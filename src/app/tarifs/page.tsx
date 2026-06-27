"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PlanKey = "premium_monthly" | "pro_monthly" | "lifetime";

export default function TarifsPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<PlanKey | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Starts a real Stripe Checkout session. Auth + pricing are enforced server-side.
  const checkout = async (plan: PlanKey) => {
    setErr(null);
    setBusy(plan);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      if (r.status === 401) { router.push("/login?next=/tarifs"); return; }
      const j = await r.json();
      if (j.url) { window.location.href = j.url as string; return; }
      setErr("Paiement indisponible pour le moment. Réessayez ou contactez-nous.");
    } catch {
      setErr("Connexion au paiement impossible. Vérifiez votre réseau.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section>
      <div className="wrap section">
        <p className="eyebrow">Tarifs</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>Choisissez votre accès</h2>
        <p className="lead" style={{ marginBottom: 30 }}>Académie, guides et outils en accès libre. Vous ne payez que pour les coordonnées des fournisseurs — annulable à tout moment, sans engagement.</p>

        <div className="plans">
          {/* FREE */}
          <div className="plan">
            <h3>Free</h3>
            <div className="price">0€</div>
            <ul>
              <li>Académie, guides &amp; outils inclus</li>
              <li>Aperçu de l&apos;annuaire : noms et catégories</li>
              <li>Recherche et filtres par catégorie</li>
              <li>Sans engagement, sans carte bancaire</li>
            </ul>
            <button className="btn ghost" data-go="suppliers">Commencer gratuitement</button>
          </div>

          {/* PREMIUM — gold */}
          <div className="plan prem">
            <div className="plan-badge g">Le plus populaire</div>
            <h3>Premium</h3>
            <div className="price">49€<small>/mois</small></div>
            <ul>
              <li>Coordonnées complètes : WeChat, e-mail, téléphone, n° de stand</li>
              <li>10 déblocages de contacts par mois</li>
              <li>Accès à l&apos;annuaire complet (1 540 fournisseurs)</li>
              <li>Favoris et fiches sauvegardées</li>
              <li>Mises à jour de l&apos;annuaire incluses</li>
              <li>Support par e-mail</li>
            </ul>
            <button className="btn gold" disabled={busy !== null} onClick={() => checkout("premium_monthly")}>
              {busy === "premium_monthly" ? "Redirection…" : "Devenir Premium"}
            </button>
          </div>

          {/* PRO — jade */}
          <div className="plan pro">
            <div className="plan-badge j">Meilleur rapport qualité/prix</div>
            <h3>Pro</h3>
            <div className="price">89€<small>/mois</small></div>
            <ul>
              <li>Tout Premium inclus</li>
              <li>50 déblocages de contacts par mois (5× plus)</li>
              <li>Idéal pour un sourcing intensif, multi-catégories</li>
              <li>Support prioritaire par e-mail</li>
            </ul>
            <button className="btn jade" disabled={busy !== null} onClick={() => checkout("pro_monthly")}>
              {busy === "pro_monthly" ? "Redirection…" : "Devenir Pro"}
            </button>
          </div>

          {/* LIFETIME — red hero */}
          <div className="plan pop">
            <div className="pop-badge">🔥 Offre de lancement</div>
            <h3>Lifetime</h3>
            <div className="price">399€</div>
            <ul>
              <li>Déblocages illimités — tous les contacts, sans compteur</li>
              <li>Accès à vie, aucun abonnement</li>
              <li>Toutes les futures mises à jour incluses</li>
              <li>Le choix le plus rentable si vous sourcez régulièrement</li>
            </ul>
            <button className="btn primary" disabled={busy !== null} onClick={() => checkout("lifetime")}>
              {busy === "lifetime" ? "Redirection…" : "Accès à vie"}
            </button>
          </div>
        </div>

        {err && <p style={{ color: "var(--seal)", fontSize: 13, marginTop: 14, textAlign: "center" }}>{err}</p>}

        <div className="pricing-note">
          <div className="rule" />
          <span className="lead-line">Un seul fournisseur rentable peut vous faire économiser bien plus que le prix de votre abonnement.</span>
          <p>Trouvez le bon partenaire, négociez directement et transformez votre prochaine commande en opportunité de croissance.</p>
        </div>
      </div>
    </section>
  );
}
