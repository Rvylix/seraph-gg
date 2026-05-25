"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/",        label: "Home" },
  { href: "/memoria", label: "Memoria DB" },
  { href: "/events",  label: "Events", badge: true },
  { href: "/guides",  label: "Guides" },
  { href: "/units",   label: "Units" },
  { href: "/squads",  label: "Squads" },
  //{ href: "/gacha",   label: "Gacha" },
  { href: "/story",   label: "Story" },
];

export function Navbar() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "0.5px solid var(--hbr-border)",
        background: "rgba(7,7,14,0.97)",
        backdropFilter: "blur(6px)",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "'Courier New', monospace", fontSize: 16,
          fontWeight: 700, letterSpacing: "0.15em", color: "#fff",
          textDecoration: "none", flexShrink: 0,
        }}>
          NARBY<span style={{ color: "var(--hbr-red)" }}>.</span>GG
        </Link>

        {/* Desktop links */}
        <ul style={{
          display: "flex", gap: 20, listStyle: "none", margin: 0, padding: 0,
          "@media (max-width: 768px)": { display: "none" },
        } as any} className="desktop-nav">
          {links.map((l) => {
            const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link href={l.href} style={{
                  fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                  textDecoration: "none",
                  color: active ? "var(--hbr-red)" : "var(--hbr-muted)",
                  transition: "color 0.2s", whiteSpace: "nowrap",
                }}>
                  {l.label}
                  {l.badge && (
                    <span style={{ marginLeft: 4, background: "var(--hbr-red)", color: "#fff", fontSize: 9, padding: "1px 5px", borderRadius: 3 }}>LIVE</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: "none", background: "transparent", border: "none",
            cursor: "pointer", padding: 4, flexDirection: "column", gap: 5,
          }}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "var(--hbr-red)" : "var(--hbr-silver)", borderRadius: 1, transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "transparent" : "var(--hbr-silver)", borderRadius: 1, transition: "all 0.2s" }} />
          <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "var(--hbr-red)" : "var(--hbr-silver)", borderRadius: 1, transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: "fixed", top: 49, left: 0, right: 0, bottom: 0,
          background: "rgba(7,7,14,0.98)", zIndex: 49,
          display: "flex", flexDirection: "column", padding: "24px 20px",
          gap: 4, overflowY: "auto",
        }}>
          {links.map((l) => {
            const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
                fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase",
                textDecoration: "none", padding: "14px 0",
                color: active ? "var(--hbr-red)" : "var(--hbr-silver)",
                borderBottom: "0.5px solid var(--hbr-border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                {l.label}
                {l.badge && <span style={{ background: "var(--hbr-red)", color: "#fff", fontSize: 9, padding: "2px 7px", borderRadius: 3 }}>LIVE</span>}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
