export const metadata = { title: "FAQ" };

const QA: [string, string][] = [
  ["Les fournisseurs sont-ils vérifiés ?", "« Vérifié » signifie que le stand est localisé au marché de Yiwu (emplacement précis identifié au sein du marché). C'est un repère sur la qualité de la donnée — pas une garantie sur la qualité des produits."],
  ["Puis-je contacter les fournisseurs directement ?", "Oui. Les membres Premium voient les coordonnées directes (WeChat, e-mail, téléphone, adresse du stand). Vous traitez ensuite en direct avec le fournisseur."],
  ["Garantissez-vous la qualité ?", "Non. Aucune plateforme ne peut garantir la qualité depuis une fiche. Nous recommandons toujours de commander un échantillon avant une grosse commande — l'académie explique comment."],
  ["Importez-vous à ma place ?", "Non. Yiwu Index est une plateforme d'information. Pour le transport, nous vous mettons en relation avec un partenaire logistique (voir Transport)."],
  ["Quelle est la politique de remboursement ?", "Voir nos conditions de remboursement détaillées dans les pages légales. L'abonnement mensuel est annulable à tout moment depuis votre espace compte."],
  ["Comment fonctionne le Premium ?", "Abonnement mensuel (Premium ou Pro) ou accès à vie (Lifetime). Le paiement déverrouille un quota de coordonnées directes et l'académie complète. Le paiement et l'accès sont gérés côté serveur via Stripe."]
];

export default function FaqPage() {
  return (
    <section>
      <div className="wrap section" style={{ maxWidth: 820 }}>
        <p className="eyebrow">FAQ</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 24 }}>Questions fréquentes</h2>
        <div className="faq">
          {QA.map(([q, a], i) => (
            <details key={i}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
