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

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const [expanded, setExpanded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const typeStyle = TYPE_STYLE[chapter.chapter_type] ?? TYPE_STYLE.main;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        width: 180,
        background: "var(--hbr-card)",
        border: `0.5px solid ${expanded ? typeStyle.color : chapter.is_released ? typeStyle.border : "var(--hbr-border)"}`,
        borderRadius: 8,
        overflow: "hidden",
        opacity: chapter.is_released ? 1 : 0.5,
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {/* Artwork */}
      <div style={{ height: 110, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${typeStyle.bg}, var(--hbr-surface))` }}>
        {chapter.image_url && (
          <img src={chapter.image_url} alt={chapter.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: typeStyle.bg, color: typeStyle.color, fontWeight: 700, backdropFilter: "blur(4px)" }}>
            {typeStyle.label}
          </span>
        </div>
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
        <div style={{ position: "absolute", bottom: 8, left: 10 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: typeStyle.color, fontWeight: 700 }}>
            {chapter.chapter_type === "main" ? `CH ${String(chapter.chapter_number).padStart(2, "0")}` : `#${chapter.chapter_number}`}
          </span>
        </div>
        {!chapter.is_released && (
          <div style={{ position: "absolute", bottom: 8, right: 8 }}>
            <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: "rgba(0,0,0,0.6)", color: "var(--hbr-muted)" }}>Soon</span>
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 2 }}>{chapter.title}</div>
        {chapter.subtitle && (
          <div style={{ fontSize: 9, color: "var(--hbr-muted)", fontStyle: "italic" }}>{chapter.subtitle}</div>
        )}

        {/* Expanded — spoiler */}
        {expanded && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "0.5px solid var(--hbr-border)" }} onClick={e => e.stopPropagation()}>
            {chapter.is_released && chapter.spoiler_summary ? (
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 11, color: "var(--hbr-muted)", lineHeight: 1.6, filter: revealed ? "none" : "blur(5px)", userSelect: revealed ? "auto" : "none", transition: "filter 0.3s", pointerEvents: revealed ? "auto" : "none" }}>
                  {chapter.spoiler_summary}
                </div>
                {!revealed && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <button onClick={() => setRevealed(true)} style={{ fontSize: 9, padding: "4px 12px", borderRadius: 3, cursor: "pointer", background: "rgba(204,34,34,0.15)", color: "var(--hbr-red)", border: "0.5px solid rgba(204,34,34,0.3)", fontWeight: 600 }}>⚠ Reveal</button>
                  </div>
                )}
                {revealed && (
                  <button onClick={() => setRevealed(false)} style={{ marginTop: 6, fontSize: 9, padding: "2px 8px", borderRadius: 3, cursor: "pointer", background: "transparent", color: "var(--hbr-muted)", border: "0.5px solid var(--hbr-border)", display: "block" }}>Hide</button>
                )}
              </div>
            ) : (
              <p style={{ fontSize: 11, color: "var(--hbr-muted)" }}>
                {!chapter.is_released ? "Not yet released in Global." : "No summary added yet."}
              </p>
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

      {/* CSS grid alternating layout */}
      <div ref={scrollRef} style={{ overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{
          display: "grid",
          gridTemplateRows: "1fr 24px 1fr",
          gridAutoColumns: "200px",
          gridAutoFlow: "column",
          minWidth: "max-content",
        }}>
          {chapters.map((c, i) => {
            const isTop = i % 2 === 0;
            return [
              /* Top cell */
              <div key={`top-${c.id}`} style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8, paddingRight: 10 }}>
                {isTop ? <ChapterCard chapter={c} /> : null}
              </div>,

              /* Middle — dot + line */
              <div key={`mid-${c.id}`} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `${color}33`, transform: "translateY(-50%)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.is_released ? color : "var(--hbr-border)", border: "2px solid var(--hbr-bg)", zIndex: 2, position: "relative" }} />
              </div>,

              /* Bottom cell */
              <div key={`bot-${c.id}`} style={{ display: "flex", alignItems: "flex-start", paddingTop: 8, paddingRight: 10 }}>
                {!isTop ? <ChapterCard chapter={c} /> : null}
              </div>,
            ];
          })}
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
    <div style={{ padding: "28px 24px" }}>
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
