export const metadata = { title: "Connexion" };
export default function Login() {
  return (<main className="wrap" style={{ padding: "60px 22px" }}>
    <h1>Connexion / Inscription</h1>
    <p className="note">Formulaire à brancher sur Auth.js (<code>signIn("credentials", …)</code>). Le hash du mot de passe se fait avec bcryptjs.</p>
  </main>);
}
