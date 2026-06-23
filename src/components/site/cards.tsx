"use client";
import { monogram, tintOf } from "@/lib/format";

export type SupplierListItem = {
  code: string; name: string; category: string; products?: string;
  tags?: string[]; district?: string; verified?: boolean; agent?: boolean;
};

function cssVars(tint: string): React.CSSProperties {
  return { ["--c" as any]: tint, ["--ct" as any]: tint + "1a" };
}

/** Masked contact rows. No real contact values ever live on the client here —
 *  they are only revealed in the detail drawer, by the server, for premium users. */
function MaskedContacts({ unlockedPreview }: { unlockedPreview: boolean }) {
  if (unlockedPreview) {
    return (
      <div className="contacts-inner">
        <div className="row"><span className="lbl">💬</span><span className="val" style={{ color: "var(--jade)", fontWeight: 600 }}>Coordonnées dans la fiche</span></div>
        <div className="row"><span className="lbl">✉️</span><span className="val">Réservé aux membres Premium</span></div>
      </div>
    );
  }
  return (
    <div className="contacts-inner">
      <div className="row"><span className="lbl">💬</span><span className="val">•••• •••• ••••</span></div>
      <div className="row"><span className="lbl">✉️</span><span className="val">••••••••@••••.com</span></div>
      <div className="row"><span className="lbl">📍</span><span className="val">•••• •••• ••••</span></div>
    </div>
  );
}

export function SupplierCard({
  d, faved, preview, onFav, onDetail
}: {
  d: SupplierListItem; faved: boolean; preview: boolean;
  onFav: (code: string) => void; onDetail: (code: string) => void;
}) {
  const tint = tintOf(d.category);
  const tags = (d.tags || []).slice(0, 5);
  const extra = (d.tags || []).length - 5;
  return (
    <article className="scard" style={cssVars(tint)}>
      <div className="sc-body">
        <div className="sc-top">
          <div className="tile">{monogram(d.name)}</div>
          <div className="sc-id">
            <div className="code">{d.code}</div>
            <div className="sc-cat">{d.category}</div>
          </div>
          <button className={"fav" + (faved ? " on" : "")} onClick={() => onFav(d.code)} title="Sauvegarder">{faved ? "♥" : "♡"}</button>
        </div>
        <h3 className="sc-name">{d.name}</h3>
        <div className="meta-row">
          {d.district ? <span>{d.district}</span> : null}
          {d.agent ? <span>Revendeur</span> : null}
          {d.verified ? <span>Stand localisé</span> : null}
        </div>
        {tags.length > 0 && (
          <div className="tags">
            {tags.map((t, i) => <span className="tg" key={i}>{t}</span>)}
            {extra > 0 && <span className="tg more">+{extra}</span>}
          </div>
        )}
        <div className={"contacts" + (preview ? "" : " locked")}>
          <MaskedContacts unlockedPreview={preview} />
          {!preview && (
            <div className="lockover">
              <div className="lk">🔒 Contacts réservés au Premium</div>
              <button className="btn primary" data-go="pricing" style={{ padding: "6px 14px", fontSize: 12 }}>Débloquer</button>
            </div>
          )}
        </div>
      </div>
      <button className="viewbtn" onClick={() => onDetail(d.code)}>Voir la fiche</button>
    </article>
  );
}

export function MiniCard({ d }: { d: SupplierListItem }) {
  const tint = tintOf(d.category);
  return (
    <article className="scard" style={{ ...cssVars(tint), marginBottom: 14 }}>
      <div className="sc-body" style={{ padding: 16 }}>
        <div className="sc-top">
          <div className="tile" style={{ width: 40, height: 40, fontSize: 15 }}>{monogram(d.name)}</div>
          <div className="sc-id">
            <div className="code">{d.code}</div>
            <div className="sc-cat">{d.category}</div>
          </div>
        </div>
        <h3 className="sc-name" style={{ fontSize: 15 }}>{d.name}</h3>
      </div>
    </article>
  );
}
