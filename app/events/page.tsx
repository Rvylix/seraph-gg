import { supabase } from "@/lib/supabase";
import { EventsPage } from "./EventsPage";

export const dynamic = "force-dynamic";

export default async function Events() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at");

  const live     = (events as any[])?.filter(e => e.status === "live").length ?? 0;
  const upcoming = (events as any[])?.filter(e => e.status === "upcoming").length ?? 0;

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>
      <div style={{
        position: "relative", height: 180, overflow: "hidden",
        background: "var(--hbr-surface)", borderBottom: "0.5px solid var(--hbr-border)",
      }}>
        <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(34,204,102,0.06) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "40px 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 8 }}>// Tracker</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1 }}>Events</h1>
          <p style={{ fontSize: 13, color: "var(--hbr-muted)" }}>
            {live > 0 && <span style={{ color: "#22CC66" }}>{live} live</span>}
            {live > 0 && upcoming > 0 && <span style={{ color: "var(--hbr-muted)" }}> · </span>}
            {upcoming > 0 && <span style={{ color: "#C8A050" }}>{upcoming} upcoming</span>}
            {live === 0 && upcoming === 0 && "No active events"}
          </p>
        </div>
      </div>
      {error && <p style={{ padding: 24, color: "var(--hbr-red)", fontFamily: "monospace", fontSize: 12 }}>Error: {error.message}</p>}
      <EventsPage events={events as any[] ?? []} />
    </div>
  );
}
