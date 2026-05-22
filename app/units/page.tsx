import { supabase } from "@/lib/supabase";
import Link from "next/link";

const COMPANY_COLOR: Record<string, string> = {
  "31-A": "#CC4444", "31-B": "#CC6622", "31-C": "#CC8833",
  "31-D": "#AAAA22", "31-E": "#44AA66", "31-F": "#4488CC",
  "31-X": "#9944CC", "30-G": "#CC44AA", "HQ": "#888888",
  "ANGEL BEATS": "#C8A050", "other": "#555555",
};

const POSITION_LABEL: Record<string, string> = {
  front: "Front", mid: "Mid", back: "Back",
};

export const dynamic = "force-dynamic";

export default async function UnitsPage() {
  const { data: units, error } = await supabase
    .from("units")
    .select("*")
    .order("company")
    .order("name");

  const companies = [...new Set(((units || []) as any[]).map((u: any) => u.company))];

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>

      {/* Page header */}
      <div style={{
        padding: "22px 24px 0",
        background: "var(--hbr-surface)",
        borderBottom: "0.5px solid var(--hbr-border)",
      }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 6 }}>
          // Roster
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Units</h1>
        <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 16 }}>
          {units?.length ?? 0} characters · Click any unit to view full profile, Memorias, Socialization & Recollections
        </p>

        {/* Company filter tabs */}
        <div style={{ display: "flex", gap: 0, borderTop: "0.5px solid var(--hbr-border)", overflowX: "auto" }}>
          {["All", ...companies].map((c) => (
            <div key={c} style={{
              fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "10px 16px", color: "var(--hbr-muted)", cursor: "pointer",
              whiteSpace: "nowrap", borderBottom: "2px solid transparent",
            }}>
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: 24, color: "var(--hbr-red)", fontFamily: "monospace", fontSize: 12 }}>
          Error loading units: {error.message}
        </div>
      )}

      {/* Empty state */}
      {!error && (!units || units.length === 0) && (
        <div style={{ padding: 48, textAlign: "center", color: "var(--hbr-muted)", fontSize: 13 }}>
          No units found. Add some in Supabase to get started.
        </div>
      )}

      {/* Unit grid */}
      {units && units.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 10, padding: 20,
        }}>
          {((units || []) as any[]).map((unit: any) => (
            <Link key={unit.id} href={`/units/${unit.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--hbr-card)",
                border: "0.5px solid var(--hbr-border)",
                borderTop: `2px solid ${COMPANY_COLOR[unit.company] ?? "#555"}`,
                borderRadius: 6,
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}>
                {/* Avatar placeholder */}
                <div style={{
                  width: "100%", aspectRatio: "3/4",
                  background: "var(--hbr-surface)",
                  display: "flex", alignItems: "flex-start", justifyContent: "center",
                  position: "relative",
                }}>
                  {unit.image_url ? (
                    <img src={unit.image_url} alt={unit.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                  ) : (
                    <span style={{
                      fontFamily: "monospace", fontSize: 32, fontWeight: 700,
                      color: "rgba(255,255,255,0.06)",
                    }}>
                      {unit.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </span>
                  )}

                  {/* Position badge */}
                  <span style={{
                    position: "absolute", bottom: 8, left: 8,
                    fontFamily: "monospace", fontSize: 9, fontWeight: 700,
                    padding: "2px 6px", borderRadius: 2,
                    background: "rgba(255,255,255,0.08)",
                    color: "var(--hbr-muted)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                  }}>
                    {POSITION_LABEL[unit.position] ?? unit.position}
                  </span>

                  {/* Limited badge */}
                  {unit.is_limited && (
                    <span style={{
                      position: "absolute", top: 8, right: 8,
                      fontSize: 9, padding: "2px 5px", borderRadius: 2,
                      background: "rgba(200,160,80,0.2)",
                      color: "var(--hbr-gold)",
                      border: "0.5px solid rgba(200,160,80,0.3)",
                    }}>LIMITED</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
                    {unit.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--hbr-muted)" }}>
                    {unit.company}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
