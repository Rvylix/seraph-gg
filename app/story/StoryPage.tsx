"use client";
import { useState, useRef } from "react";

type Chapter = {
  id: string;
  chapter_number: number;
  title: string;
  subtitle: string | null;
  chapter_type: string;
  unlock_condition: string;
  spoiler_summary: string | null;
  image_url: string | null;
  is_released: boolean;
};

const TYPE_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  main:      { label: "Main Story", color: "#FF8080", bg: "rgba(204,34,34,0.12)",  border: "rgba(204,34,34,0.35)" },
  interlude: { label: "Interlude",  color: "#C8A050", bg: "rgba(200,160,80,0.12)", border: "rgba(200,160,80,0.35)" },
  side:      { label: "Side Story", color: "#80AAFF", bg: "rgba(34,100,204,0.12)", border: "rgba(34,100,204,0.35)" },
};

function ChapterCard({ chapter, position }: { chapter: Chapter; position: "top" | "bottom" }) {
  const [revealed, setRevealed] = useState(false);
  const typeStyle = TYPE_STYLE[chapter.chapter_type] ?? TYPE_STYLE.main;

  return (
    <div style={{
      width: 180,
      background: "var(--hbr-card)",
      border: `0.5px solid ${chapter.is_released ? typeStyle.border : "var(--hbr-border)"}`,
      borderRadius: 8, overflow: "hidden",
      opacity: chapter.is_released ? 1 : 0.5,
    }}>
      {/* Artwork */}
      <div style={{ height: 100, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${typeStyle.bg}, var(--hbr-surface))` }}>
        {chapter.image_url && (
          <img src={chapter.image_url} alt={chapter.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 6, left: 8 }}>
          <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: typeStyle.bg, color: typeStyle.color, fontWeight: 700, backdropFilter: "blur(4px)" }}>
            {typeStyle.label}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: 6, left: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: typeStyle.color, fontWeight: 700 }}>
            {chapter.chapter_type === "main" ? `CH ${String(chapter.chapter_number).padStart(2, "0")}` : `#${chapter.chapter_number}`}
          </span>
        </div>
        {!chapter.is_released && (
          <div style={{ position: "absolute", top: 6, right: 8 }}>
            <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: "rgba(0,0,0,0.6)", color: "var(--hbr-muted)" }}>Soon</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 2 }}>{chapter.title}</div>
        {chapter.subtitle && <div style={{ fontSize: 9, color: "var(--hbr-muted)", fontStyle: "italic", marginBottom: 4 }}>{chapter.subtitle}</div>}
        {chapter.spoiler_summary && chapter.is_released && (
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 9, color: "var(--hbr-muted)", lineHeight: 1.5, filter: revealed ? "none" : "blur(4px)", userSelect: revealed ? "auto" : "none", transition: "filter 0.3s", pointerEvents: revealed ? "auto" : "none", maxHeight: 48, overflow: "hidden" }}>
              {chapter.spoiler_summary}
            </div>
            {!revealed && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button onClick={() => setRevealed(true)} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, cursor: "pointer", background: "rgba(204,34,34,0.15)", color: "var(--hbr-red)", border: "0.5px solid rgba(204,34,34,0.3)", fontWeight: 600 }}>⚠ Spoiler</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineRow({ label, color, chapters }: { label: string; color: string; chapters: Chapter[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
  }

  if (chapters.length === 0) return null;

  const CARD_H  = 200;
  const GAP     = 20;
  const DOT     = 10;
  const TOTAL   = CARD_H + GAP + DOT + GAP + CARD_H + 32;

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: color }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.15em", color, textTransform: "uppercase" }}>{label}</span>
          <span style={{ fontSize: 10, color: "var(--hbr-muted)", fontFamily: "monospace" }}>{chapters.length} chapters</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => scroll("left")} style={{ width: 28, height: 28, borderRadius: 4, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", color: "var(--hbr-muted)", cursor: "pointer", fontSize: 12 }}>←</button>
          <button onClick={() => scroll("right")} style={{ width: 28, height: 28, borderRadius: 4, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", color: "var(--hbr-muted)", cursor: "pointer", fontSize: 12 }}>→</button>
        </div>
      </div>

      {/* Scrollable timeline */}
      <div style={{ height: TOTAL, position: "relative" }}>
        <div ref={scrollRef} style={{ position: "absolute", inset: 0, overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, position: "relative", minWidth: "max-content", height: "100%" }}>
          {chapters.map((c, i) => {
            const isTop = i % 2 === 0;
            return (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 200, flexShrink: 0 }}>

                {/* Top card */}
                <div style={{ height: CARD_H, display: "flex", alignItems: "flex-end", paddingBottom: 0 }}>
                  {isTop ? <ChapterCard chapter={c} position="top" /> : <div style={{ width: 180 }} />}
                </div>

                {/* Connector from card to dot */}
                <div style={{ width: 1, height: GAP, background: isTop ? `${color}66` : "transparent" }} />

                {/* Center dot + line */}
                <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: DOT }}>
                  {/* Left line segment */}
                  <div style={{ position: "absolute", left: 0, right: "50%", height: 2, background: `${color}33`, top: "50%", transform: "translateY(-50%)" }} />
                  {/* Right line segment */}
                  <div style={{ position: "absolute", left: "50%", right: 0, height: 2, background: `${color}33`, top: "50%", transform: "translateY(-50%)" }} />
                  {/* Dot */}
                  <div style={{ width: DOT, height: DOT, borderRadius: "50%", background: c.is_released ? color : "var(--hbr-border)", border: `2px solid var(--hbr-bg)`, zIndex: 2, position: "relative", flexShrink: 0 }} />
                </div>

                {/* Connector from dot to bottom card */}
                <div style={{ width: 1, height: GAP, background: !isTop ? `${color}66` : "transparent" }} />

                {/* Bottom card */}
                <div style={{ height: CARD_H, display: "flex", alignItems: "flex-start", paddingTop: 0 }}>
                  {!isTop ? <ChapterCard chapter={c} position="bottom" /> : <div style={{ width: 180 }} />}
                </div>

              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}

export function StoryPage({ chapters }: { chapters: Chapter[] }) {
  const main      = chapters.filter(c => c.chapter_type === "main");
  const interlude = chapters.filter(c => c.chapter_type === "interlude");
  const side      = chapters.filter(c => c.chapter_type === "side");

  return (
    <div style={{ padding: "28px 24px", overflowX: "hidden" }}>
      <TimelineRow label="Main Story" color="#FF8080" chapters={main} />
      <TimelineRow label="Interlude"  color="#C8A050" chapters={interlude} />
      <TimelineRow label="Side Story" color="#80AAFF" chapters={side} />
      {chapters.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--hbr-muted)" }}>
          <p style={{ fontSize: 13 }}>No chapters added yet.</p>
        </div>
      )}
    </div>
  );
}
