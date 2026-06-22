export const metadata = { title: "Politique de confidentialité" };
export default function Page() { return (<>
  <h1>Politique de confidentialité (RGPD)</h1>
  <h2>Responsable du traitement</h2>
  <p>[RAISON SOCIALE], [ADRESSE], [EMAIL].</p>
  <h2>Données collectées</h2>
  <p>E-mail et mot de passe (chiffré) à l'inscription ; données de facturation gérées par Stripe ; données d'usage et de navigation
     (cookies analytics, sous réserve de consentement).</p>
  <h2>Finalités et bases légales</h2>
  <p>Gestion du compte et de l'abonnement (exécution du contrat) ; facturation (obligation légale) ; mesure d'audience et marketing
     (consentement) ; sécurité (intérêt légitime).</p>
  <h2>Sous-traitants</h2>
  <p>Stripe (paiement), Vercel (hébergement), [Neon/Supabase] (base de données), Resend (e-mails), Google/Meta/TikTok (analytics, si consenti).</p>
  <h2>Durée de conservation</h2>
  <p>Données de compte : durée de l'abonnement + [X] ans. Données de facturation : 10 ans (obligation comptable).</p>
  <h2>Vos droits</h2>
  <p>Accès, rectification, effacement, opposition, portabilité, limitation. Exercice à [EMAIL]. Réclamation possible auprès de la CNIL (cnil.fr).</p>
</>); }
