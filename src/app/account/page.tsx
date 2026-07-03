import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActivePaidAccess, unlockLimit } from "@/lib/roles";
import { syncRoleFromStripe } from "@/lib/stripe-sync";
import { AccountActions } from "@/components/account/AccountActions";
import { SessionRefresh } from "@/components/account/SessionRefresh";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};
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

      <div className="acct-card" style={{ marginTop: 20 }}>
        <div className="acct-head">
          <div className="acct-av">{(user.name || user.email || "?").trim().charAt(0).toUpperCase()}</div>
          <div>
            <b>{user.name || "Non renseigné"}</b>
            <small>{user.email}</small>
          </div>
          <span className={`plan-pill ${user.role}`}>{roleLabel[user.role] || user.role}</span>
        </div>

        <div className="acct-rows">
          <div className="acct-row"><span>Statut</span><b>{roleLabel[user.role] || user.role}</b></div>
          <div className="acct-row"><span>Déblocages ce mois-ci</span><b>{unlimited ? "Illimité" : `${used} / ${limit}`}</b></div>
          {validPremiumUntil && <div className="acct-row"><span>Accès actif jusqu&apos;au</span><b>{validPremiumUntil.toLocaleDateString("fr-FR")}</b></div>}
          {user.subscription?.status && <div className="acct-row"><span>Abonnement Stripe</span><b>{user.subscription.status}</b></div>}
        </div>

        <div className="acct-access">
          <h3>Votre accès</h3>
          {isPaid ? (
            <>
              <p>✓ Contacts directs des fournisseurs <b>visibles</b> (WeChat, e-mail, téléphone, n° de stand).</p>
              {unlimited ? (
                <p>✓ Déblocages <b>illimités</b> — toutes les coordonnées sont accessibles.</p>
              ) : (
                <>
                  <p>Il vous reste <b>{Math.max((limit as number) - used, 0)}</b> déblocage{Math.max((limit as number) - used, 0) > 1 ? "s" : ""} ce mois-ci.</p>
                  <div className="quota-bar"><i style={{ width: `${Math.min((used / (limit as number)) * 100, 100)}%` }} /></div>
                </>
              )}
            </>
          ) : (
            <>
              <p>Les contacts directs sont réservés aux offres payantes. Vous explorez actuellement l&apos;annuaire en accès libre.</p>
              <p style={{ marginTop: 8 }}><a className="btn gold" href="/tarifs" style={{ padding: "8px 18px", fontSize: 13 }}>Débloquer les contacts</a></p>
            </>
          )}
        </div>

        <div className="acct-actions">
          <AccountActions hasCustomer={!!user.stripeCustomerId} />
        </div>
      </div>
    </main>
  );
}
