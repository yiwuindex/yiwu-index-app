import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Emails } from "@/lib/email";

// Stripe needs the raw body to verify the signature.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `signature: ${(err as Error).message}` }, { status: 400 });
  }

  const byCustomer = async (customerId: string) =>
    prisma.user.findUnique({ where: { stripeCustomerId: customerId } });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.metadata?.userId;
        const plan = s.metadata?.plan;
        if (!userId) break;
        if (s.mode === "payment" && plan === "lifetime") {
          await prisma.user.update({ where: { id: userId }, data: { role: "lifetime", premiumUntil: null } });
          await prisma.subscription.upsert({
            where: { userId }, update: { status: "lifetime", stripePriceId: null, currentPeriodEnd: null },
            create: { userId, status: "lifetime" }
          });
        }
        // subscription mode is finalised by customer.subscription.* below
        const u = await prisma.user.findUnique({ where: { id: userId } });
        if (u) await Emails.paymentConfirmed(u.email, plan === "lifetime" ? "Lifetime" : "Premium");
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const user = await byCustomer(sub.customer as string);
        if (!user) break;
        const active = sub.status === "active" || sub.status === "trialing";
        const periodEnd = new Date(sub.current_period_end * 1000);
        await prisma.user.update({
          where: { id: user.id },
          data: { role: active ? "premium" : "free", premiumUntil: active ? periodEnd : new Date(0) }
        });
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: { stripeSubscriptionId: sub.id, stripePriceId: sub.items.data[0]?.price.id, status: sub.status, currentPeriodEnd: periodEnd, cancelAtPeriodEnd: sub.cancel_at_period_end },
          create: { userId: user.id, stripeSubscriptionId: sub.id, stripePriceId: sub.items.data[0]?.price.id, status: sub.status, currentPeriodEnd: periodEnd, cancelAtPeriodEnd: sub.cancel_at_period_end }
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const user = await byCustomer(sub.customer as string);
        if (!user) break;
        await prisma.user.update({ where: { id: user.id }, data: { role: "free", premiumUntil: new Date(0) } });
        await prisma.subscription.updateMany({ where: { userId: user.id }, data: { status: "canceled" } });
        await Emails.subscriptionCancelled(user.email);
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const user = await byCustomer(inv.customer as string);
        if (user) await Emails.paymentFailed(user.email);
        break;
      }
      case "charge.refunded": {
        const ch = event.data.object as Stripe.Charge;
        const user = await byCustomer(ch.customer as string);
        // lifetime refund -> revoke access
        if (user) await prisma.user.update({ where: { id: user.id }, data: { role: "free", premiumUntil: new Date(0) } });
        break;
      }
    }
  } catch (e) {
    console.error("[webhook] handler error", e);
    return NextResponse.json({ error: "handler" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
