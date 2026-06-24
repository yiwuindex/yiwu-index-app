// ============================================================================
//  INFORMATIONS LÉGALES — À REMPLIR UNE SEULE FOIS ICI.
//  Toutes les pages légales (mentions, CGV, confidentialité, cookies,
//  remboursement, conditions d'abonnement) et le pied de page lisent ce fichier.
//  Remplacez chaque valeur entre crochets [ ... ] par votre information réelle.
// ============================================================================

export const LEGAL = {
  // — Identité de l'entreprise —
  companyName: "Yiwu Index",                 // nom commercial affiché
  legalName: "[RAISON SOCIALE]",             // raison sociale complète
  legalStatus: "[FORME JURIDIQUE]",          // ex : SAS, SASU, EURL, auto-entrepreneur
  capital: "[MONTANT]",                      // capital social, en € (ou "" si non applicable)
  rcsCity: "[VILLE RCS]",                    // ville d'immatriculation au RCS
  siret: "[SIRET]",                          // n° SIRET / RCS
  vatNumber: "[N° TVA]",                     // TVA intracommunautaire

  // — Personnes —
  ownerName: "[NOM DU RESPONSABLE]",         // gérant / président
  publicationDirector: "[NOM DU RESPONSABLE]", // directeur de la publication

  // — Coordonnées —
  address: "[ADRESSE DU SIÈGE]",
  supportEmail: "[EMAIL SUPPORT]",
  phone: "[TÉLÉPHONE]",

  // — Hébergement —
  hostingProvider: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
  dbProvider: "Supabase",                    // hébergeur de la base de données

  // — RGPD / remboursement —
  dataRetentionYears: "[X]",                 // années de conservation après fin d'abonnement
  refundWindowDays: "14",                    // jours de garantie commerciale (si vous en offrez une)
  courtCity: "[VILLE]",                      // tribunal compétent en cas de litige

  // — Divers —
  siteUrl: "https://yiwu-index.com",

  // — Tarifs (gardez synchronisé avec la page /tarifs et Stripe) —
  pricePremium: "49 €/mois",
  pricePro: "89 €/mois",
  priceLifetime: "399 €",
} as const;
