import type { MetadataRoute } from "next";
import { guides, resolveSiteUrl, supplierCategories } from "@/lib/seo-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = resolveSiteUrl();
  const now = new Date();

  const coreRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/fournisseurs", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/tarifs", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/guides", priority: 0.75, changeFrequency: "weekly" as const },
    { path: "/academie", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/outils", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/transport", priority: 0.65, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.55, changeFrequency: "monthly" as const },
    { path: "/mentions-legales", priority: 0.25, changeFrequency: "yearly" as const },
    { path: "/cgv", priority: 0.25, changeFrequency: "yearly" as const },
    { path: "/confidentialite", priority: 0.25, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/conditions-abonnement", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/remboursement", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const categoryRoutes = supplierCategories.map((category) => ({
    path: `/fournisseurs/${category.slug}`,
    priority: 0.82,
    changeFrequency: "weekly" as const,
  }));

  const guideRoutes = guides.map((guide) => ({
    path: `/guides/${guide.slug}`,
    priority: 0.78,
    changeFrequency: "monthly" as const,
  }));

  return [...coreRoutes, ...categoryRoutes, ...guideRoutes].map((route) => ({
    url: `${site}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
