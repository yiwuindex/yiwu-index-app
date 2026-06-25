import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Politique de remboursement — Yiwu Index" };

export default function Page() {
  return (
    <>
      <h1>Politique de remboursement</h1>
      <p>{LEGAL.companyName} fournit un contenu numérique et un service à accès immédiat. La présente politique précise les conditions de remboursement, dans le respect des droits des consommateurs.</p>

      <h2>Principe</h2>
      <p>L&apos;accès premium est débloqué immédiatement après validation du paiement par {LEGAL.paymentProcessor}. En demandant cet accès immédiat et en accédant au contenu, le client (consommateur) reconnaît renoncer à son droit de rétractation, conformément à l&apos;article L.221-28 du Code de la consommation.</p>

      <h2>Aucun remboursement après accès</h2>
      <p>En conséquence, et sous réserve des garanties légales, <b>aucun remboursement n&apos;est accordé après le premier accès au contenu</b> (déblocage de fiches, accès à l&apos;académie ou aux outils). Tant qu&apos;aucun contenu n&apos;a été consulté, le consommateur conserve son droit de rétractation de 14 jours et peut demander le remboursement intégral.</p>

      <h2>Annulation d&apos;un abonnement</h2>
      <p>L&apos;annulation d&apos;un abonnement mensuel met fin au renouvellement à venir. Elle ne donne pas lieu à un remboursement au prorata de la période en cours, qui reste accessible jusqu&apos;à son terme. L&apos;annulation s&apos;effectue à tout moment depuis « Mon compte ».</p>

      <h2>Cas particuliers</h2>
      <p>Un remboursement pourra être étudié en cas de double facturation, de paiement non autorisé ou d&apos;indisponibilité prolongée du service imputable à l&apos;Éditeur. Toute demande est à adresser à {LEGAL.supportEmail}.</p>
    </>
  );
}
