# Yiwu Index — derniers réglages après ce ZIP

## Ce qui a été corrigé dans ce ZIP

- Suppression du faux bouton/toggle Premium de démonstration dans le header.
- Le catalogue fournisseurs utilise maintenant Supabase si la base est remplie, sinon il retombe sur `data/suppliers.json` pour éviter l'écran "0 fournisseur".
- Les contacts restent verrouillés côté front. Le vrai déblocage passe par le rôle utilisateur + Stripe.
- L'inscription/connexion passent par Auth.js Credentials + `/api/register`.
- Les pages Stripe sont prévues pour Premium, Pro et Lifetime.
- Les routes fournisseurs détails/déblocage sont plus robustes si la base n'a pas encore été seed.

## À faire sur ton PC

Ouvre CMD dans le dossier du projet :

```bash
cd Desktop\yiwu-index-app
```

Puis lance :

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

Si `npm run db:seed` répond que les fournisseurs sont importés, c'est bon.

## À faire avec GitHub Desktop

1. Ouvre GitHub Desktop.
2. Vérifie que les fichiers modifiés apparaissent.
3. Commit : `final fixes auth suppliers stripe`.
4. Push origin.
5. Vercel redéploie automatiquement.

## Variables Vercel à vérifier

Il faut avoir :

```txt
DATABASE_URL=...
AUTH_SECRET=...
AUTH_URL=https://ton-url-vercel-ou-domaine
NEXT_PUBLIC_SITE_URL=https://ton-url-vercel-ou-domaine
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_LIFETIME=price_...
```

Important : si tu changes `AUTH_URL` ou `NEXT_PUBLIC_SITE_URL`, fais Redeploy.

## Test final en mode Stripe test

1. Va sur `/login`.
2. Clique `Inscription`.
3. Mets un email + mot de passe de 8 caractères minimum.
4. Tu dois arriver sur `/tarifs`.
5. Clique Premium ou Pro ou Lifetime.
6. Stripe Checkout doit s'ouvrir.
7. Utilise la carte test :

```txt
4242 4242 4242 4242
Date future
CVC 123
Code postal 75000
```

8. Après paiement, tu dois revenir sur `/account`.
9. Ton rôle doit être `premium`, `pro` ou `lifetime`.
10. Va sur `/fournisseurs`, ouvre une fiche, clique `Débloquer cette fiche`.

## Si l'inscription échoue

- Vérifie que `DATABASE_URL` est bien sur Vercel.
- Vérifie que `npx prisma db push` a été lancé sur ton PC.
- Vérifie que `AUTH_SECRET` existe sur Vercel.
- Vérifie les logs Vercel de `/api/register` ou `/api/auth`.

## Si les fournisseurs affichent 0

Ce ZIP contient une sécurité avec `data/suppliers.json`, donc le catalogue doit s'afficher même si Supabase est vide.
Si ce n'est pas le cas, vérifie `/api/suppliers` dans le navigateur.

## Avant de vendre en vrai

- Remplace les clés Stripe test par les clés live.
- Recrée les produits Stripe en mode Live.
- Recrée le webhook en mode Live.
- Remplace les variables Vercel par `sk_live`, `pk_live`, `whsec_live` et les nouveaux `price_...`.
- Corrige les pages légales avec vraie société, SIRET, email, adresse.
