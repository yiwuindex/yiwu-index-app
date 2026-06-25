import { stripe, PLANS, roleFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

function roleFromPlan(plan?: string | null, priceId?: string | null): Role {
  if (plan && plan in PLANS) return PLANS[plan as keyof typeof PLANS].role;
  return roleFromPriceId(priceId);
}

function isActive(status?: string | null) {
  return status === "active" || status === "trialing";
}

function oneMonthFromNow() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
}

// Pull the user's paid status straight from Stripe and update the DB. Used as a
// fallback when the webhook is late or Vercel/Stripe briefly race each other.
// This function only GRANTS active access. Downgrades are handled only by
// subscription.deleted/refund webhooks, preventing paid users from flipping Free
// because of incomplete/past_due subscription update events.
export async function syncRoleFromStripe(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) return;

    const subs = await stripe.subscriptions.list({ customer: user.stripeCustomerId, status: "all", limit: 10 });
    const active = subs.data.find((s) => isActive(s.status));
    if (active) {
      const priceId = active.items.data[0]?.price.id ?? null;
      const role = roleFromPlan(active.metadata?.plan, priceId);
      const periodEnd = active.current_period_end ? new Date(active.current_period_end * 1000) : oneMonthFromNow();

      await prisma.user.update({ where: { id: userId }, data: { role, premiumUntil: periodEnd } });
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          status: active.status,
          stripeSubscriptionId: active.id,
          stripePriceId: priceId,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: active.cancel_at_period_end,
        },
        create: {
          userId,
          status: active.status,
          stripeSubscriptionId: active.id,
          stripePriceId: priceId,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: active.cancel_at_period_end,
        },
      });
      return;
    }

    const sessions = await stripe.checkout.sessions.list({ customer: user.stripeCustomerId, limit: 10 });
    const paidLifetime = sessions.data.find(
      (s) => s.mode === "payment" && s.payment_status === "paid" && s.metadata?.plan === "lifetime"
    );
    if (paidLifetime) {
      await prisma.user.update({ where: { id: userId }, data: { role: "lifetime", premiumUntil: null } });
      await prisma.subscription.upsert({
        where: { userId },
        update: { status: "lifetime", stripePriceId: process.env.STRIPE_PRICE_LIFETIME || null, currentPeriodEnd: null },
        create: { userId, status: "lifetime", stripePriceId: process.env.STRIPE_PRICE_LIFETIME || null },
      });
    }
  } catch (e) {
    console.error("[stripe sync] failed", e);
  }
}
