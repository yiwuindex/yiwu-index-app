import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum."),
  name: z.string().trim().max(80).optional()
});

export async function POST(req: Request) {
  let data: unknown;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "invalid" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const { password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, name: name || null, passwordHash, role: "free" }
  });

  // No auto-login here: the client signs in right after, through Auth.js.
  return NextResponse.json({ ok: true }, { status: 201 });
}
