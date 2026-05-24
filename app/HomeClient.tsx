"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RARITY_ICON, RARITY_COLOR, ELEMENT_ICON, ELEMENT_COLOR, ATTACK_ICON, ROLE_COLOR } from "@/lib/icons";

// ── Countdown hook ────────────────────────────────────────────
function useCountdown(target: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    function calc() {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [target]);
  return timeLeft;
}

// ── Event card ────────────────────────────────────────────────
function EventCard({ event }: { event: any }) {
  const isLive     = event.status === "live";
  const countdown  = useCountdown(isLive ? event.ends_at : event.starts_at);
  const statusColor = isLive ? "#22CC66" : "#C8A050";
  const statusBg    = isLive ? "rgba(34,204,102,0.12)" : "rgba(200,160,80,0.12)";

  return (
    <Link href="/events" style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--hbr-card)",
        border: `0.5px solid ${isLive ? "rgba(34,204,102,0.25)" : "var(--hbr-border)"}`,
        borderLeft: `3px solid ${statusColor}`,
        borderRadius: 8, padding: "14px 16px", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.3, flex: 1 }}>{event.name}</span>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 2, background: statusBg, color: statusColor, fontWeight: 700, flexShrink: 0 }}>
            {isLive ? "LIVE" : "SOON"}
          </span>
        </div>
        {event.rewards?.slice(0, 2).map((r: string, i: number) => (
          <span key={i} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", marginRight: 4 }}>{r}</span>
        ))}
        <div style={{ fontFamily: "monospace", fontSize: 11, color: statusColor, marginTop: 8 }}>
          {isLive ? "⏱ Ends in " : "⏱ Starts in "}{countdown}
        </div>
      </div>
    </Link>
  );
}

