"use client";
import { useState } from "react";

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

const TYPE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  main:       { label: "Main Story",  color: "#FF8080", bg: "rgba(204,34,34,0.15)" },
  interlude:  { label: "Interlude",   color: "#C8A050", bg: "rgba(200,160,80,0.15)" },
  side:       { label: "Side Story",  color: "#80AAFF", bg: "rgba(34,100,204,0.15)" },
};

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const [revealed, setRevealed] = useState(false);
  const typeStyle = TYPE_STYLE[chapter.chapter_type] ?? TYPE_STYLE.main;

  return (
    <div style={{
      background: "var(--hbr-card)",
      border: "0.5px solid var(--hbr-border)",
      borderLeft: `3px solid ${typeStyle.color}`,
      borderRadius: 8, overflow: "hidden",
      opacity: chapter.is_released ? 1 : 0.45,
    }}>
      {/* Chapter artwork */}
      {chapter.image_url && (
        <div style={{ height: 120, overflow: "hidden", position: "relative" }}>
          <img src={chapter.image_url} alt={chapter.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--hbr-card) 0%, transparent 60%)" }} />
        </div>
      )}

      <div style={{ padding: "16px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              {/* Chapter number */}
              <span style={{
                fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                color: typeStyle.color, letterSpacing: "0.05em",
              }}>
                {chapter.chapter_type === "main"
                  ? `CH ${String(chapter.chapter_number).padStart(2, "0")}`
                  : `${typeStyle.label} ${chapter.chapter_number}`}
              </span>
              {/* Type badge */}
              <span style={{
                fontSize: 9, padding: "2px 7px", borderRadius: 2,
                background: typeStyle.bg, color: typeStyle.color,
              }}>
                {typeStyle.label}
              </span>
              {/* Not released badge */}
              {!chapter.is_released && (
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)" }}>
                  Coming Soon
                </span>
              )}
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3, lineHeight: 1.3 }}>
              {chapter.title}
            </h3>
            {chapter.subtitle && (
              <p style={{ fontSize: 11, color: "var(--hbr-muted)", fontStyle: "italic" }}>{chapter.subtitle}</p>
            )}
          </div>
        </div>

        {/* Unlock condition */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: chapter.spoiler_summary ? 14 : 0 }}>
          <span style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Unlock</span>
          <span style={{ fontSize: 11, color: "var(--hbr-silver)" }}>{chapter.unlock_condition}</span>
        </div>

        {/* Spoiler summary — blurred until revealed */}
        {chapter.spoiler_summary && chapter.is_released && (
          <div style={{ position: "relative", marginTop: 4 }}>
            <div style={{
              fontSize: 12, color: "var(--hbr-muted)", lineHeight: 1.7,
              filter: revealed ? "none" : "blur(6px)",
              userSelect: revealed ? "auto" : "none",
              transition: "filter 0.3s ease",
              pointerEvents: revealed ? "auto" : "none",
            }}>
              {chapter.spoiler_summary}
            </div>
            {!revealed && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <button onClick={() => setRevealed(true)} style={{
                  fontSize: 11, padding: "6px 16px", borderRadius: 4, cursor: "pointer",
                  background: "rgba(204,34,34,0.15)", color: "var(--hbr-red)",
                  border: "0.5px solid rgba(204,34,34,0.3)", letterSpacing: "0.05em",
                  fontWeight: 600,
                }}>
                  ⚠ Reveal Spoiler
                </button>
              </div>
            )}
            {revealed && (
              <button onClick={() => setRevealed(false)} style={{
                marginTop: 8, fontSize: 10, padding: "3px 10px", borderRadius: 3, cursor: "pointer",
                background: "transparent", color: "var(--hbr-muted)",
                border: "0.5px solid var(--hbr-border)", letterSpacing: "0.05em",
              }}>
                Hide spoiler
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function StoryPage({ chapters }: { chapters: Chapter[] }) {
  const [filter, setFilter] = useState<"all" | "main" | "interlude" | "side">("all");

  const main      = chapters.filter(c => c.chapter_type === "main");
  const interlude = chapters.filter(c => c.chapter_type === "interlude");
  const side      = chapters.filter(c => c.chapter_type === "side");
  const filtered  = filter === "all" ? chapters
    : filter === "main"      ? main
    : filter === "interlude" ? interlude
    : side;

  const tabs = [
    { key: "all",       label: "All",        count: chapters.length },
    { key: "main",      label: "Main Story", count: main.length },
    { key: "interlude", label: "Interlude",  count: interlude.length },
    { key: "side",      label: "Side Story", count: side.length },
  ];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--hbr-border)", background: "var(--hbr-surface)", position: "sticky", top: 49, zIndex: 10 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key as any)} style={{
            fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "10px 20px", cursor: "pointer", background: "transparent", border: "none",
            borderBottom: filter === t.key ? "2px solid var(--hbr-red)" : "2px solid transparent",
            color: filter === t.key ? "var(--hbr-red)" : "var(--hbr-muted)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {t.label}
            <span style={{
              fontSize: 9, padding: "1px 5px", borderRadius: 2,
              background: filter === t.key ? "var(--hbr-red)" : "rgba(255,255,255,0.08)",
              color: filter === t.key ? "#fff" : "var(--hbr-muted)",
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Chapter grid */}
      <div style={{ padding: 24 }}>
        {chapters.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--hbr-muted)" }}>
            <p style={{ fontSize: 13 }}>No chapters added yet.</p>
            <p style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>Add chapters in Supabase → story_chapters table.</p>
          </div>
        )}
        <div className="story-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
          {filtered.map(chapter => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </div>
  );
}
