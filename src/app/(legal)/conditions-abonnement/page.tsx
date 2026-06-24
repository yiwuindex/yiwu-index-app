import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Conditions d'abonnement" };
export default function Page() { return (<>
  <h1>Conditions d'abonnement</h1>
  <h2>Renouvellement automatique</h2>
  <p>Les abonnements Premium ({LEGAL.pricePremium}) et Pro ({LEGAL.pricePro}) sont reconduits automatiquement chaque mois jusqu'à résiliation. Le paiement est prélevé via Stripe à chaque échéance.</p>
  <h2>Résiliation</h2>
  <p>Vous pouvez résilier à tout moment depuis l'espace « Mon compte » → portail de facturation Stripe. L'accès reste actif jusqu'à la fin de la période payée.</p>
  <h2>Lifetime</h2>
  <p>L'offre Lifetime ({LEGAL.priceLifetime}) est un paiement unique donnant un accès permanent.</p>
  <h2>Échec de paiement</h2>
  <p>En cas d'échec de paiement, l'accès peut être suspendu après relance. Mettez à jour votre moyen de paiement depuis le portail Stripe.</p>
</>); }
