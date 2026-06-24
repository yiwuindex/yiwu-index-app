# Yiwu Index — version corrigée par ChatGPT

## Ce qui a été corrigé dans ce ZIP

- Page login remplacée par un vrai formulaire inscription / connexion relié à NextAuth Credentials.
- API `/api/register` utilisée pour créer un compte avec mot de passe hashé bcrypt.
- Header + footer globaux remis dans `src/app/layout.tsx`.
- Stripe Checkout branché pour Premium, Pro et Lifetime.
- Webhook Stripe mis à jour pour activer `premium`, `pro` ou `lifetime` selon le plan payé.
- Ajout du rôle `pro` dans Prisma.
- Ajout d'une table `SupplierUnlock` pour enregistrer les fiches fournisseurs débloquées par utilisateur.
- Page compte améliorée : email, rôle, déblocages utilisés, abonnement Stripe, déconnexion, portail Stripe.
- Fiches fournisseurs : contacts cachés tant que la fiche n'est pas débloquée.
- Premium : 10 déblocages/mois.
- Pro : 50 déblocages/mois.
- Lifetime/VIP : illimité.
- `/pricing` redirige vers `/tarifs`.

## Variables Vercel obligatoires

Dans Vercel > Settings > Environment Variables :

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=https://yiwu-index-app.vercel.app
NEXT_PUBLIC_SITE_URL=https://yiwu-index-app.vercel.app

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_1TlZbuINSWdh0jWE41MWOTQg
STRIPE_PRICE_PRO_MONTHLY=price_1TlZcQINSWdh0jWErxCqzHsr
STRIPE_PRICE_LIFETIME=price_1T1ZfsINSWdh0jWE1FmWwLJM
```

`RESEND_API_KEY` et `EMAIL_FROM` sont optionnels.

## Très important après remplacement des fichiers

Comme le schéma Prisma a changé, il faut appliquer la base de données :

```bash
cd Desktop\yiwu-index-app
npm install
npx prisma generate
npx prisma db push
```

Puis :

```bash
npm run build
```

Si le build passe : commit + push GitHub Desktop, Vercel redéploie.

## Tests à faire

1. Aller sur `/login`.
2. Créer un compte avec email + mot de passe de 8 caractères minimum.
3. Être redirigé vers `/tarifs`.
4. Cliquer Premium / Pro / Lifetime.
5. Stripe Checkout doit s'ouvrir.
6. Payer en mode test avec : `4242 4242 4242 4242`.
7. Après paiement, aller sur `/account`.
8. Vérifier que le rôle est devenu `premium`, `pro` ou `lifetime`.
9. Aller sur `/fournisseurs`.
10. Ouvrir une fiche et cliquer sur “Débloquer cette fiche”.

## Limites actuelles

- Le système de déblocage est fonctionnel côté code, mais il faut faire `npx prisma db push` pour créer la table `SupplierUnlock`.
- Les emails Resend sont optionnels : si `RESEND_API_KEY` manque, le site fonctionne quand même.
- Le build n'a pas pu être exécuté dans l'environnement ChatGPT car il n'a pas accès à Internet pour télécharger les binaires Prisma/Next nécessaires. Il devra être vérifié sur ton PC/Vercel.
