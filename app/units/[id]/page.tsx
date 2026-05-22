import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

const ROLE_COLOR: Record<string, { bg: string; text: string }> = {
  attacker:  { bg: "rgba(204,34,34,0.15)",   text: "#FF8080" },
  breaker:   { bg: "rgba(204,100,34,0.15)",  text: "#FFAA66" },
  blaster:   { bg: "rgba(180,34,180,0.15)",  text: "#FF88FF" },
  defender:  { bg: "rgba(34,100,204,0.15)",  text: "#80AAFF" },
  buffer:    { bg: "rgba(200,160,80,0.15)",  text: "#C8A050" },
  debuffer:  { bg: "rgba(100,180,100,0.15)", text: "#80FF80" },
  healer:    { bg: "rgba(34,180,100,0.15)",  text: "#22CC66" },
  admiral:   { bg: "rgba(180,140,34,0.15)",  text: "#FFD966" },
  rider:     { bg: "rgba(80,160,200,0.15)",  text: "#80DDFF" },
};

const ELEMENT_COLOR: Record<string, { text: string }> = {
  fire:    { text: "#FF7755" },
  ice:     { text: "#80AAFF" },
  thunder: { text: "#FFD966" },
  light:   { text: "#FFFFAA" },
  dark:    { text: "#CC88FF" },
  none:    { text: "#888888" },
};

const ELEMENT_ICON: Record<string, string> = {
  fire: "🔥", ice: "❄️", thunder: "⚡", light: "✨", dark: "🌑", none: "—",
};

const RARITY_COLOR: Record<string, string> = {
  SS: "var(--hbr-gold)", S: "#AA88FF", A: "#80AAFF",
};

export const dynamic = "force-dynamic";

interface Props { params: { id: string } }

