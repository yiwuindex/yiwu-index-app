"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup" && password !== confirmPassword) {
        setMessage("Les mots de passe ne correspondent pas.");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        const r = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) {
          setMessage(j.error || "Impossible de créer le compte.");
          setLoading(false);
          return;
        }
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setMessage("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      // After login go to the homepage by default. An explicit ?next= (set by the
      // checkout button or the /account guard) is still honored, if it's internal.
      const raw = new URLSearchParams(window.location.search).get("next");
      const next = raw && raw.startsWith("/") ? raw : "/";
      router.push(next);
      router.refresh();
    } catch {
      setMessage("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 520, margin: "0 auto" }}>
      <p className="eyebrow">Compte client</p>
      <h1 className="serif" style={{ fontSize: 34, marginBottom: 8 }}>Connexion / Inscription</h1>
      <p className="lead" style={{ marginBottom: 24 }}>
        Connectez-vous pour acheter un accès Premium, Pro ou Lifetime et débloquer vos fournisseurs.
      </p>
      {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("reset") === "1" && (
        <p style={{ color: "var(--jade)", fontSize: 13, marginTop: -12, marginBottom: 18 }}>Mot de passe modifié. Vous pouvez vous connecter.</p>
      )}

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface)", border: "1px solid var(--line)", padding: 24, borderRadius: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button type="button" className={mode === "login" ? "btn primary" : "btn ghost"} onClick={() => setMode("login")}>Connexion</button>
          <button type="button" className={mode === "signup" ? "btn primary" : "btn ghost"} onClick={() => setMode("signup")}>Inscription</button>
        </div>

        {mode === "signup" && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom (optionnel)" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />
        )}

        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />
        <div style={{ position: "relative", display: "flex" }}>
          <input
            type={showPw ? "text" : "password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe (8 caractères min.)"
            style={{ flex: 1, padding: 14, paddingRight: 46, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={showPw}
            title={showPw ? "Masquer" : "Afficher"}
            style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, display: "grid", placeItems: "center", border: 0, background: "transparent", cursor: "pointer", color: "var(--slate)", borderRadius: 8 }}
          >
            {showPw ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        </div>

        {mode === "signup" && (
          <input
            type={showPw ? "text" : "password"}
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }}
          />
        )}

        {message && <p style={{ color: "var(--seal)", fontSize: 13, margin: 0 }}>{message}</p>}

        <button type="submit" className="btn primary lg" disabled={loading}>
          {loading ? "Chargement…" : mode === "signup" ? "Créer mon compte" : "Me connecter"}
        </button>

        {mode === "login" && (
          <a href="/mot-de-passe-oublie" style={{ fontSize: 13, fontWeight: 700, color: "var(--seal)", textAlign: "center" }}>
            Mot de passe oublié ?
          </a>
        )}
      </form>
    </main>
  );
}
