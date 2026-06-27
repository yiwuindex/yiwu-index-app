import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Académie import Chine",
  description: "12 modules pour comprendre le sourcing à Yiwu, les MOQ, les échantillons, le transport, les incoterms, les douanes et les arnaques courantes.",
  alternates: { canonical: "/academie" },
};

// 12 modules — content ported verbatim from the design. Static HTML authored here
// (templates, checklists), rendered inside the <details> accordion markup.
const MODULES: [string, string][] = [
  ["Introduction à Yiwu", "Le plus grand marché de petites marchandises au monde, organisé par districts (1 à 5+) et par catégories. Comprendre la structure, c'est savoir où chercher."],
  ["Trouver des fournisseurs", "Trois types à distinguer : <b>usine</b> (fabrique), <b>trader</b> (revend, plus flexible sur petites quantités), <b>agent sourcing</b> (intermédiaire payé). Chacun a ses avantages."],
  ["Négociation", "Template de premier message :<div class=\"tmpl\">Bonjour, je suis intéressé par votre produit.\nQuel est votre MOQ ?\nPouvez-vous envoyer un échantillon ?\nQuel est votre meilleur prix FOB ?</div>Restez poli, précis, et demandez toujours le prix FOB."],
  ["MOQ", "La quantité minimale de commande. Souvent négociable, surtout chez les traders. Demandez le prix à plusieurs paliers de quantité."],
  ["Échantillons", "Checklist d'inspection :<ul class=\"chk\"><li>Conforme aux photos</li><li>Finitions et coutures</li><li>Solidité / matériaux</li><li>Emballage</li><li>Marquage / odeur</li></ul>Commandez toujours avant une grosse commande."],
  ["Production", "Flux type : <b>Acompte → Production → Contrôle qualité → Expédition</b>. Fixez les délais par écrit."],
  ["Transport", "Trois modes : <b>express</b> (rapide, cher), <b>aérien</b> (intermédiaire), <b>maritime</b> (lent, économique pour gros volumes)."],
  ["Incoterms", "<b>EXW</b> (départ usine), <b>FOB</b> (port de départ), <b>CIF</b> (assurance+fret inclus), <b>DDP</b> (rendu dédouané). Le FOB est le plus courant pour comparer."],
  ["Douanes", "Déclaration, code HS, droits applicables. Faites-vous accompagner si c'est votre première importation."],
  ["Taxes & TVA import", "La TVA s'applique à l'import sur la valeur + transport + droits. À intégrer dans votre coût au débarquement (voir Outils)."],
  ["Contrôle qualité", "Inspection avant expédition (souvent par un tiers). Définissez vos critères d'acceptation à l'avance."],
  ["Les arnaques courantes", "Top pièges : <b>fausse usine</b>, <b>faux certificats</b>, <b>prix d'appel</b>, <b>bon échantillon / mauvaise série</b>. La règle d'or : échantillon + contrôle avant gros volume."]
];

export default function AcademiePage() {
  return (
    <section>
      <div className="wrap section">
        <p className="eyebrow">Académie d&apos;importation</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>Importer de A à Z</h2>
        <p className="lead" style={{ marginBottom: 28 }}>12 modules, des bases du marché de Yiwu jusqu&apos;aux arnaques les plus courantes.</p>
        <div className="modlist">
          {MODULES.map(([title, content], i) => (
            <details className="mod" key={i}>
              <summary>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                {title}
                <span className="arrow">›</span>
              </summary>
              <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
