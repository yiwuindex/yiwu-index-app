"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="wrap" style={{ padding: "90px 22px", textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
      <div className="seal" style={{ width: 56, height: 56, fontSize: 30, margin: "0 auto 22px", display: "grid", placeItems: "center" }}>义</div>
      <p className="eyebrow">Oups</p>
      <h1 className="serif" style={{ fontSize: 30, margin: "6px 0 10px" }}>Une erreur s&apos;est produite</h1>
      <p className="lead" style={{ marginBottom: 26 }}>
        Quelque chose n&apos;a pas fonctionné. Vous pouvez réessayer — le reste du site fonctionne normalement.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn primary lg" onClick={() => reset()}>Réessayer</button>
        <a className="btn ghost lg" href="/">Retour à l&apos;accueil</a>
      </div>
    </main>
  );
}
