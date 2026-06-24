import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Emails } from "@/lib/email";
import authConfig from "@/auth.config";

const creds = z.object({ email: z.string().email(), password: z.string().min(8) });

// Full config for the Node runtime (API routes + server components).
// Inherits the edge-safe base (pages, session, authorized) and adds the
// Prisma-backed provider, fresh-role callbacks, and the sign-in email event.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
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
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
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
  },
  events: {
    // Security notification: email the user on every sign-in. Non-blocking —
    // Emails.* is a no-op when RESEND_API_KEY is unset, and errors are swallowed.
    async signIn({ user }) {
      if (!user?.email) return;
      const when = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });
      try { await Emails.signInAlert(user.email, when); } catch {}
    }
  }
});
