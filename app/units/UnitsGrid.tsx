"use client";
import { useState } from "react";
import Link from "next/link";
import { COMPANY_ICON } from "@/lib/icons";

const COMPANY_COLOR: Record<string, string> = {
  "31-A": "#CC4444", "31-B": "#CC6622", "31-C": "#CC8833",
  "31-D": "#AAAA22", "31-E": "#44AA66", "31-F": "#4488CC",
  "31-X": "#9944CC", "30-G": "#CC44AA", "HQ": "#888888",
  "ANGEL BEATS": "#C8A050", "other": "#555555",
};

export function UnitsGrid({ units }: { units: any[] }) {
  const [activeCompany, setActiveCompany] = useState("All");

  // Get unique companies in order
  const companies = ["All", ...Array.from(new Set(units.map(u => u.company)))];

  // Filter units
  const filtered = activeCompany === "All"
    ? units
    : units.filter(u => u.company === activeCompany);

  return (
    <>
      {/* Company filter tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--hbr-border)", background: "var(--hbr-surface)", overflowX: "auto" }}>
        {companies.map((c) => (
          <button key={c} onClick={() => setActiveCompany(c)} style={{
            fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "10px 18px", cursor: "pointer", whiteSpace: "nowrap",
            background: "transparent", border: "none",
            borderBottom: activeCompany === c ? `2px solid var(--hbr-red)` : "2px solid transparent",
            color: activeCompany === c ? "var(--hbr-red)" : "var(--hbr-muted)",
            transition: "color 0.2s",
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Unit count */}
      <div style={{ padding: "10px 20px 0", color: "var(--hbr-muted)", fontSize: 11, fontFamily: "monospace" }}>
        {filtered.length} unit{filtered.length !== 1 ? "s" : ""}
        {activeCompany !== "All" ? ` in ${activeCompany}` : ""}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 10, padding: 20,
      }}>
        {filtered.map((unit) => (
          <Link key={unit.id} href={`/units/profile?id=${unit.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--hbr-card)",
              border: "0.5px solid var(--hbr-border)",
              borderTop: `2px solid ${COMPANY_COLOR[unit.company] ?? "#555"}`,
              borderRadius: 6, overflow: "hidden", cursor: "pointer",
            }}>
              {/* Avatar */}
              <div style={{ width: "100%", height: 220, background: "var(--hbr-surface)", display: "flex", alignItems: "flex-start", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {unit.image_url ? (
                  <img src={unit.image_url} alt={unit.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                ) : (
                  <span style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: "rgba(255,255,255,0.06)", marginTop: "40%" }}>
                    {unit.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </span>
                )}
                {unit.is_limited && (
                  <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9, padding: "2px 5px", borderRadius: 2, background: "rgba(200,160,80,0.2)", color: "var(--hbr-gold)", border: "0.5px solid rgba(200,160,80,0.3)" }}>LIMITED</span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{unit.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {COMPANY_ICON[unit.company] && (
                    <img src={COMPANY_ICON[unit.company]} alt={unit.company} style={{ width: 14, height: 14, objectFit: "contain" }} />
                  )}
                  <span style={{ fontSize: 10, color: "var(--hbr-muted)" }}>{unit.company}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
