import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getRequestSiteUrl } from "@/lib/site-url";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user?.stripeCustomerId) return NextResponse.json({ error: "no_customer" }, { status: 400 });
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${getRequestSiteUrl(req)}/account`
    });
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    console.error("[stripe portal] error", e);
    return NextResponse.json({ error: "portal_unavailable" }, { status: 500 });
  }
}
