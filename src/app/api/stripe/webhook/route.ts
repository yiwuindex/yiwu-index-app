import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, PLANS, roleFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Emails } from "@/lib/email";
import type { Role } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function roleFromPlan(plan?: string | null, priceId?: string | null): Role {
  if (plan && plan in PLANS) return PLANS[plan as keyof typeof PLANS].role;
  return roleFromPriceId(priceId);
}

function isSubscriptionActive(status?: string | null) {
  return status === "active" || status === "trialing";
}

function oneMonthFromNow() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
}

async function findUserByCustomer(customerId?: string | null) {
  if (!customerId) return null;
  return prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
}

async function grantAccess(userId: string, role: Role, periodEnd?: Date | null) {
  const data = role === "lifetime" || role === "vip"
    ? { role, premiumUntil: null }
    : { role, premiumUntil: periodEnd ?? oneMonthFromNow() };
  await prisma.user.update({ where: { id: userId }, data });
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[webhook] invalid signature", err);
    return NextResponse.json({ error: `signature: ${(err as Error).message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.metadata?.userId;
        const plan = s.metadata?.plan;
        const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
        if (!userId) {
          console.warn("[webhook] checkout.session.completed without userId", s.id);
          break;
        }

        if (customerId) {
          await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } }).catch(() => {});
        }

        let priceId: string | null = null;
        let subStatus: string | null = null;
        let subId: string | null = null;
        let periodEnd: Date | null = null;

        if (typeof s.subscription === "string") {
          const sub = await stripe.subscriptions.retrieve(s.subscription);
          subId = sub.id;
          subStatus = sub.status;
          priceId = sub.items.data[0]?.price.id ?? null;
          periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;
        } else if (plan === "lifetime") {
          priceId = process.env.STRIPE_PRICE_LIFETIME || null;
        } else {
          const lines = await stripe.checkout.sessions.listLineItems(s.id, { limit: 1 });
          priceId = lines.data[0]?.price?.id ?? null;
        }

        const role = roleFromPlan(plan, priceId);
        const shouldGrant = s.payment_status === "paid" || (s.mode === "subscription" && isSubscriptionActive(subStatus));
        if (shouldGrant) {
          await grantAccess(userId, role, role === "lifetime" ? null : periodEnd);
        }

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubscriptionId: subId,
            stripePriceId: priceId,
            status: role === "lifetime" ? "lifetime" : (subStatus || "checkout_completed"),
            currentPeriodEnd: role === "lifetime" ? null : periodEnd,
          },
          create: {
            userId,
            stripeSubscriptionId: subId,
            stripePriceId: priceId,
            status: role === "lifetime" ? "lifetime" : (subStatus || "checkout_completed"),
            currentPeriodEnd: role === "lifetime" ? null : periodEnd,
          },
        });

        const u = await prisma.user.findUnique({ where: { id: userId } });
        if (u) await Emails.paymentConfirmed(u.email, role === "lifetime" ? "Lifetime" : role === "pro" ? "Pro" : "Premium");
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        const user = await findUserByCustomer(customerId);
        if (!user) {
          console.warn("[webhook] subscription event without linked user", sub.id, customerId);
          break;
        }

        const priceId = sub.items.data[0]?.price.id ?? null;
        const role = roleFromPlan(sub.metadata?.plan, priceId);
        const active = isSubscriptionActive(sub.status);
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

        // IMPORTANT: only GRANT on active/trialing here. Do not downgrade on
        // incomplete/past_due/unpaid updates, because Stripe often sends those
        // during checkout/retries and that was causing paid users to flip to Free.
        if (active) {
          await grantAccess(user.id, role, periodEnd);
        }

        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId,
            status: sub.status,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          create: {
            userId: user.id,
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId,
            status: sub.status,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        const user = await findUserByCustomer(customerId);
        if (!user) break;
        if (user.role !== "lifetime" && user.role !== "vip") {
          await prisma.user.update({ where: { id: user.id }, data: { role: "free", premiumUntil: new Date(0) } });
        }
        await prisma.subscription.updateMany({ where: { userId: user.id, stripeSubscriptionId: sub.id }, data: { status: "canceled" } });
        await Emails.subscriptionCancelled(user.email);
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        const user = await findUserByCustomer(customerId);
        if (user) await Emails.paymentFailed(user.email);
        break;
      }

      case "charge.refunded": {
        const ch = event.data.object as Stripe.Charge;
        const customerId = typeof ch.customer === "string" ? ch.customer : ch.customer?.id;
        const user = await findUserByCustomer(customerId);
        if (!user || user.role === "vip") break;
        // Refunds are treated as access removal, except VIP internal accounts.
        await prisma.user.update({ where: { id: user.id }, data: { role: "free", premiumUntil: new Date(0) } });
        await prisma.subscription.updateMany({ where: { userId: user.id }, data: { status: "refunded" } });
        break;
      }
    }
  } catch (e) {
    console.error("[webhook] handler error", e);
    return NextResponse.json({ error: "handler" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
