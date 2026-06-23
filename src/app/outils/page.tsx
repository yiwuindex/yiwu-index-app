"use client";
import { useState } from "react";

const num = (v: string) => parseFloat(v) || 0;

export default function OutilsPage() {
  // Landed cost
  const [lc, setLc] = useState({ cost: "2.50", qty: "1000", ship: "600", duty: "2.7", vat: "20" });
  // Profit & margin
  const [pf, setPf] = useState({ cost: "3.40", sell: "9.90", ads: "1.50", fee: "15" });
  // MOQ
  const [mq, setMq] = useState({ cost: "2.50", ship: "600", target: "3.00" });

  // ---- landed cost / unit ----
  const lcOut = (() => {
    const c = num(lc.cost), q = num(lc.qty), sh = num(lc.ship), duty = num(lc.duty), vat = num(lc.vat);
    if (q <= 0) return "—";
    const goods = c * q, dutyAmt = goods * duty / 100, base = goods + sh + dutyAmt, vatAmt = base * vat / 100, total = base + vatAmt;
    return (total / q).toFixed(2) + " €";
  })();

  // ---- net profit / margin ----
  const c = num(pf.cost), s = num(pf.sell), ads = num(pf.ads), fee = num(pf.fee);
  const feeAmt = s * fee / 100, profit = s - c - ads - feeAmt, margin = s > 0 ? profit / s * 100 : 0;
  const pfOut = profit.toFixed(2) + " €";
  const pfSub = `marge nette ${margin.toFixed(0)}% / unité`;
  const pfColor = profit >= 0 ? "var(--jade)" : "var(--seal)";

  // ---- min order qty to hit a target landed cost ----
  const mqOut = (() => {
    const mc = num(mq.cost), sh = num(mq.ship), t = num(mq.target);
    if (t <= mc) return "∞";
    return Math.ceil(sh / (t - mc)).toLocaleString("fr-FR");
  })();

  return (
    <section>
      <div className="wrap section">
        <p className="eyebrow">Outils</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>Calculez avant de commander</h2>
        <p className="lead" style={{ marginBottom: 28 }}>Coût au débarquement, marge réelle, quantité optimale. Tout se calcule en direct.</p>

        <div className="calc-grid">
          {/* Landed cost */}
          <div className="calc">
            <h3>Coût au débarquement</h3>
            <p className="hint">Le vrai coût rendu chez vous, par unité.</p>
            <div className="field"><label>Coût produit / unité (€)</label>
              <input type="number" step="0.01" value={lc.cost} onChange={(e) => setLc({ ...lc, cost: e.target.value })} /></div>
            <div className="field"><label>Quantité</label>
              <input type="number" value={lc.qty} onChange={(e) => setLc({ ...lc, qty: e.target.value })} /></div>
            <div className="field"><label>Transport total (€)</label>
              <input type="number" value={lc.ship} onChange={(e) => setLc({ ...lc, ship: e.target.value })} /></div>
            <div className="field"><label>Droits de douane (%)</label>
              <input type="number" step="0.1" value={lc.duty} onChange={(e) => setLc({ ...lc, duty: e.target.value })} /></div>
            <div className="field"><label>TVA import (%)</label>
              <input type="number" step="0.1" value={lc.vat} onChange={(e) => setLc({ ...lc, vat: e.target.value })} /></div>
            <div className="result"><div className="big">{lcOut}</div><div className="sub">par unité, rendu</div></div>
          </div>

          {/* Profit & margin */}
          <div className="calc">
            <h3>Marge &amp; profit</h3>
            <p className="hint">Ce qu&apos;il vous reste après tout.</p>
            <div className="field"><label>Coût rendu / unité (€)</label>
              <input type="number" step="0.01" value={pf.cost} onChange={(e) => setPf({ ...pf, cost: e.target.value })} /></div>
            <div className="field"><label>Prix de vente (€)</label>
              <input type="number" step="0.01" value={pf.sell} onChange={(e) => setPf({ ...pf, sell: e.target.value })} /></div>
            <div className="field"><label>Pub / acquisition / unité (€)</label>
              <input type="number" step="0.01" value={pf.ads} onChange={(e) => setPf({ ...pf, ads: e.target.value })} /></div>
            <div className="field"><label>Frais plateforme (%)</label>
              <input type="number" step="0.1" value={pf.fee} onChange={(e) => setPf({ ...pf, fee: e.target.value })} /></div>
            <div className="result"><div className="big" style={{ color: pfColor }}>{pfOut}</div><div className="sub">{pfSub}</div></div>
          </div>

          {/* MOQ */}
          <div className="calc">
            <h3>Quantité optimale (MOQ)</h3>
            <p className="hint">Combien commander pour atteindre un coût cible.</p>
            <div className="field"><label>Coût produit / unité (€)</label>
              <input type="number" step="0.01" value={mq.cost} onChange={(e) => setMq({ ...mq, cost: e.target.value })} /></div>
            <div className="field"><label>Transport fixe (€)</label>
              <input type="number" value={mq.ship} onChange={(e) => setMq({ ...mq, ship: e.target.value })} /></div>
            <div className="field"><label>Coût rendu cible / unité (€)</label>
              <input type="number" step="0.01" value={mq.target} onChange={(e) => setMq({ ...mq, target: e.target.value })} /></div>
            <div className="result"><div className="big">{mqOut}</div><div className="sub">unités minimum</div></div>
          </div>
        </div>
        <p className="note">Estimations indicatives. Vérifiez les taux de douane/TVA réels de votre produit (code HS) auprès des douanes.</p>
      </div>
    </section>
  );
}
