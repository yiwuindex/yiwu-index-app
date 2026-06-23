"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { tintOf } from "@/lib/format";
import { SupplierCard, type SupplierListItem } from "@/components/site/cards";
import { SupplierDrawer } from "@/components/site/SupplierDrawer";
import { PREVIEW_EVENT, getPreview } from "@/lib/preview";

const CATS = [
  "Accessories","Adult","Apparel & Shoes","Auto","Bags & Luggage","Beauty","Electronics",
  "General Goods","Home & Living","Pet Supplies","Sports & Outdoor","Stationery","Tools & Hardware","Toys"
];
const PAGE = 48;

export default function FournisseursPage() {
  const [items, setItems] = useState<SupplierListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState<"pertinence" | "cat">("pertinence");
  const [favOnly, setFavOnly] = useState(false);
  const [fav, setFav] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const qDebounce = useRef<ReturnType<typeof setTimeout>>();

  // favorites + preview state (client-only)
  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem("yiwu_fav") || "[]");
      if (Array.isArray(f)) setFav(new Set(f));
    } catch {}
    setPreview(getPreview());
    const onPrev = (e: Event) => setPreview(!!(e as CustomEvent).detail);
    window.addEventListener(PREVIEW_EVENT, onPrev);
    return () => window.removeEventListener(PREVIEW_EVENT, onPrev);
  }, []);

  const saveFav = (next: Set<string>) => {
    setFav(new Set(next));
    try { localStorage.setItem("yiwu_fav", JSON.stringify([...next])); } catch {}
  };
  const toggleFav = (code: string) => {
    const next = new Set(fav);
    next.has(code) ? next.delete(code) : next.add(code);
    saveFav(next);
  };

  const load = useCallback(async (reset: boolean) => {
    setLoading(true);
    const skip = reset ? 0 : items.length;
    const params = new URLSearchParams({ take: String(PAGE), skip: String(skip) });
    if (query.trim()) params.set("q", query.trim());
    if (cat) params.set("category", cat);
    try {
      const r = await fetch(`/api/suppliers?${params.toString()}`);
      const j = await r.json();
      const next: SupplierListItem[] = j.items || [];
      setTotal(j.total || 0);
      setItems((prev) => (reset ? next : [...prev, ...next]));
    } catch {
      if (reset) { setItems([]); setTotal(0); }
    } finally {
      setLoading(false);
    }
  }, [items.length, query, cat]);

  // reset + reload whenever query/category changes
  useEffect(() => { load(true); /* eslint-disable-next-line */ }, [query, cat]);

  const onSearch = (v: string) => {
    clearTimeout(qDebounce.current);
    qDebounce.current = setTimeout(() => setQuery(v), 140);
  };

  // client-side view transforms (sort + favourites filter) over loaded items
  let view = items;
  if (favOnly) view = view.filter((d) => fav.has(d.code));
  if (sort === "cat") view = [...view].sort((a, b) => a.category.localeCompare(b.category) || a.code.localeCompare(b.code));

  const canLoadMore = !favOnly && items.length < total;

  return (
    <section>
      <div className="wrap" style={{ paddingTop: 30 }}>
        <p className="eyebrow">Base de données</p>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>Intelligence fournisseurs</h2>
        <p className="lead">Recherchez, filtrez et triez. Les stands localisés au marché sont mis en avant.</p>
      </div>

      <div className="wrap">
        <div className="trustrow">
          <div className="tpill g"><div className="ic">✓</div><div><b>{(total || 1540).toLocaleString("fr-FR")}</b><span>fournisseurs · marché de Yiwu</span></div></div>
          <div className="tpill j"><div className="ic">💬</div><div><b>Contact direct</b><span>WeChat · email · téléphone</span></div></div>
          <div className="tpill r"><div className="ic">🗂️</div><div><b>{CATS.length} catégories</b><span>Classé et recherchable</span></div></div>
        </div>

        <div className="chips" id="chips">
          <button className={"chip all" + (cat === "" ? "" : "")} aria-pressed={cat === ""} onClick={() => setCat("")}
            style={cat === "" ? { background: "var(--ink)", color: "#fff", borderColor: "transparent" } : undefined}>
            Tout
          </button>
          {CATS.map((c) => {
            const on = c === cat;
            const tint = tintOf(c);
            return (
              <button key={c} className="chip" aria-pressed={on} onClick={() => setCat(on ? "" : c)}
                style={on ? { background: tint, color: "#fff", borderColor: "transparent" } : undefined}>
                <span className="cdot" style={{ background: tint }} />{c}
              </button>
            );
          })}
        </div>
        <p className="browse-note">Les vignettes sont des visuels générés par catégorie ; les vraies photos produits s'affichent dès qu'elles sont fournies.</p>
      </div>

      <div className="toolbar"><div className="wrap">
        <div className="tb-row">
          <div className="searchbox">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input type="search" placeholder="Nom, produit, mot-clé…" autoComplete="off" onChange={(e) => onSearch(e.target.value)} />
          </div>
          <select className="f" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">Toutes catégories</option>
            {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="f" value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="pertinence">Tri : Pertinence</option>
            <option value="cat">Catégorie</option>
          </select>
          <button className={"vtoggle" + (favOnly ? " on" : "")} onClick={() => setFavOnly((v) => !v)} title="Afficher mes favoris">
            <span className="fh">{favOnly ? "♥" : "♡"}</span> Favoris
          </button>
        </div>
      </div></div>

      <div className="wrap">
        <div className="count">
          {loading && items.length === 0 ? "Chargement…" : `${(favOnly ? view.length : total).toLocaleString("fr-FR")} fournisseur${(favOnly ? view.length : total) > 1 ? "s" : ""}`}
          {cat ? ` · ${cat}` : ""}
        </div>
        <div className="grid">
          {view.length === 0 && !loading ? (
            <p style={{ gridColumn: "1/-1", color: "var(--slate)", padding: 40, textAlign: "center" }}>
              {favOnly ? "Aucun favori pour l'instant. Touchez le ♡ sur une fiche." : "Aucun résultat. Élargissez la recherche."}
            </p>
          ) : (
            view.map((d) => (
              <SupplierCard key={d.code} d={d} faved={fav.has(d.code)} preview={preview} onFav={toggleFav} onDetail={setDetail} />
            ))
          )}
        </div>
        {canLoadMore && (
          <button className="more" onClick={() => load(false)} disabled={loading}>
            {loading ? "Chargement…" : `Afficher plus (${(total - items.length).toLocaleString("fr-FR")})`}
          </button>
        )}
      </div>

      <SupplierDrawer code={detail} onClose={() => setDetail(null)} />
    </section>
  );
}
