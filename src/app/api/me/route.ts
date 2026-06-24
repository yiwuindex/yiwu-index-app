import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const id = (session?.user as any)?.id;

  if (!id) {
    return NextResponse.json({ authenticated: false });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      premiumUntil: true,
      createdAt: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      premiumUntil: user.premiumUntil?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      hasStripeCustomer: !!user.stripeCustomerId,
    },
  });
}
