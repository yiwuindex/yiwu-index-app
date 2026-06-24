# Yiwu Index — version corrigée finale

## Ce qui a été corrigé dans cette version

- Header dynamique :
  - non connecté -> bouton Connexion ;
  - connecté -> avatar, nom/email, rôle et menu Mon compte / Mon abonnement / Déconnexion.
- Endpoint `/api/me` ajouté pour lire proprement l'utilisateur connecté côté frontend.
- Page login améliorée :
  - inscription avec nom, email, mot de passe ;
  - connexion via Auth.js Credentials ;
  - redirection vers `/account` ou vers `?next=...`.
- Page `/account` affiche nom, email, statut et déblocages mensuels.
- Mode “Premium preview” désactivé : les contacts ne sont plus simulés côté frontend.
- L’accès aux contacts reste contrôlé côté serveur via `/api/suppliers/[code]` et `/unlock`.

## Commandes à lancer après remplacement du dossier

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

Ensuite : GitHub Desktop -> Commit -> Push origin -> Vercel redeploy.

## Variables nécessaires sur Vercel

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
NEXT_PUBLIC_SITE_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_MONTHLY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_LIFETIME=
RESEND_API_KEY=
EMAIL_FROM=
```

Important : `DATABASE_URL` doit contenir le vrai mot de passe Supabase, pas `[YOUR-PASSWORD]`.

## Tests à faire

1. Aller sur `/login`.
2. Créer un compte avec nom + email + mot de passe.
3. Vérifier que le header affiche l’utilisateur connecté.
4. Aller sur `/account`.
5. Aller sur `/tarifs` et cliquer Premium / Pro / Lifetime.
6. Tester Stripe avec `4242 4242 4242 4242` en mode test.
7. Vérifier dans Supabase que le rôle utilisateur change après paiement.
8. Tester `/fournisseurs`, ouvrir une fiche et vérifier que les contacts restent verrouillés tant que l’utilisateur n’a pas d’accès payant.

