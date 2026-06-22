export default function Home() {
  return (
    <main className="wrap" style={{ padding: "60px 22px" }}>
      <h1 style={{ fontSize: 34 }}>Yiwu Index</h1>
      <p style={{ maxWidth: 620, color: "var(--slate)" }}>
        Intelligence de sourcing B2B : 1 540 fournisseurs vérifiés de Yiwu et leurs coordonnées directes,
        débloquées via un abonnement Premium. Les contacts sont servis côté serveur, jamais exposés au navigateur.
      </p>
      <p><a href="/fournisseurs">Explorer les fournisseurs →</a> &nbsp; <a href="/pricing">Voir les tarifs →</a></p>
      <div className="note" style={{ marginTop: 24 }}>
        Ceci est la fondation production (Next.js + API privée). La page marketing/annuaire existante
        (yiwu-index.html) se branche sur l'API <code>/api/suppliers</code>.
      </div>
    </main>
  );
}
