import Link from "next/link";
import { LEGAL } from "@/lib/legal";

const legal: [string, string][] = [
  ["Mentions légales", "/mentions-legales"], ["CGV", "/cgv"],
  ["Confidentialité", "/confidentialite"], ["Cookies", "/cookies"],
  ["Conditions d'abonnement", "/conditions-abonnement"], ["Remboursement", "/remboursement"]
];

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <div>
          <div className="brand">
            <div className="seal">义</div>
            <div><b>YIWU INDEX</b><small>Sourcing intelligence</small></div>
          </div>
          <nav style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 16, fontSize: 13 }}>
            {legal.map(([l, h]) => <Link key={h} href={h} style={{ color: "var(--slate)" }}>{l}</Link>)}
          </nav>
        </div>
        <small>
          Plateforme d'intelligence B2B — pas une place de marché ; aucun produit n'est vendu ici.
          Les données proviennent d'une liste fournisseurs à usage privé. « Vérifié » indique qu'un stand a été
          localisé au marché de Yiwu, ce n'est pas une garantie de qualité produit. Les coordonnées directes
          sont servies côté serveur et réservées aux membres — jamais exposées au navigateur.
          © {new Date().getFullYear()} {LEGAL.companyName} — {LEGAL.legalName}.
        </small>
      </div>
    </footer>
  );
}
