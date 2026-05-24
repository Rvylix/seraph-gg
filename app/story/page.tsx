import { supabase } from "@/lib/supabase";
import { StoryPage } from "./StoryPage";

export const dynamic = "force-dynamic";

export default async function Story() {
  const { data: chapters, error } = await supabase
    .from("story_chapters")
    .select("*")
    .order("chapter_number");

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>
      <div style={{
        position: "relative", height: 200, overflow: "hidden",
        background: "var(--hbr-surface)", borderBottom: "0.5px solid var(--hbr-border)",
      }}>
        <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(204,34,34,0.08) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "40px 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 10 }}>// Main Story</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1 }}>Heaven Burns Red</h1>
          <p style={{ fontSize: 13, color: "var(--hbr-muted)", maxWidth: 500 }}>
            Chapter list · Story summaries are hidden behind spoiler blur — click to reveal
          </p>
        </div>
      </div>
      {error && <p style={{ padding: 24, color: "var(--hbr-red)", fontFamily: "monospace", fontSize: 12 }}>Error: {error.message}</p>}
      <StoryPage chapters={chapters ?? []} />
    </div>
  );
}
