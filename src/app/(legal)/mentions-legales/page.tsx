import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Mentions légales — Yiwu Index" };

export default function Page() {
  return (
    <>
      <h1>Mentions légales</h1>
      <p>Conformément à l&apos;article 6 III de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), voici les informations relatives à l&apos;éditeur et à l&apos;hébergeur du site {LEGAL.domain}.</p>

      <h2>Éditeur du site</h2>
      <p>
        Le site {LEGAL.companyName} ({LEGAL.domain}) est édité par {LEGAL.entrepreneur} ({LEGAL.legalName}),
        exerçant sous le statut d&apos;{LEGAL.legalStatus}.<br />
        Siège : {LEGAL.address}<br />
        SIREN : {LEGAL.siren}<br />
        Immatriculation : {LEGAL.rcs}<br />
        TVA : {LEGAL.vatNote}<br />
        Contact : {LEGAL.supportEmail} — {LEGAL.phoneNote}.
      </p>

      <h2>Directeur de la publication</h2>
      <p>{LEGAL.publicationDirector}.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par {LEGAL.hostingProvider}, {LEGAL.hostingAddress} ({LEGAL.hostingSite}).
        L&apos;infrastructure de base de données et les services techniques associés sont opérés via des prestataires
        décrits dans la <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Activité</h2>
      <p>
        {LEGAL.companyName} est une plateforme numérique d&apos;intelligence sourcing donnant accès, sur abonnement, à une
        base de données de fournisseurs, à des outils de sourcing et à des contenus éducatifs. Il ne s&apos;agit pas d&apos;une
        place de marché : aucun produit physique n&apos;est vendu sur le site et l&apos;éditeur n&apos;intervient pas dans les
        transactions conclues entre l&apos;utilisateur et les fournisseurs.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site (structure, textes, interface, base de données, contenus de l&apos;académie,
        marques et logos) est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de
        l&apos;éditeur ou de ses partenaires. Toute reproduction, extraction ou réutilisation substantielle de la base de
        données est interdite, en application notamment de l&apos;article L.341-1 du Code de la propriété intellectuelle
        (droit sui generis du producteur de bases de données). Toute utilisation non autorisée pourra faire l&apos;objet de
        poursuites.
      </p>

      <h2>Données personnelles & cookies</h2>
      <p>
        Le traitement des données personnelles est détaillé dans la <a href="/confidentialite">politique de confidentialité</a>,
        et l&apos;usage des cookies dans la <a href="/cookies">politique cookies</a>.
      </p>
    </>
  );
}
