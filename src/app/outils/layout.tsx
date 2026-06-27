import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outils import Chine : marge, MOQ et coût au débarquement",
  description:
    "Calculez le coût au débarquement, la marge réelle et la quantité optimale avant de commander auprès d'un fournisseur chinois.",
  alternates: { canonical: "/outils" },
};

export default function OutilsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
