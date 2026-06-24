# Yiwu Index — finalisation pro v4

## Modifications ajoutées

- Page `/login` retravaillée comme un vrai SaaS :
  - champ nom complet à l'inscription ;
  - email + mot de passe ;
  - confirmation du mot de passe ;
  - bouton œil pour afficher/masquer le mot de passe ;
  - indicateur de sécurité du mot de passe ;
  - messages d'erreur propres ;
  - loading state.
- Auth NextAuth Credentials simplifiée et fiabilisée :
  - suppression de la dépendance directe au PrismaAdapter dans la config auth ;
  - session JWT rafraîchie depuis la base ;
  - nom/email/role lus proprement dans la session.
- Emails transactionnels :
  - email de bienvenue après inscription ;
  - email de notification après connexion réussie ;
  - emails paiement confirmé / paiement échoué / annulation conservés.
- Page `/account` améliorée :
  - affiche nom, email, plan, date de création, déblocages ;
  - CTA selon le plan ;
  - gestion abonnement Stripe si customer Stripe présent.
- Nettoyage :
  - suppression d'un ancien fichier header statique inutile ;
  - ajout CSS responsive/premium pour l'auth.

## Variables Vercel obligatoires

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
```

## Variables recommandées pour emails

```env
RESEND_API_KEY=
EMAIL_FROM="Yiwu Index <no-reply@votre-domaine.com>"
```

Si `RESEND_API_KEY` manque, le site continue de fonctionner, mais les emails automatiques ne sont pas envoyés.

## Commandes à lancer après remplacement du dossier

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

Puis : GitHub Desktop → commit → push → Vercel redeploy.

## Tests finaux

1. `/login` → créer un compte avec nom, email, mot de passe.
2. Vérifier réception email de bienvenue si Resend est configuré.
3. Se connecter → vérifier email de connexion.
4. Vérifier header : avatar + nom/email + menu compte.
5. `/account` → vérifier plan Free + déblocages.
6. `/fournisseurs` → ouvrir une fiche, contacts verrouillés en Free.
7. `/tarifs` → tester Premium/Pro/Lifetime en mode Stripe test.
8. Payer avec `4242 4242 4242 4242`.
9. Vérifier que Stripe webhook passe en vert.
10. Vérifier dans Supabase que `User.role` change.
11. Revenir sur `/account`, puis `/fournisseurs`, tester déblocage.

## Avant publication Google

- Remplacer toutes les pages légales placeholders par vos vraies infos : SIRET, adresse, email support.
- Ajouter le vrai domaine dans Vercel.
- Mettre `AUTH_URL` et `NEXT_PUBLIC_SITE_URL` avec le vrai domaine.
- Passer Stripe en Live et remplacer les clés test par les clés live.
- Configurer Resend avec un domaine vérifié.
- Soumettre le sitemap à Google Search Console : `/sitemap.xml`.
