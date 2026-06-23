// Shared, non-sensitive display helpers (safe on client).

const STOP: Record<string, 1> = {
  co:1,ltd:1,inc:1,llc:1,the:1,and:1,de:1,factory:1,firm:1,company:1,trading:1,trade:1,
  import:1,export:1,group:1,industry:1,industrial:1,products:1,product:1,supplies:1,supply:1,
  manufacturing:1,mfg:1,international:1,city:1,province:1,yiwu:1,zhejiang:1,guangdong:1,
  dongyang:1,jinhua:1,ningbo:1,wenzhou:1,yongkang:1,shanghai:1,guangzhou:1,henan:1,jiangsu:1
};

/** Initials monogram, with Chinese-character handling + stopword filtering. */
export function monogram(name: string): string {
  const s = (name || "").trim();
  if (!s) return "\u2014";
  if (/[\u4e00-\u9fff]/.test(s[0])) {
    const cj = s.match(/[\u4e00-\u9fff]/g) || [];
    return cj.slice(0, 2).join("");
  }
  const w = s.replace(/[.,&/()\-\u2013|]/g, " ").split(/\s+/).filter(Boolean);
  let sig = w.filter((x) => !STOP[x.toLowerCase().replace(/\.$/, "")]);
  if (!sig.length) sig = w;
  let init = sig.slice(0, 2).map((x) => x[0]).join("");
  if (init.length < 2 && sig[0]) init = sig[0].slice(0, 2);
  return (init || s.slice(0, 2)).toUpperCase();
}

const TINTS: Record<string, string> = {
  Toys:"#8f6956","Sports & Outdoor":"#568f6a",Accessories:"#8f5f56",Auto:"#6c717a",
  Electronics:"#56738f","Home & Living":"#8f7856","Pet Supplies":"#568f8f","Apparel & Shoes":"#8f6c56",
  Stationery:"#8f7a56",Beauty:"#8f566c","General Goods":"#6e7277","Bags & Luggage":"#6d6086",
  "Tools & Hardware":"#69727c",Adult:"#8f5656"
};
/** Deterministic muted tint for a category (mirrors the dataset palette). */
export function tintOf(category: string): string {
  return TINTS[category] || "#9a9189";
}

const GLYPHS: Record<string, string> = {
  Toys:"🧸","Sports & Outdoor":"⛺",Accessories:"🧣",Auto:"🚗",Electronics:"🔌",
  "Home & Living":"🏠","Pet Supplies":"🐾","Apparel & Shoes":"👟",Stationery:"✏️",
  Beauty:"💄","General Goods":"📦","Bags & Luggage":"🧳","Tools & Hardware":"🔧",Adult:"🔞"
};
/** Category glyph used for placeholder product tiles. */
export function glyphOf(category: string): string {
  return GLYPHS[category] || "📦";
}
