import { Resend } from "resend";
import { welcome, loginNotice, paymentConfirmed, subscriptionCancelled, paymentFailed } from "../../emails/templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Yiwu Index <no-reply@example.com>";

async function send(to: string, subject: string, html: string) {
  if (!resend) { console.warn("[email] RESEND_API_KEY missing, skipping:", subject); return; }
  try { await resend.emails.send({ from: FROM, to, subject, html }); }
  catch (e) { console.error("[email] send failed", e); }
}
export const Emails = {
  welcome: (to: string, name?: string) => send(to, "Bienvenue sur Yiwu Index", welcome(name)),
  loginNotice: (to: string, name?: string) => send(to, "Nouvelle connexion à votre compte Yiwu Index", loginNotice(name)),
  paymentConfirmed: (to: string, plan: string) => send(to, "Paiement confirmé — accès Premium activé", paymentConfirmed(plan)),
  subscriptionCancelled: (to: string) => send(to, "Votre abonnement a été annulé", subscriptionCancelled()),
  paymentFailed: (to: string) => send(to, "Échec de paiement — action requise", paymentFailed())
};
