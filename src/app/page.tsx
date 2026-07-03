import Link from "next/link";
import { HeroPreview, Teaser } from "@/components/site/HomeIslands";
import { guides, supplierCategories } from "@/lib/seo-content";

export default function Home() {
  return (
    <section>
      <div className="hero"><div className="wrap heroflex">
        <div>
          <p className="eyebrow">Annuaire sourcing · Marché de Yiwu</p>
          <h1 className="serif">Trouvez vos fournisseurs chinois <em>en quelques clics.</em></h1>
          <p className="lead">1&nbsp;540 profils fournisseurs du marché de Yiwu, organisés par catégorie — avec les contacts directs (WeChat, e-mail, téléphone, n° de stand) accessibles selon votre offre. Explorez gratuitement, débloquez quand vous êtes prêt.</p>
          <div className="cta-row">
            <Link className="btn primary lg" href="/fournisseurs">Voir les fournisseurs</Link>
            <Link className="btn gold lg" href="/tarifs">Débloquer les contacts</Link>
          </div>
          <div className="stats">
            <div className="stat"><b>1&nbsp;540</b><span>Fournisseurs référencés</span></div>
            <div className="stat"><b>14</b><span>Catégories</span></div>
            <div className="stat"><b>WeChat · mail · tél</b><span>Contacts directs</span></div>
            <div className="stat"><b>10 → ∞</b><span>Déblocages / mois selon l&apos;offre</span></div>
          </div>
        </div>
        <HeroPreview />
      </div></div>

      <div className="section wrap">
        <p className="eyebrow">Comment ça marche</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 8 }}>Du profil au contact direct, en 3 étapes.</h2>
        <p className="lead" style={{ marginBottom: 26 }}>Pas de commission, pas d&apos;intermédiaire : vous gardez votre carnet de fournisseurs.</p>
        <div className="how3">
          <div className="hstep"><b>Explorez les profils fournisseurs</b><p>Parcourez gratuitement l&apos;annuaire : nom, catégorie, produits phares, district du marché. Sans carte bancaire.</p></div>
          <div className="hstep"><b>Comparez les produits et catégories</b><p>Filtrez par catégorie, recherchez par mot-clé, sauvegardez vos favoris pour présélectionner les stands qui correspondent à votre projet.</p></div>
          <div className="hstep"><b>Débloquez les contacts directs</b><p>WeChat, e-mail, téléphone et n° de stand — débloqués selon votre offre, pour contacter le fournisseur sans intermédiaire.</p></div>
        </div>
      </div>

      <div className="section wrap" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Pourquoi Yiwu Index</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 8 }}>On a déjà fait les erreurs, pas vous.</h2>
        <p className="lead" style={{ marginBottom: 30 }}>Une plateforme d&apos;aide au sourcing, pas une place de marché. On ne vend pas les produits — on vous donne les bonnes informations.</p>
        <div className="cards3">
          <div className="feat"><div className="ic" style={{ background: "var(--jade-soft)", color: "var(--jade)" }}>🗂️</div><h3>Profils fournisseurs organisés</h3><p>Un annuaire structuré du marché de Yiwu : catégories, produits phares, district — et le badge « Stand localisé » quand le stand a été repéré au marché.</p></div>
          <div className="feat"><div className="ic" style={{ background: "var(--seal-soft)", color: "var(--seal)" }}>💬</div><h3>Contacts directs</h3><p>WeChat, e-mail, téléphone et adresse du stand, accessibles selon votre offre. Pas d&apos;intermédiaire opaque, pas de commission sur vos achats.</p></div>
          <div className="feat"><div className="ic" style={{ background: "var(--gold-soft)", color: "var(--gold)" }}>🎓</div><h3>Académie d&apos;importation</h3><p>De la négociation aux douanes : les modules et guides pour importer de A à Z sans vous faire avoir — en accès libre.</p></div>
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
        <p className="lead" style={{ marginBottom: 24 }}>Voici une fiche telle qu&apos;un visiteur la voit : profil complet, contacts masqués. Avec un abonnement, les coordonnées s&apos;affichent directement sur la carte.</p>
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
        <p className="eyebrow">Confiance</p>
        <div className="trustband">
          <div className="titem"><div className="ic">🔒</div><div><b>Paiement sécurisé</b><span>Transactions opérées par Stripe. Vos données bancaires ne transitent jamais par nos serveurs.</span></div></div>
          <div className="titem"><div className="ic">↩︎</div><div><b>Annulable à tout moment</b><span>Résiliez en deux clics depuis votre compte. L&apos;accès reste actif jusqu&apos;à la fin de la période payée.</span></div></div>
          <div className="titem"><div className="ic">✉️</div><div><b>Support par e-mail</b><span>Une question ? Écrivez-nous, on répond — support prioritaire pour les membres Pro.</span></div></div>
          <div className="titem"><div className="ic">🧭</div><div><b>Dédié au sourcing Chine</b><span>Une plateforme spécialisée sur le marché de Yiwu, pensée pour les importateurs francophones.</span></div></div>
        </div>
      </div>

      <div className="section wrap" style={{ paddingTop: 0 }}>
        <div style={{ background: "var(--ink)", borderRadius: 22, padding: 46, textAlign: "center", color: "#fff" }}>
          <h2 className="serif" style={{ fontSize: 30, color: "#fff", marginBottom: 10 }}>Prêt à sourcer sereinement ?</h2>
          <p style={{ color: "#cfcabf", maxWidth: "52ch", margin: "0 auto 22px" }}>Explorez les 1&nbsp;540 profils gratuitement — et débloquez les coordonnées directes quand vous avez trouvé les bons stands.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn gold lg" href="/tarifs">Débloquer les contacts</Link>
            <Link className="btn ghost lg" href="/fournisseurs" style={{ background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.2)" }}>Explorer gratuitement</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
