import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Politique de confidentialité — Yiwu Index" };

export default function Page() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p>La présente politique décrit comment {LEGAL.companyName} traite vos données personnelles, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi « Informatique et Libertés ».</p>

      <h2>1. Responsable du traitement</h2>
      <p>{LEGAL.entrepreneur} ({LEGAL.legalName}), {LEGAL.address}. Contact pour toute question relative aux données : {LEGAL.rgpdEmail}.</p>

      <h2>2. Données collectées</h2>
      <p>Dans le cadre de votre compte et de votre abonnement, nous traitons :</p>
      <ul>
        <li>adresse e-mail ;</li>
        <li>nom ou pseudonyme ;</li>
        <li>mot de passe (stocké de façon chiffrée / hachée, jamais en clair) ;</li>
        <li>historique de paiement et statut d&apos;abonnement (via {LEGAL.paymentProcessor}) ;</li>
        <li>liste des fiches fournisseurs débloquées ;</li>
        <li>journaux de connexion et de sécurité (logs).</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>Création et gestion du compte, fourniture du service — exécution du contrat (art. 6.1.b RGPD) ;</li>
        <li>Gestion des paiements et de la facturation — exécution du contrat et obligation légale (art. 6.1.b et 6.1.c) ;</li>
        <li>Sécurité, prévention de la fraude et des abus — intérêt légitime (art. 6.1.f) ;</li>
        <li>Mesure d&apos;audience agrégée et sans cookie — intérêt légitime (art. 6.1.f).</li>
      </ul>

      <h2>4. Destinataires et sous-traitants</h2>
      <p>Vos données sont accessibles à l&apos;Éditeur et à ses sous-traitants techniques, strictement pour les besoins du service :</p>
      <ul>
        <li>{LEGAL.hostingProvider} — hébergement et base de données ;</li>
        <li>{LEGAL.paymentProcessor} — traitement des paiements ;</li>
        <li>{LEGAL.emailProcessor} — envoi des e-mails transactionnels ;</li>
        <li>{LEGAL.analytics} — statistiques d&apos;audience.</li>
      </ul>

      <h2>5. Transferts hors Union européenne</h2>
      <p>Certains prestataires (notamment l&apos;hébergeur) sont situés ou opèrent en dehors de l&apos;UE. Ces transferts sont encadrés par des garanties appropriées : clauses contractuelles types de la Commission européenne et/ou mécanismes d&apos;adéquation (tel le Data Privacy Framework UE–États-Unis).</p>

      <h2>6. Durée de conservation</h2>
      <p>
        Données de compte : pendant toute la durée d&apos;utilisation, puis {LEGAL.retentionAfterDeletion} après la suppression
        du compte. Données de facturation : {LEGAL.billingRetention}. Les journaux techniques sont conservés pour une durée
        limitée à des fins de sécurité.
      </p>

      <h2>7. Vos droits</h2>
      <p>
        Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation et de
        portabilité, ainsi que du droit de définir des directives relatives au sort de vos données après votre décès. Pour les
        exercer, écrivez à {LEGAL.rgpdEmail}. Vous pouvez également introduire une réclamation auprès de la CNIL
        (<a href="https://www.cnil.fr">www.cnil.fr</a>).
      </p>

      <h2>8. Sécurité</h2>
      <p>Les mots de passe sont hachés, les coordonnées des fournisseurs sont servies côté serveur et réservées aux membres, et l&apos;accès aux données est restreint. Aucune transmission n&apos;étant totalement infaillible, nous mettons en œuvre des mesures techniques et organisationnelles proportionnées.</p>

      <h2>9. Cookies</h2>
      <p>L&apos;usage des cookies est décrit dans la <a href="/cookies">politique cookies</a>.</p>
    </>
  );
}
