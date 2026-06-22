import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const category = searchParams.get("category") || undefined;
  const take = Math.min(Number(searchParams.get("take") || 48), 96);
  const skip = Number(searchParams.get("skip") || 0);

  const where: any = {};
  if (category) where.category = category;
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { products: { contains: q, mode: "insensitive" } }];

  const [items, total] = await Promise.all([
    prisma.supplier.findMany({
      where, skip, take, orderBy: [{ verified: "desc" }, { code: "asc" }],
      // SELECT only non-premium fields. Contacts are NEVER returned here.
      select: { code: true, name: true, category: true, products: true, tags: true, district: true, verified: true, agent: true }
    }),
    prisma.supplier.count({ where })
  ]);
  return NextResponse.json({ items, total });
}
