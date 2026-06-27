import Link from "next/link";
import { HeroPreview, Teaser } from "@/components/site/HomeIslands";
import { guides, supplierCategories } from "@/lib/seo-content";

export default function Home() {
  return (
    <section>
      <div className="hero"><div className="wrap heroflex">
        <div>
          <p className="eyebrow">Sourcing · Marché de Yiwu</p>
          <h1 className="serif">Importez depuis Yiwu <em>sans perdre d&apos;argent.</em></h1>
          <p className="lead">Accédez aux meilleurs fournisseurs vérifiés, à leurs coordonnées directes et à notre guide complet d&apos;importation — pensé pour les entrepreneurs francophones.</p>
          <div className="cta-row">
            <Link className="btn primary lg" href="/fournisseurs">Voir les fournisseurs</Link>
            <Link className="btn ghost lg" href="/tarifs">Devenir Premium</Link>
          </div>
          <div className="stats">
            <div className="stat"><b>1&nbsp;540</b><span>Fournisseurs</span></div>
            <div className="stat"><b>14</b><span>Catégories</span></div>
            <div className="stat"><b>1&nbsp;540</b><span>Contacts directs</span></div>
            <div className="stat"><b>1000+</b><span>Produits référencés</span></div>
          </div>
        </div>
        <HeroPreview />
      </div></div>

      <div className="section wrap">
        <p className="eyebrow">Pourquoi Yiwu Index</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 8 }}>On a déjà fait les erreurs, pas vous.</h2>
        <p className="lead" style={{ marginBottom: 30 }}>Une plateforme d&apos;intelligence, pas une place de marché. On ne vend pas les produits — on vous donne les bonnes informations.</p>
        <div className="cards3">
          <div className="feat"><div className="ic" style={{ background: "var(--jade-soft)", color: "var(--jade)" }}>✓</div><h3>Fournisseurs vérifiés</h3><p>Chaque fournisseur est recherché à la main : stand localisé au marché de Yiwu, coordonnées directes confirmées.</p></div>
          <div className="feat"><div className="ic" style={{ background: "var(--seal-soft)", color: "var(--seal)" }}>💬</div><h3>Contacts directs</h3><p>WeChat, e-mail, téléphone et adresse exacte du stand : les coordonnées directes du fournisseur, débloquées d&apos;un seul coup. Pas d&apos;intermédiaire opaque.</p></div>
          <div className="feat"><div className="ic" style={{ background: "var(--gold-soft)", color: "var(--gold)" }}>🎓</div><h3>Académie d&apos;importation</h3><p>De la négociation aux douanes : 12 modules pour importer de A à Z sans vous faire avoir.</p></div>
        </div>
      </div>

      <div className="section wrap" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Catégories fournisseurs</p>
        <h2 className="serif" style={{ fontSize: 26, marginBottom: 8 }}>Explorez les catégories les plus demandées.</h2>
        <p className="lead" style={{ marginBottom: 20 }}>Des pages publiques aident à comprendre chaque marché ; les coordonnées directes restent réservées aux membres.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {supplierCategories.slice(0, 8).map((category) => (
            <Link key={category.slug} className="btn ghost" href={`/fournisseurs/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          {guides.slice(0, 3).map((guide) => (
            <Link key={guide.slug} className="btn ghost" href={`/guides/${guide.slug}`}>
              {guide.h1}
            </Link>
          ))}
        </div>
      </div>

      <div className="section wrap" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Les pièges qu&apos;on vous évite</p>
        <h2 className="serif" style={{ fontSize: 26, marginBottom: 22 }}>Importer seul, c&apos;est risqué.</h2>
        <div className="pain">
          <div>Arnaques et faux fournisseurs</div><div>Fausses usines / revendeurs cachés</div><div>Frais de transport cachés</div>
          <div>Problèmes de douane</div><div>Qualité produit décevante</div><div>Barrière de communication</div>
        </div>
      </div>

      <div className="section wrap" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Aperçu premium</p>
        <h2 className="serif" style={{ fontSize: 26, marginBottom: 8 }}>Les coordonnées directes sont réservées aux membres.</h2>
        <p className="lead" style={{ marginBottom: 24 }}>En visiteur, les coordonnées sont masquées. Activez l&apos;aperçu « Premium » en haut à droite pour voir le déverrouillage.</p>
        <Teaser />
      </div>

      <div className="section wrap" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Ils importent avec Yiwu Index <span className="tag-demo">exemples</span></p>
        <div className="testi">
          <blockquote><p>« J&apos;ai trouvé mon fournisseur de coques téléphone en une soirée. Le numéro de stand était exact, j&apos;ai commandé un échantillon la semaine suivante. »</p><cite><span className="av">LM</span>Léa M. — boutique e-commerce</cite></blockquote>
          <blockquote><p>« L&apos;académie m&apos;a évité une arnaque classique sur les certificats. Rien que ça, ça valait l&apos;abonnement. »</p><cite><span className="av">YB</span>Yanis B. — Amazon FBA</cite></blockquote>
          <blockquote><p>« Le calculateur de coût au débarquement m&apos;a montré que ma marge n&apos;existait pas. J&apos;ai changé de produit. »</p><cite><span className="av">SR</span>Sophie R. — private label</cite></blockquote>
        </div>
        <p className="note">Témoignages d&apos;illustration pour la maquette — à remplacer par de vrais avis clients.</p>
      </div>

      <div className="section wrap" style={{ paddingTop: 0 }}>
        <div style={{ background: "var(--ink)", borderRadius: 22, padding: 46, textAlign: "center", color: "#fff" }}>
          <h2 className="serif" style={{ fontSize: 30, color: "#fff", marginBottom: 10 }}>Prêt à sourcer sereinement ?</h2>
          <p style={{ color: "#cfcabf", maxWidth: "50ch", margin: "0 auto 22px" }}>Débloquez les 1&nbsp;500+ fournisseurs, leurs coordonnées directes et l&apos;académie complète.</p>
          <Link className="btn gold lg" href="/tarifs">Voir les tarifs</Link>
        </div>
      </div>
    </section>
  );
}