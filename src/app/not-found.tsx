import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "90px 22px", textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
      <div className="seal" style={{ width: 56, height: 56, fontSize: 30, margin: "0 auto 22px", display: "grid", placeItems: "center" }}>义</div>
      <p className="eyebrow">Erreur 404</p>
      <h1 className="serif" style={{ fontSize: 34, margin: "6px 0 10px" }}>Page introuvable</h1>
      <p className="lead" style={{ marginBottom: 26 }}>
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn primary lg" href="/">Retour à l&apos;accueil</Link>
        <Link className="btn ghost lg" href="/fournisseurs">Voir les fournisseurs</Link>
      </div>
    </main>
  );
}
