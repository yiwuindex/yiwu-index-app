import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transport Chine France et devis import",
  description:
    "Demandez un devis transport pour importer vos marchandises depuis Yiwu ou la Chine vers la France et l'Europe.",
  alternates: { canonical: "/transport" },
};

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
