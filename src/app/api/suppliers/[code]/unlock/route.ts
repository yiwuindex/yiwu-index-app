import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActivePaidAccess, isUnlimited, unlockLimit } from "@/lib/roles";

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export async function POST(_req: Request, { params }: { params: { code: string } }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (!hasActivePaidAccess(user)) return NextResponse.json({ error: "upgrade_required" }, { status: 403 });

  const supplier = await prisma.supplier.findUnique({ where: { code: params.code }, select: { code: true } });
  if (!supplier) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const existing = await prisma.supplierUnlock.findUnique({ where: { userId_supplierCode: { userId: user.id, supplierCode: supplier.code } } });
  if (existing || isUnlimited(user.role)) return NextResponse.json({ ok: true, alreadyUnlocked: true });

  const limit = unlockLimit(user.role);
  const used = await prisma.supplierUnlock.count({ where: { userId: user.id, createdAt: { gte: monthStart() } } });
  if (used >= limit) return NextResponse.json({ error: "limit_reached", used, limit }, { status: 402 });

  await prisma.supplierUnlock.create({ data: { userId: user.id, supplierCode: supplier.code } });
  return NextResponse.json({ ok: true, used: used + 1, limit, remaining: Math.max(limit - used - 1, 0) });
}
