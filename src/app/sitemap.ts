import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://yiwu-index.com";
  const routes = ["", "/fournisseurs", "/pricing", "/mentions-legales", "/cgv", "/confidentialite", "/cookies", "/conditions-abonnement", "/remboursement"];
  return routes.map((r) => ({ url: `${site}${r}`, lastModified: new Date(), changeFrequency: "weekly", priority: r === "" ? 1 : 0.6 }));
}
