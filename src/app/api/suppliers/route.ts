import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import rawSuppliers from "../../../../data/suppliers.json";

type RawSupplier = {
  code: string;
  name: string;
  category: string;
  products?: string | string[];
  tags?: string[];
  district?: string;
  verified?: boolean;
  agent?: boolean;
};

function normalizeSupplier(s: RawSupplier) {
  return {
    code: s.code,
    name: s.name || "",
    category: s.category || "",
    products: Array.isArray(s.products) ? s.products.join(", ") : (s.products || ""),
    tags: Array.isArray(s.tags) ? s.tags : [],
    district: s.district || "",
    verified: Boolean(s.verified),
    agent: Boolean(s.agent),
  };
}

function fallbackSearch(q: string, category?: string, take = 48, skip = 0) {
  const needle = q.toLowerCase();
  let list = (rawSuppliers as RawSupplier[]).map(normalizeSupplier);

  if (category) list = list.filter((s) => s.category === category);
  if (needle) {
    list = list.filter((s) => {
      const haystack = [s.code, s.name, s.category, s.products, ...(s.tags || [])].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }

  list = list.sort((a, b) => Number(b.verified) - Number(a.verified) || a.code.localeCompare(b.code));
  return { items: list.slice(skip, skip + take), total: list.length, source: "json" };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const category = searchParams.get("category") || undefined;
  const take = Math.min(Number(searchParams.get("take") || 48), 96);
  const skip = Number(searchParams.get("skip") || 0);

  const where: any = {};
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { products: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const [items, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take,
        orderBy: [{ verified: "desc" }, { code: "asc" }],
        select: { code: true, name: true, category: true, products: true, tags: true, district: true, verified: true, agent: true },
      }),
      prisma.supplier.count({ where }),
    ]);

    // If the database exists but has not been seeded yet, keep the site usable
    // with the bundled JSON file instead of showing an empty catalogue.
    if (total > 0) return NextResponse.json({ items, total, source: "database" });
  } catch (e) {
    console.error("[api/suppliers] database unavailable, using JSON fallback", e);
  }

  return NextResponse.json(fallbackSearch(q, category, take, skip));
}
