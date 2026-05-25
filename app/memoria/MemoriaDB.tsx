"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ELEMENT_ICON, ELEMENT_COLOR, ATTACK_ICON, ROLE_COLOR, RARITY_ICON, RARITY_COLOR } from "@/lib/icons";

const RARITIES     = ["A", "S", "SS", "SSR"];
const ROLES        = ["attacker", "breaker", "blaster", "defender", "buffer", "debuffer", "healer", "admiral", "rider"];
const ELEMENTS     = ["fire", "ice", "thunder", "light", "dark"];
const ATTACK_TYPES = ["slash", "pierce", "crush"];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.15em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 8 }}>{title}</p>
      {children}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 10, padding: "4px 10px", borderRadius: 3, cursor: "pointer",
      border: `0.5px solid ${active ? "var(--hbr-red)" : "rgba(200,200,216,0.1)"}`,
      background: active ? "var(--hbr-red-glow)" : "transparent",
      color: active ? "var(--hbr-red)" : "var(--hbr-muted)",
      display: "inline-flex", alignItems: "center", gap: 4,
      transition: "all 0.15s",
    }}>
      {children}
    </button>
  );
}

export function MemoriaDB({ memorias, units }: { memorias: any[]; units: any[] }) {
  const [search,      setSearch]      = useState("");
  const [rarities,    setRarities]    = useState<string[]>([]);
  const [roles,       setRoles]       = useState<string[]>([]);
  const [elements,    setElements]    = useState<string[]>([]);
  const [attackTypes, setAttackTypes] = useState<string[]>([]);
  const [unitFilter,  setUnitFilter]  = useState("");
  const [newOnly,     setNewOnly]     = useState(false);
  const [limitedOnly,  setLimitedOnly]  = useState(false);
  const [resonanceOnly, setResonanceOnly] = useState(false);
  const [unisonOnly,    setUnisonOnly]    = useState(false);

  function toggle<T>(arr: T[], setArr: (a: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  const filtered = useMemo(() => {
    return memorias.filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (rarities.length    && !rarities.includes(m.rarity))             return false;
      if (roles.length       && !roles.includes(m.role))                  return false;
      if (attackTypes.length && !attackTypes.includes(m.attack_type))     return false;
      if (elements.length    && !elements.includes(m.element) && !elements.includes(m.element2)) return false;
      if (unitFilter         && m.units?.id !== unitFilter)               return false;
      if (limitedOnly        && !m.is_limited)                            return false;
      if (resonanceOnly      && !m.has_resonance)                         return false;
      if (unisonOnly         && !m.has_unison)                            return false;
      return true;
    });
  }, [memorias, search, rarities, roles, elements, attackTypes, unitFilter, newOnly, limitedOnly, resonanceOnly, unisonOnly]);

  const hasFilters = rarities.length || roles.length || elements.length || attackTypes.length || unitFilter || limitedOnly || resonanceOnly || unisonOnly || search;

  return (
    <div className="memoria-db-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 100px)" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ background: "var(--hbr-surface)", borderRight: "0.5px solid var(--hbr-border)", padding: "20px 16px", overflowY: "auto" }}>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Memoria..."
            style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "var(--hbr-silver)", fontSize: 11, padding: "7px 10px", outline: "none" }}
          />
        </div>

        {/* Clear all */}
        {hasFilters && (
          <button onClick={() => { setSearch(""); setRarities([]); setRoles([]); setElements([]); setAttackTypes([]); setUnitFilter(""); setLimitedOnly(false); setNewOnly(false); }}
            style={{ width: "100%", marginBottom: 16, fontSize: 10, padding: "5px", borderRadius: 3, cursor: "pointer", border: "0.5px solid var(--hbr-border)", background: "rgba(204,34,34,0.1)", color: "var(--hbr-red)", letterSpacing: "0.05em" }}>
            Clear all filters
          </button>
        )}

        {/* Rarity */}
        <FilterSection title="Rarity">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {RARITIES.map(r => (
              <FilterChip key={r} active={rarities.includes(r)} onClick={() => toggle(rarities, setRarities, r)}>
                {RARITY_ICON[r] && <img src={RARITY_ICON[r]} alt={r} style={{ height: 12, objectFit: "contain" }} />}
                {r}
              </FilterChip>
            ))}
          </div>
        </FilterSection>

        {/* Role */}
        <FilterSection title="Role">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {ROLES.map(r => (
              <FilterChip key={r} active={roles.includes(r)} onClick={() => toggle(roles, setRoles, r)}>
                <span style={{ textTransform: "capitalize" }}>{r}</span>
              </FilterChip>
            ))}
          </div>
        </FilterSection>

        {/* Element */}
        <FilterSection title="Element">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {ELEMENTS.map(e => (
              <FilterChip key={e} active={elements.includes(e)} onClick={() => toggle(elements, setElements, e)}>
                {ELEMENT_ICON[e] && <img src={ELEMENT_ICON[e]} alt={e} style={{ width: 12, height: 12, objectFit: "contain" }} />}
                <span style={{ textTransform: "capitalize", color: elements.includes(e) ? "var(--hbr-red)" : ELEMENT_COLOR[e] }}>{e}</span>
              </FilterChip>
            ))}
          </div>
        </FilterSection>

        {/* Attack Type */}
        <FilterSection title="Attack Type">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {ATTACK_TYPES.map(a => (
              <FilterChip key={a} active={attackTypes.includes(a)} onClick={() => toggle(attackTypes, setAttackTypes, a)}>
                {ATTACK_ICON[a] && <img src={ATTACK_ICON[a]} alt={a} style={{ width: 12, height: 12, objectFit: "contain" }} />}
                <span style={{ textTransform: "capitalize" }}>{a}</span>
              </FilterChip>
            ))}
          </div>
        </FilterSection>

        {/* Unit */}
        <FilterSection title="Unit">
          <select
            value={unitFilter}
            onChange={e => setUnitFilter(e.target.value)}
            style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: unitFilter ? "var(--hbr-silver)" : "var(--hbr-muted)", fontSize: 11, padding: "6px 8px", cursor: "pointer" }}
          >
            <option value="">All units</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.company})</option>
            ))}
          </select>
        </FilterSection>

        {/* Special */}
        <FilterSection title="Special">
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <FilterChip active={limitedOnly} onClick={() => setLimitedOnly(!limitedOnly)}>
              Limited only
            </FilterChip>
            <FilterChip active={resonanceOnly} onClick={() => setResonanceOnly(!resonanceOnly)}>
              Resonance Effect
            </FilterChip>
            <FilterChip active={unisonOnly} onClick={() => setUnisonOnly(!unisonOnly)}>
              Unison
            </FilterChip>
          </div>
        </FilterSection>

      </div>

      {/* ── GRID ── */}
      <div style={{ padding: 20, overflowY: "auto" }}>

        {/* Result count */}
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "var(--hbr-muted)", marginBottom: 14, letterSpacing: "0.08em" }}>
          {filtered.length} / {memorias.length} MEMORIAS
        </p>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--hbr-muted)", fontSize: 13 }}>
            No Memorias match your filters.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {filtered.map((m: any) => {
            const roleStyle  = ROLE_COLOR[m.role]       ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
            const elemColor  = ELEMENT_COLOR[m.element] ?? "#888";
            const elemIcon   = ELEMENT_ICON[m.element];
            const atkIcon    = ATTACK_ICON[m.attack_type];
            const rarityIcon = RARITY_ICON[m.rarity];
            const unitId     = m.units?.id;

            return (
              <Link key={m.id} href={unitId ? `/memoria/detail?id=${m.id}&from=${unitId}` : `/memoria/detail?id=${m.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 6, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}>

                  {/* Artwork strip */}
                  <div style={{ height: 120, background: m.rarity === "SS" || m.rarity === "SSR" ? "rgba(200,160,80,0.06)" : "rgba(120,100,200,0.06)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                    {m.image_url
                      ? <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                      : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: RARITY_COLOR[m.rarity] ?? "rgba(255,255,255,0.1)", opacity: 0.3 }}>{m.rarity}</span>
                        </div>
                    }
                    {/* Rarity icon — top right */}
                    {rarityIcon && (
                      <img src={rarityIcon} alt={m.rarity} style={{ position: "absolute", top: 8, right: 8, height: 40, objectFit: "contain" }} />
                    )}
                    {/* Limited badge */}
                    {m.is_limited && (
                      <span style={{ position: "absolute", top: 8, left: 8, fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "rgba(200,160,80,0.2)", color: "#C8A050", border: "0.5px solid rgba(200,160,80,0.3)" }}>LIMITED</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "10px 12px 12px", flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{m.name}</div>

                    {/* Unit name */}
                    {m.units && (
                      <div style={{ fontSize: 10, color: "var(--hbr-muted)", marginBottom: 7 }}>
                        {m.units.name} · {m.units.company}
                      </div>
                    )}

                    <div style={{ fontSize: 10, color: "var(--hbr-muted)", lineHeight: 1.5, marginBottom: 8 }}>
                      {m.skill_desc?.length > 60 ? m.skill_desc.slice(0, 60) + "..." : m.skill_desc}
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 2, background: roleStyle.bg, color: roleStyle.text, textTransform: "capitalize" }}>{m.role}</span>
                      {m.attack_type !== "none" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", textTransform: "capitalize" }}>
                          {atkIcon && <img src={atkIcon} alt={m.attack_type} style={{ width: 11, height: 11, objectFit: "contain" }} />}
                          {m.attack_type}
                        </span>
                      )}
                      {m.element !== "none" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: elemColor, textTransform: "capitalize" }}>
                          {elemIcon && <img src={elemIcon} alt={m.element} style={{ width: 11, height: 11, objectFit: "contain" }} />}
                          {m.element}
                        </span>
                      )}
                      {m.element2 && m.element2 !== "none" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: ELEMENT_COLOR[m.element2] ?? "#888", textTransform: "capitalize" }}>
                          {ELEMENT_ICON[m.element2] && <img src={ELEMENT_ICON[m.element2]} alt={m.element2} style={{ width: 11, height: 11, objectFit: "contain" }} />}
                          {m.element2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
