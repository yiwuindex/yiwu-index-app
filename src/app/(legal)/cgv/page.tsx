import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Conditions générales de vente — Yiwu Index" };

export default function Page() {
  return (
    <>
      <h1>Conditions générales de vente (CGV)</h1>
      <p>Les présentes CGV régissent la vente des abonnements et accès proposés par {LEGAL.entrepreneur} ({LEGAL.legalName}), {LEGAL.legalStatus}, {LEGAL.address} (« l&apos;Éditeur »), sur le site {LEGAL.domain}. Elles s&apos;appliquent à tout client, particulier (consommateur) ou professionnel.</p>

      <h2>1. Objet</h2>
      <p>{LEGAL.companyName} fournit un accès numérique, par abonnement, à une base de données de fournisseurs, à des outils de sourcing et à des contenus éducatifs. Il s&apos;agit d&apos;une prestation de service numérique : aucun produit physique n&apos;est vendu et l&apos;Éditeur n&apos;intervient pas dans les relations entre le client et les fournisseurs.</p>

      <h2>2. Offres et prix</h2>
      <p>
        Premium : {LEGAL.pricePremium}. Pro : {LEGAL.pricePro}. Lifetime : {LEGAL.priceLifetime}.<br />
        Les prix sont indiqués en euros. {LEGAL.vatNote}. Les prix peuvent être modifiés à tout moment ; le tarif applicable
        est celui affiché au moment de la commande.
      </p>

      <h2>3. Commande et paiement</h2>
      <p>
        La création d&apos;un compte est nécessaire. Les paiements sont traités de manière sécurisée par {LEGAL.paymentProcessor}.
        L&apos;Éditeur n&apos;a jamais accès aux données complètes de carte bancaire. La commande est ferme dès validation du
        paiement. L&apos;accès premium est débloqué immédiatement après confirmation du paiement.
      </p>

      <h2>4. Droit de rétractation et exécution immédiate</h2>
      <p>
        Conformément aux articles L.221-18 et suivants du Code de la consommation, le consommateur dispose en principe d&apos;un
        délai de 14 jours pour se rétracter. Toutefois, s&apos;agissant d&apos;un contenu numérique et d&apos;un service fourni
        immédiatement, le client, en validant sa commande et en accédant au contenu, <b>demande expressément l&apos;exécution
        immédiate</b> de la prestation et <b>reconnaît renoncer à son droit de rétractation</b> dès le premier accès au
        contenu, en application de l&apos;article L.221-28 du Code de la consommation. En l&apos;absence d&apos;accès au contenu,
        le droit de rétractation de 14 jours reste applicable au consommateur.
      </p>

      <h2>5. Absence de remboursement</h2>
      <p>
        Sous réserve de l&apos;exercice valable du droit de rétractation ci-dessus et des garanties légales, aucun remboursement
        n&apos;est dû après accès au contenu numérique. Les modalités sont détaillées dans la
        <a href="/remboursement"> politique de remboursement</a>.
      </p>

      <h2>6. Durée, renouvellement et résiliation</h2>
      <p>
        Les abonnements Premium et Pro sont mensuels et reconduits automatiquement jusqu&apos;à résiliation. Le client peut
        résilier <b>à tout moment</b>, sans frais, depuis son espace « Mon compte » (portail de facturation {LEGAL.paymentProcessor}) ;
        l&apos;accès reste actif jusqu&apos;à la fin de la période déjà payée. L&apos;offre Lifetime est un paiement unique donnant
        un accès permanent. Voir aussi les <a href="/conditions-abonnement">conditions d&apos;abonnement</a>.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        Les informations relatives aux fournisseurs sont fournies à titre informatif et « en l&apos;état ». La mention
        « vérifié » signifie qu&apos;un stand a été localisé au marché de Yiwu ; elle ne constitue pas une garantie sur la
        solvabilité, la disponibilité ou la qualité des produits du fournisseur. L&apos;Éditeur ne saurait être tenu responsable
        des relations commerciales, commandes, paiements ou litiges intervenant entre le client et un fournisseur.
      </p>

      <h2>8. Données personnelles</h2>
      <p>Le traitement des données est décrit dans la <a href="/confidentialite">politique de confidentialité</a>.</p>

      <h2>9. Médiation de la consommation</h2>
      <p>
        Conformément à l&apos;article L.612-1 du Code de la consommation, tout consommateur a le droit de recourir gratuitement
        à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige, après avoir adressé une réclamation
        écrite à l&apos;Éditeur. Médiateur compétent : {LEGAL.mediatorName} ({LEGAL.mediatorUrl}). Le consommateur peut également
        recourir à la plateforme européenne de règlement en ligne des litiges : <a href={LEGAL.euOdrUrl}>{LEGAL.euOdrUrl}</a>.
      </p>

      <h2>10. Droit applicable et juridiction</h2>
      <p>
        Les présentes CGV sont soumises au droit français. Pour les clients professionnels, tout litige relève de la
        compétence exclusive du {LEGAL.court}. Pour les consommateurs, les règles légales de compétence s&apos;appliquent : le
        consommateur peut saisir, à son choix, la juridiction de son lieu de domicile ou celle du lieu d&apos;exécution.
      </p>
    </>
  );
}
