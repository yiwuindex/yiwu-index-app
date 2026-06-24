import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasActivePaidAccess, isUnlimited, unlockLimit } from "@/lib/roles";
import rawSuppliers from "../../../../../data/suppliers.json";

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

type AnySupplier = any;

function fromJson(code: string): AnySupplier | null {
  const s = (rawSuppliers as any[]).find((x) => x.code === code);
  if (!s) return null;
  return {
    code: s.code,
    name: s.name || "",
    category: s.category || "",
    products: Array.isArray(s.products) ? s.products.join(", ") : (s.products || ""),
    tags: Array.isArray(s.tags) ? s.tags : [],
    district: s.district || "",
    verified: Boolean(s.verified),
    agent: Boolean(s.agent),
    wechat: Array.isArray(s.wechat) ? s.wechat : (s.wechat ? [String(s.wechat)] : []),
    email: s.email || "",
    tel: s.tel || "",
    location: s.location || "",
  };
}

async function getSupplier(code: string): Promise<AnySupplier | null> {
  try {
    const s = await prisma.supplier.findUnique({ where: { code } });
    if (s) return s;
  } catch (e) {
    console.error("[api/suppliers/detail] DB unavailable, using JSON fallback", e);
  }
  return fromJson(code);
}

async function getAccess(userId: string | undefined, code: string, role: any, premiumUntil: any) {
  if (!userId || !hasActivePaidAccess({ role, premiumUntil })) {
    return { canSee: false, unlocked: false, remaining: 0, limit: 0 };
  }
  if (isUnlimited(role)) return { canSee: true, unlocked: true, remaining: Infinity, limit: Infinity };

  try {
    const existing = await prisma.supplierUnlock.findUnique({ where: { userId_supplierCode: { userId, supplierCode: code } } });
    const limit = unlockLimit(role);
    const used = await prisma.supplierUnlock.count({ where: { userId, createdAt: { gte: monthStart() } } });
    return { canSee: !!existing, unlocked: !!existing, remaining: Math.max(limit - used, 0), limit };
  } catch {
    return { canSee: false, unlocked: false, remaining: 0, limit: unlockLimit(role) };
  }
}

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const s = await getSupplier(params.code);
  if (!s) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const session = await auth();
  const user = session?.user as any;
  const access = await getAccess(user?.id, s.code, user?.role, user?.premiumUntil);

  const base = {
    code: s.code,
    name: s.name,
    category: s.category,
    products: s.products,
    tags: s.tags,
    district: s.district,
    verified: s.verified,
    agent: s.agent,
  };

  if (!access.canSee) {
    return NextResponse.json({
      ...base,
      locked: true,
      authenticated: !!user?.id,
      alreadyUnlocked: access.unlocked,
      remainingUnlocks: access.remaining === Infinity ? null : access.remaining,
      monthlyLimit: access.limit === Infinity ? null : access.limit,
      channels: { wechat: s.wechat.length > 0, email: !!s.email, tel: !!s.tel, address: !!s.location },
      cta: user?.id ? "Débloquez cette fiche" : "Connectez-vous pour débloquer",
    });
  }

  return NextResponse.json({
    ...base,
    locked: false,
    authenticated: !!user?.id,
    alreadyUnlocked: access.unlocked,
    remainingUnlocks: access.remaining === Infinity ? null : access.remaining,
    monthlyLimit: access.limit === Infinity ? null : access.limit,
    contacts: { wechat: s.wechat, email: s.email, tel: s.tel, location: s.location },
  });
}
