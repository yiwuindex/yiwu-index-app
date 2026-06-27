import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs Premium, Pro et Lifetime",
  description:
    "Choisissez votre accès Yiwu Index : Premium 49€/mois, Pro 89€/mois ou Lifetime 399€ pour débloquer les contacts fournisseurs.",
  alternates: { canonical: "/tarifs" },
};

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
