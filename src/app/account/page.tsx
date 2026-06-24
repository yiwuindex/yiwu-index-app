import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlockLimit } from "@/lib/roles";
import { AccountActions } from "@/components/account/AccountActions";
import { stripe, PLANS, roleFromPriceId } from "@/lib/stripe";
import type Stripe from "stripe";
import type { Role } from "@prisma/client";

export const metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function roleFromPlan(plan?: string | null, priceId?: string | null): Role {
  if (plan && plan in PLANS) return PLANS[plan as keyof typeof PLANS].role;
  return roleFromPriceId(priceId);
}

/**
 * Fallback synchronisation after Stripe Checkout redirect.
 * Webhooks are still the main source of truth, but this makes the user account
 * unlock immediately even if Stripe webhook delivery is delayed by a few seconds.
 */
async function syncStripeCheckoutSession(sessionId: string, userId: string) {
  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (checkout.metadata?.userId !== userId) return;

    const customerId = typeof checkout.customer === "string" ? checkout.customer : checkout.customer?.id || null;
    const plan = checkout.metadata?.plan;

    if (checkout.mode === "payment" && plan === "lifetime" && checkout.payment_status === "paid") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "lifetime", premiumUntil: null, stripeCustomerId: customerId || undefined },
      });
      await prisma.subscription.upsert({
        where: { userId },
        update: { status: "lifetime", stripePriceId: process.env.STRIPE_PRICE_LIFETIME || null, currentPeriodEnd: null, cancelAtPeriodEnd: false },
        create: { userId, status: "lifetime", stripePriceId: process.env.STRIPE_PRICE_LIFETIME || null, currentPeriodEnd: null, cancelAtPeriodEnd: false },
      });
      return;
    }

    if (checkout.mode === "subscription" && checkout.subscription) {
      const sub = typeof checkout.subscription === "string"
        ? await stripe.subscriptions.retrieve(checkout.subscription)
        : checkout.subscription as Stripe.Subscription;

      const priceId = sub.items.data[0]?.price.id;
      const role = roleFromPlan(plan || sub.metadata?.plan, priceId);
      const active = sub.status === "active" || sub.status === "trialing";
      const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

      await prisma.user.update({
        where: { id: userId },
        data: {
          role: active ? role : "free",
          premiumUntil: active ? periodEnd : new Date(0),
          stripeCustomerId: customerId || (sub.customer as string) || undefined,
        },
      });

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          status: sub.status,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
        create: {
          userId,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          status: sub.status,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
    }
  } catch (e) {
    console.error("[account] Stripe checkout sync failed", e);
  }
}

function planLabel(role: string) {
  if (role === "premium") return "Premium";
  if (role === "pro") return "Pro";
  if (role === "lifetime") return "Lifetime";
  if (role === "vip") return "VIP";
  return "Free";
}

export default async function Account({ searchParams }: { searchParams?: { session_id?: string; paid?: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/account");

  const userId = (session.user as any).id as string;
  if (searchParams?.session_id) {
    await syncStripeCheckoutSession(searchParams.session_id, userId);
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
  if (!user) redirect("/login?next=/account");

  let used = 0;
  try {
    used = await prisma.supplierUnlock.count({ where: { userId: user.id, createdAt: { gte: monthStart() } } });
  } catch (e) {
    console.error("[account] unlock count failed", e);
  }
  const limit = unlockLimit(user.role);
  const unlimited = !Number.isFinite(limit);
  const isPaid = user.role !== "free";

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 820 }}>
      <p className="eyebrow">Espace membre</p>
      <h1 className="serif" style={{ fontSize: 34, marginBottom: 8 }}>Mon compte</h1>

      {searchParams?.paid === "1" && (
        <div className="panelbox" style={{ borderColor: "var(--jade)", marginTop: 18 }}>
          <b>Paiement confirmé.</b>{" "}
          {isPaid ? "Votre accès est activé. Vous pouvez maintenant débloquer vos fournisseurs." : "Activation en cours. Rafraîchissez dans quelques secondes si besoin."}
        </div>
      )}

      <div className="panelbox" style={{ marginTop: 20 }}>
        <p><b>Nom :</b> {user.name || "Non renseigné"}</p>
        <p><b>Email :</b> {user.email}</p>
        <p><b>Plan actuel :</b> {planLabel(user.role)}</p>
        <p><b>Déblocages ce mois-ci :</b> {unlimited ? "Illimité" : `${used} / ${limit}`}</p>
        {user.premiumUntil && <p><b>Accès actif jusqu'au :</b> {user.premiumUntil.toLocaleDateString("fr-FR")}</p>}
        {user.subscription?.status && <p><b>Abonnement Stripe :</b> {user.subscription.status}</p>}
        <AccountActions hasCustomer={!!user.stripeCustomerId} />
      </div>

      {!isPaid && (
        <div className="panelbox" style={{ marginTop: 18 }}>
          <b>Vous êtes actuellement en Free.</b>
          <p className="note" style={{ marginTop: 6 }}>Passez Premium ou Pro pour débloquer les coordonnées directes des fournisseurs.</p>
          <a className="btn primary" href="/tarifs" style={{ marginTop: 10 }}>Voir les offres</a>
        </div>
      )}
    </main>
  );
}
