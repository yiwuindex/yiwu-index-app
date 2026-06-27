import type { Metadata } from "next";
import Link from "next/link";
import { getGuide, guides, supplierCategories } from "@/lib/seo-content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `/guides/${guide.slug}`,
    },
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="wrap section" style={{ maxWidth: 920 }}>
        <Link href="/guides" style={{ color: "var(--slate)", fontSize: 13, fontWeight: 700 }}>
          ← Tous les guides
        </Link>
        <p className="eyebrow" style={{ marginTop: 26 }}>Guide sourcing Chine</p>
        <h1 className="serif" style={{ fontSize: "clamp(32px,4vw,46px)", marginBottom: 12 }}>
          {guide.h1}
        </h1>
        <p className="lead" style={{ maxWidth: 760, marginBottom: 30 }}>{guide.intro}</p>

        <div className="panelbox">
          {guide.sections.map((section) => (
            <section key={section.heading} style={{ marginBottom: 26 }}>
              <h2 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="panelbox" style={{ marginTop: 24 }}>
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 16 }}>Questions fréquentes</h2>
          <div className="faq">
            {guide.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, background: "var(--ink)", borderRadius: 22, padding: 34, color: "#fff" }}>
          <h2 className="serif" style={{ color: "#fff", fontSize: 26, marginBottom: 8 }}>
            Passez de la théorie aux fournisseurs réels
          </h2>
          <p style={{ color: "#cfcabf", maxWidth: 680, marginBottom: 18 }}>
            Consultez les profils fournisseurs Yiwu Index, comparez les catégories et débloquez les coordonnées directes avec votre abonnement.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link className="btn gold" href="/fournisseurs">Voir les fournisseurs</Link>
            <Link className="btn ghost" href="/tarifs" style={{ background: "rgba(255,255,255,.08)", color: "#fff" }}>Voir les tarifs</Link>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <p className="eyebrow">Catégories liées</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {supplierCategories.slice(0, 6).map((category) => (
              <Link key={category.slug} className="btn ghost" href={`/fournisseurs/${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
