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
  const isLive    = event.status === "live";
  const isEnded   = event.status === "ended";
  const countdown = useCountdown(isLive ? event.ends_at : event.starts_at);
  const statusColor = isLive ? "#22CC66" : event.status === "upcoming" ? "#C8A050" : "#6A6A80";
  const borderColor = isLive ? "rgba(34,204,102,0.35)" : event.status === "upcoming" ? "rgba(200,160,80,0.25)" : "var(--hbr-border)";

  return (
    <div style={{
      width: 200,
      background: "var(--hbr-card)",
      border: `0.5px solid ${borderColor}`,
      borderRadius: 8, overflow: "hidden",
      opacity: isEnded ? 0.45 : 1,
    }}>
      {/* Image */}
      <div style={{ height: 100, position: "relative", overflow: "hidden", background: isLive ? "rgba(34,204,102,0.08)" : event.status === "upcoming" ? "rgba(200,160,80,0.08)" : "rgba(255,255,255,0.03)" }}>
        {event.image_url
          ? <img src={event.image_url} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 28, opacity: 0.1 }}>⚔</span>
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 6, left: 8 }}>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, color: statusColor, fontWeight: 700, letterSpacing: "0.08em", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
            {isLive ? "LIVE" : event.status === "upcoming" ? "SOON" : "ENDED"}
          </span>
        </div>
        {!isEnded && (
          <div style={{ position: "absolute", bottom: 6, left: 8 }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: statusColor }}>{countdown}</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>{event.name}</div>
        <div style={{ fontSize: 9, color: "var(--hbr-muted)", fontFamily: "monospace", marginBottom: 5 }}>
          {new Date(event.starts_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
          {" → "}
          {new Date(event.ends_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
        </div>
        {event.rewards && event.rewards.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {event.rewards.slice(0, 2).map((r, i) => (
              <span key={i} style={{ fontSize: 8, padding: "1px 5px", borderRadius: 2, background: "rgba(255,255,255,0.05)", color: "var(--hbr-muted)", border: "0.5px solid var(--hbr-border)" }}>{r}</span>
            ))}
            {event.rewards.length > 2 && <span style={{ fontSize: 8, color: "var(--hbr-muted)" }}>+{event.rewards.length - 2}</span>}
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

  const CARD_H = 172;
  const GAP    = 20;
  const DOT    = 10;

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
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

      <div ref={scrollRef} style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 0, position: "relative", minWidth: "max-content" }}>
          {events.map((e, i) => {
            const isTop = i % 2 === 0;
            return (
              <div key={e.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 220, flexShrink: 0 }}>
                <div style={{ height: CARD_H, display: "flex", alignItems: "flex-end" }}>
                  {isTop ? <EventCard event={e} /> : <div style={{ width: 200 }} />}
                </div>
                <div style={{ width: 1, height: GAP, background: isTop ? `${color}66` : "transparent" }} />
                <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: DOT }}>
                  <div style={{ position: "absolute", left: 0, right: "50%", height: 2, background: `${color}33`, top: "50%", transform: "translateY(-50%)" }} />
                  <div style={{ position: "absolute", left: "50%", right: 0, height: 2, background: `${color}33`, top: "50%", transform: "translateY(-50%)" }} />
                  <div style={{ width: DOT, height: DOT, borderRadius: "50%", background: e.status === "live" ? "#22CC66" : e.status === "upcoming" ? "#C8A050" : "#6A6A80", border: "2px solid var(--hbr-bg)", zIndex: 2, position: "relative" }} />
                </div>
                <div style={{ width: 1, height: GAP, background: !isTop ? `${color}66` : "transparent" }} />
                <div style={{ height: CARD_H, display: "flex", alignItems: "flex-start" }}>
                  {!isTop ? <EventCard event={e} /> : <div style={{ width: 200 }} />}
                </div>
              </div>
            );
          })}
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
    <div style={{ padding: "28px 24px", overflowX: "hidden" }}>
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
