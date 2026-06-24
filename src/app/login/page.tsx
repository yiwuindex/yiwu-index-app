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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
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

      const next = new URLSearchParams(window.location.search).get("next") || "/account";
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

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface)", border: "1px solid var(--line)", padding: 24, borderRadius: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button type="button" className={mode === "login" ? "btn primary" : "btn ghost"} onClick={() => setMode("login")}>Connexion</button>
          <button type="button" className={mode === "signup" ? "btn primary" : "btn ghost"} onClick={() => setMode("signup")}>Inscription</button>
        </div>

        {mode === "signup" && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom (optionnel)" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />
        )}

        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe (8 caractères min.)" style={{ padding: 14, borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff" }} />

        {message && <p style={{ color: "var(--seal)", fontSize: 13, margin: 0 }}>{message}</p>}

        <button type="submit" className="btn primary lg" disabled={loading}>
          {loading ? "Chargement…" : mode === "signup" ? "Créer mon compte" : "Me connecter"}
        </button>
      </form>
    </main>
  );
}
