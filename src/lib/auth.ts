import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Emails } from "@/lib/email";

const creds = z.object({ email: z.string().email(), password: z.string().min(8) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Credentials + JWT. We deliberately do not use PrismaAdapter here:
  // users are created by /api/register and the JWT is refreshed from Prisma.
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = creds.safeParse(raw);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase().trim();
        const { password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Non bloquant : si Resend n'est pas configuré, l'envoi est ignoré.
        await Emails.loginNotice(user.email, user.name ?? undefined);

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      }
    })
  ],
  callbacks: {
    async jwt({ token }) {
      if (token.sub) {
        const u = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true, email: true, name: true, role: true, premiumUntil: true },
        });
        if (u) {
          token.email = u.email;
          token.name = u.name ?? token.email;
          (token as any).role = u.role;
          (token as any).premiumUntil = u.premiumUntil?.toISOString() ?? null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        session.user.email = token.email ?? session.user.email;
        session.user.name = token.name ?? session.user.email ?? "Membre Yiwu Index";
        (session.user as any).role = (token as any).role ?? "free";
        (session.user as any).premiumUntil = (token as any).premiumUntil ?? null;
      }
      return session;
    }
  }
});
