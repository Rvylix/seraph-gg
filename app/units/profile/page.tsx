import { supabase } from "@/lib/supabase";
import { ELEMENT_ICON, ELEMENT_COLOR, ATTACK_ICON, ROLE_COLOR, RARITY_COLOR, RARITY_ICON, COMPANY_ICON } from "@/lib/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UnitProfilePage(props: any) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id ?? "";

  if (!id) {
    return (
      <div style={{ padding: 48, color: "var(--hbr-red)", fontFamily: "monospace" }}>
        <p>No unit ID provided.</p>
        <a href="/units" style={{ color: "var(--hbr-muted)", fontSize: 12 }}>← Back to units</a>
      </div>
    );
  }

  const { data: unit } = await supabase
    .from("units").select("*").eq("id", id).single();

  if (!unit) {
    return (
      <div style={{ padding: 48, color: "var(--hbr-red)", fontFamily: "monospace" }}>
        <p>Unit not found.</p>
        <a href="/units" style={{ color: "var(--hbr-muted)", fontSize: 12 }}>← Back to units</a>
      </div>
    );
  }

  const u = unit as any;
  const { data: memorias } = await supabase
    .from("memorias").select("*").eq("unit_id", id).order("rarity").order("name");
  const { data: socializations } = await supabase
    .from("socializations").select("*").eq("unit_id", id).order("order_index");
  const { data: recollections } = await supabase
    .from("recollections").select("*").eq("unit_id", id).order("order_index");

  type SocRow = { id: string; unit_id: string; episode_group: string; order_index: number; title: string; unlock_condition: string };
  const socialGroups = (socializations as SocRow[] ?? []).reduce((acc: Record<string, SocRow[]>, s: SocRow) => {
    if (!acc[s.episode_group]) acc[s.episode_group] = [];
    acc[s.episode_group].push(s);
    return acc;
  }, {} as Record<string, SocRow[]>);

  const companyLogo = COMPANY_ICON[u.company] ?? "";

  return (
    <div style={{ display: "flex", height: "calc(100vh - 49px)", background: "var(--hbr-bg)", overflow: "hidden" }}>

      {/* LEFT — Full height character art */}
      <div style={{ width: 320, flexShrink: 0, position: "relative", background: "var(--hbr-surface)", borderRight: "0.5px solid var(--hbr-border)", overflow: "hidden" }}>
        <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, var(--hbr-surface) 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
        {u.image_url
          ? <img src={u.image_url} alt={u.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", zIndex: 0 }} />
          : <div style={{ position: "absolute", inset: 0, zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 64, fontWeight: 700, color: "rgba(255,255,255,0.04)" }}>
                {u.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
              </span>
            </div>
        }
        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
          <Link href="/units" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--hbr-muted)", textDecoration: "none", background: "rgba(7,7,14,0.7)", padding: "5px 10px", borderRadius: 3, border: "0.5px solid var(--hbr-border)", backdropFilter: "blur(4px)" }}>
            ← All Units
          </Link>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 24px", zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {companyLogo && <img src={companyLogo} alt={u.company} style={{ width: 28, height: 28, objectFit: "contain" }} />}
            <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "#fff", textTransform: "uppercase" }}>{u.company}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 3, lineHeight: 1.2 }}>{u.name}</h1>
          {u.name_jp && <p style={{ fontSize: 11, color: "var(--hbr-muted)" }}>{u.name_jp}{u.cv ? ` · CV: ${u.cv}` : ""}</p>}
        </div>
      </div>

      {/* RIGHT — Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

        {u.description && <p style={{ fontSize: 13, color: "var(--hbr-muted)", lineHeight: 1.8, marginBottom: 28, maxWidth: 620 }}>{u.description}</p>}

        {/* Quick stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[
            { label: "Memorias",      value: memorias?.length ?? 0 },
            { label: "Bond Episodes", value: socializations?.length ?? 0 },
            { label: "Recollections", value: recollections?.length ?? 0 },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, padding: "8px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MEMORIAS */}
        <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>// Memorias</span>
        {!memorias || memorias.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 28 }}>No Memorias added yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {(memorias as any[]).map((m: any) => {
              const roleStyle = ROLE_COLOR[m.role] ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
              const elemColor = ELEMENT_COLOR[m.element] ?? "#888";
              const elemIcon  = ELEMENT_ICON[m.element];
              const atkIcon   = ATTACK_ICON[m.attack_type];
              const rarityIcon = RARITY_ICON[m.rarity];
              return (
                <Link key={m.id} href={`/memoria/detail?id=${m.id}&from=${id}`} style={{ textDecoration: "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", alignItems: "center", gap: 14, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 6, padding: "12px 14px", cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(204,34,34,0.5)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(180,40,40,0.22)")}>

                    {/* Artwork */}
                    <div style={{ width: 72, height: 72, borderRadius: 6, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 13, fontWeight: 700, background: m.rarity === "SS" ? "rgba(200,160,80,0.08)" : "rgba(120,100,200,0.08)", color: RARITY_COLOR[m.rarity] ?? "#fff", border: `0.5px solid ${m.rarity === "SS" ? "rgba(200,160,80,0.25)" : "rgba(120,100,200,0.25)"}` }}>
                      {m.image_url ? <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : m.rarity}
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        {rarityIcon && <img src={rarityIcon} alt={m.rarity} style={{ height: 16, objectFit: "contain", flexShrink: 0 }} />}
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{m.name}</span>
                        {m.is_limited && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 2, background: "rgba(200,160,80,0.1)", color: "#C8A050", flexShrink: 0 }}>Limited</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--hbr-muted)", lineHeight: 1.5, marginBottom: 7 }}>{m.skill_desc}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 2, background: roleStyle.bg, color: roleStyle.text, textTransform: "capitalize" }}>{m.role}</span>
                        {m.attack_type !== "none" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, padding: "2px 7px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", textTransform: "capitalize" }}>
                            {atkIcon && <img src={atkIcon} alt={m.attack_type} style={{ width: 12, height: 12, objectFit: "contain" }} />}
                            {m.attack_type}
                          </span>
                        )}
                        {m.element !== "none" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, padding: "2px 7px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: elemColor, textTransform: "capitalize" }}>
                            {elemIcon && <img src={elemIcon} alt={m.element} style={{ width: 12, height: 12, objectFit: "contain" }} />}
                            {m.element}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <hr style={{ border: "none", borderTop: "0.5px solid var(--hbr-border)", margin: "4px 0 24px" }} />

        {/* SOCIALIZATION */}
        <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>// Socialization</span>
        {Object.keys(socialGroups).length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 28 }}>Socialization not available for this unit.</p>
        ) : (
          <div style={{ marginBottom: 28 }}>
            {Object.entries(socialGroups).map(([group, items]) => (
              <div key={group} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--hbr-silver)", marginBottom: 8, paddingBottom: 6, borderBottom: "0.5px solid var(--hbr-border)" }}>{group}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(items as any[]).map((s: any) => (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--hbr-red)", minWidth: 24 }}>S{s.order_index}</div>
                      <div><div style={{ fontSize: 11, color: "#fff", marginBottom: 2 }}>{s.title}</div><div style={{ fontSize: 10, color: "var(--hbr-muted)" }}>{s.unlock_condition}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <hr style={{ border: "none", borderTop: "0.5px solid var(--hbr-border)", margin: "4px 0 24px" }} />

        {/* RECOLLECTIONS */}
        <span style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>// Recollections</span>
        {!recollections || recollections.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--hbr-muted)", paddingBottom: 40 }}>Recollections not available for this unit.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 40 }}>
            {(recollections as any[]).map((r: any) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4 }}>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--hbr-red)", minWidth: 24 }}>R{r.order_index}</div>
                <div><div style={{ fontSize: 11, color: "#fff", marginBottom: 2 }}>{r.title}</div><div style={{ fontSize: 10, color: "var(--hbr-muted)" }}>{r.unlock_condition}</div></div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
