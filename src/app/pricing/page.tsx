import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tarifs",
  alternates: { canonical: "/tarifs" },
  robots: { index: false, follow: true },
};
export default function Pricing() {
  redirect("/tarifs");
}
