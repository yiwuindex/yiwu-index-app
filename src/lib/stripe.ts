import Stripe from "stripe";
import type { Role } from "@prisma/client";

// Use a placeholder when the key is unset so importing this module never throws
// at load time. Real API calls fail at call time and are caught by each route.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_unset_placeholder", {
  apiVersion: "2024-06-20",
});

export const PLANS = {
  premium_monthly: {
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
    mode: "subscription" as const,
    role: "premium" as Role,
    stripePlan: "premium" as const,
    label: "Premium — 49€/mois",
  },
  pro_monthly: {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    mode: "subscription" as const,
    role: "pro" as Role,
    stripePlan: "pro" as const,
    label: "Pro — 89€/mois",
  },
  lifetime: {
    priceId: process.env.STRIPE_PRICE_LIFETIME!,
    mode: "payment" as const,
    role: "lifetime" as Role,
    stripePlan: "lifetime" as const,
    label: "Lifetime — 399€",
  },
};

export type PlanKey = keyof typeof PLANS;
export type StripePlan = (typeof PLANS)[PlanKey]["stripePlan"];

export function roleFromPriceId(priceId?: string | null): Role | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY) return "premium";
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_LIFETIME) return "lifetime";
  return null;
}

// Accept both the new canonical Stripe metadata values and the legacy values
// already present on older Checkout sessions/subscriptions.
export function roleFromStripePlan(plan?: string | null, priceId?: string | null): Role | null {
  if (plan === "premium" || plan === "premium_monthly") return "premium";
  if (plan === "pro" || plan === "pro_monthly") return "pro";
  if (plan === "lifetime") return "lifetime";
  return roleFromPriceId(priceId);
}

export function isActiveStripeStatus(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

export function subscriptionRole(subscription: Stripe.Subscription): Role | null {
  const priceId = subscription.items.data[0]?.price.id;
  return roleFromStripePlan(subscription.metadata?.plan, priceId);
}

function roleRank(role: Role | null): number {
  if (role === "pro") return 2;
  if (role === "premium") return 1;
  return 0;
}

export function bestActiveSubscription(subscriptions: Stripe.Subscription[]): Stripe.Subscription | null {
  return subscriptions
    .filter((subscription) => isActiveStripeStatus(subscription.status))
    .filter((subscription) => {
      const role = subscriptionRole(subscription);
      return role === "premium" || role === "pro";
    })
    .sort((a, b) => roleRank(subscriptionRole(b)) - roleRank(subscriptionRole(a)))[0] ?? null;
}


export function safeStripePeriodEnd(value?: number | null): Date | null {
  if (!value || !Number.isFinite(value) || value <= 0) return null;
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isProtectedRole(role?: Role | null): boolean {
  return role === "lifetime" || role === "vip";
}

// Production Checkout must always return to the canonical host so the Auth.js
// cookie remains on the same origin. Local development keeps its local URL.
export function appBaseUrl(): string {
  if (process.env.NODE_ENV !== "production") {
    const local = process.env.NEXT_PUBLIC_SITE_URL;
    if (local) {
      try {
        return new URL(local).origin;
      } catch {}
    }
  }
  return "https://yiwu-index.com";
}
