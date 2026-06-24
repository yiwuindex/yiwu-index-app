"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function scoreLabel(score: number) {
  if (score <= 1) return "Faible";
  if (score === 2) return "Correct";
  if (score === 3) return "Bon";
  return "Très bon";
}

export default function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const score = useMemo(() => passwordScore(password), [password]);
  const next = params.get("next") || "/account";

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !password) {
      setMessage("Renseignez votre email et votre mot de passe.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const r = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password, name: name.trim() }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) {
          setMessage(j.error || "Impossible de créer le compte.");
          setLoading(false);
          return;
        }
      }

      const res = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (res?.error) {
        setMessage("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setMessage("Erreur réseau. Réessayez dans quelques secondes.");
      setLoading(false);
    }
  }

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "center" }} className="auth-grid">
        <section>
          <p className="eyebrow">Espace membre</p>
          <h1 className="serif" style={{ fontSize: 40, marginBottom: 12 }}>Votre accès sourcing, sécurisé.</h1>
          <p className="lead" style={{ marginBottom: 22 }}>
            Créez votre compte pour acheter un plan Premium, Pro ou Lifetime, suivre vos déblocages et accéder aux contacts fournisseurs autorisés.
          </p>
          <div className="panelbox">
            <b>Inclus avec votre compte</b>
            <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--ink-2)" }}>
              <li>Session sécurisée et persistante</li>
              <li>Suivi de votre plan et de vos déblocages</li>
              <li>Emails automatiques importants</li>
            </ul>
          </div>
        </section>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--surface)", border: "1px solid var(--line)", padding: 24, borderRadius: 18, boxShadow: "var(--shadow)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button type="button" className={mode === "login" ? "btn primary" : "btn ghost"} onClick={() => { setMode("login"); setMessage(""); }}>
              Connexion
            </button>
            <button type="button" className={mode === "signup" ? "btn primary" : "btn ghost"} onClick={() => { setMode("signup"); setMessage(""); }}>
              Inscription
            </button>
          </div>

          {mode === "signup" && (
            <label className="auth-field">
              <span>Nom complet</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ivan Beuca" autoComplete="name" />
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@email.com" autoComplete="email" />
          </label>

          <label className="auth-field">
            <span>Mot de passe</span>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          {mode === "signup" && (
            <>
              <label className="auth-field">
                <span>Confirmer le mot de passe</span>
                <input type={showPassword ? "text" : "password"} required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répétez le mot de passe" autoComplete="new-password" />
              </label>
              <div className="password-meter" aria-label={`Sécurité du mot de passe : ${scoreLabel(score)}`}>
                <i style={{ width: `${Math.max(score, 1) * 25}%` }} />
                <span>{scoreLabel(score)}</span>
              </div>
            </>
          )}

          {message && <p style={{ color: "var(--seal)", fontSize: 13, margin: 0 }}>{message}</p>}

          <button type="submit" className="btn primary lg" disabled={loading}>
            {loading ? "Sécurisation…" : mode === "signup" ? "Créer mon compte" : "Me connecter"}
          </button>
          <p className="note" style={{ margin: 0 }}>
            En continuant, vous acceptez les CGV, la politique de confidentialité et les règles d'utilisation de Yiwu Index.
          </p>
        </form>
      </div>
    </main>
  );
}
