import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Emails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email() });
const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: true }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true });

  const email = parsed.data.email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always answer ok to avoid leaking registered emails.
    if (!user) return NextResponse.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: tokenHash, passwordResetExpires: expires },
    });

    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://yiwu-index.com";
    const url = `${site}/reset-password?token=${encodeURIComponent(token)}`;
    await Emails.passwordReset(user.email, url);
  } catch (e) {
    console.error("[password forgot] error", e);
  }

  return NextResponse.json({ ok: true });
}
