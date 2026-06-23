import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const { plan } = (await req.json()) as { plan: PlanKey };
  const cfg = PLANS[plan];
  if (!cfg) return NextResponse.json({ error: "bad_plan" }, { status: 400 });

  const userId = (session.user as any).id as string;
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "no_user" }, { status: 400 });

  // reuse / create a Stripe customer so we can link webhooks back to the user
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId } });
    user = await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customer.id } });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const checkout = await stripe.checkout.sessions.create({
    mode: cfg.mode,
    customer: user.stripeCustomerId!,
    line_items: [{ price: cfg.priceId, quantity: 1 }],
    success_url: `${site}/account?paid=1`,
    cancel_url: `${site}/tarifs?canceled=1`,
    metadata: { userId, plan },
    ...(cfg.mode === "subscription" ? { subscription_data: { metadata: { userId, plan } } } : {})
  });
  return NextResponse.json({ url: checkout.url });
}
