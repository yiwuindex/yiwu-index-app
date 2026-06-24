import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Edge-safe auth instance: built from the lightweight config only (no Prisma,
// no Resend), so the middleware can run on the Edge runtime without crashing.
// It can still read the JWT session cookie to know if the user is logged in.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isProtected = nextUrl.pathname.startsWith("/account");
  if (isProtected && !req.auth) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("next", nextUrl.pathname);
    return Response.redirect(url);
  }
});

// Only run on the member area. Marketing pages + APIs stay untouched by middleware.
export const config = { matcher: ["/account/:path*"] };
