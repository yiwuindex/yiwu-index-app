import type { Metadata } from "next";
import Link from "next/link";
import { guides, supplierCategories } from "@/lib/seo-content";

export const metadata: Metadata = {
  title: "Guides import Chine et sourcing Yiwu",
  description:
    "Guides pratiques pour importer de Chine, trouver un fournisseur à Yiwu, vérifier les profils et éviter les erreurs de sourcing.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <section>
      <div className="wrap section">
        <p className="eyebrow">Guides sourcing Chine</p>
        <h1 className="serif" style={{ fontSize: "clamp(32px,4vw,46px)", marginBottom: 10 }}>
          Apprendre à sourcer et importer depuis la Chine
        </h1>
        <p className="lead" style={{ maxWidth: 760, marginBottom: 30 }}>
          Méthodes simples pour trouver un fournisseur fiable, calculer vos coûts et limiter les erreurs avant votre première commande.
        </p>

        <div className="cards3">
          {guides.map((guide) => (
            <article className="feat" key={guide.slug}>
              <div className="ic" style={{ background: "var(--gold-soft)", color: "var(--gold)" }}>📘</div>
              <h2 style={{ fontSize: 20 }}>{guide.h1}</h2>
              <p>{guide.description}</p>
              <Link className="btn ghost" href={`/guides/${guide.slug}`} style={{ marginTop: 12 }}>
                Lire le guide
              </Link>
            </article>
          ))}
        </div>

        <div className="panelbox" style={{ marginTop: 34 }}>
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Catégories fournisseurs populaires</h2>
          <p className="lead" style={{ marginBottom: 18 }}>
            Explorez aussi les catégories les plus recherchées dans l'annuaire Yiwu Index.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {supplierCategories.map((category) => (
              <Link key={category.slug} className="btn ghost" href={`/fournisseurs/${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
