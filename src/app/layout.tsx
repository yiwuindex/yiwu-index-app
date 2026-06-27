import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/site/SiteChrome";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Providers } from "@/components/Providers";
import { resolveSiteUrl } from "@/lib/seo-content";

const site = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  applicationName: "Yiwu Index",
  title: {
    default: "Yiwu Index — fournisseurs Yiwu & sourcing Chine",
    template: "%s · Yiwu Index",
  },
  description:
    "Yiwu Index aide les importateurs francophones à trouver des fournisseurs en Chine, comparer les profils et débloquer les coordonnées directes après abonnement.",
  keywords: [
    "fournisseur Yiwu",
    "fournisseur Chine",
    "sourcing Chine",
    "import Chine",
    "grossiste Yiwu",
    "annuaire fournisseurs Chine",
  ],
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    url: site,
    title: "Yiwu Index — fournisseurs chinois vérifiés",
    description:
      "Plateforme B2B pour trouver des fournisseurs à Yiwu, comparer les profils et accéder aux contacts directs.",
    siteName: "Yiwu Index",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yiwu Index — sourcing B2B Chine",
    description: "Fournisseurs de Yiwu, profils détaillés et contacts directs réservés aux membres.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yiwu Index",
  url: site,
  inLanguage: "fr-FR",
  potentialAction: {
    "@type": "SearchAction",
    target: `${site}/fournisseurs?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yiwu Index",
  url: site,
  email: "support@yiwu-index.com",
  sameAs: [site],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteSchema, organizationSchema]) }}
        />
        <Providers>
          <SiteChrome />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
