import { LEGAL } from "@/lib/legal";
export const metadata = { title: "Politique cookies — Yiwu Index" };

export default function Page() {
  return (
    <>
      <h1>Politique de gestion des cookies</h1>
      <p>Le site {LEGAL.domain} limite volontairement l&apos;usage des cookies au strict nécessaire et n&apos;utilise aucun cookie publicitaire ni traceur tiers.</p>

      <h2>Cookies strictement nécessaires</h2>
      <p>Ces cookies sont indispensables au fonctionnement du site et ne requièrent pas votre consentement : ils gèrent votre session d&apos;authentification (rester connecté) et la sécurité. Sans eux, vous ne pourriez pas vous connecter à votre compte.</p>

      <h2>Mesure d&apos;audience sans cookie</h2>
      <p>Nous utilisons {LEGAL.analytics}, une solution de statistiques d&apos;audience respectueuse de la vie privée qui <b>ne dépose pas de cookie</b> et ne permet pas de vous suivre individuellement à travers le web. Aucun consentement n&apos;est donc requis à ce titre.</p>

      <h2>Absence de traceurs publicitaires</h2>
      <p>Le site n&apos;intègre pas de cookies publicitaires, de pixels de réseaux sociaux ni de traceurs marketing tiers. Si cela devait évoluer, un bandeau de consentement conforme aux recommandations de la CNIL serait mis en place au préalable.</p>

      <h2>Gérer les cookies</h2>
      <p>Vous pouvez à tout moment configurer votre navigateur pour bloquer ou supprimer les cookies. Le blocage des cookies strictement nécessaires peut toutefois empêcher la connexion à votre compte.</p>
    </>
  );
}