// ── Memoria card ──────────────────────────────────────────────
function MemoriaCard({ m }: { m: any }) {
  const roleStyle  = ROLE_COLOR[m.role]       ?? { bg: "rgba(255,255,255,0.05)", text: "#888" };
  const elemColor  = ELEMENT_COLOR[m.element] ?? "#888";
  const elemIcon   = ELEMENT_ICON[m.element];
  const atkIcon    = ATTACK_ICON[m.attack_type];
  const rarityIcon = RARITY_ICON[m.rarity];
  const unitId     = m.units?.id;

  return (
    <Link href={unitId ? `/memoria/detail?id=${m.id}&from=${unitId}` : `/memoria/detail?id=${m.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)",
        borderRadius: 8, overflow: "hidden", cursor: "pointer",
      }}>
        {/* Artwork */}
        <div style={{ height: 100, position: "relative", overflow: "hidden", background: m.rarity === "SS" || m.rarity === "SSR" ? "rgba(200,160,80,0.06)" : "rgba(120,100,200,0.06)" }}>
          {m.image_url
            ? <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: RARITY_COLOR[m.rarity] ?? "#fff", opacity: 0.3 }}>{m.rarity}</span>
              </div>
          }
          {rarityIcon && <img src={rarityIcon} alt={m.rarity} style={{ position: "absolute", top: 6, right: 6, height: 14, objectFit: "contain" }} />}
        </div>
        {/* Info */}
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
          {m.units && <div style={{ fontSize: 9, color: "var(--hbr-muted)", marginBottom: 5 }}>{m.units.name}</div>}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 2, background: roleStyle.bg, color: roleStyle.text, textTransform: "capitalize" }}>{m.role}</span>
            {m.element !== "none" && elemIcon && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 8, padding: "1px 5px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: elemColor, textTransform: "capitalize" }}>
                <img src={elemIcon} alt={m.element} style={{ width: 9, height: 9, objectFit: "contain" }} />{m.element}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Chapter pill ──────────────────────────────────────────────
function ChapterPill({ chapter, type }: { chapter: any; type: "previous" | "current" | "upcoming" }) {
  const styles = {
    previous: { label: "Previous",    border: "var(--hbr-border)", bg: "var(--hbr-card)",    numColor: "var(--hbr-muted)",   titleColor: "var(--hbr-muted)",   opacity: 0.6 },
    current:  { label: "Current",     border: "var(--hbr-red)",   bg: "rgba(204,34,34,0.08)", numColor: "var(--hbr-red)",    titleColor: "#fff",               opacity: 1   },
    upcoming: { label: "Coming Soon", border: "var(--hbr-border)", bg: "var(--hbr-card)",    numColor: "var(--hbr-muted)",   titleColor: "var(--hbr-silver)",  opacity: 0.75},
  }[type];

  return (
    <Link href="/story" style={{ textDecoration: "none", flex: 1 }}>
      <div style={{
        background: styles.bg, border: `0.5px solid ${styles.border}`,
        borderRadius: 8, padding: "14px 16px", opacity: styles.opacity,
        position: "relative", overflow: "hidden", cursor: "pointer",
        height: "100%",
      }}>
        {chapter.image_url && (
          <>
            <img src={chapter.image_url} alt={chapter.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--hbr-card) 30%, transparent 100%)" }} />
          </>
        )}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: styles.numColor, marginBottom: 6, fontFamily: "monospace" }}>
            {styles.label}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: styles.numColor, marginBottom: 4 }}>
            CH {String(chapter.chapter_number).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: styles.titleColor, lineHeight: 1.3 }}>
            {chapter.title}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Section header ────────────────────────────────────────────
function SectionHeader({ label, href, count }: { label: string; href: string; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase" }}>
        // {label}
      </span>
      <Link href={href} style={{ fontSize: 11, color: "var(--hbr-muted)", textDecoration: "none" }}>
        View all {count != null ? `(${count})` : ""}→
      </Link>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function HomeClient({ chapters, newMemorias, events }: { chapters: any[]; newMemorias: any[]; events: any[] }) {
  // Find current chapter — last released one
  const released = chapters.filter(c => c.is_released);
  const currentIdx = released.length - 1;
  const current  = released[currentIdx];
  const previous = released[currentIdx - 1] ?? null;
  const upcoming = chapters.find(c => !c.is_released) ?? null;

  const liveEvents     = events.filter(e => e.status === "live");
  const upcomingEvents = events.filter(e => e.status === "upcoming");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

      {/* ── HERO ── */}
      <div style={{
        position: "relative", borderRadius: 12, overflow: "hidden",
        background: "var(--hbr-surface)", border: "0.5px solid var(--hbr-border)",
        padding: "48px 40px", marginBottom: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(204,34,34,0.08) 0%, transparent 60%)" }} />

        {/* Left — text content */}
        <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 12 }}>// Heaven Burns Red — Global</p>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
            Fight. Survive.<br /><span style={{ color: "var(--hbr-red)" }}>Never Burn Out.</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--hbr-muted)", marginBottom: 24, maxWidth: 480 }}>
            Memoria database · Event tracker · Unit profiles · Story guide
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/memoria" className="hbr-btn-primary">Browse Memoria DB</Link>
            <Link href="/units" className="hbr-btn-outline">View All Units</Link>
          </div>
        </div>

        {/* Right — HBR game logo */}
        <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
          <img
            src="https://fesdcaexwcslmwipzzln.supabase.co/storage/v1/object/public/assets/logo/HBR-Logo.png"
            alt="Heaven Burns Red"
            style={{ height: 140, objectFit: "contain", filter: "drop-shadow(0 0 24px rgba(204,34,34,0.3))" }}
          />
        </div>
      </div>

      {/* ── MAIN STORY ── */}
      {chapters.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <SectionHeader label="Main Story Progress" href="/story" />
          <div style={{ display: "flex", gap: 12 }}>
            {previous && <ChapterPill chapter={previous} type="previous" />}
            {current  && <ChapterPill chapter={current}  type="current" />}
            {upcoming && <ChapterPill chapter={upcoming} type="upcoming" />}
            {!previous && !current && !upcoming && (
              <p style={{ color: "var(--hbr-muted)", fontSize: 13 }}>No chapters added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* ── EVENTS ── */}
      {events.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <SectionHeader label="Events" href="/events" count={events.length} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {liveEvents.map(e => <EventCard key={e.id} event={e} />)}
            {upcomingEvents.slice(0, 3).map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}

      {/* ── NEW MEMORIAS ── */}
      {newMemorias.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <SectionHeader label="New Memorias" href="/memoria" count={newMemorias.length} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {newMemorias.map(m => <MemoriaCard key={m.id} m={m} />)}
          </div>
        </div>
      )}

    </div>
  );
}
