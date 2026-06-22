import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://yiwu-index.com";
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
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
