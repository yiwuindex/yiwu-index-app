import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActivePaidAccess, unlockLimit } from "@/lib/roles";
import { syncRoleFromStripe } from "@/lib/stripe-sync";
import { AccountActions } from "@/components/account/AccountActions";
import { SessionRefresh } from "@/components/account/SessionRefresh";

export const metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

const roleLabel: Record<string, string> = {
  free: "Free", premium: "Premium", pro: "Pro", lifetime: "Lifetime", vip: "VIP"
};

export default async function Account({ searchParams }: { searchParams: { checkout?: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/account");
  const userId = (session.user as any).id as string;

  // Returning from a successful checkout: resync the role straight from Stripe in
  // case the webhook hasn't landed yet. Prevents the "paid but still free" race.
  const justPaid = searchParams?.checkout === "success";
  if (justPaid) await syncRoleFromStripe(userId);

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
  const isPaid = hasActivePaidAccess(user);
  const validPremiumUntil = user.premiumUntil && user.premiumUntil.getTime() > 0 ? user.premiumUntil : null;

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 760 }}>
      {justPaid && <SessionRefresh />}
      <p className="eyebrow">Espace membre</p>
      <h1 className="serif" style={{ fontSize: 34, marginBottom: 8 }}>Mon compte</h1>

      {justPaid && (
        <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, background: "var(--jade-soft)", border: "1px solid var(--jade)", color: "var(--jade)", fontWeight: 600 }}>
          {isPaid
            ? "✓ Paiement confirmé. Votre accès est actif."
            : "Paiement reçu. Activation en cours — actualisez la page dans quelques secondes si le statut n'est pas encore à jour."}
        </div>
      )}

      <div className="panelbox" style={{ marginTop: 20 }}>
        <p><b>Nom :</b> {user.name || "Non renseigné"}</p>
        <p><b>Email :</b> {user.email}</p>
        <p><b>Statut :</b> {roleLabel[user.role] || user.role}</p>
        <p><b>Déblocages ce mois-ci :</b> {unlimited ? "Illimité" : `${used} / ${limit}`}</p>
        {validPremiumUntil && <p><b>Accès actif jusqu'au :</b> {validPremiumUntil.toLocaleDateString("fr-FR")}</p>}
        {user.subscription?.status && <p><b>Abonnement Stripe :</b> {user.subscription.status}</p>}
        <AccountActions hasCustomer={!!user.stripeCustomerId} />
      </div>
    </main>
  );
}