export default async function UnitProfilePage({ params }: Props) {
  // Fetch unit
  const { data: unit } = await supabase
    .from("units")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!unit) {
    return (
      <div style={{ padding: 48, color: "var(--hbr-red)", fontFamily: "monospace" }}>
        <p>Unit not found for ID: {params.id}</p>
        <a href="/units" style={{ color: "var(--hbr-muted)", fontSize: 12 }}>← Back to units</a>
      </div>
    );
  }
  const u = unit as { id: string; name: string; name_jp: string | null; cv: string | null; company: string; position: string; description: string | null; image_url: string | null; is_limited: boolean };

  // Fetch memorias for this unit
  const { data: memorias } = await supabase
    .from("memorias")
    .select("*")
    .eq("unit_id", params.id)
    .order("rarity")
    .order("name");

  // Fetch socializations
  const { data: socializations } = await supabase
    .from("socializations")
    .select("*")
    .eq("unit_id", params.id)
    .order("order_index");

  // Fetch recollections
  const { data: recollections } = await supabase
    .from("recollections")
    .select("*")
    .eq("unit_id", params.id)
    .order("order_index");

  // Group socializations by episode_group
  type SocRow = { id: string; unit_id: string; episode_group: string; order_index: number; title: string; unlock_condition: string };
  const socialGroups = (socializations as SocRow[] ?? []).reduce((acc: Record<string, SocRow[]>, s: SocRow) => {
    if (!acc[s.episode_group]) acc[s.episode_group] = [];
    acc[s.episode_group].push(s);
    return acc;
  }, {} as Record<string, SocRow[]>);

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>

      {/* Back button */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 24px",
        borderBottom: "0.5px solid var(--hbr-border)",
        background: "var(--hbr-surface)",
      }}>
        <Link href="/units" style={{
          fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "var(--hbr-muted)", textDecoration: "none",
        }}>
          ← Back to all units
        </Link>
      </div>

      {/* Hero */}
      <div style={{
        display: "grid", gridTemplateColumns: "180px 1fr",
        borderBottom: "0.5px solid var(--hbr-border)",
      }}>
        {/* Art placeholder */}
        <div style={{
          background: "var(--hbr-surface)", display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "32px 20px",
          borderRight: "0.5px solid var(--hbr-border)",
        }}>
          <div style={{
            width: 120, height: 160,
            background: "var(--hbr-card)",
            border: "0.5px solid var(--hbr-border)",
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {u.image_url ? (
              <img src={u.image_url} alt={u.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
            ) : (
              <span style={{ fontFamily: "monospace", fontSize: 40, fontWeight: 700, color: "rgba(255,255,255,0.06)" }}>
                {u.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: 24 }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 6 }}>
            // {u.company}
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4, letterSpacing: "-0.01em" }}>
            {u.name}
          </h1>
          {u.name_jp && (
            <p style={{ fontSize: 13, color: "var(--hbr-muted)", marginBottom: 14 }}>
              {u.name_jp}{u.cv ? ` · CV: ${u.cv}` : ""}
            </p>
          )}

          {/* Stats row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { label: "Company", value: u.company },
              { label: "Position", value: u.position },
              { label: "Type", value: u.is_limited ? "Limited" : "Standard" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)",
                borderRadius: 3, padding: "6px 12px",
              }}>
                <div style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", textTransform: "capitalize" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {u.description && (
            <p style={{ fontSize: 12, color: "var(--hbr-muted)", lineHeight: 1.7, maxWidth: 520 }}>
              {u.description}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px" }}>

        {/* Left — Memorias + Social + Recoll */}
        <div style={{ padding: "20px 24px", borderRight: "0.5px solid var(--hbr-border)" }}>

          {/* ── MEMORIAS ── */}
          <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>
            // Memorias
          </span>

          {!memorias || memorias.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 24 }}>
              No Memorias added yet for this unit.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {(memorias as any[]).map((m: any) => {
                const roleStyle = ROLE_COLOR[m.role] ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
                const elemColor = ELEMENT_COLOR[m.element]?.text ?? "#888";
                return (
                  <div key={m.id} style={{
                    display: "grid", gridTemplateColumns: "48px 1fr auto",
                    alignItems: "center", gap: 12,
                    background: "var(--hbr-card)",
                    border: "0.5px solid var(--hbr-border)",
                    borderRadius: 4, padding: "10px 12px",
                  }}>
                    {/* Rarity box */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "monospace", fontSize: 12, fontWeight: 700,
                      background: m.rarity === "SS" ? "rgba(200,160,80,0.12)" : "rgba(120,100,200,0.12)",
                      color: RARITY_COLOR[m.rarity] ?? "#fff",
                      border: `0.5px solid ${m.rarity === "SS" ? "rgba(200,160,80,0.3)" : "rgba(120,100,200,0.3)"}`,
                      flexShrink: 0,
                    }}>
                      {m.rarity}
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 3 }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--hbr-muted)", lineHeight: 1.5, marginBottom: 5 }}>
                        {m.skill_desc}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {/* Role tag */}
                        <span style={{
                          fontSize: 9, padding: "2px 6px", borderRadius: 2,
                          background: roleStyle.bg, color: roleStyle.text,
                          textTransform: "capitalize",
                        }}>
                          {m.role}
                        </span>
                        {/* Attack type */}
                        {m.attack_type !== "none" && (
                          <span style={{
                            fontSize: 9, padding: "2px 6px", borderRadius: 2,
                            background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)",
                            textTransform: "capitalize",
                          }}>
                            {m.attack_type}
                          </span>
                        )}
                        {/* Element */}
                        {m.element !== "none" && (
                          <span style={{
                            fontSize: 9, padding: "2px 6px", borderRadius: 2,
                            background: "rgba(255,255,255,0.05)", color: elemColor,
                            textTransform: "capitalize",
                          }}>
                            {ELEMENT_ICON[m.element]} {m.element}
                          </span>
                        )}
                        {m.is_limited && (
                          <span style={{
                            fontSize: 9, padding: "2px 6px", borderRadius: 2,
                            background: "rgba(200,160,80,0.1)", color: "var(--hbr-gold)",
                          }}>
                            Limited
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <hr style={{ border: "none", borderTop: "0.5px solid var(--hbr-border)", margin: "4px 0 20px" }} />

          {/* ── SOCIALIZATION ── */}
          <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>
            // Socialization
          </span>

          {Object.keys(socialGroups).length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 24 }}>
              Socialization not available for this unit.
            </p>
          ) : (
            <div style={{ marginBottom: 24 }}>
              {Object.entries(socialGroups).map(([group, items]) => (
                <div key={group} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--hbr-silver)", marginBottom: 8, paddingBottom: 6, borderBottom: "0.5px solid var(--hbr-border)" }}>
                    {group}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(items as any[]).map((s: any) => (
                      <div key={s.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 12px", background: "var(--hbr-card)",
                        border: "0.5px solid var(--hbr-border)", borderRadius: 4,
                      }}>
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--hbr-red)", minWidth: 22 }}>
                          S{s.order_index}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "#fff", marginBottom: 2 }}>{s.title}</div>
                          <div style={{ fontSize: 10, color: "var(--hbr-muted)" }}>{s.unlock_condition}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr style={{ border: "none", borderTop: "0.5px solid var(--hbr-border)", margin: "4px 0 20px" }} />

          {/* ── RECOLLECTIONS ── */}
          <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>
            // Recollections
          </span>

          {!recollections || recollections.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--hbr-muted)" }}>
              Recollections not available for this unit.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(recollections as any[]).map((r: any) => (
                <div key={r.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px", background: "var(--hbr-card)",
                  border: "0.5px solid var(--hbr-border)", borderRadius: 4,
                }}>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--hbr-red)", minWidth: 22 }}>
                    R{r.order_index}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#fff", marginBottom: 2 }}>{r.title}</div>
                    <div style={{ fontSize: 10, color: "var(--hbr-muted)" }}>{r.unlock_condition}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right sidebar */}
        <div style={{ padding: 16, background: "var(--hbr-surface)" }}>
          <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>
            // Quick stats
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
            {[
              { label: "Memorias", value: memorias?.length ?? 0 },
              { label: "Bond eps", value: socializations?.length ?? 0 },
              { label: "Recollections", value: recollections?.length ?? 0 },
            ].map((s) => (
              <div key={s.label} style={{
                background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)",
                borderRadius: 4, padding: "8px 10px",
              }}>
                <div style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 17, color: "#fff", fontWeight: 700 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
