import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Emails } from "@/lib/email";
import {
  bestActiveSubscription,
  isActiveStripeStatus,
  isProtectedRole,
  roleFromStripePlan,
  safeStripePeriodEnd,
  stripe,
} from "@/lib/stripe";
import { persistActiveSubscription } from "@/lib/stripe-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function stripeId(value: string | { id: string } | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function planLabel(plan?: string | null): string {
  if (plan === "pro" || plan === "pro_monthly") return "Pro";
  if (plan === "lifetime") return "Lifetime";
  return "Premium";
}

async function userForStripeObject(params: {
  customerId: string | null;
  metadataUserId?: string | null;
}): Promise<User | null> {
  const { customerId, metadataUserId } = params;

  let user = customerId
    ? await prisma.user.findUnique({ where: { stripeCustomerId: customerId } })
    : null;

  if (!user && metadataUserId) {
    user = await prisma.user.findUnique({ where: { id: metadataUserId } });
  }

  // Repair old users that reached Checkout before stripeCustomerId was saved.
  if (user && customerId && !user.stripeCustomerId) {
    try {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    } catch (e) {
      console.error("[stripe webhook] customer link failed", {
        userId: user.id,
        customerId,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return user;
}

async function persistBestActiveSubscription(
  user: User,
  eventSubscription: Stripe.Subscription
): Promise<Stripe.Subscription> {
  if (!user.stripeCustomerId) {
    await persistActiveSubscription(user.id, eventSubscription);
    return eventSubscription;
  }

  const listed = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: "all",
    limit: 100,
  });
  const candidates = listed.data.some((subscription) => subscription.id === eventSubscription.id)
    ? listed.data
    : [eventSubscription, ...listed.data];
  const best = bestActiveSubscription(candidates) ?? eventSubscription;

  await persistActiveSubscription(user.id, best);
  return best;
}

async function persistSubscriptionRecord(userId: string, subscription: Stripe.Subscription): Promise<void> {
  const priceId = subscription.items.data[0]?.price.id ?? null;
  const periodEnd = safeStripePeriodEnd(subscription.current_period_end);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
    },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: periodEnd,
    },
  });
}

// Fail closed against accidental downgrades: only return to Free when Stripe
// confirms there is no active/trialing subscription and the DB role is neither
// Lifetime nor VIP. A transient Stripe error throws, causing webhook retry.
async function downgradeIfReallyInactive(user: User, sourceSubscriptionId: string): Promise<boolean> {
  const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!freshUser || isProtectedRole(freshUser.role)) return false;
  if (!freshUser.stripeCustomerId) return false;

  const subscriptions = await stripe.subscriptions.list({
    customer: freshUser.stripeCustomerId,
    status: "all",
    limit: 100,
  });
  const active = bestActiveSubscription(subscriptions.data);

  if (active) {
    await persistActiveSubscription(freshUser.id, active);
    console.info("[stripe webhook] downgrade skipped; another subscription is active", {
      userId: freshUser.id,
      sourceSubscriptionId,
      activeSubscriptionId: active.id,
      activeStatus: active.status,
    });
    return false;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: freshUser.id },
      data: { role: "free", premiumUntil: null },
    }),
    prisma.subscription.updateMany({
      where: { userId: freshUser.id },
      data: { status: "canceled", cancelAtPeriodEnd: false },
    }),
  ]);

  console.info("[stripe webhook] user downgraded after confirmed cancellation", {
    userId: freshUser.id,
    sourceSubscriptionId,
  });
  return true;
}

