export const metadata = { title: "Tarifs" };
export default function Pricing() {
  return (<main className="wrap" style={{ padding: "60px 22px" }}>
    <h1>Tarifs</h1>
    <ul>
      <li><b>Premium</b> — 49 €/mois — accès complet, renouvellement auto.</li>
      <li><b>Lifetime</b> — 799 € — paiement unique, accès permanent.</li>
      <li><b>VIP</b> — sur devis.</li>
    </ul>
    <p className="note">Le bouton de paiement appelle <code>POST /api/stripe/checkout</code> avec <code>{`{ plan: "premium_monthly" | "lifetime" }`}</code> (utilisateur connecté requis).</p>
  </main>);
}
