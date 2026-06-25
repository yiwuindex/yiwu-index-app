# Correctif Stripe/Auth Yiwu Index

Correctifs appliqués :

- Ajout `src/lib/site-url.ts` pour éviter les erreurs `null/api/auth/session`, `null/api/auth/error`, etc.
- Auth.js/NextAuth force maintenant une URL valide même si `AUTH_URL`, `NEXTAUTH_URL` ou `NEXT_PUBLIC_SITE_URL` valent `null` ou sont absentes.
- Checkout Stripe utilise maintenant l'origine de la requête quand possible, donc retour plus stable vers le même domaine.
- Portal Stripe utilise une URL de retour propre.
- Webhook Stripe corrigé :
  - `checkout.session.completed` active immédiatement Premium/Pro/Lifetime ;
  - `customer.subscription.updated` ne rétrograde plus un client payé en Free sur des statuts temporaires (`incomplete`, `past_due`, etc.) ;
  - `customer.subscription.deleted` reste le seul vrai cas de downgrade abonnement ;
  - lifetime/vip protégés contre les downgrades d'abonnement ;
  - logs plus clairs.
- `syncRoleFromStripe` corrigé pour accorder l'accès depuis Stripe sans downgrader par erreur.
- `/account?checkout=success` rafraîchit aussi la session côté client.

## Variables Vercel à vérifier

Dans Vercel, ajoute/vérifie :

```env
AUTH_URL=https://yiwu-index.com
NEXTAUTH_URL=https://yiwu-index.com
NEXT_PUBLIC_SITE_URL=https://yiwu-index.com
AUTH_SECRET=...
NEXTAUTH_SECRET=même valeur que AUTH_SECRET
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... ou pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_LIFETIME=price_...
RESEND_API_KEY=re_...
EMAIL_FROM=Yiwu Index <support@yiwu-index.com>
```

## Commandes

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

Note : je n'ai pas pu valider `npm install`/`npm run build` dans l'environnement sandbox car Prisma n'a pas pu télécharger son binaire (`binaries.prisma.sh` inaccessible). Lance les commandes sur ton PC.

## Test final

1. Redeploy Vercel.
2. Va sur `https://yiwu-index.com/login`.
3. Connecte-toi.
4. Paye en mode test Stripe.
5. Retour attendu : `/account?checkout=success`.
6. Le compte doit afficher Premium/Pro actif.
7. Va sur `/fournisseurs` et vérifie que les fournisseurs sont débloqués selon ton plan.
8. Dans Stripe > Webhooks, vérifie les events en vert.
