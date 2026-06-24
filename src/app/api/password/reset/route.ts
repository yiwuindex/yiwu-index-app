import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum."),
});
const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Requête invalide." }, { status: 400 });

  const tokenHash = hashToken(parsed.data.token);
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: tokenHash, passwordResetExpires: { gt: new Date() } },
  });

  if (!user) return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 400 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordResetToken: null, passwordResetExpires: null },
  });

  return NextResponse.json({ ok: true });
}
