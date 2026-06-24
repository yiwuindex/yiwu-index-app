import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Mentions légales" };
export default function Page() { return (<>
  <h1>Mentions légales</h1>
  <h2>Éditeur</h2>
  <p>Le site {LEGAL.companyName} est édité par {LEGAL.legalName}, {LEGAL.legalStatus} au capital de {LEGAL.capital} €,
     immatriculée au RCS de {LEGAL.rcsCity} sous le numéro {LEGAL.siret}, dont le siège social est situé {LEGAL.address}.
     TVA intracommunautaire : {LEGAL.vatNumber}. Directeur de la publication : {LEGAL.publicationDirector}.</p>
  <h2>Contact</h2>
  <p>E-mail : {LEGAL.supportEmail} — Téléphone : {LEGAL.phone}.</p>
  <h2>Hébergement</h2>
  <p>Le site est hébergé par {LEGAL.hostingProvider}. Base de données hébergée par {LEGAL.dbProvider}.</p>
  <h2>Propriété intellectuelle</h2>
  <p>L'ensemble des contenus (base de données, textes, interface, académie) est la propriété de {LEGAL.legalName} ou de ses partenaires.
     Toute reproduction ou extraction substantielle de la base de données est interdite (art. L341-1 CPI).</p>
</>); }
