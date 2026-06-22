export const metadata = { title: "Fournisseurs" };
export default function Fournisseurs() {
  return (<main className="wrap" style={{ padding: "60px 22px" }}>
    <h1>Fournisseurs</h1>
    <p className="note">Brancher ici l'UI annuaire existante (yiwu-index.html) sur <code>/api/suppliers</code> (liste publique)
      et <code>/api/suppliers/[code]</code> (détail, contacts verrouillés côté serveur).</p>
  </main>);
}
