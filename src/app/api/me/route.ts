import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;

  if (!id) {
    return NextResponse.json(
      { authenticated: false },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
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
    return NextResponse.json(
      { authenticated: false },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const premiumUntil =
    user.premiumUntil && user.premiumUntil.getTime() > 0
      ? user.premiumUntil.toISOString()
      : null;

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        premiumUntil,
        createdAt: user.createdAt.toISOString(),
        hasStripeCustomer: !!user.stripeCustomerId,
      },
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
