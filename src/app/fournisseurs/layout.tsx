import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fournisseurs chinois à Yiwu",
  description:
    "Annuaire de fournisseurs chinois à Yiwu : profils, catégories, produits et coordonnées directes réservées aux membres Premium, Pro, Lifetime et VIP.",
  alternates: { canonical: "/fournisseurs" },
};

export default function FournisseursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
