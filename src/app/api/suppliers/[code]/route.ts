import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasActivePaidAccess, isUnlimited, unlockLimit } from "@/lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

async function getAccess(userId: string | undefined, code: string, role: any, premiumUntil: any) {
  if (!userId || !hasActivePaidAccess({ role, premiumUntil })) {
    return { canSee: false, unlocked: false, remaining: 0, limit: 0 };
  }
  if (isUnlimited(role)) return { canSee: true, unlocked: true, remaining: Infinity, limit: Infinity };

  const limit = unlockLimit(role);
  try {
    const existing = await prisma.supplierUnlock.findUnique({ where: { userId_supplierCode: { userId, supplierCode: code } } });
    const used = await prisma.supplierUnlock.count({ where: { userId, createdAt: { gte: monthStart() } } });
    return { canSee: !!existing, unlocked: !!existing, remaining: Math.max(limit - used, 0), limit };
  } catch (e) {
    console.error("[supplier detail] unlock lookup failed", e);
    return { canSee: false, unlocked: false, remaining: limit, limit };
  }
}

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  try {
    const s = await prisma.supplier.findUnique({ where: { code: params.code } });
    if (!s) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const session = await auth();
    const sid = (session?.user as any)?.id as string | undefined;
    let role: any = undefined;
    let premiumUntil: Date | null = null;
    if (sid) {
      try {
        const du = await prisma.user.findUnique({ where: { id: sid }, select: { role: true, premiumUntil: true } });
        role = du?.role;
        premiumUntil = du?.premiumUntil ?? null;
      } catch (e) {
        console.error("[supplier detail] role lookup failed", e);
      }
    }
    const access = await getAccess(sid, s.code, role, premiumUntil);

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
        authenticated: !!sid,
        alreadyUnlocked: access.unlocked,
        remainingUnlocks: access.remaining === Infinity ? null : access.remaining,
        monthlyLimit: access.limit === Infinity ? null : access.limit,
        channels: { wechat: s.wechat.length > 0, email: !!s.email, tel: !!s.tel, address: !!s.location },
        cta: sid ? "Débloquez cette fiche" : "Connectez-vous pour débloquer",
      });
    }

    return NextResponse.json({
      ...base,
      locked: false,
      authenticated: !!sid,
      alreadyUnlocked: access.unlocked,
      remainingUnlocks: access.remaining === Infinity ? null : access.remaining,
      monthlyLimit: access.limit === Infinity ? null : access.limit,
      contacts: { wechat: s.wechat, email: s.email, tel: s.tel, location: s.location },
    });
  } catch (e) {
    console.error("[supplier detail] error", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
