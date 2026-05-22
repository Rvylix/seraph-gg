import { supabase } from "@/lib/supabase";
import { EventsPage } from "./EventsPage";

export const dynamic = "force-dynamic";

export default async function Events() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at");

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>
      <div style={{ padding: "22px 24px 16px", background: "var(--hbr-surface)", borderBottom: "0.5px solid var(--hbr-border)" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 6 }}>// Tracker</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Events</h1>
        <p style={{ fontSize: 12, color: "var(--hbr-muted)" }}>
          {(events as any[])?.filter(e => e.status === "live").length ?? 0} live · {(events as any[])?.filter(e => e.status === "upcoming").length ?? 0} upcoming
        </p>
      </div>
      {error && <p style={{ padding: 24, color: "var(--hbr-red)", fontFamily: "monospace", fontSize: 12 }}>Error: {error.message}</p>}
      {events && <EventsPage events={events} />}
    </div>
  );
}
