import Stripe from "stripe";
import type { Role } from "@prisma/client";

// Use a placeholder when the key is unset so importing this module never throws
// at load time (a throw here would 500 every route that imports Stripe, including
// the account page). Real API calls with an invalid key fail at call time and are
// caught by each route's try/catch.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_unset_placeholder", { apiVersion: "2024-06-20" });

export const PLANS = {
  premium_monthly: {
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
    mode: "subscription" as const,
    role: "premium" as Role,
    label: "Premium — 49€/mois",
  },
  pro_monthly: {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    mode: "subscription" as const,
    role: "pro" as Role,
    label: "Pro — 89€/mois",
  },
  lifetime: {
    priceId: process.env.STRIPE_PRICE_LIFETIME!,
    mode: "payment" as const,
    role: "lifetime" as Role,
    label: "Lifetime — 399€",
  },
};

export type PlanKey = keyof typeof PLANS;

export function roleFromPriceId(priceId?: string | null): Role {
  if (!priceId) return "premium";
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_LIFETIME) return "lifetime";
  return "premium";
}
