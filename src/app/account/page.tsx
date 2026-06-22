import { auth } from "@/lib/auth";
export const metadata = { title: "Mon compte" };
export default async function Account() {
  const session = await auth();
  return (<main className="wrap" style={{ padding: "60px 22px" }}>
    <h1>Mon compte</h1>
    <p>Connecté : {session?.user?.email ?? "—"} · rôle : {(session?.user as any)?.role ?? "—"}</p>
    <p className="note">Bouton « Gérer mon abonnement » → <code>POST /api/stripe/portal</code>.</p>
  </main>);
}
