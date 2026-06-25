import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/site/SiteChrome";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Providers } from "@/components/Providers";

// Resolve the site URL defensively: a malformed NEXT_PUBLIC_SITE_URL must never
// throw at module load (that would 500 *every* page). Fall back to the canonical
// domain on any problem.
function resolveSite(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    try { return new URL(raw).origin; } catch {}
  }
  return "https://yiwu-index.com";
}
const site = resolveSite();
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Yiwu Index — fournisseurs Yiwu & sourcing Chine", template: "%s · Yiwu Index" },
  description: "Accédez à 1 540 fournisseurs vérifiés de Yiwu et à leurs coordonnées directes. Intelligence de sourcing pour l'import depuis la Chine.",
  keywords: ["fournisseur yiwu", "import chine", "sourcing yiwu", "fournisseur chine"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: site, title: "Yiwu Index — sourcing B2B Yiwu", description: "1 540 fournisseurs vérifiés de Yiwu + coordonnées directes.", siteName: "Yiwu Index" },
  twitter: { card: "summary_large_image", title: "Yiwu Index", description: "Sourcing B2B — fournisseurs de Yiwu vérifiés." },
  robots: { index: true, follow: true }
};

const schema = {
  "@context": "https://schema.org", "@type": "WebSite", name: "Yiwu Index", url: site,
  potentialAction: { "@type": "SearchAction", target: `${site}/fournisseurs?q={q}`, "query-input": "required name=q" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,600&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Serif+SC:wght@600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <Providers>
          <SiteChrome />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
