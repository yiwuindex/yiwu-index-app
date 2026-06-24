"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function AccountActions({ hasCustomer }: { hasCustomer: boolean }) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const r = await fetch("/api/stripe/portal", { method: "POST" });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.url) window.location.href = j.url;
      else alert("Le portail d'abonnement est momentanément indisponible. Réessayez plus tard.");
    } catch {
      alert("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
      {hasCustomer && <button className="btn ghost" onClick={openPortal} disabled={loading}>{loading ? "Ouverture…" : "Gérer mon abonnement"}</button>}
      <button className="btn primary" onClick={() => signOut({ callbackUrl: "/" })}>Se déconnecter</button>
    </div>
  );
}
