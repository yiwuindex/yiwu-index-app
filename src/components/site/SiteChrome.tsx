"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV: [string, string][] = [
  ["Accueil", "/"], ["Fournisseurs", "/fournisseurs"], ["Académie", "/academie"],
  ["Outils", "/outils"], ["Transport", "/transport"], ["Tarifs", "/tarifs"], ["FAQ", "/faq"]
];

const GO: Record<string, string> = {
  home: "/", suppliers: "/fournisseurs", academy: "/academie",
  tools: "/outils", shipping: "/transport", pricing: "/tarifs", faq: "/faq"
};

export function SiteChrome() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-go]") as HTMLElement | null;
      if (!el) return;
      const dest = GO[el.getAttribute("data-go") || ""];
      if (dest) { e.preventDefault(); setOpen(false); router.push(dest); }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/">
          <div className="seal">义</div>
          <div><b>YIWU INDEX</b><small>Sourcing intelligence</small></div>
        </Link>
        <nav className="navlinks" id="navlinks">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "on" : ""}>{label}</Link>
          ))}
        </nav>
        <div className="navactions">
          <Link className="btn ghost" href="/login">Connexion</Link>
          <Link className="btn primary" href="/tarifs">Devenir Premium</Link>
          <button className="hamb-btn" aria-label="Menu" onClick={() => setOpen((o) => !o)}
            style={{ display: "none", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, width: 40, height: 38, fontSize: 18, cursor: "pointer" }}>
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" style={{ borderTop: "1px solid var(--line)", background: "var(--surface)", padding: "8px 0" }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 2, padding: "6px 22px" }}>
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                style={{ padding: "10px 8px", fontWeight: 600, color: pathname === href ? "var(--seal)" : "var(--ink-2)", borderRadius: 8 }}>
                {label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} style={{ padding: "10px 8px", fontWeight: 600 }}>Connexion</Link>
          </div>
        </nav>
      )}

      <style>{`@media(max-width:1000px){.hamb-btn{display:inline-flex!important;align-items:center;justify-content:center}}`}</style>
    </header>
  );
}
