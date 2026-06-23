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
        <p className="lead" style={{ marginBottom: 30 }}>Annulable à tout moment. Les fournisseurs sont mis à jour en continu.</p>

        <div className="plans">
          {/* FREE */}
          <div className="plan">
            <h3>Free</h3>
            <div className="price">0€</div>
            <ul>
              <li>Aperçu de l&apos;annuaire</li>
              <li>Accès limité aux fournisseurs</li>
              <li>Recherche de base</li>
              <li>Sans engagement</li>
            </ul>
            <button className="btn ghost" data-go="suppliers">Commencer</button>
          </div>

          {/* PREMIUM — gold */}
          <div className="plan prem">
            <div className="plan-badge g">Le plus populaire</div>
            <h3>Premium</h3>
            <div className="price">49€<small>/mois</small></div>
            <ul>
              <li>10 déblocages de contacts/mois</li>
              <li>Accès à l&apos;annuaire complet</li>
              <li>Académie Yiwu Index</li>
              <li>Outils de sourcing</li>
              <li>Favoris</li>
              <li>Support standard</li>
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
              <li>50 déblocages de contacts/mois</li>
              <li>Tout Premium inclus</li>
              <li>Export CSV / Excel</li>
              <li>Recherche avancée</li>
              <li>Support prioritaire</li>
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
              <li>Déblocages illimités</li>
              <li>Accès à vie</li>
              <li>Toutes les futures mises à jour</li>
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
