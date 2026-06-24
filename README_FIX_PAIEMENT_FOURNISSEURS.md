# Correctifs appliqués — paiement / session / fournisseurs

## Corrigé
- Stripe Checkout renvoie maintenant vers `/account?paid=1&session_id=...`.
- La page `/account` synchronise la session Stripe immédiatement après paiement.
- Le webhook Stripe active aussi l'abonnement dès `checkout.session.completed`.
- Cela évite le bug : paiement réussi mais fournisseurs encore bloqués.
- Les appels fournisseurs utilisent `cache: "no-store"` pour réduire les états vides/stales.
- Ajout d'une checklist des informations légales à compléter.

## À tester après déploiement
1. Créer un compte.
2. Acheter Premium ou Pro en mode test Stripe.
3. Vérifier `/account` : le plan doit passer Premium/Pro.
4. Aller sur `/fournisseurs`, ouvrir une fiche, cliquer Débloquer.
5. Les contacts doivent apparaître.
6. Vérifier Stripe Webhooks : évènement `checkout.session.completed` vert.
