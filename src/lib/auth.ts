import NextAuth from "next-auth";
import { ensureAuthUrlEnv } from "@/lib/site-url";
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
ensureAuthUrlEnv();

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
    // Load role + premiumUntil onto the token. On sign-in `user` carries the id
    // (token.sub isn't set yet with the Credentials provider), so we use it. We
    // also re-read on session updates. On a transient DB error we KEEP the
    // previous role rather than dropping the user to "free".
    async jwt({ token, user }) {
      const id = (user as { id?: string } | undefined)?.id ?? token.sub;
      if (id) {
        token.sub = id;
        try {
          const u = await prisma.user.findUnique({ where: { id } });
          if (u) {
            token.role = u.role;
            token.premiumUntil = u.premiumUntil ? u.premiumUntil.toISOString() : null;
          }
        } catch (e) {
          console.error("[auth jwt] role refresh failed", e);
        }
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
