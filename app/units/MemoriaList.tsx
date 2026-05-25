"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ELEMENT_ICON, ELEMENT_COLOR, ATTACK_ICON, ROLE_COLOR, RARITY_ICON, RARITY_COLOR } from "@/lib/icons";

const RARITY_ORDER: Record<string, number> = { A: 1, S: 2, SS: 3, SSR: 4 };

export function MemoriaList({ memorias, unitId }: { memorias: any[]; unitId: string }) {
  const [rarityFilter, setRarityFilter] = useState<string>("All");
  const [sortDate, setSortDate]         = useState<"newest" | "oldest">("oldest");

  const rarities = ["All", "A", "S", "SS", "SSR"];

  const filtered = useMemo(() => {
    let list = [...memorias];
    if (rarityFilter !== "All") list = list.filter(m => m.rarity === rarityFilter);
    list.sort((a, b) => {
      if (sortDate === "newest") {
        // newest released_at first, nulls last
        if (!a.released_at && !b.released_at) return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
        if (!a.released_at) return 1;
        if (!b.released_at) return -1;
        return new Date(b.released_at).getTime() - new Date(a.released_at).getTime();
      } else {
        // A → SSR by rarity_order, then name
        return (a.rarity_order ?? RARITY_ORDER[a.rarity] ?? 0) - (b.rarity_order ?? RARITY_ORDER[b.rarity] ?? 0) || a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [memorias, rarityFilter, sortDate]);

  return (
    <>
      {/* Filter + sort row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase" }}>
          // Memorias
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {/* Rarity filter */}
          {rarities.map(r => (
            <button key={r} onClick={() => setRarityFilter(r)} style={{
              fontSize: 9, padding: "3px 8px", borderRadius: 3, cursor: "pointer",
              background: rarityFilter === r ? "var(--hbr-red-glow)" : "transparent",
              border: `0.5px solid ${rarityFilter === r ? "var(--hbr-red)" : "rgba(200,200,216,0.1)"}`,
              color: rarityFilter === r ? "var(--hbr-red)" : "var(--hbr-muted)",
              display: "inline-flex", alignItems: "center", gap: 3,
            }}>
              {r !== "All" && RARITY_ICON[r] && <img src={RARITY_ICON[r]} alt={r} style={{ height: 10, objectFit: "contain" }} />}
              {r}
            </button>
          ))}
          {/* Sort */}
          <select
            value={sortDate}
            onChange={e => setSortDate(e.target.value as any)}
            style={{ fontSize: 9, padding: "3px 8px", borderRadius: 3, background: "var(--hbr-card)", border: "0.5px solid rgba(200,200,216,0.1)", color: "var(--hbr-muted)", cursor: "pointer" }}
          >
            <option value="oldest">Rarity: A → SSR</option>
            <option value="newest">Released: Newest first</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <p style={{ fontSize: 10, color: "var(--hbr-muted)", fontFamily: "monospace", marginBottom: 10 }}>
        {filtered.length} / {memorias.length} memorias
      </p>

      {/* Memoria cards */}
      {filtered.length === 0 ? (
        <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 28 }}>No Memorias match.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {filtered.map((m: any) => {
            const roleStyle  = ROLE_COLOR[m.role] ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
            const elemColor  = ELEMENT_COLOR[m.element] ?? "#888";
            const elemIcon   = ELEMENT_ICON[m.element];
            const atkIcon    = ATTACK_ICON[m.attack_type];
            const rarityIcon = RARITY_ICON[m.rarity];

            return (
              <Link key={m.id} href={`/memoria/detail?id=${m.id}&from=${unitId}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", alignItems: "center", gap: 14, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 6, padding: "12px 14px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 6, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 13, fontWeight: 700, background: m.rarity === "SS" || m.rarity === "SSR" ? "rgba(200,160,80,0.12)" : "rgba(120,100,200,0.12)", color: RARITY_COLOR[m.rarity] ?? "#fff", border: `0.5px solid ${m.rarity === "SS" || m.rarity === "SSR" ? "rgba(200,160,80,0.3)" : "rgba(120,100,200,0.3)"}` }}>
                    {m.image_url ? <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : m.rarity}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      {rarityIcon && <img src={rarityIcon} alt={m.rarity} style={{ height: 16, objectFit: "contain", flexShrink: 0 }} />}
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{m.name}</span>
                      {m.is_limited && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 2, background: "rgba(200,160,80,0.1)", color: "#C8A050", flexShrink: 0 }}>Limited</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--hbr-muted)", lineHeight: 1.5, marginBottom: 6 }}>{m.skill_desc}</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 2, background: roleStyle.bg, color: roleStyle.text, textTransform: "capitalize" }}>{m.role}</span>
                      {m.attack_type !== "none" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, padding: "2px 7px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", textTransform: "capitalize" }}>
                          {atkIcon && <img src={atkIcon} alt={m.attack_type} style={{ width: 11, height: 11, objectFit: "contain" }} />}
                          {m.attack_type}
                        </span>
                      )}
                      {m.element !== "none" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, padding: "2px 7px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: elemColor, textTransform: "capitalize" }}>
                          {elemIcon && <img src={elemIcon} alt={m.element} style={{ width: 11, height: 11, objectFit: "contain" }} />}
                          {m.element}
                        </span>
                      )}
                      {m.element2 && m.element2 !== "none" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, padding: "2px 7px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: ELEMENT_COLOR[m.element2] ?? "#888", textTransform: "capitalize" }}>
                          {ELEMENT_ICON[m.element2] && <img src={ELEMENT_ICON[m.element2]} alt={m.element2} style={{ width: 11, height: 11, objectFit: "contain" }} />}
                          {m.element2}
                        </span>
                      )}
                      {m.released_at && (
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 2, background: "rgba(34,204,102,0.1)", color: "#22CC66" }}>
                          {new Date(m.released_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
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
    </>
  );
}
