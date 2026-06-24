"use client";
import { monogram, tintOf } from "@/lib/format";

export type SupplierContacts = { wechat?: string[]; email?: string | null; tel?: string | null; location?: string | null };
export type SupplierListItem = {
  code: string; name: string; category: string; products?: string;
  tags?: string[]; district?: string; verified?: boolean; agent?: boolean;
  unlocked?: boolean; contacts?: SupplierContacts;
};

function cssVars(tint: string): React.CSSProperties {
  return { ["--c" as any]: tint, ["--ct" as any]: tint + "1a" };
}

/** Real contacts — only rendered for suppliers the paid user has unlocked.
 *  The server only sends these values for unlocked suppliers. */
function RevealedContacts({ c }: { c: SupplierContacts }) {
  const wechat = (c.wechat || []).filter(Boolean);
  return (
    <div className="contacts-inner">
      {wechat.length > 0 && <div className="row"><span className="lbl">💬</span><span className="val" style={{ fontWeight: 600 }}>{wechat.join(" · ")}</span></div>}
      {c.email && <div className="row"><span className="lbl">✉️</span><span className="val" style={{ color: "var(--jade)", fontWeight: 600 }}>{c.email}</span></div>}
      {c.tel && <div className="row"><span className="lbl">📞</span><span className="val" style={{ fontWeight: 600 }}>{c.tel}</span></div>}
      {c.location && <div className="row"><span className="lbl">📍</span><span className="val">{c.location}</span></div>}
    </div>
  );
}

function MaskedRows() {
  return (
    <div className="contacts-inner">
      <div className="row"><span className="lbl">💬</span><span className="val">•••• •••• ••••</span></div>
      <div className="row"><span className="lbl">✉️</span><span className="val">••••••••@••••.com</span></div>
      <div className="row"><span className="lbl">📍</span><span className="val">•••• •••• ••••</span></div>
    </div>
  );
}

export function SupplierCard({
  d, faved, isPaid, remaining, unlocking, onFav, onDetail, onUnlock
}: {
  d: SupplierListItem; faved: boolean; isPaid: boolean;
  remaining?: number | null; unlocking?: boolean;
  onFav: (code: string) => void; onDetail: (code: string) => void; onUnlock: (code: string) => void;
}) {
  const tint = tintOf(d.category);
  const tags = (d.tags || []).slice(0, 5);
  const extra = (d.tags || []).length - 5;
  const isUnlocked = !!d.unlocked && !!d.contacts;
  const quotaReached = isPaid && !isUnlocked && remaining !== null && remaining !== undefined && remaining <= 0;

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

        {/* ——— Contacts block: 3 states ——— */}
        {isUnlocked ? (
          <div className="contacts">
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "var(--jade)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
              <span>✓</span> Contact débloqué
            </div>
            <RevealedContacts c={d.contacts!} />
          </div>
        ) : isPaid ? (
          <div className="contacts locked">
            <MaskedRows />
            <div className="lockover">
              {quotaReached ? (
                <>
                  <div className="lk">Quota mensuel atteint</div>
                  <button className="btn ghost" data-go="pricing" style={{ padding: "6px 14px", fontSize: 12 }}>Voir les offres</button>
                </>
              ) : (
                <button className="btn primary" onClick={() => onUnlock(d.code)} disabled={!!unlocking} style={{ padding: "6px 16px", fontSize: 12.5 }}>
                  {unlocking ? "Déblocage…" : "🔓 Débloquer ce contact"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="contacts locked">
            <MaskedRows />
            <div className="lockover">
              <div className="lk">🔒 Contacts réservés au Premium</div>
              <button className="btn primary" data-go="pricing" style={{ padding: "6px 14px", fontSize: 12 }}>Devenir Premium</button>
            </div>
          </div>
        )}
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
