import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fournisseur à Yiwu : trouver des fournisseurs fiables en Chine",
  description:
    "Trouvez des fournisseurs à Yiwu, comparez les profils et découvrez comment Yiwu Index aide les importateurs à accéder à des contacts fournisseurs en Chine.",
  alternates: { canonical: "/fournisseur-yiwu" },
  openGraph: {
    title: "Fournisseur à Yiwu : trouver des fournisseurs fiables en Chine",
    description:
      "Trouvez des fournisseurs à Yiwu, comparez les profils et accédez aux contacts directs avec Yiwu Index.",
    type: "article",
    url: "/fournisseur-yiwu",
  },
};

const faq = [
  {
    question: "Comment trouver un fournisseur à Yiwu sans aller en Chine ?",
    answer:
      "Utilisez un annuaire spécialisé comme Yiwu Index pour identifier les stands par catégorie, puis contactez les fournisseurs directement par WeChat ou e-mail. Validez ensuite par un échantillon avant toute commande.",
  },
  {
    question: "Les fournisseurs de Yiwu acceptent-ils les petites quantités ?",
    answer:
      "Oui, c'est l'une des forces du marché de Yiwu : les MOQ y sont souvent plus bas que chez les usines classiques, ce qui permet de tester un produit avec un budget limité.",
  },
  {
    question: "Que signifie « Stand localisé » sur Yiwu Index ?",
    answer:
      "Cela indique qu'un stand a été repéré au marché de Yiwu pour ce fournisseur. C'est un repère d'existence utile, mais ce n'est pas une garantie de qualité produit : l'échantillon reste indispensable.",
  },
  {
    question: "Quels moyens de paiement utiliser avec un fournisseur de Yiwu ?",
    answer:
      "Privilégiez des paiements traçables avec un acompte à la commande et le solde avant expédition, après contrôle. Évitez les règlements intégraux immédiats vers des comptes personnels.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FournisseurYiwuPage() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="wrap section" style={{ maxWidth: 920 }}>
        <p className="eyebrow" style={{ marginTop: 10 }}>Sourcing Chine</p>
        <h1 className="serif" style={{ fontSize: "clamp(32px,4vw,46px)", marginBottom: 12 }}>
          Trouver un fournisseur à Yiwu
        </h1>
        <p className="lead" style={{ maxWidth: 760, marginBottom: 30 }}>
          Yiwu, dans la province du Zhejiang, abrite le plus grand marché de gros de petites marchandises au monde : le
          Yiwu International Trade City, avec ses dizaines de milliers de stands répartis en districts spécialisés.
          Trouver le bon fournisseur à Yiwu peut transformer la rentabilité d&apos;un e-commerce ou d&apos;une activité
          d&apos;import — à condition de savoir où chercher, comment comparer et comment vérifier. Voici la méthode, et la
          façon dont Yiwu Index vous fait gagner l&apos;étape la plus longue : obtenir des contacts directs fiables.
        </p>

        <div className="panelbox">
          <section style={{ marginBottom: 26 }}>
            <h2 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Pourquoi Yiwu attire les importateurs ?</h2>
            <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
              Le marché de Yiwu concentre une profondeur de gamme unique : des centaines de milliers de références,
              accessibles en un seul lieu, avec des prix de gros parmi les plus compétitifs de Chine. Contrairement aux
              usines traditionnelles qui imposent des minimums élevés, les stands de Yiwu acceptent souvent des quantités
              réduites — idéal pour tester un produit, composer un premier conteneur multi-références ou approvisionner
              une boutique en ligne sans immobiliser un gros budget.
            </p>
            <p style={{ color: "var(--slate)", lineHeight: 1.75 }}>
              Autre atout : la densité. En travaillant avec plusieurs stands d&apos;un même district, un importateur peut
              consolider des commandes variées en une seule expédition, mutualiser le transport et diversifier son
              catalogue rapidement. C&apos;est ce modèle qui a fait de Yiwu la référence mondiale du sourcing de petites
              marchandises.
            </p>
          </section>

          <section style={{ marginBottom: 26 }}>
            <h2 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Quels produits sourcer à Yiwu ?</h2>
            <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
              Les catégories fortes du marché couvrent l&apos;essentiel des produits à forte rotation : jouets et loisirs,
              accessoires de mode et bijoux fantaisie, articles de maison et décoration, papeterie, beauté et cosmétique
              accessoires, sport et outdoor, bagagerie, petit électronique et accessoires téléphonie, produits pour
              animaux, articles auto, et une immense catégorie « general goods » de produits du quotidien.
            </p>
            <p style={{ color: "var(--slate)", lineHeight: 1.75 }}>
              En revanche, Yiwu n&apos;est pas le meilleur point d&apos;entrée pour des produits très techniques,
              certifiés ou fortement personnalisés (électronique complexe, textile technique, machines) : pour ces
              gammes, le sourcing direct usine dans les provinces spécialisées reste plus adapté. Savoir ce que Yiwu fait
              bien — et ce qu&apos;il fait moins bien — est déjà une décision de sourcing intelligente.
            </p>
          </section>

          <section style={{ marginBottom: 26 }}>
            <h2 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Comment éviter les mauvais fournisseurs ?</h2>
            <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
              La règle d&apos;or : ne jamais commander sans échantillon. C&apos;est le seul moyen de juger la qualité
              réelle, les finitions et la conformité à votre besoin. Exigez ensuite des conditions écrites — prix,
              quantité minimale (MOQ), délai de production, emballage, modalités de paiement — et privilégiez un acompte
              avec solde avant expédition plutôt qu&apos;un paiement intégral immédiat.
            </p>
            <p style={{ color: "var(--slate)", lineHeight: 1.75 }}>
              Méfiez-vous des signaux d&apos;alerte classiques : prix anormalement bas, photos trop parfaites sans vidéo
              réelle, interlocuteur qui change de conditions en cours de route, ou demande de règlement vers un compte
              personnel. Pour les volumes importants, une inspection avant expédition (quantités, références, état,
              photos) est un investissement minime comparé au risque couvert.
            </p>
          </section>

          <section style={{ marginBottom: 0 }}>
            <h2 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Comment Yiwu Index simplifie la recherche fournisseur ?</h2>
            <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
              Le vrai goulot d&apos;étranglement du sourcing à distance, c&apos;est l&apos;accès aux contacts : les stands
              de Yiwu sont physiques, peu présents sur le web, et les intermédiaires facturent cet accès au prix fort.
              Yiwu Index référence plus de 1 500 fournisseurs du marché, classés en 14 catégories, avec leurs produits
              phares et leur district. La mention « Stand localisé » indique un stand repéré au marché de Yiwu.
            </p>
            <p style={{ color: "var(--slate)", lineHeight: 1.75 }}>
              Avec un abonnement, vous débloquez les coordonnées directes — WeChat, e-mail, téléphone et numéro de stand —
              et contactez les fournisseurs sans commission ni intermédiaire. Vous gardez votre carnet de contacts, vous
              comparez librement les prix, et vous pouvez consulter nos{" "}
              <Link href="/guides" style={{ color: "var(--jade)", fontWeight: 600 }}>guides pratiques</Link> pour
              structurer chaque étape, de la vérification au transport.
            </p>
          </section>
        </div>

        <div className="panelbox" style={{ marginTop: 24 }}>
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 16 }}>FAQ fournisseur Yiwu</h2>
          <div className="faq">
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, background: "var(--ink)", borderRadius: 22, padding: 34, color: "#fff" }}>
          <h2 className="serif" style={{ color: "#fff", fontSize: 26, marginBottom: 8 }}>
            Accédez aux fournisseurs du marché de Yiwu
          </h2>
          <p style={{ color: "#cfcabf", maxWidth: 680, marginBottom: 18 }}>
            Parcourez l&apos;annuaire gratuitement, comparez les stands par catégorie, puis débloquez les coordonnées
            directes avec la formule adaptée à votre volume de sourcing.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link className="btn gold" href="/fournisseurs">Voir les fournisseurs</Link>
            <Link className="btn ghost" href="/tarifs" style={{ background: "rgba(255,255,255,.08)", color: "#fff" }}>Voir les tarifs</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
