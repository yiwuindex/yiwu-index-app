"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const NAV: [string, string][] = [
  ["Accueil", "/"],
  ["Fournisseurs", "/fournisseurs"],
  ["Académie", "/academie"],
  ["Outils", "/outils"],
  ["Transport", "/transport"],
  ["Tarifs", "/tarifs"],
  ["FAQ", "/faq"],
];

const GO: Record<string, string> = {
  home: "/",
  suppliers: "/fournisseurs",
  academy: "/academie",
  tools: "/outils",
  shipping: "/transport",
  pricing: "/tarifs",
  faq: "/faq",
};

function initials(nameOrEmail: string) {
  const clean = nameOrEmail.trim();
  if (!clean) return "U";
  const parts = clean.includes("@") ? [clean[0]] : clean.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function roleLabel(role?: string) {
  if (role === "premium") return "Premium";
  if (role === "pro") return "Pro";
  if (role === "lifetime") return "Lifetime";
  if (role === "vip") return "VIP";
  return "Free";
}

export function SiteChrome() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  // Session from context (persists across navigation; no logged-out flicker).
  const { data: session, status } = useSession();
  const user = (session?.user as { email?: string | null; name?: string | null; role?: string } | undefined) ?? undefined;
  const authenticated = status === "authenticated" && !!user;

  // The role label comes straight from the DB via /api/me (the session's role
  // claim can lag behind a recent payment). Keeps the last value on a failed
  // fetch so it never flickers back to "Free".
  const [dbRole, setDbRole] = useState<string>("free");
  useEffect(() => {
    if (status !== "authenticated") return;
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => { if (alive && j?.user?.role) setDbRole(j.user.role); })
      .catch(() => {});
    return () => { alive = false; };
  }, [status, pathname]);

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.name?.trim() || user.email || "";
  }, [user]);

  // Close the account menu on route change.
  useEffect(() => { setMenu(false); }, [pathname]);

  // Delegated router for every [data-go] control rendered in page content.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-go]") as HTMLElement | null;
      if (!el) return;
      const dest = GO[el.getAttribute("data-go") || ""];
      if (dest) {
        e.preventDefault();
        setOpen(false);
        router.push(dest);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  const logout = async () => {
    setMenu(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/">
          <div className="seal">义</div>
          <div>
            <b>YIWU INDEX</b>
            <small>Sourcing intelligence</small>
          </div>
        </Link>

        <nav className="navlinks" id="navlinks">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "on" : ""}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="navactions" style={{ position: "relative" }}>
          {authenticated && user ? (
            <>
              <button className="account-pill" type="button" onClick={() => setMenu((v) => !v)}>
                <span className="account-avatar">{initials(displayName)}</span>
                <span className="account-text">
                  <b>{displayName}</b>
                  <small>{roleLabel(dbRole)}</small>
                </span>
              </button>
              {menu && (
                <div className="account-menu">
                  <div className="account-menu-head">
                    <b>Connecté en tant que</b>
                    <span>{displayName}</span>
                  </div>
                  <Link href="/account" onClick={() => setMenu(false)}>Mon compte</Link>
                  <Link href="/tarifs" onClick={() => setMenu(false)}>Mon abonnement</Link>
                  <button type="button" onClick={logout}>Se déconnecter</button>
                </div>
              )}
            </>
          ) : (
            <Link className="btn ghost" href="/login">Connexion</Link>
          )}

          <Link className="btn primary" href="/tarifs">Devenir Premium</Link>
          <button
            className="hamb-btn"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            style={{ display: "none", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, width: 40, height: 38, fontSize: 18, cursor: "pointer" }}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" style={{ borderTop: "1px solid var(--line)", background: "var(--surface)", padding: "8px 0" }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 2, padding: "6px 22px" }}>
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{ padding: "10px 8px", fontWeight: 600, color: pathname === href ? "var(--seal)" : "var(--ink-2)", borderRadius: 8 }}>
                {label}
              </Link>
            ))}
            {authenticated ? (
              <Link href="/account" onClick={() => setOpen(false)} style={{ padding: "10px 8px", fontWeight: 700 }}>Mon compte</Link>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} style={{ padding: "10px 8px", fontWeight: 700 }}>Connexion</Link>
            )}
          </div>
        </nav>
      )}

      <style>{`
        @media(max-width:1000px){.hamb-btn{display:inline-flex!important;align-items:center;justify-content:center}}
        .account-pill{display:flex;align-items:center;gap:9px;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:5px 11px 5px 6px;cursor:pointer;max-width:250px}
        .account-avatar{width:30px;height:30px;border-radius:999px;background:var(--jade);color:white;display:grid;place-items:center;font-size:12px;font-weight:800;flex:none}
        .account-text{display:flex;flex-direction:column;align-items:flex-start;line-height:1.1;min-width:0}
        .account-text b{font-size:12.5px;max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .account-text small{font-size:10.5px;color:var(--slate);font-weight:700;text-transform:uppercase;letter-spacing:.08em}
        .account-menu{position:absolute;right:0;top:48px;z-index:80;width:260px;background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);padding:8px}
        .account-menu-head{padding:10px 10px 8px;border-bottom:1px solid var(--line-2);margin-bottom:6px;display:flex;flex-direction:column;gap:3px}
        .account-menu-head b{font-size:11px;color:var(--slate);text-transform:uppercase;letter-spacing:.08em}
        .account-menu-head span{font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .account-menu a,.account-menu button{width:100%;display:block;text-align:left;background:transparent;border:0;border-radius:9px;padding:10px;font-size:13px;font-weight:700;color:var(--ink);cursor:pointer;font-family:inherit}
        .account-menu a:hover,.account-menu button:hover{background:var(--line-2)}
      `}</style>
    </header>
  );
}
