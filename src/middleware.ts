import { auth } from "@/lib/auth";
// Protect the member area + the contact-revealing API. Public marketing pages stay open.
export default auth((req) => {
  const { nextUrl } = req;
  const isProtected = nextUrl.pathname.startsWith("/account");
  if (isProtected && !req.auth) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("next", nextUrl.pathname);
    return Response.redirect(url);
  }
});
export const config = { matcher: ["/account/:path*"] };
