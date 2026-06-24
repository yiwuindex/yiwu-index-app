"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 540, margin: "0 auto" }}>
      <p className="eyebrow">Sécurité du compte</p>
      <h1 className="serif" style={{ fontSize: 34, marginBottom: 8 }}>Mot de passe oublié</h1>
      <p className="lead" style={{ marginBottom: 24 }}>Entrez votre email. Si un compte existe, vous recevrez un lien sécurisé valable 1 heure.</p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface)", border: "1px solid var(--line)", padding: 24, borderRadius: 16 }}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />
        {done && <p style={{ color: "var(--jade)", fontSize: 13, margin: 0 }}>Si ce compte existe, un email vient d'être envoyé.</p>}
        <button className="btn primary lg" disabled={loading}>{loading ? "Envoi…" : "Envoyer le lien"}</button>
        <Link href="/login" style={{ fontSize: 13, fontWeight: 700 }}>Retour à la connexion</Link>
      </form>
    </main>
  );
}
