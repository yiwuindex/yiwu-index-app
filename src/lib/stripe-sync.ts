import type Stripe from "stripe";
import type { Role } from "@prisma/client";
import {
  bestActiveSubscription,
  isActiveStripeStatus,
  isProtectedRole,
  subscriptionRole,
  safeStripePeriodEnd,
  stripe,
} from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function persistActiveSubscription(userId: string, subscription: Stripe.Subscription): Promise<void> {
  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) return;

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const role = subscriptionRole(subscription);
  const periodEnd = safeStripePeriodEnd(subscription.current_period_end);

  const userData: { role?: Role; premiumUntil?: Date | null } = {};
  if (!isProtectedRole(currentUser.role) && (role === "premium" || role === "pro")) {
    userData.role = role;
    if (periodEnd) {
      userData.premiumUntil = periodEnd;
    } else if (!currentUser.premiumUntil || currentUser.premiumUntil.getTime() <= 0) {
      // Never manufacture 1970 when Stripe omits current_period_end.
      userData.premiumUntil = null;
    }
  }

  const subscriptionWrite = prisma.subscription.upsert({
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

  if (Object.keys(userData).length) {
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: userData }),
      subscriptionWrite,
    ]);
  } else {
    await subscriptionWrite;
  }
}

// Pull the user's paid status straight from Stripe and update the DB. This is
// called on /account?checkout=success as a fallback when a webhook is delayed.
// It only grants/repairs access; webhook cancellation handles real downgrades.
export async function syncRoleFromStripe(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) return;

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "all",
      limit: 100,
    });
    const active = bestActiveSubscription(subscriptions.data);

    if (active) {
      await persistActiveSubscription(userId, active);
      console.info("[stripe sync] active subscription restored", {
        userId,
        subscriptionId: active.id,
        status: active.status,
      });
      return;
    }

    // Lifetime is a one-time Checkout payment and must never be removed by an
    // unrelated subscription event. Older sessions with legacy metadata remain valid.
    if (!isProtectedRole(user.role)) {
      const sessions = await stripe.checkout.sessions.list({
        customer: user.stripeCustomerId,
        limit: 100,
      });
      const paidLifetime = sessions.data.find(
        (session) =>
          session.mode === "payment" &&
          session.payment_status === "paid" &&
          session.metadata?.plan === "lifetime"
      );

      if (paidLifetime) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { role: "lifetime", premiumUntil: null },
          }),
          prisma.subscription.upsert({
            where: { userId },
            update: {
              status: "lifetime",
              stripePriceId: paidLifetime.metadata?.priceId || process.env.STRIPE_PRICE_LIFETIME || null,
              currentPeriodEnd: null,
              cancelAtPeriodEnd: false,
            },
            create: {
              userId,
              status: "lifetime",
              stripePriceId: paidLifetime.metadata?.priceId || process.env.STRIPE_PRICE_LIFETIME || null,
              currentPeriodEnd: null,
            },
          }),
        ]);
        console.info("[stripe sync] lifetime restored", { userId, checkoutSessionId: paidLifetime.id });
      }
    }
  } catch (e) {
    // The account page remains available if Stripe has a transient outage.
    console.error("[stripe sync] failed", e instanceof Error ? e.message : e);
  }
}
