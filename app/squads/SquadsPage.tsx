"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { RARITY_ICON, RARITY_COLOR, ELEMENT_ICON, ELEMENT_COLOR, ROLE_COLOR } from "@/lib/icons";

// ── Memoria mini card ─────────────────────────────────────────
function MemoriaSlot({ memoria }: { memoria: any }) {
  if (!memoria) return (
    <div style={{ aspectRatio: "1", borderRadius: 6, background: "rgba(255,255,255,0.03)", border: "0.5px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 18, color: "rgba(255,255,255,0.1)" }}>+</span>
    </div>
  );

  const roleStyle = ROLE_COLOR[memoria.role] ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
  const elemColor = ELEMENT_COLOR[memoria.element] ?? "#888";
  const elemIcon  = ELEMENT_ICON[memoria.element];
  const unitId    = memoria.units?.id ?? memoria.unit_id;

  return (
    <Link href={unitId ? `/memoria/detail?id=${memoria.id}&from=${unitId}` : `/memoria/detail?id=${memoria.id}`} style={{ textDecoration: "none" }}>
      <div style={{ position: "relative", aspectRatio: "1", borderRadius: 6, overflow: "hidden", background: memoria.rarity === "SS" || memoria.rarity === "SSR" ? "rgba(200,160,80,0.08)" : "rgba(120,100,200,0.08)", border: `0.5px solid ${memoria.rarity === "SS" || memoria.rarity === "SSR" ? "rgba(200,160,80,0.25)" : "rgba(120,100,200,0.2)"}`, cursor: "pointer" }}>
        {memoria.image_url
          ? <img src={memoria.image_url} alt={memoria.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: RARITY_COLOR[memoria.rarity] ?? "#fff", opacity: 0.5 }}>{memoria.rarity}</span>
            </div>
        }
        {/* Rarity icon */}
        {RARITY_ICON[memoria.rarity] && (
          <img src={RARITY_ICON[memoria.rarity]} alt={memoria.rarity} style={{ position: "absolute", top: 4, right: 4, height: 14, objectFit: "contain" }} />
        )}
        {/* Element icon */}
        {memoria.element && memoria.element !== "none" && elemIcon && (
          <img src={elemIcon} alt={memoria.element} style={{ position: "absolute", top: 4, left: 4, width: 14, height: 14, objectFit: "contain" }} />
        )}
        {/* Bottom name */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)", padding: "16px 4px 4px" }}>
          <div style={{ fontSize: 8, color: "#fff", textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 2px" }}>
            {memoria.name}
          </div>
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
      {/* Header */}
      <div style={{ padding: "14px 16px 10px", borderBottom: "0.5px solid var(--hbr-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{squad.name}</span>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 2, background: "rgba(34,204,102,0.1)", color: "#22CC66", border: "0.5px solid rgba(34,204,102,0.2)" }}>
            PvE
          </span>
        </div>
        {squad.description && (
          <p style={{ fontSize: 11, color: "var(--hbr-muted)", lineHeight: 1.5, marginBottom: 6 }}>{squad.description}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.05em" }}>
            By {squad.submitted_by}
          </span>
          <span style={{ fontSize: 9, color: "var(--hbr-muted)", opacity: 0.4 }}>·</span>
          <span style={{ fontSize: 9, color: "var(--hbr-muted)" }}>
            {new Date(squad.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Memoria grid — 6 slots */}
      <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const slot = slots.find((s: any) => s.slot_index === i);
          return <MemoriaSlot key={i} memoria={slot?.memorias ?? null} />;
        })}
      </div>

      {/* Slot notes */}
      {slots.some((s: any) => s.notes) && (
        <div style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {slots.filter((s: any) => s.notes).map((s: any) => (
            <div key={s.id} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <span style={{ fontSize: 9, color: "var(--hbr-red)", flexShrink: 0, marginTop: 1 }}>Slot {s.slot_index + 1}</span>
              <span style={{ fontSize: 11, color: "var(--hbr-muted)", lineHeight: 1.5 }}>{s.notes}</span>
            </div>
          ))}
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
  const [slots, setSlots]         = useState<(string | null)[]>(Array(6).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  function setSlot(i: number, val: string) {
    const next = [...slots];
    next[i] = val || null;
    setSlots(next);
  }

  async function submit() {
    if (!name.trim()) { setError("Squad name is required."); return; }
    if (!submitter.trim()) { setError("Your name is required."); return; }
    if (slots.every(s => !s)) { setError("Add at least one Memoria."); return; }
    setError("");
    setSubmitting(true);

    const { data: squad, error: squadErr } = await supabase
      .from("squads")
      .insert({ name: name.trim(), description: desc.trim(), submitted_by: submitter.trim(), category: "pve", is_approved: false } as any)
      .select().single() as any;

    if (squadErr || !squad) { setError(`Failed to submit: ${squadErr?.message ?? "Unknown error"}`); setSubmitting(false); return; }

    const slotRows = slots
      .map((memoriaId, i) => ({ squad_id: squad.id, slot_index: i, memoria_id: memoriaId || null }))
      .filter(s => s.memoria_id);

    if (slotRows.length > 0) {
      await supabase.from("squad_slots").insert(slotRows as any);
    }

    setSubmitting(false);
    setDone(true);
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 24px" }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Squad submitted!</p>
      <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 24 }}>Your squad is pending review and will appear once approved.</p>
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
        {/* Name */}
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Squad Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fire DPS Build" style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "#fff", fontSize: 13, padding: "8px 12px", outline: "none" }} />
        </div>

        {/* Your name */}
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Your Name *</label>
          <input value={submitter} onChange={e => setSubmitter(e.target.value)} placeholder="e.g. Remy" style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "#fff", fontSize: 13, padding: "8px 12px", outline: "none" }} />
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Strategy notes, when to use, etc." rows={2} style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: "#fff", fontSize: 13, padding: "8px 12px", outline: "none", resize: "vertical" }} />
        </div>

        {/* Memoria slots */}
        <div>
          <label style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Memorias (up to 6)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div style={{ fontSize: 9, color: "var(--hbr-muted)", marginBottom: 4 }}>Slot {i + 1}</div>
                <select
                  value={slots[i] ?? ""}
                  onChange={e => setSlot(i, e.target.value)}
                  style={{ width: "100%", background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", borderRadius: 4, color: slots[i] ? "#fff" : "var(--hbr-muted)", fontSize: 11, padding: "6px 8px", cursor: "pointer" }}
                >
                  <option value="">— Empty —</option>
                  {(memorias as any[]).map((m: any) => (
                    <option key={m.id} value={m.id}>{m.rarity} · {m.name} ({m.units?.name ?? "—"})</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p style={{ fontSize: 12, color: "var(--hbr-red)" }}>{error}</p>}

        {/* Submit */}
        <button onClick={submit} disabled={submitting} style={{ background: "var(--hbr-red)", color: "#fff", border: "none", padding: "12px", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.6 : 1, letterSpacing: "0.05em" }}>
          {submitting ? "Submitting..." : "Submit Squad"}
        </button>

        <p style={{ fontSize: 10, color: "var(--hbr-muted)", textAlign: "center" }}>
          Squads are reviewed before appearing publicly.
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export function SquadsPage({ squads, memorias }: { squads: any[]; memorias: any[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase" }}>// PvE Builds</span>
          <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginTop: 4 }}>Click any Memoria to view its details</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "var(--hbr-red)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          + Submit Squad
        </button>
      </div>

      {/* Submit form modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--hbr-surface)", border: "0.5px solid var(--hbr-border)", borderRadius: 10, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
            <SubmitForm memorias={memorias} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Squads grid */}
      {squads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--hbr-muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>⚔</div>
          <p style={{ fontSize: 14, marginBottom: 8 }}>No squads yet.</p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>Be the first to submit a squad build!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
          {squads.map(squad => (
            <SquadCard key={squad.id} squad={squad} />
          ))}
        </div>
      )}

    </div>
  );
}
