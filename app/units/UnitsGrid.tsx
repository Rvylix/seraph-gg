"use client";
import { useState } from "react";
import Link from "next/link";
import { COMPANY_ICON, COMPANY_ARTWORK } from "@/lib/icons";

const COMPANY_COLOR: Record<string, string> = {
  "31-A": "#CC4444", "31-B": "#CC6622", "31-C": "#CC8833",
  "31-D": "#AAAA22", "31-E": "#44AA66", "31-F": "#4488CC",
  "31-X": "#9944CC", "30-G": "#CC44AA", "HQ": "#888888",
  "ANGEL BEATS": "#C8A050", "other": "#555555",
};

export function UnitsGrid({ units }: { units: any[] }) {
  const [activeCompany, setActiveCompany] = useState("All");
  const companies = ["All", ...Array.from(new Set(units.map(u => u.company)))];
  const filtered  = activeCompany === "All" ? units : units.filter(u => u.company === activeCompany);
  const artwork   = activeCompany !== "All" ? COMPANY_ARTWORK[activeCompany] : "";
  const logo      = activeCompany !== "All" ? COMPANY_ICON[activeCompany] : "";
  const accent    = COMPANY_COLOR[activeCompany] ?? "var(--hbr-red)";

  return (
    <>
      {/* ── CINEMATIC BANNER ── */}
      <div style={{
        position: "relative", height: 260, overflow: "hidden",
        background: "var(--hbr-surface)",
      }}>
        {/* Company artwork — full width, fades cleanly left */}
        {artwork ? (
          <>
            <img src={artwork} alt={activeCompany} style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              width: "100%", height: "100%",
              objectFit: "contain", objectPosition: "right center",
              zIndex: 0,
            }} />
            {/* Clean gradient — solid left, fully transparent right */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(to right, #0F0F1A 0%, #0F0F1A 20%, rgba(15,15,26,0.95) 35%, rgba(15,15,26,0.6) 55%, rgba(15,15,26,0.1) 80%, transparent 100%)",
            }} />
            {/* Bottom fade into tabs */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 60, zIndex: 1,
              background: "linear-gradient(to top, #0F0F1A 0%, transparent 100%)",
            }} />
          </>
        ) : (
          <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        )}

        {/* Accent color line at bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 3,
          background: activeCompany !== "All"
            ? `linear-gradient(to right, ${accent}, transparent)`
            : "var(--hbr-border)",
        }} />

        {/* Content — left aligned, vertically centered */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 36px",
        }}>
          {activeCompany === "All" ? (
            <>
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 10 }}>// Roster</p>
              <h1 style={{ fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1 }}>Units</h1>
              <p style={{ fontSize: 13, color: "var(--hbr-muted)" }}>{units.length} characters · Select a company to filter</p>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: accent, textTransform: "uppercase", marginBottom: 12 }}>// Company</p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 10 }}>
                {logo && (
                  <img src={logo} alt={activeCompany} style={{ height: 56, objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }} />
                )}
                <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-0.01em" }}>
                  {activeCompany}
                </h1>
              </div>
              <p style={{ fontSize: 13, color: "var(--hbr-muted)" }}>
                {filtered.length} unit{filtered.length !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── COMPANY FILTER TABS ── */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "0.5px solid var(--hbr-border)",
        background: "var(--hbr-surface)",
        overflowX: "auto",
        position: "sticky", top: 49, zIndex: 10,
      }}>
        {companies.map((c) => {
          const isActive = activeCompany === c;
          const color = COMPANY_COLOR[c] ?? "var(--hbr-red)";
          return (
            <button key={c} onClick={() => setActiveCompany(c)} style={{
              fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "11px 20px", cursor: "pointer", whiteSpace: "nowrap",
              background: "transparent", border: "none",
              borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
              color: isActive ? color : "var(--hbr-muted)",
              transition: "color 0.2s",
            }}>
              {c}
            </button>
          );
        })}
      </div>

      {/* ── UNIT GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, padding: 20 }}>
        {filtered.map((unit) => (
          <Link key={unit.id} href={`/units/profile?id=${unit.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--hbr-card)",
              border: "0.5px solid var(--hbr-border)",
              borderTop: `2px solid ${COMPANY_COLOR[unit.company] ?? "#555"}`,
              borderRadius: 6, overflow: "hidden", cursor: "pointer",
            }}>
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
