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
  const isLive     = event.status === "live";
  const isUpcoming = event.status === "upcoming";
  const isEnded    = event.status === "ended";
  const countdown  = useCountdown(isLive ? event.ends_at : event.starts_at);
  const statusColor = isLive ? "#22CC66" : isUpcoming ? "#C8A050" : "#6A6A80";
  const statusBg    = isLive ? "rgba(34,204,102,0.12)" : isUpcoming ? "rgba(200,160,80,0.12)" : "rgba(100,100,100,0.08)";
  const borderColor = isLive ? "rgba(34,204,102,0.35)" : isUpcoming ? "rgba(200,160,80,0.25)" : "var(--hbr-border)";

  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: "var(--hbr-card)",
      border: `0.5px solid ${borderColor}`,
      borderRadius: 10, overflow: "hidden",
      opacity: isEnded ? 0.45 : 1,
      display: "flex", flexDirection: "column",
    }}>
      {/* Event image */}
      <div style={{ height: 110, position: "relative", overflow: "hidden", background: statusBg, flexShrink: 0 }}>
        {event.image_url
          ? <img src={event.image_url} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 32, opacity: 0.15 }}>⚔</span>
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />

        {/* Status badge */}
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, background: statusBg, color: statusColor, fontWeight: 700, letterSpacing: "0.08em", backdropFilter: "blur(4px)", border: `0.5px solid ${statusColor}44` }}>
            {isLive ? "LIVE" : isUpcoming ? "SOON" : "ENDED"}
          </span>
        </div>

        {/* Countdown on image */}
        {!isEnded && (
          <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: statusColor }}>
              {isLive ? "⏱ " : "⏳ "}{countdown}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{event.name}</div>
        {event.description && (
          <div style={{ fontSize: 10, color: "var(--hbr-muted)", lineHeight: 1.5 }}>
            {event.description.length > 60 ? event.description.slice(0, 60) + "..." : event.description}
          </div>
        )}
        {/* Date range */}
        <div style={{ fontSize: 9, color: "var(--hbr-muted)", fontFamily: "monospace", marginTop: "auto" }}>
          {new Date(event.starts_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
          {" → "}
          {new Date(event.ends_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
        </div>
        {/* Rewards */}
        {event.rewards && event.rewards.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {event.rewards.slice(0, 3).map((r, i) => (
              <span key={i} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", border: "0.5px solid var(--hbr-border)" }}>{r}</span>
            ))}
            {event.rewards.length > 3 && (
              <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 2, color: "var(--hbr-muted)" }}>+{event.rewards.length - 3}</span>
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
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "right" ? 520 : -520, behavior: "smooth" });
  }

  if (events.length === 0) return null;

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
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

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 55, left: 0, right: 0, height: 1, background: `linear-gradient(to right, ${color}44, ${color}22, transparent)`, zIndex: 0, pointerEvents: "none" }} />
        <div ref={scrollRef} style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none", msOverflowStyle: "none", position: "relative", zIndex: 1 }}>
          {events.map((e) => (
            <div key={e.id} style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: e.status === "live" ? "#22CC66" : e.status === "upcoming" ? "#C8A050" : "var(--hbr-border)", border: "2px solid var(--hbr-bg)", zIndex: 2 }} />
              <EventCard event={e} />
            </div>
          ))}
        </div>
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
      <TimelineRow label="Live Now"  color="#22CC66" events={live} />
      <TimelineRow label="Upcoming"  color="#C8A050" events={upcoming} />
      <TimelineRow label="Ended"     color="#6A6A80" events={ended} />

      {events.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--hbr-muted)" }}>
          <p style={{ fontSize: 13 }}>No events added yet.</p>
        </div>
      )}
    </div>
  );
}
