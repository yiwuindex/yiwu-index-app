export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <main className="legal">
    <div className="note" style={{ marginBottom: 24 }}>
      ⚖️ <b>Modèle à faire valider par un juriste avant mise en ligne.</b> Remplacez les champs entre crochets
      ([RAISON SOCIALE], [SIRET], [ADRESSE]…) par vos informations réelles. Ce texte ne constitue pas un conseil juridique.
    </div>
    {children}
  </main>;
}
