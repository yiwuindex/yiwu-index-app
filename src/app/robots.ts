import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/seo-content";

export default function robots(): MetadataRoute.Robots {
  const site = resolveSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/admin",
          "/api",
          "/checkout",
          "/success",
          "/login",
          "/register",
          "/reset-password",
          "/mot-de-passe-oublie",
        ],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
