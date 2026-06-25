import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Conditions d'abonnement — Yiwu Index" };

export default function Page() {
  return (
    <>
      <h1>Conditions d&apos;abonnement</h1>

      <h2>Offres</h2>
      <p>Premium ({LEGAL.pricePremium}) et Pro ({LEGAL.pricePro}) sont des abonnements mensuels reconduits automatiquement. Lifetime ({LEGAL.priceLifetime}) est un paiement unique donnant un accès permanent.</p>

      <h2>Renouvellement automatique</h2>
      <p>Les abonnements mensuels sont prélevés automatiquement à chaque échéance via {LEGAL.paymentProcessor}, jusqu&apos;à résiliation par le client.</p>

      <h2>Résiliation</h2>
      <p>Vous pouvez résilier à tout moment, sans frais ni justification, depuis votre espace « Mon compte » (portail de facturation {LEGAL.paymentProcessor}). La résiliation prend effet à la fin de la période en cours déjà réglée, période durant laquelle l&apos;accès reste actif.</p>

      <h2>Quotas de déblocage</h2>
      <p>Chaque offre inclut un nombre de déblocages de coordonnées fournisseurs par mois : 10 pour Premium, 50 pour Pro, et illimité pour Lifetime. Les fiches déjà débloquées restent accessibles.</p>

      <h2>Échec de paiement</h2>
      <p>En cas d&apos;échec de paiement, l&apos;accès peut être suspendu après relance. Vous pouvez mettre à jour votre moyen de paiement depuis le portail {LEGAL.paymentProcessor}.</p>
    </>
  );
}