async function grantLifetime(user: User, session: Stripe.Checkout.Session): Promise<void> {
  const nextRole: Role = user.role === "vip" ? "vip" : "lifetime";
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { role: nextRole, premiumUntil: null },
    }),
    prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        status: "lifetime",
        stripeSubscriptionId: null,
        stripePriceId: session.metadata?.priceId || process.env.STRIPE_PRICE_LIFETIME || null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
      create: {
        userId: user.id,
        status: "lifetime",
        stripePriceId: session.metadata?.priceId || process.env.STRIPE_PRICE_LIFETIME || null,
        currentPeriodEnd: null,
      },
    }),
  ]);
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("[stripe webhook] missing signature or webhook secret");
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (e) {
    console.error("[stripe webhook] signature verification failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    console.info("[stripe webhook] received", { eventId: event.id, type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const checkout = event.data.object as Stripe.Checkout.Session;
        const customerId = stripeId(checkout.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null);
        const metadataUserId = checkout.metadata?.userId || checkout.client_reference_id;
        const user = await userForStripeObject({ customerId, metadataUserId });

        if (!user) {
          console.error("[stripe webhook] checkout user not found", {
            eventId: event.id,
            checkoutSessionId: checkout.id,
            metadataUserId,
            customerId,
          });
          break;
        }

        if (
          checkout.mode === "payment" &&
          checkout.metadata?.plan === "lifetime" &&
          checkout.payment_status === "paid"
        ) {
          await grantLifetime(user, checkout);
        }

        if (checkout.mode === "subscription") {
          const subscriptionId = stripeId(checkout.subscription as string | Stripe.Subscription | null);
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            if (isActiveStripeStatus(subscription.status)) {
              await persistBestActiveSubscription(user, subscription);
            } else {
              await persistSubscriptionRecord(user.id, subscription);
            }
          }
        }

        await Emails.paymentConfirmed(user.email, planLabel(checkout.metadata?.plan));
        console.info("[stripe webhook] checkout synchronized", {
          userId: user.id,
          checkoutSessionId: checkout.id,
          mode: checkout.mode,
          paymentStatus: checkout.payment_status,
          plan: checkout.metadata?.plan,
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = stripeId(subscription.customer as string | Stripe.Customer | Stripe.DeletedCustomer);
        const user = await userForStripeObject({
          customerId,
          metadataUserId: subscription.metadata?.userId,
        });

        if (!user) {
          console.error("[stripe webhook] subscription user not found", {
            eventId: event.id,
            subscriptionId: subscription.id,
            customerId,
          });
          break;
        }

        if (isActiveStripeStatus(subscription.status)) {
          await persistBestActiveSubscription(user, subscription);
        } else {
          // past_due/unpaid/incomplete update billing state but do not instantly
          // erase an entitlement. Only a confirmed canceled state may downgrade.
          await persistSubscriptionRecord(user.id, subscription);
          if (subscription.status === "canceled") {
            await downgradeIfReallyInactive(user, subscription.id);
          }
        }

        const priceId = subscription.items.data[0]?.price.id;
        console.info("[stripe webhook] subscription synchronized", {
          userId: user.id,
          subscriptionId: subscription.id,
          status: subscription.status,
          role: roleFromStripePlan(subscription.metadata?.plan, priceId),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = stripeId(subscription.customer as string | Stripe.Customer | Stripe.DeletedCustomer);
        const user = await userForStripeObject({
          customerId,
          metadataUserId: subscription.metadata?.userId,
        });
        if (!user) break;

        await persistSubscriptionRecord(user.id, subscription);
        const downgraded = await downgradeIfReallyInactive(user, subscription.id);
        if (downgraded) await Emails.subscriptionCancelled(user.email);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = stripeId(invoice.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null);
        const user = await userForStripeObject({ customerId });
        if (user) {
          await Emails.paymentFailed(user.email);
          console.info("[stripe webhook] payment failure recorded without role downgrade", {
            userId: user.id,
            invoiceId: invoice.id,
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const customerId = stripeId(charge.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null);
        const user = await userForStripeObject({ customerId });
        // A refund event alone is not proof that every entitlement for this
        // customer is inactive. Never destroy Lifetime/VIP or an active plan here.
        console.info("[stripe webhook] refund recorded without automatic downgrade", {
          userId: user?.id,
          chargeId: charge.id,
        });
        break;
      }
    }
  } catch (e) {
    console.error("[stripe webhook] handler error", {
      eventId: event.id,
      type: event.type,
      error: e instanceof Error ? e.message : String(e),
    });
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
