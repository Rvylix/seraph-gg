"use client";
import { useState, useEffect, useRef } from "react";

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
  const [expanded, setExpanded] = useState(false);
  const isLive    = event.status === "live";
  const isEnded   = event.status === "ended";
  const isUpcoming = event.status === "upcoming";
  const countdown = useCountdown(isLive ? event.ends_at : event.starts_at);
  const statusColor = isLive ? "#22CC66" : isUpcoming ? "#C8A050" : "#6A6A80";
  const borderColor = expanded
    ? statusColor
    : isLive ? "rgba(34,204,102,0.3)" : isUpcoming ? "rgba(200,160,80,0.2)" : "var(--hbr-border)";

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        width: expanded ? 280 : 200,
        flexShrink: 0,
        background: "var(--hbr-card)",
        border: `0.5px solid ${borderColor}`,
        borderRadius: 8,
        overflow: "hidden",
        opacity: isEnded ? 0.6 : 1,
        cursor: "pointer",
        transition: "width 0.3s ease, border-color 0.2s",
      }}
    >
      {/* Artwork */}
      <div style={{ height: 120, position: "relative", overflow: "hidden", background: isLive ? "rgba(34,204,102,0.08)" : isUpcoming ? "rgba(200,160,80,0.08)" : "rgba(255,255,255,0.03)", flexShrink: 0 }}>
        {event.image_url
          ? <img src={event.image_url} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 32, opacity: 0.1 }}>⚔</span>
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />

        {/* Status */}
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, color: statusColor, fontWeight: 700, letterSpacing: "0.08em", background: "rgba(0,0,0,0.6)" }}>
            {isLive ? "LIVE" : isUpcoming ? "SOON" : "ENDED"}
          </span>
        </div>

        {/* Expand indicator */}
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Always visible — title + duration */}
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>{event.name}</div>
        <div style={{ fontSize: 10, color: "var(--hbr-muted)", fontFamily: "monospace" }}>
          {new Date(event.starts_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
          {" → "}
          {new Date(event.ends_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
        </div>
        {!isEnded && (
          <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: statusColor, marginTop: 4 }}>
            {isLive ? "⏱ " : "⏳ "}{countdown}
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid var(--hbr-border)" }}>
            {event.description && (
              <p style={{ fontSize: 11, color: "var(--hbr-muted)", lineHeight: 1.6, marginBottom: 10 }}>{event.description}</p>
            )}
            {event.rewards && event.rewards.length > 0 && (
              <>
                <div style={{ fontSize: 9, color: "var(--hbr-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Rewards</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {event.rewards.map((r, i) => (
                    <span key={i} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-silver)", border: "0.5px solid var(--hbr-border)" }}>{r}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineRow({ label, color, events }: { label: string; color: string; events: Event[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
  }

  if (events.length === 0) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: color }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.15em", color, textTransform: "uppercase" }}>{label}</span>
          <span style={{ fontSize: 10, color: "var(--hbr-muted)", fontFamily: "monospace" }}>{events.length} events</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => scroll("left")} style={{ width: 28, height: 28, borderRadius: 4, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", color: "var(--hbr-muted)", cursor: "pointer", fontSize: 12 }}>←</button>
          <button onClick={() => scroll("right")} style={{ width: 28, height: 28, borderRadius: 4, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", color: "var(--hbr-muted)", cursor: "pointer", fontSize: 12 }}>→</button>
        </div>
      </div>

      {/* Timeline line */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, ${color}44, ${color}22 80%, transparent)` }} />
      </div>

      {/* Scrollable cards */}
      <div ref={scrollRef} style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8, alignItems: "flex-start" }}>
        {events.map(e => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}

export function EventsPage({ events }: { events: Event[] }) {
  const live     = events.filter(e => e.status === "live");
  const upcoming = events.filter(e => e.status === "upcoming");
  const ended    = events.filter(e => e.status === "ended");

  return (
    <div style={{ padding: "28px 24px" }}>
      <TimelineRow label="Live Now" color="#22CC66" events={live} />
      <TimelineRow label="Upcoming" color="#C8A050" events={upcoming} />
      <TimelineRow label="Ended"    color="#6A6A80" events={ended} />
      {events.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--hbr-muted)" }}>
          <p style={{ fontSize: 13 }}>No events added yet.</p>
        </div>
      )}
    </div>
  );
}
