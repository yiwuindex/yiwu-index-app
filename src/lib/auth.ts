import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const creds = z.object({ email: z.string().email(), password: z.string().min(8) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = creds.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      }
    })
  ],
  callbacks: {
    // keep role + premiumUntil fresh on the token (re-read from DB each pass)
    async jwt({ token }) {
      if (token.sub) {
        const u = await prisma.user.findUnique({ where: { id: token.sub } });
        if (u) { token.role = u.role; token.premiumUntil = u.premiumUntil?.toISOString() ?? null; }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role ?? "free";
        (session.user as any).premiumUntil = (token as any).premiumUntil ?? null;
      }
      return session;
    }
  }
});
