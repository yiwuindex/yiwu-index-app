import type { Role } from "@prisma/client";

export function hasActivePaidAccess(user?: { role?: Role | null; premiumUntil?: Date | string | null } | null): boolean {
  if (!user?.role) return false;
  if (user.role === "lifetime" || user.role === "vip") return true;
  if (user.role === "premium" || user.role === "pro") {
    if (!user.premiumUntil) return true;
    const until = typeof user.premiumUntil === "string" ? new Date(user.premiumUntil) : user.premiumUntil;
    return until.getTime() > Date.now();
  }
  return false;
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
