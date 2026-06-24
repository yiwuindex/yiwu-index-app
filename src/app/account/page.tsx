import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlockLimit } from "@/lib/roles";
import { AccountActions } from "@/components/account/AccountActions";

export const metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function roleLabel(role: string) {
  if (role === "premium") return "Premium";
  if (role === "pro") return "Pro";
  if (role === "lifetime") return "Lifetime";
  if (role === "vip") return "VIP";
  return "Free";
}

function planHelp(role: string) {
  if (role === "free") return "Vous pouvez explorer l'annuaire. Les contacts directs se débloquent avec Premium, Pro ou Lifetime.";
  if (role === "premium") return "Vous avez 10 déblocages de contacts par mois.";
  if (role === "pro") return "Vous avez 50 déblocages de contacts par mois.";
  return "Vous avez les déblocages illimités.";
}

export default async function Account() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/account");

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id }, include: { subscription: true } });
  if (!user) redirect("/login?next=/account");

  const used = await prisma.supplierUnlock.count({ where: { userId: user.id, createdAt: { gte: monthStart() } } });
  const limit = unlockLimit(user.role);
  const unlimited = !Number.isFinite(limit);
  const displayName = user.name || user.email;

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 940 }}>
      <p className="eyebrow">Espace membre</p>
      <h1 className="serif" style={{ fontSize: 36, marginBottom: 8 }}>Bonjour, {displayName}</h1>
      <p className="lead" style={{ marginBottom: 24 }}>
        Vous êtes connecté à Yiwu Index. Gérez votre accès, vos déblocages et votre abonnement depuis cette page.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 18 }} className="account-grid">
        <section className="panelbox">
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 14 }}>Identité</h2>
          <p><b>Nom :</b> {user.name || "Non renseigné"}</p>
          <p><b>Email :</b> {user.email}</p>
          <p><b>Compte créé le :</b> {user.createdAt.toLocaleDateString("fr-FR")}</p>
          <AccountActions hasCustomer={!!user.stripeCustomerId} />
        </section>

        <section className="panelbox" style={{ borderColor: user.role === "free" ? "var(--line)" : "var(--gold)" }}>
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 14 }}>Accès actuel</h2>
          <p><b>Plan :</b> {roleLabel(user.role)}</p>
          <p>{planHelp(user.role)}</p>
          <p><b>Déblocages ce mois-ci :</b> {unlimited ? "Illimité" : `${used} / ${limit}`}</p>
          {user.premiumUntil && user.role !== "free" && <p><b>Accès actif jusqu'au :</b> {user.premiumUntil.toLocaleDateString("fr-FR")}</p>}
          {user.subscription?.status && <p><b>Statut Stripe :</b> {user.subscription.status}</p>}
          {user.role === "free" && <Link className="btn primary" href="/tarifs">Choisir une offre</Link>}
          {user.role !== "free" && <Link className="btn jade" href="/fournisseurs">Voir les fournisseurs</Link>}
        </section>
      </div>

      <style>{`@media(max-width:820px){.account-grid{grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}
