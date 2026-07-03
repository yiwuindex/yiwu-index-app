"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { monogram, tintOf, glyphOf } from "@/lib/format";
import type { SupplierContacts } from "@/components/site/cards";

type Detail = {
  code: string; name: string; category: string; products?: string;
  tags?: string[]; district?: string; verified?: boolean; agent?: boolean;
  locked: boolean;
  channels?: { wechat: boolean; email: boolean; tel: boolean; address: boolean };
  contacts?: { wechat: string[]; email: string; tel: string; location: string };
  cta?: string;
  authenticated?: boolean;
  alreadyUnlocked?: boolean;
  remainingUnlocks?: number | null;
  monthlyLimit?: number | null;
};

function ProductThumbs({ d }: { d: Detail }) {
  const tint = tintOf(d.category);
  const glyph = glyphOf(d.category);
  const items = (d.tags && d.tags.length ? d.tags : String(d.products || "").split(/[,，;、]/))
    .map((s) => s.trim()).filter(Boolean).slice(0, 8);
  if (!items.length) return <p className="note">{d.products || "Produits à préciser avec le fournisseur."}</p>;
  return (
    <div className="pgal">
      {items.map((t, i) => (
        <figure className="pthumb" title={t} key={i}>
          <div className="pimg" style={{ ["--c" as any]: tint }}><span className="pgl">{glyph}</span></div>
          <figcaption className="pcap">{t}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function RealContacts({ c }: { c: NonNullable<Detail["contacts"]> }) {
  const wechat = (c.wechat || []).join(" · ");
  return (
    <div className="contacts-inner">
      {wechat && <div className="row"><span className="lbl">💬</span><span className="val">{wechat}</span></div>}
      {c.email && <div className="row"><span className="lbl">✉️</span><a className="val" href={`mailto:${c.email}`}>{c.email}</a></div>}
      {c.tel && <div className="row"><span className="lbl">☎️</span><span className="val">{c.tel}</span></div>}
      {c.location && <div className="row"><span className="lbl">📍</span><span className="val" title={c.location}>{c.location}</span></div>}
    </div>
  );
}

function LockedContacts({ ch }: { ch?: Detail["channels"] }) {
  // Show which channels EXIST (booleans only — no values), masked.
  const rows: [string, boolean][] = [
    ["💬", !!ch?.wechat], ["✉️", !!ch?.email], ["☎️", !!ch?.tel], ["📍", !!ch?.address]
  ];
  return (
    <div className="contacts-inner">
      {rows.filter(([, has]) => has).map(([icon], i) => (
        <div className="row" key={i}><span className="lbl">{icon}</span><span className="val">•••• •••• ••••</span></div>
      ))}
    </div>
  );
}

export function SupplierDrawer({ code, onClose, onUnlocked }: { code: string | null; onClose: () => void; onUnlocked?: (code: string, contacts?: SupplierContacts) => void }) {
  const [d, setD] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [nonce, setNonce] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!code) { setD(null); setLoadError(false); return; }
    let alive = true;
    setLoading(true); setD(null); setLoadError(false); setError("");
    fetch(`/api/suppliers/${encodeURIComponent(code)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("http_" + r.status);
        const j = await r.json();
        if (!j || typeof j.code !== "string") throw new Error("bad_payload");
        return j as Detail;
      })
      .then((j) => { if (alive) setD(j); })
      .catch(() => { if (alive) { setD(null); setLoadError(true); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [code, nonce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);


  const unlock = async () => {
    if (!d) return;
    if (!d.authenticated) { router.push("/login?next=/fournisseurs"); return; }
    setUnlocking(true);
    setError("");
    try {
      const r = await fetch(`/api/suppliers/${encodeURIComponent(d.code)}/unlock`, { method: "POST" });
      const j = await r.json().catch(() => ({}));
      if (r.status === 403) { router.push("/tarifs"); return; }
      if (r.status === 402) { setError(`Limite mensuelle atteinte (${j.used}/${j.limit}). Passez au plan supérieur.`); return; }
      if (!r.ok) { setError("Impossible de débloquer cette fiche."); return; }
      onUnlocked?.(d.code, j.contacts as SupplierContacts | undefined);
      const res = await fetch(`/api/suppliers/${encodeURIComponent(d.code)}`);
      if (res.ok) {
        const refreshed = await res.json();
        if (refreshed && typeof refreshed.code === "string") setD(refreshed);
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setUnlocking(false);
    }
  };

  const on = !!code;
  return (
    <>
      <div className={"scrim" + (on ? " on" : "")} onClick={onClose} />
      <aside className={"drawer" + (on ? " on" : "")}>
        {loading && <div className="dr-body"><p className="note">Chargement…</p></div>}
        {!loading && loadError && (
          <>
            <div className="dr-head">
              <div className="tile">!</div>
              <div>
                <div className="code">Fiche</div>
                <h3 style={{ fontSize: 20 }} className="serif">Fiche indisponible</h3>
              </div>
              <button className="dr-x" onClick={onClose}>✕</button>
            </div>
            <div className="dr-body">
              <p className="note">Impossible de charger cette fiche pour le moment. Réessayez dans un instant.</p>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button className="btn primary" onClick={() => setNonce((n) => n + 1)}>Réessayer</button>
                <button className="btn ghost" onClick={onClose}>Fermer</button>
              </div>
            </div>
          </>
        )}
        {d && (
          <>
            <div className="dr-head">
              <div className="tile">{monogram(d.name)}</div>
              <div>
                <div className="code">{d.code} · {d.district || "Yiwu"}</div>
                <h3 style={{ fontSize: 20 }} className="serif">{d.name}</h3>
              </div>
              <button className="dr-x" onClick={onClose}>✕</button>
            </div>
            <div className="dr-body">
              <div className="dr-sec">
                <h4>Aperçu</h4>
                <div className="panelbox">{d.category}{d.agent ? " · Revendeur / agent (WeChat partagé)" : " · Contact direct"}</div>
              </div>
              <div className="dr-sec">
                <h4>Exemples de produits</h4>
                <ProductThumbs d={d} />
                <p className="note">Visuels par catégorie tant qu'aucune photo réelle n'est fournie. Noms tirés de la gamme déclarée par le fournisseur.</p>
              </div>
              <div className="dr-sec">
                <h4>Localisation</h4>
                <div className="panelbox">
                  {d.locked ? (d.channels?.address ? "Adresse de stand réservée aux membres Premium." : "Non renseignée — fournisseur joignable par WeChat.")
                            : (d.contacts?.location || "Non renseignée — fournisseur joignable par WeChat.")}
                </div>
              </div>
              <div className="dr-sec">
                <h4>Contacts directs</h4>
                <div className={"contacts" + (d.locked ? " locked" : " dr-contacts-open")}
                  style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14, background: "var(--surface)" }}>
                  {!d.locked && <span className="chip-unlocked">Contact débloqué</span>}
                  {d.locked ? <LockedContacts ch={d.channels} /> : (d.contacts ? <RealContacts c={d.contacts} /> : null)}
                  {d.locked && (
                    <div className="lockover" style={{ borderRadius: 12 }}>
                      <div className="lk">🔒 Débloquez les contacts directs pour contacter ce fournisseur</div>
                      <div className="lk-benefit">WeChat · e-mail · téléphone · n° de stand</div>
                      {d.authenticated && typeof d.remainingUnlocks === "number" && d.remainingUnlocks > 0 && (
                        <div className="note" style={{ marginTop: -4 }}>{d.remainingUnlocks} déblocage(s) restant(s) ce mois-ci</div>
                      )}
                      {error && <div className="note" style={{ color: "var(--seal)", maxWidth: 260 }}>{error}</div>}
                      <button className="btn primary" onClick={unlock} disabled={unlocking} style={{ padding: "7px 16px", fontSize: 12 }}>
                        {unlocking ? "Déblocage…" : d.authenticated ? "Débloquer cette fiche" : "Se connecter"}
                      </button>
                      <button className="btn ghost" onClick={() => router.push("/tarifs")} style={{ padding: "6px 14px", fontSize: 12 }}>Voir les offres</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
