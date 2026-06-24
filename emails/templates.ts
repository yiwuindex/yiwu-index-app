// Minimal, premium-looking transactional templates (inline CSS for email clients).
const shell = (title: string, body: string) => `
<div style="background:#f5f3ee;padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#1a1c20">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e7e2d8;border-radius:16px;overflow:hidden">
    <div style="padding:22px 28px;border-bottom:1px solid #e7e2d8;font-weight:800;letter-spacing:.04em">YIWU INDEX</div>
    <div style="padding:28px">
      <h1 style="font-size:21px;margin:0 0 14px">${title}</h1>
      ${body}
    </div>
    <div style="padding:18px 28px;border-top:1px solid #e7e2d8;font-size:12px;color:#9a9189;line-height:1.5">
      Yiwu Index — intelligence de sourcing B2B. Vous recevez cet e-mail suite à une action sur votre compte.
    </div>
  </div>
</div>`;
const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#c8453a;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px;margin-top:8px">${label}</a>`;
const site = process.env.NEXT_PUBLIC_SITE_URL || "https://yiwu-index.com";

export const welcome = (name?: string) => shell("Bienvenue" + (name ? `, ${name}` : ""),
  `<p>Votre compte Yiwu Index est créé. Accédez à la base de 1 540 fournisseurs vérifiés et à l'académie d'importation.</p>${btn(site + "/account", "Accéder à mon compte")}`);

export const paymentConfirmed = (plan: string) => shell("Paiement confirmé",
  `<p>Votre accès <b>${plan}</b> est actif. Les coordonnées directes des fournisseurs sont désormais débloquées.</p>${btn(site + "/fournisseurs", "Voir les fournisseurs")}`);

export const subscriptionCancelled = () => shell("Abonnement annulé",
  `<p>Votre abonnement a bien été annulé. Vous gardez l'accès jusqu'à la fin de la période en cours.</p>${btn(site + "/tarifs", "Réactiver")}`);

export const paymentFailed = () => shell("Échec de paiement",
  `<p>Le dernier paiement n'a pas pu être traité. Mettez à jour votre moyen de paiement pour conserver votre accès.</p>${btn(site + "/account", "Mettre à jour")}`);

export const signInAlert = (when: string) => shell("Nouvelle connexion à votre compte",
  `<p>Une connexion à votre compte Yiwu Index vient d'avoir lieu&nbsp;:</p>
   <p style="background:#f5f3ee;border:1px solid #e7e2d8;border-radius:10px;padding:12px 14px;font-size:14px"><b>${when}</b></p>
   <p style="font-size:13px;color:#666b73">Si c'était bien vous, aucune action n'est nécessaire. Si vous ne reconnaissez pas cette connexion, changez votre mot de passe sans attendre et contactez-nous.</p>${btn(site + "/account", "Voir mon compte")}`);

export const passwordReset = (url: string) => shell("Réinitialisation du mot de passe",
  `<p>Vous avez demandé à réinitialiser votre mot de passe Yiwu Index.</p>
   <p>Ce lien est valable pendant 1 heure.</p>
   ${btn(url, "Créer un nouveau mot de passe")}
   <p style="font-size:13px;color:#666b73;margin-top:18px">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>`);
