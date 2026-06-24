"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    if (password !== confirm) { setMessage("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setMessage(j.error || "Lien invalide ou expiré."); setLoading(false); return; }
      router.push("/login?reset=1");
    } catch {
      setMessage("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface)", border: "1px solid var(--line)", padding: 24, borderRadius: 16 }}>
      {!token && <p style={{ color: "var(--seal)", fontSize: 13, margin: 0 }}>Lien de réinitialisation manquant.</p>}
      <input type={show ? "text" : "password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />
      <input type={show ? "text" : "password"} required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmer le mot de passe" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, fontWeight: 700 }}><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />Afficher le mot de passe</label>
      {message && <p style={{ color: "var(--seal)", fontSize: 13, margin: 0 }}>{message}</p>}
      <button className="btn primary lg" disabled={loading || !token}>{loading ? "Mise à jour…" : "Modifier mon mot de passe"}</button>
      <Link href="/login" style={{ fontSize: 13, fontWeight: 700 }}>Retour à la connexion</Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 540, margin: "0 auto" }}>
      <p className="eyebrow">Sécurité du compte</p>
      <h1 className="serif" style={{ fontSize: 34, marginBottom: 8 }}>Nouveau mot de passe</h1>
      <p className="lead" style={{ marginBottom: 24 }}>Choisissez un nouveau mot de passe sécurisé.</p>
      <Suspense fallback={<p>Chargement…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
