import type { NextAuthConfig } from "next-auth";
import { ensureAuthUrlEnv } from "@/lib/site-url";

ensureAuthUrlEnv();

// Edge-safe base config. NO Prisma, NO Resend, NO Node-only imports here —
// this is what the middleware (Edge runtime) uses. The real Credentials
// provider + Prisma callbacks + email events live in src/lib/auth.ts (Node).
export default {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    // Used by middleware to gate protected routes (login presence only).
    authorized({ auth }) {
      return !!auth?.user;
    }
  }
} satisfies NextAuthConfig;
