import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user?.stripeCustomerId) return NextResponse.json({ error: "no_customer" }, { status: 400 });
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`
    });
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    console.error("[stripe portal] error", e);
    return NextResponse.json({ error: "portal_unavailable" }, { status: 500 });
  }
}
