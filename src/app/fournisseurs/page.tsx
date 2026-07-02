"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { tintOf } from "@/lib/format";
import { SupplierCard, type SupplierListItem, type SupplierContacts } from "@/components/site/cards";
import { SupplierDrawer } from "@/components/site/SupplierDrawer";

const CATS = [
  "Accessories","Adult","Apparel & Shoes","Auto","Bags & Luggage","Beauty","Electronics",
  "General Goods","Home & Living","Pet Supplies","Sports & Outdoor","Stationery","Tools & Hardware","Toys"
];
const PAGE = 48;

type Account = { isPaid: boolean; unlimited: boolean; remaining: number | null; limit: number | null };

export default function FournisseursPage() {
  const [items, setItems] = useState<SupplierListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState<"pertinence" | "cat">("pertinence");
  const [favOnly, setFavOnly] = useState(false);
  const [fav, setFav] = useState<Set<string>>(new Set());
  const [account, setAccount] = useState<Account>({ isPaid: false, unlimited: false, remaining: null, limit: null });
  const [unlocking, setUnlocking] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const qDebounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem("yiwu_fav") || "[]");
      if (Array.isArray(f)) setFav(new Set(f));
    } catch {}
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
      const r = await fetch(`/api/suppliers?${params.toString()}`, { cache: "no-store" });
      const j = await r.json();
      const next: SupplierListItem[] = j.items || [];
      setTotal(j.total || 0);
      if (j.account) setAccount(j.account);
      setItems((prev) => (reset ? next : [...prev, ...next]));
    } catch {
      if (reset) { setItems([]); setTotal(0); }
    } finally {
      setLoading(false);
    }
  }, [items.length, query, cat]);

  useEffect(() => { load(true); /* eslint-disable-next-line */ }, [query, cat]);

  // One-click unlock straight from a card (paid users). Reveals contacts inline.
  const onUnlock = async (code: string) => {
    if (unlocking.has(code)) return;
    setUnlocking((s) => new Set(s).add(code));
    try {
      const r = await fetch(`/api/suppliers/${encodeURIComponent(code)}/unlock`, { method: "POST" });
      if (r.status === 401) { window.location.href = "/login?next=/fournisseurs"; return; }
      if (r.status === 403) { window.location.href = "/tarifs"; return; }
      const j = await r.json().catch(() => ({}));
      if (r.status === 402) {
        setAccount((a) => ({ ...a, remaining: 0 }));
        alert("Vous avez atteint votre quota de déblocages ce mois-ci. Passez à l'offre supérieure pour en débloquer davantage.");
        return;
      }
      if (r.ok && j.contacts) {
        setItems((prev) => prev.map((it) => (it.code === code ? { ...it, unlocked: true, contacts: j.contacts } : it)));
        if (typeof j.remaining === "number") setAccount((a) => ({ ...a, remaining: j.remaining }));
      }
    } catch {
      alert("Déblocage impossible. Vérifiez votre connexion.");
    } finally {
      setUnlocking((s) => { const n = new Set(s); n.delete(code); return n; });
    }
  };

  // Keep cards in sync when a supplier is unlocked from inside the detail drawer.
  const onDrawerUnlocked = (code: string, contacts?: SupplierContacts) => {
    setItems((prev) => prev.map((it) => (it.code === code ? { ...it, unlocked: true, contacts: contacts ?? it.contacts } : it)));
    setAccount((a) => (a.remaining !== null && a.remaining > 0 ? { ...a, remaining: a.remaining - 1 } : a));
  };

  const onSearch = (v: string) => {
    clearTimeout(qDebounce.current);
    qDebounce.current = setTimeout(() => setQuery(v), 140);
  };

  let view = items;
  if (favOnly) view = view.filter((d) => fav.has(d.code));
  if (sort === "cat") view = [...view].sort((a, b) => a.category.localeCompare(b.category) || a.code.localeCompare(b.code));

  const canLoadMore = !favOnly && items.length < total;
  const remainingForCard = account.unlimited ? null : account.remaining;

  return (
    <section>
      <div className="wrap" style={{ paddingTop: 30 }}>
        <p className="eyebrow">Base de données</p>
        <h1 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>Fournisseurs à Yiwu et fournisseurs chinois vérifiés</h1>
        <p className="lead">
          Yiwu Index référence plus de 1 500 fournisseurs du marché de Yiwu (Yiwu International Trade City), le plus grand
          marché de gros de petites marchandises au monde. Chaque fiche présente la catégorie, les produits phares et le
          district du stand ; la mention « Stand localisé » indique un stand repéré au marché de Yiwu. Recherchez par
          mot-clé, filtrez par catégorie, sauvegardez vos favoris — puis débloquez les coordonnées directes (WeChat,
          e-mail, téléphone, numéro de stand) avec un abonnement pour contacter les fournisseurs sans intermédiaire.
        </p>
      </div>

      <div className="wrap">
        <div className="trustrow">
          <div className="tpill g"><div className="ic">✓</div><div><b>{(total || 1540).toLocaleString("fr-FR")}</b><span>fournisseurs · marché de Yiwu</span></div></div>
          <div className="tpill j"><div className="ic">💬</div><div><b>Contact direct</b><span>WeChat · email · téléphone</span></div></div>
          <div className="tpill r"><div className="ic">🗂️</div><div><b>{CATS.length} catégories</b><span>Classé et recherchable</span></div></div>
        </div>

        {account.isPaid && !account.unlimited && account.remaining !== null && (
          <div style={{ margin: "4px 0 0", fontSize: 13, color: "var(--slate)" }}>
            Membre <b style={{ color: "var(--jade)" }}>actif</b> — il vous reste <b>{account.remaining}</b> déblocage{account.remaining > 1 ? "s" : ""} ce mois-ci.
          </div>
        )}
        {account.unlimited && (
          <div style={{ margin: "4px 0 0", fontSize: 13, color: "var(--jade)", fontWeight: 600 }}>Accès illimité actif — toutes les coordonnées sont visibles.</div>
        )}

        <div className="chips" id="chips">
          <button className="chip all" aria-pressed={cat === ""} onClick={() => setCat("")}
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
              <SupplierCard
                key={d.code} d={d} faved={fav.has(d.code)}
                isPaid={account.isPaid} remaining={remainingForCard} unlocking={unlocking.has(d.code)}
                onFav={toggleFav} onDetail={setDetail} onUnlock={onUnlock}
              />
            ))
          )}
        </div>
        {canLoadMore && (
          <button className="more" onClick={() => load(false)} disabled={loading}>
            {loading ? "Chargement…" : `Afficher plus (${(total - items.length).toLocaleString("fr-FR")})`}
          </button>
        )}
      </div>

      {/* ——— Contenu SEO statique (n'affecte ni la liste ni les API) ——— */}
      <div className="wrap section" style={{ maxWidth: 920 }}>
        <div className="panelbox">
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Pourquoi chercher un fournisseur à Yiwu ?</h2>
          <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
            Yiwu concentre en un seul lieu des dizaines de milliers de stands de grossistes et de fabricants, répartis en
            districts spécialisés. Pour un importateur, c&apos;est la possibilité de comparer rapidement les gammes, de
            composer des commandes multi-produits avec des minimums accessibles, et d&apos;obtenir des prix de gros
            compétitifs — y compris sur de petites quantités. C&apos;est ce qui fait de Yiwu une porte d&apos;entrée idéale
            pour tester des produits ou approvisionner un e-commerce.
          </p>

          <h2 className="serif" style={{ fontSize: 24, margin: "22px 0 10px" }}>Quels types de fournisseurs trouver sur Yiwu Index ?</h2>
          <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
            L&apos;annuaire couvre 14 catégories : jouets, accessoires, sport &amp; outdoor, maison, beauté, électronique,
            papeterie, bagagerie, auto, animaux et plus encore. Chaque fiche indique les produits phares du stand, son
            district, et si le fournisseur est un fabricant ou un revendeur. Les coordonnées directes — WeChat, e-mail,
            téléphone et numéro de stand — sont réservées aux membres et servies de manière sécurisée.
          </p>

          <h2 className="serif" style={{ fontSize: 24, margin: "22px 0 10px" }}>Comment vérifier un fournisseur chinois ?</h2>
          <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 10 }}>
            Aucune liste ne remplace la vérification : demandez un échantillon avant toute commande, exigez des photos et
            vidéos réelles, faites confirmer prix, MOQ et délais par écrit, et privilégiez des paiements sécurisés avec
            acompte plutôt qu&apos;un règlement intégral. Sur Yiwu Index, la mention « Stand localisé » signifie qu&apos;un
            stand a été repéré au marché de Yiwu — c&apos;est un repère utile, pas une garantie de qualité produit. Notre{" "}
            <Link href="/guides" style={{ color: "var(--jade)", fontWeight: 600 }}>section guides</Link> détaille la
            méthode complète de vérification.
          </p>

          <h2 className="serif" style={{ fontSize: 24, margin: "22px 0 10px" }}>Comment Yiwu Index aide les importateurs ?</h2>
          <p style={{ color: "var(--slate)", lineHeight: 1.75, marginBottom: 0 }}>
            Yiwu Index fait gagner l&apos;étape la plus longue du sourcing : constituer un carnet de contacts fiables. Vous
            recherchez par produit, comparez les stands, puis débloquez les coordonnées directes selon votre{" "}
            <Link href="/tarifs" style={{ color: "var(--jade)", fontWeight: 600 }}>formule d&apos;abonnement</Link> — sans
            commission sur vos achats et sans intermédiaire. Pour aller plus loin, consultez nos guides pratiques :{" "}
            <Link href="/guides/importer-de-yiwu" style={{ color: "var(--jade)", fontWeight: 600 }}>comment importer de Yiwu</Link>,{" "}
            <Link href="/guides/societe-import-export-yiwu" style={{ color: "var(--jade)", fontWeight: 600 }}>choisir une société import-export à Yiwu</Link>{" "}
            ou notre page dédiée <Link href="/fournisseur-yiwu" style={{ color: "var(--jade)", fontWeight: 600 }}>trouver un fournisseur à Yiwu</Link>.
          </p>
        </div>
      </div>

      <SupplierDrawer code={detail} onClose={() => setDetail(null)} onUnlocked={onDrawerUnlocked} />
    </section>
  );
}
