import { Resend } from "resend";
import { welcome, paymentConfirmed, subscriptionCancelled, paymentFailed, signInAlert, passwordReset } from "../../emails/templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Yiwu Index <noreply@yiwu-index.com>";

async function send(to: string, subject: string, html: string) {
  if (!resend) { console.warn("[email] RESEND_API_KEY missing, skipping:", subject); return; }
  try { await resend.emails.send({ from: FROM, to, subject, html }); }
  catch (e) { console.error("[email] send failed", e); }
}

export const Emails = {
  welcome: (to: string, name?: string) => send(to, "Bienvenue sur Yiwu Index", welcome(name)),
  paymentConfirmed: (to: string, plan: string) => send(to, "Paiement confirmé — accès activé", paymentConfirmed(plan)),
  subscriptionCancelled: (to: string) => send(to, "Votre abonnement a été annulé", subscriptionCancelled()),
  paymentFailed: (to: string) => send(to, "Échec de paiement — action requise", paymentFailed()),
  signInAlert: (to: string, when: string) => send(to, "Nouvelle connexion à votre compte Yiwu Index", signInAlert(when)),
  passwordReset: (to: string, url: string) => send(to, "Réinitialiser votre mot de passe Yiwu Index", passwordReset(url)),
};
