# Yiwu Index — fondation production

Transformation du prototype HTML en application **sécurisée et déployable** : front + API privée + base de données + auth + Stripe. Ce dépôt est la **fondation exécutable** (elle compile et tourne après `npm install` + base + clés Stripe). La fin de ce README liste ce qui est inclus et ce qui reste à brancher.

---

## 1. Architecture (la stack recommandée)

| Couche | Choix | Pourquoi |
|---|---|---|
| Frontend | **Next.js 14** (App Router) + React + TypeScript | SSR/SEO, déploiement Vercel en 1 clic |
| Backend / API | **Next.js Route Handlers** (`/src/app/api/*`) | même repo, fonctions serverless, secrets côté serveur |
| Base de données | **PostgreSQL** (Neon ou Supabase) + **Prisma** | relationnel, migrations versionnées |
| Auth | **Auth.js (NextAuth v5)** + adapter Prisma | sessions JWT, rôles, extensible (Google, e-mail…) |
| Paiement | **Stripe** (Checkout + Customer Portal + Webhooks) | abonnement, lifetime, gestion annulation/échec/refund |
| E-mails | **Resend** | transactionnels (bienvenue, paiement, annulation, échec) |
| Hébergement | **Vercel** (app) + Postgres managé | SSL auto, CDN, edge |

### Le point critique : la donnée premium ne quitte plus le navigateur
Dans le prototype, **tous les contacts étaient dans le JS** — n'importe qui pouvait les lire gratuitement (view-source). Ici :

- `GET /api/suppliers` renvoie **uniquement** les champs publics (nom, catégorie, produits, tags, district). Jamais les contacts.
- `GET /api/suppliers/[code]` lit la session côté serveur. Si l'utilisateur **n'est pas premium**, la réponse ne contient **aucune coordonnée** (seulement `locked: true` + quels canaux existent + un CTA). S'il est premium, les contacts sont inclus.
- La règle unique est dans `src/lib/roles.ts` (`isPremium()`), pilotée par les rôles `free / premium / lifetime / vip` mis à jour par les **webhooks Stripe**.

Conséquence : un non-abonné ne peut pas récupérer les contacts, même via l'onglet réseau.

---

## 2. Installation (local)

```bash
npm install
cp .env.example .env        # puis renseignez les valeurs
npx prisma generate
npm run db:push             # crée les tables (ou: npm run db:migrate)
npm run db:seed             # importe vos 1 540 fournisseurs (data/suppliers.json)
npm run dev                 # http://localhost:3000
```

## 3. Configuration Stripe

1. Créez un compte sur dashboard.stripe.com (mode test d'abord).
2. **Produits → +** :
   - « Premium » prix **récurrent 49 €/mois** → copiez le `price_...` dans `STRIPE_PRICE_PREMIUM_MONTHLY`.
   - « Lifetime » prix **unique 799 €** → `STRIPE_PRICE_LIFETIME`.
   - VIP = « sur devis » : pas de prix Stripe ; à l'issue du devis, passez l'utilisateur en rôle `vip` (admin/DB).
3. Clés API (Developers → API keys) → `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Webhook local : `npm run stripe:listen` → copiez le `whsec_...` dans `STRIPE_WEBHOOK_SECRET`.
   En prod : Developers → Webhooks → endpoint `https://VOTRE-DOMAINE/api/stripe/webhook`, événements :
   `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_failed`, `charge.refunded`.

Le flux : Checkout → paiement → webhook → rôle mis à jour → accès débloqué instantanément. Annulation/échec/refund → rôle repassé à `free`.

## 4. Déploiement Vercel

1. Poussez le repo sur GitHub, puis **Import Project** sur vercel.com.
2. **Environment Variables** : recopiez tout `.env` (DATABASE_URL, AUTH_SECRET, clés Stripe, RESEND, NEXT_PUBLIC_SITE_URL = votre domaine).
3. **Base de données** : créez un Postgres Neon/Supabase, mettez l'URL dans `DATABASE_URL`. Migration prod :
   `npx prisma migrate deploy` (via un job ou en local pointé sur la prod), puis `npm run db:seed`.
4. **Domaine + SSL** : Vercel → Settings → Domains → ajoutez votre domaine, suivez les enregistrements DNS. SSL (Let's Encrypt) est **automatique**.
5. **Monitoring** : activez Vercel Analytics + Log Drains ; surveillez les webhooks dans le dashboard Stripe (onglet Webhooks → tentatives/erreurs).

---

## 5. Ce qui est inclus ✅ / à brancher 🔜

**Inclus, fonctionnel :**
- ✅ Schéma DB (User/rôles, Subscription, Supplier, Testimonial) + import des 1 540 fournisseurs.
- ✅ API privée avec **verrouillage des contacts côté serveur** (le cœur de la sécurité).
- ✅ Auth.js (signup/login e-mail + mot de passe chiffré, sessions, rôles).
- ✅ Stripe complet : checkout, customer portal, webhook (activation/annulation/échec/refund), renouvellement auto.
- ✅ E-mails transactionnels (bienvenue, paiement confirmé, annulation, échec).
- ✅ 6 pages légales FR (RGPD) + footer, SEO (metadata, OpenGraph, schema.org, sitemap.xml, robots.txt, canonical).
- ✅ Stubs analytics **consentement-d'abord** (GA4/Meta/TikTok) + structure d'événements (signup, checkout_started, payment_success, premium_unlocked).

**À brancher (étapes suivantes) :**
- 🔜 Portage de l'UI annuaire existante (yiwu-index.html) en pages React qui consomment `/api/suppliers` (login, /fournisseurs, /account, /pricing, bandeau cookies).
- 🔜 Section trust homepage + logos de paiement **réels** (afficher seulement les moyens réellement acceptés ; pas de PayPal si non utilisé).
- 🔜 Témoignages : modèle DB prêt — à alimenter avec de **vrais** avis (pas de faux).
- 🔜 Perf/Lighthouse 90+ : next/image, lazy-load, code-splitting (acquis en grande partie via Next, à mesurer).

## 6. Limites honnêtes
- **Légal** : les pages sont des **modèles à faire valider par un avocat** et à compléter (SIRET, raison sociale…). Ce code n'est pas un conseil juridique.
- **Sécurité paiement** : je ne manipule jamais vos clés Stripe — vous les saisissez dans `.env`/Vercel. Testez en mode test avant le live.
- **Déploiement** : je ne peux pas déployer ni configurer votre domaine à votre place ; suivez les étapes ci-dessus.
- **Pas de faux signaux** : aucun chiffre/certification inventé (ISO, « +10 000 acheteurs ») n'est inclus.
