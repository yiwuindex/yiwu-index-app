import { stripe, PLANS, roleFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

function roleFromPlan(plan?: string | null, priceId?: string | null): Role {
  if (plan && plan in PLANS) return PLANS[plan as keyof typeof PLANS].role;
  return roleFromPriceId(priceId);
}

// Pull the user's paid status straight from Stripe and update the DB. Used as a
// fallback when the webhook is late or not yet configured — called when the user
// lands on /account?checkout=success. It only ever GRANTS access here; downgrades
// remain the webhook's responsibility (subscription.deleted / refund).
export async function syncRoleFromStripe(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) return;

    // 1) Active subscription → Premium / Pro
    const subs = await stripe.subscriptions.list({ customer: user.stripeCustomerId, status: "all", limit: 5 });
    const active = subs.data.find((s) => s.status === "active" || s.status === "trialing");
    if (active) {
      const priceId = active.items.data[0]?.price.id;
      const role = roleFromPlan(active.metadata?.plan, priceId);
      const periodEnd = active.current_period_end ? new Date(active.current_period_end * 1000) : null;
      await prisma.user.update({ where: { id: userId }, data: { role, premiumUntil: periodEnd } });
      await prisma.subscription.upsert({
        where: { userId },
        update: { status: active.status, stripeSubscriptionId: active.id, stripePriceId: priceId || null, currentPeriodEnd: periodEnd },
        create: { userId, status: active.status, stripeSubscriptionId: active.id, stripePriceId: priceId || null, currentPeriodEnd: periodEnd },
      });
      return;
    }

    // 2) One-time Lifetime payment
    if (user.role !== "lifetime") {
      const sessions = await stripe.checkout.sessions.list({ customer: user.stripeCustomerId, limit: 5 });
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
    }
  } catch (e) {
    console.error("[stripe sync] failed", e);
  }
}
