import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActivePaidAccess, isUnlimited, unlockLimit } from "@/lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export async function POST(_req: Request, { params }: { params: { code: string } }) {
  try {
    const session = await auth();
    const sid = (session?.user as any)?.id as string | undefined;
    if (!sid) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: sid }, select: { role: true, premiumUntil: true } });
    if (!dbUser || !hasActivePaidAccess(dbUser)) return NextResponse.json({ error: "upgrade_required" }, { status: 403 });
    const role = dbUser.role;

    const supplier = await prisma.supplier.findUnique({ where: { code: params.code }, select: { code: true, wechat: true, email: true, tel: true, location: true } });
    if (!supplier) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const contacts = { wechat: supplier.wechat, email: supplier.email, tel: supplier.tel, location: supplier.location };

    const existing = await prisma.supplierUnlock.findUnique({ where: { userId_supplierCode: { userId: sid, supplierCode: supplier.code } } });
    if (existing || isUnlimited(role)) return NextResponse.json({ ok: true, alreadyUnlocked: true, contacts });

    const limit = unlockLimit(role);
    const used = await prisma.supplierUnlock.count({ where: { userId: sid, createdAt: { gte: monthStart() } } });
    if (used >= limit) return NextResponse.json({ error: "limit_reached", used, limit }, { status: 402 });

    await prisma.supplierUnlock.create({ data: { userId: sid, supplierCode: supplier.code } });
    return NextResponse.json({ ok: true, used: used + 1, limit, remaining: Math.max(limit - used - 1, 0), contacts });
  } catch (e) {
    console.error("[unlock] error", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
