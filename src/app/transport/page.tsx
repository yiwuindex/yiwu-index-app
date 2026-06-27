import { LEGAL } from "@/lib/legal";

const STEPS = ["Sélectionnez vos fournisseurs", "Décrivez l'envoi", "Recevez un devis", "Validez le devis", "Suivez l'import"];

export default function TransportPage() {
  return (
    <section>
      <div className="hero"><div className="wrap">
        <p className="eyebrow">Transport &amp; importation</p>
        <span style={{ display: "inline-block", margin: "8px 0 6px", padding: "4px 13px", borderRadius: 999, background: "#f3e7c9", color: "var(--gold, #b8841f)", fontSize: 12.5, fontWeight: 700, letterSpacing: ".04em" }}>
          Bientôt disponible
        </span>
        <h1 className="serif" style={{ fontSize: "clamp(28px,4vw,42px)", maxWidth: "20ch" }}>L&apos;importation depuis Yiwu, bientôt disponible.</h1>
        <p className="lead" style={{ marginTop: 14 }}>
          Nous mettons en place un service de devis et d&apos;expédition avec un partenaire logistique de confiance, pour
          acheminer vos marchandises de Chine vers la France et l&apos;Europe. Yiwu Index ne sera pas le transporteur :
          votre point de mise en relation.
        </p>
      </div></div>

      <div className="wrap section" style={{ paddingTop: 30 }}>
        <h3 className="serif" style={{ fontSize: 22, marginBottom: 18 }}>Comment ça marchera</h3>
        <div className="steps">
          {STEPS.map((s, i) => <div className="step" key={i}><b>{s}</b></div>)}
        </div>

        <div className="panelbox" style={{ marginTop: 40, textAlign: "center" }}>
          <h3 className="serif" style={{ fontSize: 22, marginBottom: 8 }}>Service en cours de préparation</h3>
          <p className="lead" style={{ margin: "0 auto 18px", maxWidth: "54ch" }}>
            Le module de devis transport n&apos;est pas encore ouvert. Laissez-nous votre e-mail et nous vous préviendrons
            dès son lancement — vous pouvez aussi nous écrire si vous avez un import à organiser dès maintenant.
          </p>
          <a className="btn jade lg" href={`mailto:${LEGAL.supportEmail}?subject=${encodeURIComponent("Être prévenu du lancement du service Transport")}`}>
            Être prévenu du lancement
          </a>
          <div className="disclose" style={{ marginTop: 18 }}>
            À son ouverture, Yiwu Index mettra en relation avec des partenaires logistiques et pourra percevoir une
            commission sur les expéditions. Nous ne serons ni le transporteur ni le déclarant en douane.
          </div>
        </div>
      </div>
    </section>
  );
}
