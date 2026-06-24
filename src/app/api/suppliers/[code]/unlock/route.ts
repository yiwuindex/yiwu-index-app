import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActivePaidAccess, isUnlimited, unlockLimit } from "@/lib/roles";
import rawSuppliers from "../../../../../../data/suppliers.json";

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

async function supplierExists(code: string) {
  try {
    const supplier = await prisma.supplier.findUnique({ where: { code }, select: { code: true } });
    if (supplier) return true;
  } catch {}
  return (rawSuppliers as any[]).some((s) => s.code === code);
}

export async function POST(_req: Request, { params }: { params: { code: string } }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (!hasActivePaidAccess(user)) return NextResponse.json({ error: "upgrade_required" }, { status: 403 });

  if (!(await supplierExists(params.code))) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (isUnlimited(user.role)) return NextResponse.json({ ok: true, alreadyUnlocked: true });

  const existing = await prisma.supplierUnlock.findUnique({ where: { userId_supplierCode: { userId: user.id, supplierCode: params.code } } });
  if (existing) return NextResponse.json({ ok: true, alreadyUnlocked: true });

  const limit = unlockLimit(user.role);
  const used = await prisma.supplierUnlock.count({ where: { userId: user.id, createdAt: { gte: monthStart() } } });
  if (used >= limit) return NextResponse.json({ error: "limit_reached", used, limit }, { status: 402 });

  await prisma.supplierUnlock.create({ data: { userId: user.id, supplierCode: params.code } });
  return NextResponse.json({ ok: true, used: used + 1, limit, remaining: Math.max(limit - used - 1, 0) });
}
