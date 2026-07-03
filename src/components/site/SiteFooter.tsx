import Link from "next/link";
import { LEGAL } from "@/lib/legal";

const platform: [string, string][] = [
  ["Accueil", "/"],
  ["Fournisseurs", "/fournisseurs"],
  ["Académie", "/academie"],
  ["Outils", "/outils"],
  ["Transport", "/transport"],
  ["Tarifs", "/tarifs"],
  ["FAQ", "/faq"],
];

const guidesLinks: [string, string][] = [
  ["Guides import Chine", "/guides"],
  ["Fournisseur Yiwu", "/fournisseur-yiwu"],
  ["Importer de Yiwu", "/guides/importer-de-yiwu"],
  ["Société import export Yiwu", "/guides/societe-import-export-yiwu"],
  ["Importer de Chine", "/guides/importer-de-chine"],
  ["Fournisseurs vêtements", "/fournisseurs/vetements"],
  ["Fournisseurs électronique", "/fournisseurs/electronique"],
  ["Fournisseurs packaging", "/fournisseurs/emballage"],
];

const legal: [string, string][] = [
  ["Mentions légales", "/mentions-legales"], ["CGV", "/cgv"],
  ["Confidentialité", "/confidentialite"], ["Cookies", "/cookies"],
  ["Conditions d'abonnement", "/conditions-abonnement"], ["Remboursement", "/remboursement"]
];

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <div className="fcols">
          <div>
            <div className="brand">
              <div className="seal">义</div>
              <div><b>YIWU INDEX</b><small>Sourcing intelligence</small></div>
            </div>
            <p style={{ color: "var(--slate)", fontSize: 13, lineHeight: 1.6, marginTop: 14, maxWidth: "30ch" }}>
              L&apos;annuaire sourcing du marché de Yiwu : profils fournisseurs organisés, contacts directs accessibles selon votre offre.
            </p>
          </div>
          <div>
            <h4>Plateforme</h4>
            <nav aria-label="Plateforme">
              {platform.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}
            </nav>
          </div>
          <div>
            <h4>Guides</h4>
            <nav aria-label="Guides et pages SEO">
              {guidesLinks.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}
            </nav>
          </div>
          <div>
            <h4>Légal &amp; contact</h4>
            <nav aria-label="Pages légales">
              {legal.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}
            </nav>
            <h4 style={{ marginTop: 16 }}>Contact</h4>
            <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>
          </div>
        </div>
        <div className="foot-legalnote">
          Plateforme d&apos;aide au sourcing B2B — pas une place de marché ; aucun produit n&apos;est vendu ici.
          Les données proviennent d&apos;une liste fournisseurs à usage privé. « Stand localisé » indique qu&apos;un stand a été
          repéré au marché de Yiwu, ce n&apos;est pas une garantie de qualité produit. Les coordonnées directes
          sont servies côté serveur et réservées aux membres — jamais exposées au navigateur.
          © {new Date().getFullYear()} {LEGAL.companyName} — {LEGAL.legalName}.
        </div>
      </div>
    </footer>
  );
}
