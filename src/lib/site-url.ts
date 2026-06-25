export const CANONICAL_SITE_URL = "https://yiwu-index.com";

export function cleanSiteUrl(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function getConfiguredSiteUrl(): string {
  return (
    cleanSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    cleanSiteUrl(process.env.AUTH_URL) ||
    cleanSiteUrl(process.env.NEXTAUTH_URL) ||
    CANONICAL_SITE_URL
  );
}

export function getRequestSiteUrl(req?: Request): string {
  if (req) {
    const origin = cleanSiteUrl(req.headers.get("origin"));
    if (origin) return origin;
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const fromHost = cleanSiteUrl(host ? `${proto}://${host}` : null);
    if (fromHost) return fromHost;
  }
  return getConfiguredSiteUrl();
}

export function ensureAuthUrlEnv() {
  const site = getConfiguredSiteUrl();
  if (!cleanSiteUrl(process.env.AUTH_URL)) process.env.AUTH_URL = site;
  if (!cleanSiteUrl(process.env.NEXTAUTH_URL)) process.env.NEXTAUTH_URL = site;
  if (!cleanSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)) process.env.NEXT_PUBLIC_SITE_URL = site;
  return site;
}
