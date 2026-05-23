import { supabase } from "@/lib/supabase";
import { ToggleSkillCard } from "@/app/memoria/ToggleSkillCard";
import { ELEMENT_ICON, ELEMENT_COLOR, ATTACK_ICON, ROLE_COLOR, RARITY_ICON, RARITY_COLOR, COMPANY_ICON } from "@/lib/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SKILL_TYPE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  skill:    { label: "Skill",    color: "#FF8080", bg: "rgba(204,34,34,0.15)" },
  ex_skill: { label: "EX Skill", color: "#FFD966", bg: "rgba(200,160,34,0.15)" },
  passive:  { label: "Passive",  color: "#80FFAA", bg: "rgba(34,180,100,0.15)" },
};

type Props = {
  searchParams: Promise<{ id?: string; from?: string }>;
};

export default async function MemoriaDetailPage({ searchParams }: Props) {
  const { id = "", from = "" } = await searchParams;

  if (!id) {
    return (
      <div style={{ padding: 48, color: "var(--hbr-red)", fontFamily: "monospace" }}>
        <p>No Memoria ID provided.</p>
        <a href="/units" style={{ color: "var(--hbr-muted)", fontSize: 12 }}>← Back to units</a>
      </div>
    );
  }

  const { data: memoria } = await supabase
    .from("memorias").select("*").eq("id", id).single();

  if (!memoria) {
    return (
      <div style={{ padding: 48, color: "var(--hbr-red)", fontFamily: "monospace" }}>
        <p>Memoria not found for ID: {id}</p>
        <a href="/units" style={{ color: "var(--hbr-muted)", fontSize: 12 }}>← Back</a>
      </div>
    );
  }

  const m = memoria as any;

  const { data: unitData } = m.unit_id ? await supabase
    .from("units").select("id, name, company, image_url").eq("id", m.unit_id).single()
    : { data: null };
  const unit = unitData as any;

  const { data: skills } = await supabase
    .from("memoria_skills").select("*").eq("memoria_id", id).order("order_index");

  const roleStyle  = ROLE_COLOR[m.role]       ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
  const elemColor  = ELEMENT_COLOR[m.element] ?? "#888";
  const elemIcon   = ELEMENT_ICON[m.element];
  const atkIcon    = ATTACK_ICON[m.attack_type];
  const rarityIcon = RARITY_ICON[m.rarity];
  const backHref   = from ? `/units/profile?id=${from}` : "/units";

  const allSkills  = (skills ?? []) as any[];

  // Group skills — skills with same toggle_group are toggle variants
  function groupSkills(skillList: any[]) {
    const groups: any[][] = [];
    const seen = new Set<string>();
    for (const s of skillList) {
      if (s.toggle_group) {
        if (!seen.has(s.toggle_group)) {
          seen.add(s.toggle_group);
          groups.push(skillList.filter(x => x.toggle_group === s.toggle_group));
        }
      } else {
        groups.push([s]);
      }
    }
    return groups;
  }

  const mainSkills = allSkills.filter(s => s.skill_type === "skill");
  const exSkills   = allSkills.filter(s => s.skill_type === "ex_skill");
  const passives   = allSkills.filter(s => s.skill_type === "passive");
  const mainGroups = groupSkills(mainSkills);
  const exGroups   = groupSkills(exSkills);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 49px)", background: "var(--hbr-bg)", overflow: "hidden" }}>

      {/* ── LEFT — Full height Memoria artwork ── */}
      <div style={{ width: 380, flexShrink: 0, position: "relative", background: "var(--hbr-surface)", borderRight: "0.5px solid var(--hbr-border)", overflow: "hidden" }}>

        {/* Grid overlay */}
        <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }} />

        {/* Bottom gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, #0F0F1A 0%, rgba(15,15,26,0.6) 60%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

        {/* Artwork */}
        {m.image_url ? (
          <img src={m.image_url} alt={m.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Rarity glow background */}
            <div style={{ position: "absolute", inset: 0, background: m.rarity === "SS" ? "radial-gradient(ellipse at center, rgba(200,160,80,0.12) 0%, transparent 70%)" : "radial-gradient(ellipse at center, rgba(120,100,200,0.12) 0%, transparent 70%)" }} />
            <span style={{ fontFamily: "monospace", fontSize: 80, fontWeight: 700, color: m.rarity === "SS" ? "rgba(200,160,80,0.15)" : "rgba(120,100,200,0.15)", position: "relative", zIndex: 1 }}>
              {m.rarity}
            </span>
          </div>
        )}

        {/* Back button — top left */}
        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
          <Link href={backHref} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--hbr-muted)", textDecoration: "none", background: "rgba(7,7,14,0.75)", padding: "5px 10px", borderRadius: 3, border: "0.5px solid var(--hbr-border)", backdropFilter: "blur(4px)" }}>
            ← {unit?.name ?? "Back"}
          </Link>
        </div>

        {/* Rarity icon — top right, big */}
        {rarityIcon && (
          <div style={{ position: "absolute", top: 12, right: 16, zIndex: 10 }}>
            <img src={rarityIcon} alt={m.rarity} style={{ height: 48, objectFit: "contain" }} />
          </div>
        )}

        {/* Bottom overlay — tags + unit card full width */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 16px 20px", zIndex: 3 }}>

          {/* Tags row — full width, even spacing */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <span style={{ flex: 1, textAlign: "center", fontSize: 10, padding: "6px 0", borderRadius: 4, background: roleStyle.bg, color: roleStyle.text, textTransform: "capitalize" }}>
              {m.role}
            </span>
            {m.attack_type !== "none" && (
              <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 10, padding: "6px 0", borderRadius: 4, background: "rgba(0,0,0,0.5)", color: "var(--hbr-muted)", textTransform: "capitalize", backdropFilter: "blur(4px)" }}>
                {atkIcon && <img src={atkIcon} alt={m.attack_type} style={{ width: 14, height: 14, objectFit: "contain" }} />}
                {m.attack_type}
              </span>
            )}
            {m.element !== "none" && (
              <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 10, padding: "6px 0", borderRadius: 4, background: "rgba(0,0,0,0.5)", color: elemColor, textTransform: "capitalize", backdropFilter: "blur(4px)" }}>
                {elemIcon && <img src={elemIcon} alt={m.element} style={{ width: 14, height: 14, objectFit: "contain" }} />}
                {m.element}
              </span>
            )}
            {m.element2 && m.element2 !== "none" && (
              <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 10, padding: "6px 0", borderRadius: 4, background: "rgba(0,0,0,0.5)", color: ELEMENT_COLOR[m.element2] ?? "#888", textTransform: "capitalize", backdropFilter: "blur(4px)" }}>
                {ELEMENT_ICON[m.element2] && <img src={ELEMENT_ICON[m.element2]} alt={m.element2} style={{ width: 14, height: 14, objectFit: "contain" }} />}
                {m.element2}
              </span>
            )}
            {m.is_limited && (
              <span style={{ flex: 1, textAlign: "center", fontSize: 10, padding: "6px 0", borderRadius: 4, background: "rgba(200,160,80,0.15)", color: "#C8A050" }}>
                Limited
              </span>
            )}
          </div>

          {/* Unit card — full width */}
          {unit && (
            <Link href={`/units/profile?id=${from || unit.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(7,7,14,0.75)", border: "0.5px solid var(--hbr-border)", borderRadius: 6, backdropFilter: "blur(8px)" }}>
                {unit.image_url && (
                  <img src={unit.image_url} alt={unit.name} style={{ width: 36, height: 36, borderRadius: 4, objectFit: "cover", objectPosition: "top", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 1 }}>Unit</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{unit.name}</div>
                  <div style={{ fontSize: 10, color: "var(--hbr-muted)" }}>{unit.company}</div>
                </div>
                <span style={{ fontSize: 12, color: "var(--hbr-muted)" }}>→</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* ── RIGHT — Skills content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>

        {/* Memoria name */}
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 8 }}>// Memoria</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.15 }}>{m.name}</h1>
        <p style={{ fontSize: 13, color: "var(--hbr-muted)", lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>{m.skill_desc}</p>

        {/* No skill data */}
        {allSkills.length === 0 && (
          <div style={{ background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 8, padding: "20px 24px" }}>
            <p style={{ fontSize: 12, color: "var(--hbr-muted)" }}>Detailed skill data not added yet for this Memoria.</p>
          </div>
        )}

        {/* MAIN SKILLS */}
        {mainSkills.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            {mainSkills.map((s: any, i: number) => (
              <SkillCard key={s.id} skill={s} index={i} total={mainSkills.length} />
            ))}
          </div>
        )}

        {/* EX SKILLS */}
        {exSkills.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            {exSkills.map((s: any, i: number) => (
              <SkillCard key={s.id} skill={s} index={i} total={exSkills.length} />
            ))}
          </div>
        )}

        {/* PASSIVES */}
        {passives.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            {passives.map((s: any, i: number) => (
              <SkillCard key={s.id} skill={s} index={i} total={passives.length} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function SkillCard({ skill, index, total }: { skill: any; index: number; total: number }) {
  const typeInfo  = SKILL_TYPE_LABEL[skill.skill_type] ?? { label: skill.skill_type, color: "#888", bg: "rgba(255,255,255,0.05)" };
  const elemColor = ELEMENT_COLOR[skill.element] ?? "#888";
  const elemIcon  = skill.element ? ELEMENT_ICON[skill.element] : null;
  const atkIcon   = skill.attack_type ? ATTACK_ICON[skill.attack_type] : null;
  const isPassive = skill.skill_type === "passive";

  return (
    <div style={{ background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 8, padding: "18px 22px", marginBottom: 10, borderLeft: `2px solid ${typeInfo.color}` }}>

      {/* Type badge + skill name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: typeInfo.bg, color: typeInfo.color, fontWeight: 600, letterSpacing: "0.05em", flexShrink: 0, textTransform: "uppercase" }}>
          {typeInfo.label}{total > 1 ? ` ${index + 1}` : ""}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{skill.skill_name}</span>
      </div>

      {/* Attack type + element + hits + target */}
      {!isPassive && (skill.attack_type || skill.element || skill.hits || skill.target) && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
          {skill.attack_type && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", textTransform: "capitalize", border: "0.5px solid var(--hbr-border)" }}>
              {atkIcon && <img src={atkIcon} alt={skill.attack_type} style={{ width: 13, height: 13, objectFit: "contain" }} />}
              {skill.attack_type}
            </span>
          )}
          {skill.element && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: elemColor, textTransform: "capitalize", border: "0.5px solid var(--hbr-border)" }}>
              {elemIcon && <img src={elemIcon} alt={skill.element} style={{ width: 13, height: 13, objectFit: "contain" }} />}
              {skill.element}
            </span>
          )}
          {skill.hits && (
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", border: "0.5px solid var(--hbr-border)" }}>
              {skill.hits} hit{skill.hits > 1 ? "s" : ""}
            </span>
          )}
          {skill.target && (
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", border: "0.5px solid var(--hbr-border)" }}>
              {skill.target}
            </span>
          )}
          {skill.sp_cost != null && (
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(80,160,255,0.1)", color: "#80AAFF", border: "0.5px solid rgba(80,160,255,0.25)" }}>
              {skill.sp_cost} SP
            </span>
          )}
          {skill.max_uses != null && (
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: "rgba(200,160,80,0.1)", color: "#C8A050", border: "0.5px solid rgba(200,160,80,0.25)" }}>
              {skill.max_uses}× uses
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <p style={{ fontSize: 13, color: "var(--hbr-silver)", lineHeight: 1.7, marginBottom: skill.notes?.length > 0 ? 14 : 0 }}>
        {skill.power}
      </p>

      {/* Notes */}
      {skill.notes && skill.notes.length > 0 && (
        <div style={{ borderTop: "0.5px solid var(--hbr-border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {(skill.notes as string[]).map((note: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: typeInfo.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>*</span>
              <span style={{ fontSize: 12, color: "var(--hbr-silver)", lineHeight: 1.6 }}>{note}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

