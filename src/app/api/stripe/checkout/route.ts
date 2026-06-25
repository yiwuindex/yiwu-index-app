import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appBaseUrl, stripe, PLANS, type PlanKey } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    const { plan } = (await req.json()) as { plan: PlanKey };
    const cfg = PLANS[plan];
    if (!cfg?.priceId) return NextResponse.json({ error: "bad_plan" }, { status: 400 });

    const userId = (session.user as { id?: string }).id;
    if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "no_user" }, { status: 400 });

    // Reuse one stable Stripe customer per user. This is the primary link used
    // by subscription webhooks, so persist it before creating Checkout.
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId },
      });
      user = await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });
    }

    const metadata = {
      userId,
      plan: cfg.stripePlan,
      priceId: cfg.priceId,
    };
    const site = appBaseUrl();

    const checkout = await stripe.checkout.sessions.create({
      mode: cfg.mode,
      customer: user.stripeCustomerId!,
      client_reference_id: userId,
      line_items: [{ price: cfg.priceId, quantity: 1 }],
      success_url: `${site}/account?checkout=success`,
      cancel_url: `${site}/tarifs?checkout=cancel`,
      metadata,
      ...(cfg.mode === "subscription" ? { subscription_data: { metadata } } : {}),
    });

    console.info("[stripe checkout] created", {
      userId,
      plan: cfg.stripePlan,
      checkoutSessionId: checkout.id,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    console.error("[stripe checkout] error", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "checkout_unavailable" }, { status: 500 });
  }
}
