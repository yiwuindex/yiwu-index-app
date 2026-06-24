import Stripe from "stripe";
import type { Role } from "@prisma/client";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

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
