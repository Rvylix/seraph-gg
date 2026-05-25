"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { RARITY_ICON, RARITY_COLOR, ELEMENT_ICON, ELEMENT_COLOR, ROLE_COLOR } from "@/lib/icons";

// ── Memoria mini card in squad ────────────────────────────────
function MemoriaSlot({ memoria }: { memoria: any }) {
  if (!memoria) return (
    <div style={{ aspectRatio: "2/3", borderRadius: 6, background: "rgba(255,255,255,0.03)", border: "0.5px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 18, color: "rgba(255,255,255,0.1)" }}>+</span>
    </div>
  );

  const unitId = memoria.unit_id;
  return (
    <Link href={unitId ? `/memoria/detail?id=${memoria.id}&from=${unitId}` : `/memoria/detail?id=${memoria.id}`} style={{ textDecoration: "none" }}>
      <div style={{ position: "relative", aspectRatio: "2/3", borderRadius: 6, overflow: "hidden", background: memoria.rarity === "SS" || memoria.rarity === "SSR" ? "rgba(200,160,80,0.08)" : "rgba(120,100,200,0.08)", border: `0.5px solid ${memoria.rarity === "SS" || memoria.rarity === "SSR" ? "rgba(200,160,80,0.25)" : "rgba(120,100,200,0.2)"}`, cursor: "pointer" }}>
        {memoria.image_url
          ? <img src={memoria.image_url} alt={memoria.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: RARITY_COLOR[memoria.rarity] ?? "#fff", opacity: 0.5 }}>{memoria.rarity}</span>
            </div>
        }
        {RARITY_ICON[memoria.rarity] && <img src={RARITY_ICON[memoria.rarity]} alt={memoria.rarity} style={{ position: "absolute", top: 4, right: 4, height: 14, objectFit: "contain" }} />}
        {memoria.element && memoria.element !== "none" && ELEMENT_ICON[memoria.element] && (
          <img src={ELEMENT_ICON[memoria.element]} alt={memoria.element} style={{ position: "absolute", top: 4, left: 4, width: 14, height: 14, objectFit: "contain" }} />
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)", padding: "16px 4px 4px" }}>
          <div style={{ fontSize: 9, color: "#fff", textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 4px" }}>{memoria.name}</div>
        </div>
      </div>
    </Link>
  );
}

// ── Squad card ────────────────────────────────────────────────
function SquadCard({ squad }: { squad: any }) {
  const slots = (squad.squad_slots ?? []).sort((a: any, b: any) => a.slot_index - b.slot_index);
  return (
    <div style={{ background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 10px", borderBottom: "0.5px solid var(--hbr-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{squad.name}</span>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 2, background: "rgba(34,204,102,0.1)", color: "#22CC66", border: "0.5px solid rgba(34,204,102,0.2)" }}>PvE</span>
        </div>
        {(squad.description || squad.strategy_note) && (
          <p style={{ fontSize: 11, color: "var(--hbr-muted)", lineHeight: 1.5, marginBottom: 6 }}>{squad.description || squad.strategy_note}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "var(--hbr-muted)" }}>By {squad.submitted_by || squad.author_name}</span>
          <span style={{ fontSize: 9, color: "var(--hbr-muted)", opacity: 0.4 }}>·</span>
          <span style={{ fontSize: 9, color: "var(--hbr-muted)" }}>{new Date(squad.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>
      <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const slot = slots.find((s: any) => s.slot_index === i + 1);
          return <MemoriaSlot key={i} memoria={slot?.memorias ?? null} />;
        })}
      </div>
    </div>
  );
}

// ── Memoria picker slot in form ───────────────────────────────
function MemoriaPicker({ index, selected, memorias, onSelect }: { index: number; selected: any | null; memorias: any[]; onSelect: (m: any | null) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = memorias.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.units?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontSize: 9, color: "var(--hbr-muted)", marginBottom: 5 }}>Slot {index + 1}</div>

      {/* Selected or empty button */}
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--hbr-card)", border: `0.5px solid ${open ? "var(--hbr-red)" : "var(--hbr-border)"}`, borderRadius: 5, cursor: "pointer" }}>
        {selected ? (
          <>
            <div style={{ width: 28, height: 28, borderRadius: 3, overflow: "hidden", flexShrink: 0, background: "rgba(120,100,200,0.1)" }}>
              {selected.image_url
                ? <img src={selected.image_url} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 7, color: RARITY_COLOR[selected.rarity] ?? "#fff" }}>{selected.rarity}</span>
                  </div>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selected.name}</div>
              <div style={{ fontSize: 9, color: "var(--hbr-muted)" }}>{selected.units?.name ?? ""}</div>
            </div>
            <span onClick={e => { e.stopPropagation(); onSelect(null); }} style={{ fontSize: 14, color: "var(--hbr-muted)", flexShrink: 0, cursor: "pointer" }}>×</span>
          </>
        ) : (
          <span style={{ fontSize: 11, color: "var(--hbr-muted)" }}>Select Memoria...</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, marginTop: 4, background: "var(--hbr-surface)", border: "0.5px solid var(--hbr-border)", borderRadius: 6, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: 8 }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or unit..." style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "#fff", fontSize: 11, padding: "6px 10px", outline: "none" }} />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.slice(0, 30).map((m: any) => {
              const roleStyle = ROLE_COLOR[m.role] ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
              return (
                <div key={m.id} onClick={() => { onSelect(m); setOpen(false); setSearch(""); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", cursor: "pointer", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 32, height: 32, borderRadius: 3, overflow: "hidden", flexShrink: 0, background: "rgba(120,100,200,0.1)" }}>
                    {m.image_url
                      ? <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 8, color: RARITY_COLOR[m.rarity] ?? "#fff" }}>{m.rarity}</span>
                        </div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {RARITY_ICON[m.rarity] && <img src={RARITY_ICON[m.rarity]} alt={m.rarity} style={{ height: 10 }} />}
                      <span style={{ fontSize: 9, color: "var(--hbr-muted)" }}>{m.units?.name ?? ""}</span>
                      <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 2, background: roleStyle.bg, color: roleStyle.text, textTransform: "capitalize" }}>{m.role}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div style={{ padding: "12px 10px", fontSize: 11, color: "var(--hbr-muted)", textAlign: "center" }}>No results</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Submit form ───────────────────────────────────────────────
function SubmitForm({ memorias, onClose }: { memorias: any[]; onClose: () => void }) {
  const [name, setName]           = useState("");
  const [desc, setDesc]           = useState("");
  const [submitter, setSubmitter] = useState("");
  const [slots, setSlots]         = useState<(any | null)[]>(Array(6).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  async function submit() {
    if (!name.trim()) { setError("Squad name is required."); return; }
    if (!submitter.trim()) { setError("Your name is required."); return; }
    if (slots.every(s => !s)) { setError("Add at least one Memoria."); return; }
    setError(""); setSubmitting(true);

    const { data: squad, error: squadErr } = await supabase
      .from("squads")
      .insert({ name: name.trim(), purpose: "PvE General", description: desc.trim(), submitted_by: submitter.trim(), author_name: submitter.trim(), strategy_note: desc.trim(), tags: [], category: "pve", is_approved: false } as any)
      .select().single() as any;

    if (squadErr || !squad) { setError(`Failed to submit: ${squadErr?.message ?? "Unknown error"}`); setSubmitting(false); return; }

    const slotRows = slots
      .map((m, i) => {
        if (!m?.id) return null;
        return { squad_id: squad.id, slot_index: i + 1, memoria_id: m.id };
      })
      .filter(Boolean);

    if (slotRows.length === 0) { setError("Add at least one Memoria."); setSubmitting(false); return; }

    if (slotRows.length > 0) {
      const { error: slotErr } = await supabase.from("squad_slots").insert(slotRows as any);
      if (slotErr) { setError(`Slot error: ${slotErr.message}`); setSubmitting(false); return; }
    }

    setSubmitting(false); setDone(true);
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 24px" }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Squad submitted!</p>
      <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 24 }}>Pending review — will appear once approved.</p>
      <button onClick={onClose} style={{ fontSize: 12, padding: "8px 20px", borderRadius: 4, background: "var(--hbr-red)", color: "#fff", border: "none", cursor: "pointer" }}>Close</button>
    </div>
  );

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Submit a Squad</h2>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--hbr-muted)", cursor: "pointer", fontSize: 18 }}>×</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Squad Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fire DPS Build" style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "#fff", fontSize: 13, padding: "8px 12px", outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Your Name *</label>
          <input value={submitter} onChange={e => setSubmitter(e.target.value)} placeholder="e.g. Remy" style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "#fff", fontSize: 13, padding: "8px 12px", outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Strategy Notes</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="When to use, tips, etc." rows={2} style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "#fff", fontSize: 13, padding: "8px 12px", outline: "none", resize: "vertical" }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Memorias (up to 6)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <MemoriaPicker key={i} index={i} selected={slots[i]} memorias={memorias} onSelect={m => { const next = [...slots]; next[i] = m; setSlots(next); }} />
            ))}
          </div>
        </div>
        {error && <p style={{ fontSize: 12, color: "var(--hbr-red)" }}>{error}</p>}
        <button onClick={submit} disabled={submitting} style={{ background: "var(--hbr-red)", color: "#fff", border: "none", padding: "12px", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
          {submitting ? "Submitting..." : "Submit Squad"}
        </button>
        <p style={{ fontSize: 10, color: "var(--hbr-muted)", textAlign: "center" }}>Squads are reviewed before appearing publicly.</p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export function SquadsPage({ squads, memorias }: { squads: any[]; memorias: any[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase" }}>// PvE Builds</span>
          <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginTop: 4 }}>Click any Memoria to view its details</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "var(--hbr-red)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          + Submit Squad
        </button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--hbr-surface)", border: "0.5px solid var(--hbr-border)", borderRadius: 10, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
            <SubmitForm memorias={memorias} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {squads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--hbr-muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>⚔</div>
          <p style={{ fontSize: 14, marginBottom: 8 }}>No squads yet.</p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>Be the first to submit a squad build!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(560px, 1fr))", gap: 14 }}>
          {squads.map(squad => <SquadCard key={squad.id} squad={squad} />)}
        </div>
      )}
    </div>
  );
}
