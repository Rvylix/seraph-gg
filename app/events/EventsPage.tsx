"use client";
import { useState, useEffect } from "react";

type Event = {
  id: string;
  name: string;
  status: "live" | "upcoming" | "ended";
  starts_at: string;
  ends_at: string;
  rewards: string[];
  description: string | null;
  image_url: string | null;
};

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

function EventCard({ event }: { event: Event }) {
  const isLive     = event.status === "live";
  const isUpcoming = event.status === "upcoming";
  const isEnded    = event.status === "ended";
  const countdown  = useCountdown(isLive ? event.ends_at : event.starts_at);

  const statusColor = isLive ? "#22CC66" : isUpcoming ? "#C8A050" : "#6A6A80";
  const statusBg    = isLive ? "rgba(34,204,102,0.12)" : isUpcoming ? "rgba(200,160,80,0.12)" : "rgba(100,100,100,0.12)";
  const statusLabel = isLive ? "LIVE" : isUpcoming ? "SOON" : "ENDED";

  return (
    <div style={{
      background: "var(--hbr-card)",
      border: `0.5px solid ${isLive ? "rgba(34,204,102,0.25)" : "var(--hbr-border)"}`,
      borderLeft: `3px solid ${statusColor}`,
      borderRadius: 8, overflow: "hidden",
      opacity: isEnded ? 0.5 : 1,
    }}>
      {/* Event image */}
      {event.image_url && (
        <img src={event.image_url} alt={event.name} style={{ width: "100%", height: 140, objectFit: "cover", objectPosition: "center" }} />
      )}

      <div style={{ padding: "16px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3, flex: 1 }}>{event.name}</h2>
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 3, background: statusBg, color: statusColor, fontWeight: 700, letterSpacing: "0.08em", flexShrink: 0 }}>
            {statusLabel}
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <p style={{ fontSize: 12, color: "var(--hbr-muted)", lineHeight: 1.6, marginBottom: 14 }}>
            {event.description}
          </p>
        )}

        {/* Countdown */}
        {!isEnded && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 4 }}>
            <span style={{ fontSize: 10, color: "var(--hbr-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {isLive ? "Ends in" : "Starts in"}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: isLive ? "#22CC66" : "#C8A050" }}>
              {countdown}
            </span>
          </div>
        )}

        {/* Date range */}
        <div style={{ fontSize: 10, color: "var(--hbr-muted)", marginBottom: 14, fontFamily: "monospace" }}>
          {new Date(event.starts_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
          {" → "}
          {new Date(event.ends_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
        </div>

        {/* Rewards */}
        {event.rewards && event.rewards.length > 0 && (
          <div>
            <p style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Rewards</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {event.rewards.map((r: string, i: number) => (
                <span key={i} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-silver)", border: "0.5px solid var(--hbr-border)" }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function EventsPage({ events }: { events: Event[] }) {
  const [tab, setTab] = useState<"all" | "live" | "upcoming" | "ended">("all");

  const live     = events.filter(e => e.status === "live");
  const upcoming = events.filter(e => e.status === "upcoming");
  const ended    = events.filter(e => e.status === "ended");

  const filtered = tab === "all" ? events
    : tab === "live"     ? live
    : tab === "upcoming" ? upcoming
    : ended;

  const tabs = [
    { key: "all",      label: "All",      count: events.length },
    { key: "live",     label: "Live",     count: live.length },
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "ended",    label: "Ended",    count: ended.length },
  ];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--hbr-border)", background: "var(--hbr-surface)" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "10px 20px", cursor: "pointer", background: "transparent", border: "none",
            borderBottom: tab === t.key ? "2px solid var(--hbr-red)" : "2px solid transparent",
            color: tab === t.key ? "var(--hbr-red)" : "var(--hbr-muted)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {t.label}
            <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 2, background: tab === t.key ? "var(--hbr-red)" : "rgba(255,255,255,0.08)", color: tab === t.key ? "#fff" : "var(--hbr-muted)" }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Event grid */}
      <div style={{ padding: 24 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--hbr-muted)", fontSize: 13 }}>
            No events in this category.
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {filtered.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
