import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export const PLANS = {
  premium_monthly: { priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!, mode: "subscription" as const, role: "premium" as const, label: "Premium — 49€/mois" },
  pro_monthly:     { priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,     mode: "subscription" as const, role: "premium" as const, label: "Pro — 89€/mois" },
  lifetime:        { priceId: process.env.STRIPE_PRICE_LIFETIME!,        mode: "payment" as const,      role: "lifetime" as const, label: "Lifetime — 399€" }
  // VIP = "sur devis": handled by contact form, then set manually to role "vip" in the DB / admin.
};
export type PlanKey = keyof typeof PLANS;
