import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion à l'espace membre Yiwu Index.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
