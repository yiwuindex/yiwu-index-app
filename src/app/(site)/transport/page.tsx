"use client";
import { useState } from "react";

const STEPS = ["Sélectionnez vos fournisseurs", "Décrivez l'envoi", "Recevez un devis", "Validez le devis", "Suivez l'import"];

export default function TransportPage() {
  const [f, setF] = useState({
    name: "", email: "", wa: "", country: "France", city: "", prod: "",
    cartons: "", weight: "", cbm: "", value: "", method: "Express", customs: "Oui", msg: ""
  });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = () => {
    // Demo behaviour: confirm receipt. Hook this to /api email (Resend) or a CRM when ready.
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section>
      <div className="hero"><div className="wrap">
        <p className="eyebrow">Transport &amp; importation</p>
        <h1 className="serif" style={{ fontSize: "clamp(28px,4vw,42px)", maxWidth: "20ch" }}>Importez vos marchandises depuis Yiwu avec un partenaire fiable.</h1>
        <p className="lead" style={{ marginTop: 14 }}>Recevez un devis transport pour expédier vos produits de Chine vers la France ou l&apos;Europe. Yiwu Index n&apos;est pas le transporteur : on vous met en relation avec un partenaire logistique de confiance.</p>
      </div></div>

      <div className="wrap section" style={{ paddingTop: 30 }}>
        <h3 className="serif" style={{ fontSize: 22, marginBottom: 18 }}>Comment ça marche</h3>
        <div className="steps">
          {STEPS.map((s, i) => <div className="step" key={i}><b>{s}</b></div>)}
        </div>

        <h3 className="serif" style={{ fontSize: 22, margin: "40px 0 18px" }}>Demander un devis transport</h3>
        <div className="panelbox">
          <div className="formgrid">
            <div className="field"><label>Nom complet</label><input value={f.name} onChange={set("name")} /></div>
            <div className="field"><label>Email</label><input type="email" value={f.email} onChange={set("email")} /></div>
            <div className="field"><label>WhatsApp</label><input value={f.wa} onChange={set("wa")} /></div>
            <div className="field"><label>Pays de destination</label><input value={f.country} onChange={set("country")} /></div>
            <div className="field"><label>Ville de livraison</label><input value={f.city} onChange={set("city")} /></div>
            <div className="field"><label>Catégorie de produit</label><input value={f.prod} onChange={set("prod")} /></div>
            <div className="field"><label>Nombre de cartons</label><input type="number" value={f.cartons} onChange={set("cartons")} /></div>
            <div className="field"><label>Poids estimé (kg)</label><input type="number" value={f.weight} onChange={set("weight")} /></div>
            <div className="field"><label>Volume estimé (CBM)</label><input type="number" step="0.1" value={f.cbm} onChange={set("cbm")} /></div>
            <div className="field"><label>Valeur des marchandises (€)</label><input type="number" value={f.value} onChange={set("value")} /></div>
            <div className="field"><label>Méthode d&apos;expédition</label>
              <select value={f.method} onChange={set("method")}><option>Express</option><option>Aérien</option><option>Maritime</option><option>DDP</option></select></div>
            <div className="field"><label>Dédouanement nécessaire ?</label>
              <select value={f.customs} onChange={set("customs")}><option>Oui</option><option>Non</option></select></div>
            <div className="field full"><label>Message</label><input value={f.msg} onChange={set("msg")} /></div>
          </div>
          <button className="btn jade lg" style={{ marginTop: 8 }} onClick={submit}>Demander un devis transport</button>
          {sent && <p style={{ color: "var(--jade)", fontWeight: 600, fontSize: 14, marginTop: 12 }}>✓ Demande enregistrée. Notre partenaire logistique vous recontactera.</p>}
          <div className="disclose">Yiwu Index met en relation avec des partenaires logistiques et peut percevoir une commission sur les expéditions. Nous ne sommes ni le transporteur ni le déclarant en douane.</div>
        </div>
      </div>
    </section>
  );
}
