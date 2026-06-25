import type { Role } from "@prisma/client";

// The DB role is authoritative. Stripe webhooks/success resync are responsible
// for changing that role; a stale or missing premiumUntil must never hide paid
// contacts while the current DB role is premium/pro/lifetime/vip.
export function hasActivePaidAccess(user?: { role?: Role | null; premiumUntil?: Date | string | null } | null): boolean {
  return (
    user?.role === "premium" ||
    user?.role === "pro" ||
    user?.role === "lifetime" ||
    user?.role === "vip"
  );
}

export function unlockLimit(role?: Role | null): number {
  if (role === "premium") return 10;
  if (role === "pro") return 50;
  if (role === "lifetime" || role === "vip") return Number.POSITIVE_INFINITY;
  return 0;
}

export function isUnlimited(role?: Role | null): boolean {
  return role === "lifetime" || role === "vip";
}
