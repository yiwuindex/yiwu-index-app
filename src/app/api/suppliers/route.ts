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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const category = searchParams.get("category") || undefined;
    const take = Math.min(Number(searchParams.get("take") || 48), 96);
    const skip = Number(searchParams.get("skip") || 0);

    const where: any = {};
    if (category) where.category = category;
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { products: { contains: q, mode: "insensitive" } }];

    const [rows, total] = await Promise.all([
      prisma.supplier.findMany({
        where, skip, take, orderBy: [{ verified: "desc" }, { code: "asc" }],
        // Base list: non-premium fields only. Contacts are added below ONLY for
        // suppliers the authenticated paid user has actually unlocked.
        select: { code: true, name: true, category: true, products: true, tags: true, district: true, verified: true, agent: true }
      }),
      prisma.supplier.count({ where })
    ]);

    const session = await auth();
    const sid = (session?.user as any)?.id as string | undefined;

    // Authoritative role straight from the DB (the JWT role claim can be stale).
    let role: any = undefined;
    let premiumUntil: Date | null = null;
    if (sid) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { id: sid }, select: { role: true, premiumUntil: true } });
        role = dbUser?.role;
        premiumUntil = dbUser?.premiumUntil ?? null;
      } catch (e) {
        console.error("[suppliers] role lookup failed", e);
      }
    }
    const paid = !!sid && hasActivePaidAccess({ role, premiumUntil });
    const unlimited = paid && isUnlimited(role);
    const limit = sid ? unlockLimit(role) : 0;

    let used = 0;
    let unlockedSet = new Set<string>();
    const contactsByCode = new Map<string, { wechat: string[]; email: string | null; tel: string | null; location: string | null }>();

    if (paid && sid) {
      const codes = rows.map((r) => r.code);
      try {
        used = await prisma.supplierUnlock.count({ where: { userId: sid, createdAt: { gte: monthStart() } } });
        if (unlimited) {
          unlockedSet = new Set(codes); // unlimited members see every contact
        } else {
          const unlocks = await prisma.supplierUnlock.findMany({
            where: { userId: sid, supplierCode: { in: codes } },
            select: { supplierCode: true }
          });
          unlockedSet = new Set(unlocks.map((x: { supplierCode: string }) => x.supplierCode));
        }
        if (unlockedSet.size) {
          const full = await prisma.supplier.findMany({
            where: { code: { in: [...unlockedSet] } },
            select: { code: true, wechat: true, email: true, tel: true, location: true }
          });
          for (const f of full) contactsByCode.set(f.code, { wechat: f.wechat, email: f.email, tel: f.tel, location: f.location });
        }
      } catch (e) {
        console.error("[suppliers] unlock enrich failed", e);
      }
    }

    const items = rows.map((r) => {
      const unlocked = unlockedSet.has(r.code);
      return unlocked ? { ...r, unlocked: true, contacts: contactsByCode.get(r.code) } : { ...r, unlocked: false };
    });

    return NextResponse.json({
      items,
      total,
      account: {
        authenticated: !!sid,
        isPaid: paid,
        unlimited,
        limit: Number.isFinite(limit) ? limit : null,
        remaining: Number.isFinite(limit) ? Math.max(limit - used, 0) : null
      }
    });
  } catch (e) {
    console.error("[suppliers] list error", e);
    return NextResponse.json({ items: [], total: 0, account: { authenticated: false, isPaid: false, unlimited: false, limit: 0, remaining: 0 } });
  }
}
