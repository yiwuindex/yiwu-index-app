import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlockLimit } from "@/lib/roles";
import { AccountActions } from "@/components/account/AccountActions";

export const metadata = { title: "Mon compte" };

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export default async function Account() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/account");

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }, include: { subscription: true } });
  if (!user) redirect("/login?next=/account");

  let used = 0;
  try {
    used = await prisma.supplierUnlock.count({ where: { userId: user.id, createdAt: { gte: monthStart() } } });
  } catch (e) {
    console.error("[account] unlock count failed", e);
  }
  const limit = unlockLimit(user.role);
  const unlimited = !Number.isFinite(limit);

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 760 }}>
      <p className="eyebrow">Espace membre</p>
      <h1 className="serif" style={{ fontSize: 34, marginBottom: 8 }}>Mon compte</h1>
      <div className="panelbox" style={{ marginTop: 20 }}>
        <p><b>Nom :</b> {user.name || "Non renseigné"}</p>
        <p><b>Email :</b> {user.email}</p>
        <p><b>Statut :</b> {user.role}</p>
        <p><b>Déblocages ce mois-ci :</b> {unlimited ? "Illimité" : `${used} / ${limit}`}</p>
        {user.premiumUntil && <p><b>Accès actif jusqu'au :</b> {user.premiumUntil.toLocaleDateString("fr-FR")}</p>}
        {user.subscription?.status && <p><b>Abonnement Stripe :</b> {user.subscription.status}</p>}
        <AccountActions hasCustomer={!!user.stripeCustomerId} />
      </div>
    </main>
  );
}
