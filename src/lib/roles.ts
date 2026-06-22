import type { Role } from "@prisma/client";

/** Single source of truth for "can this user see premium data?" */
export function isPremium(user?: { role?: Role | null; premiumUntil?: Date | null } | null): boolean {
  if (!user?.role) return false;
  if (user.role === "lifetime" || user.role === "vip") return true;
  if (user.role === "premium") {
    // recurring plan: still premium only if the paid period hasn't lapsed
    return !user.premiumUntil || user.premiumUntil.getTime() > Date.now();
  }
  return false;
}
