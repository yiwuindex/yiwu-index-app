# Yiwu Index — dernières finitions ajoutées

## Ce qui a été ajouté dans cette version

- Envoi email de bienvenue déjà branché via `Emails.welcome()` après inscription.
- Envoi email de nouvelle connexion via l'événement NextAuth `signIn`.
- Envoi email paiement confirmé / abonnement annulé / paiement échoué via le webhook Stripe.
- Ajout du flow complet “mot de passe oublié” :
  - `/mot-de-passe-oublie`
  - `/reset-password?token=...`
  - `/api/password/forgot`
  - `/api/password/reset`
- Ajout des champs Prisma nécessaires :
  - `passwordResetToken`
  - `passwordResetExpires`
  - `emailVerifiedAt`
- Correction de `/api/suppliers` en route dynamique pour éviter les erreurs de rendu statique Vercel.
- Amélioration UX login : confirmation de mot de passe à l'inscription + lien “Mot de passe oublié ?”.

## Variables Vercel obligatoires

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=https://yiwu-index.com
NEXT_PUBLIC_SITE_URL=https://yiwu-index.com
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_MONTHLY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_LIFETIME=
RESEND_API_KEY=
EMAIL_FROM=Yiwu Index <noreply@yiwu-index.com>
```

## Commandes à lancer après remplacement du dossier

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

Ensuite : GitHub Desktop → Commit → Push → Vercel redeploy.

## Tests à faire après déploiement

1. Créer un nouveau compte.
2. Vérifier email de bienvenue dans la boîte mail.
3. Se connecter.
4. Vérifier email “nouvelle connexion”.
5. Cliquer “Mot de passe oublié ?”.
6. Recevoir le mail de reset.
7. Modifier le mot de passe.
8. Se reconnecter avec le nouveau mot de passe.
9. Tester Stripe checkout Premium/Pro/Lifetime.
10. Vérifier que le webhook active le rôle utilisateur.

## Suite production

- Activer les emails Stripe dans Stripe > Settings > Customer emails : successful payments, failed payments, invoices.
- Ajouter Google Search Console et soumettre `/sitemap.xml`.
- Ajouter Analytics : Vercel Analytics ou Google Analytics.
- Vérifier CGV / mentions légales / confidentialité / cookies avec vos vraies infos entreprise.
