"use client";

import { useState } from "react";

export const metadata = { title: "Connexion" };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Connexion à brancher avec Auth.js");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Inscription à brancher avec Auth.js");
  };

  return (
    <main className="wrap" style={{ padding: "60px 22px", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Connexion / Inscription</h1>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 14,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 14,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            padding: 14,
            background: "#d45745",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Se connecter
        </button>

        <button
          onClick={handleSignup}
          style={{
            padding: 14,
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          S'inscrire
        </button>
      </form>
    </main>
  );
}
