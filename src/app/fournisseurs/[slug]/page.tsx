import type { Metadata } from "next";
import Link from "next/link";
import { getSupplierCategory, supplierCategories } from "@/lib/seo-content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return supplierCategories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getSupplierCategory(params.slug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/fournisseurs/${category.slug}` },
    openGraph: {
      title: category.title,
      description: category.description,
      type: "website",
      url: `/fournisseurs/${category.slug}`,
    },
  };
}

export default function SupplierCategoryPage({ params }: { params: { slug: string } }) {
  const category = getSupplierCategory(params.slug);
  if (!category) notFound();

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.h1,
    description: category.description,
  };

  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <div className="wrap section" style={{ maxWidth: 980 }}>
        <Link href="/fournisseurs" style={{ color: "var(--slate)", fontSize: 13, fontWeight: 700 }}>
          ← Annuaire fournisseurs
        </Link>
        <p className="eyebrow" style={{ marginTop: 26 }}>Fournisseurs Chine · Yiwu</p>
        <h1 className="serif" style={{ fontSize: "clamp(32px,4vw,46px)", marginBottom: 12 }}>
          {category.h1}
        </h1>
        <p className="lead" style={{ maxWidth: 780, marginBottom: 28 }}>{category.intro}</p>

        <div className="cards3" style={{ marginBottom: 30 }}>
          <div className="feat">
            <div className="ic" style={{ background: "var(--jade-soft)", color: "var(--jade)" }}>✓</div>
            <h2 style={{ fontSize: 20 }}>Produits à sourcer</h2>
            <ul style={{ color: "var(--slate)", lineHeight: 1.8, paddingLeft: 18 }}>
              {category.products.map((product) => <li key={product}>{product}</li>)}
            </ul>
          </div>
          <div className="feat">
            <div className="ic" style={{ background: "var(--gold-soft)", color: "var(--gold)" }}>🔎</div>
            <h2 style={{ fontSize: 20 }}>Points à vérifier</h2>
            <ul style={{ color: "var(--slate)", lineHeight: 1.8, paddingLeft: 18 }}>
              {category.checks.map((check) => <li key={check}>{check}</li>)}
            </ul>
          </div>
          <div className="feat">
            <div className="ic" style={{ background: "var(--seal-soft)", color: "var(--seal)" }}>!</div>
            <h2 style={{ fontSize: 20 }}>Risques courants</h2>
            <ul style={{ color: "var(--slate)", lineHeight: 1.8, paddingLeft: 18 }}>
              {category.risks.map((risk) => <li key={risk}>{risk}</li>)}
            </ul>
          </div>
        </div>

        <div className="panelbox">
          <h2 className="serif" style={{ fontSize: 26, marginBottom: 12 }}>
            Comment Yiwu Index aide sur cette catégorie
          </h2>
          <p style={{ color: "var(--slate)", lineHeight: 1.75 }}>
            Yiwu Index vous permet de parcourir des profils fournisseurs, comparer les catégories et identifier des contacts potentiels avant de lancer vos demandes d'échantillons. Les informations descriptives sont visibles publiquement pour comprendre le marché ; les coordonnées directes restent réservées aux abonnements Premium, Pro, Lifetime et VIP.
          </p>
          <p style={{ color: "var(--slate)", lineHeight: 1.75 }}>
            Avant toute commande, comparez plusieurs fournisseurs, demandez des échantillons, confirmez les délais et calculez le coût complet rendu chez vous.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            <Link className="btn primary" href="/fournisseurs">Rechercher dans l'annuaire</Link>
            <Link className="btn ghost" href="/tarifs">Débloquer les contacts</Link>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">Autres catégories</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {supplierCategories.filter((item) => item.slug !== category.slug).slice(0, 7).map((item) => (
              <Link key={item.slug} className="btn ghost" href={`/fournisseurs/${item.slug}`}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
