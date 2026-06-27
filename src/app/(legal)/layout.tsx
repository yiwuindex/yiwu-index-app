import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Informations légales",
  description: "Mentions légales, CGV, confidentialité, cookies, conditions d'abonnement et remboursement de Yiwu Index.",
};


export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="legal">
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--slate)", fontSize: 13, marginBottom: 18 }}>
        ← Retour à l&apos;accueil
      </Link>
      {children}
      <p style={{ marginTop: 40, paddingTop: 18, borderTop: "1px solid var(--line)", color: "var(--slate-2)", fontSize: 12.5 }}>
        Dernière mise à jour : {LEGAL.lastUpdated} · {LEGAL.companyName} — {LEGAL.entrepreneur}
      </p>
    </main>
  );
}
