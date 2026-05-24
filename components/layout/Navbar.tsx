"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/",        label: "Home" },
  { href: "/memoria", label: "Memoria DB" },
  { href: "/story", label: "Story" },
  { href: "/events",  label: "Events", badge: true },
  { href: "/guides",  label: "Guides" },
  { href: "/units",   label: "Units" },
  { href: "/squads",  label: "Squads" },
];

export function Navbar() {
  const path = usePathname();
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px",
      borderBottom: "0.5px solid var(--hbr-border)",
      background: "rgba(7,7,14,0.97)",
      backdropFilter: "blur(6px)",
    }}>
      <Link href="/" style={{
        fontFamily: "'Courier New', monospace", fontSize: 16,
        fontWeight: 700, letterSpacing: "0.15em", color: "#fff",
        textDecoration: "none",
      }}>
        NARBY<span style={{ color: "var(--hbr-red)" }}>.</span>GG
      </Link>

      <ul style={{ display: "flex", gap: 24, listStyle: "none", margin: 0, padding: 0 }}>
        {links.map((l) => {
          const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
          return (
            <li key={l.href}>
              <Link href={l.href} style={{
                fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
                textDecoration: "none",
                color: active ? "var(--hbr-red)" : "var(--hbr-muted)",
                transition: "color 0.2s",
              }}>
                {l.label}
                {l.badge && (
                  <span style={{
                    marginLeft: 4, display: "inline-block",
                    background: "var(--hbr-red)", color: "#fff",
                    fontSize: 9, padding: "1px 5px", borderRadius: 3,
                  }}>LIVE</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
