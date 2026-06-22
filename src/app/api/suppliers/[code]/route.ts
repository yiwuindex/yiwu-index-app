import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isPremium } from "@/lib/roles";

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const s = await prisma.supplier.findUnique({ where: { code: params.code } });
  if (!s) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const session = await auth();
  const premium = isPremium(session?.user as any);

  const base = {
    code: s.code, name: s.name, category: s.category, products: s.products,
    tags: s.tags, district: s.district, verified: s.verified, agent: s.agent
  };

  if (!premium) {
    // The server simply does NOT send the contact values. A non-member cannot read them from the network either.
    return NextResponse.json({
      ...base,
      locked: true,
      channels: { wechat: s.wechat.length > 0, email: !!s.email, tel: !!s.tel, address: !!s.location },
      cta: "Débloquez les coordonnées directes"
    });
  }
  return NextResponse.json({
    ...base, locked: false,
    contacts: { wechat: s.wechat, email: s.email, tel: s.tel, location: s.location }
  });
}
