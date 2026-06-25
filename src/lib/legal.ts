// ============================================================================
//  INFORMATIONS LÉGALES — source unique pour toutes les pages légales + footer.
//  Pour modifier une info, changez-la ICI uniquement.
// ============================================================================

export const LEGAL = {
  // — Identité —
  companyName: "Yiwu Index",
  entrepreneur: "Hugo Duquesne",
  legalName: "DUQUESNE Hugo, Georges, Henri",
  legalStatus: "Entreprise individuelle (micro-entrepreneur)",
  siren: "943 301 838",
  rcs: "943 301 838 R.C.S. Dax",
  vatNote: "TVA non applicable, art. 293 B du CGI",
  address: "150 Place Nauton Truquez, 40300 Peyrehorade, France",

  // — Direction —
  publicationDirector: "Hugo Duquesne",

  // — Contact —
  supportEmail: "support@yiwu-index.com",
  rgpdEmail: "support@yiwu-index.com",
  phoneNote: "Aucun support téléphonique — assistance uniquement par e-mail",

  // — Technique / sous-traitants —
  hostingProvider: "Vercel Inc.",
  hostingAddress: "340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
  hostingSite: "https://vercel.com",
  paymentProcessor: "Stripe Payments Europe, Ltd.",
  emailProcessor: "Resend",
  analytics: "Vercel Analytics (mesure d'audience sans cookie)",

  // — Litiges —
  court: "Tribunal de commerce de Dax",
  // OBLIGATION B2C : un médiateur de la consommation doit être désigné si vous
  // vendez à des particuliers. Renseignez son nom + URL une fois souscrit.
  mediatorName: "[MÉDIATEUR DE LA CONSOMMATION À DÉSIGNER]",
  mediatorUrl: "[https://… site du médiateur]",
  euOdrUrl: "https://ec.europa.eu/consumers/odr",

  // — RGPD —
  retentionAfterDeletion: "3 ans",
  billingRetention: "10 ans (obligation comptable)",

  // — Site —
  siteUrl: "https://yiwu-index.com",
  domain: "yiwu-index.com",
  lastUpdated: "25 juin 2026",

  // — Offres (à garder synchro avec /tarifs et Stripe) —
  pricePremium: "49 €/mois",
  pricePro: "89 €/mois",
  priceLifetime: "399 € (paiement unique)",
} as const;
