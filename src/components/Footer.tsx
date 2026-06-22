const links = [
  ["Mentions légales", "/mentions-legales"], ["CGV", "/cgv"],
  ["Confidentialité", "/confidentialite"], ["Cookies", "/cookies"],
  ["Conditions d'abonnement", "/conditions-abonnement"], ["Remboursement", "/remboursement"]
];
export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 60, padding: "28px 0", fontSize: 13, color: "var(--slate)" }}>
      <div className="wrap" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "space-between" }}>
        <span>© {new Date().getFullYear()} Yiwu Index — [RAISON SOCIALE]</span>
        <nav style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
        </nav>
      </div>
    </footer>
  );
}
