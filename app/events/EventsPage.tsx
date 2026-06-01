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

function useCountdown(target: string, active: boolean) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    if (!active) return;
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
  }, [target, active]);
  return timeLeft;
}

function EventCard({ event }: { event: Event }) {
  const [expanded, setExpanded] = useState(false);
  const isLive     = event.status === "live";
  const isUpcoming = event.status === "upcoming";
  const isEnded    = event.status === "ended";
  const countdown  = useCountdown(isLive ? event.ends_at : event.starts_at, !isEnded);
  const statusColor = isLive ? "#22CC66" : isUpcoming ? "#C8A050" : "#6A6A80";
  const borderColor = expanded ? statusColor : isLive ? "rgba(34,204,102,0.3)" : isUpcoming ? "rgba(200,160,80,0.2)" : "var(--hbr-border)";

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        width: 190,
        background: "var(--hbr-card)",
        border: `0.5px solid ${borderColor}`,
        borderRadius: 8,
        overflow: "hidden",
        opacity: isEnded ? 0.55 : 1,
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {/* Artwork */}
      <div style={{ height: 108, position: "relative", overflow: "hidden", background: isLive ? "rgba(34,204,102,0.08)" : isUpcoming ? "rgba(200,160,80,0.08)" : "rgba(255,255,255,0.03)" }}>
        {event.image_url
          ? <img src={event.image_url} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 28, opacity: 0.1 }}>⚔</span>
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", top: 7, left: 8 }}>
          <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 3, color: statusColor, fontWeight: 700, background: "rgba(0,0,0,0.65)", letterSpacing: "0.06em" }}>
            {isLive ? "LIVE" : isUpcoming ? "SOON" : "ENDED"}
          </span>
        </div>
        <div style={{ position: "absolute", top: 7, right: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "9px 11px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 3 }}>{event.name}</div>
        <div style={{ fontSize: 9, color: "var(--hbr-muted)", fontFamily: "monospace" }}>
          {new Date(event.starts_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
          {" → "}
          {new Date(event.ends_at).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
        </div>
        {!isEnded && countdown && (
          <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: statusColor, marginTop: 3 }}>
            {isLive ? "⏱ " : "⏳ "}{countdown}
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "0.5px solid var(--hbr-border)" }}>
            {event.description && (
              <p style={{ fontSize: 10, color: "var(--hbr-muted)", lineHeight: 1.6, marginBottom: 8 }}>{event.description}</p>
            )}
            {event.rewards && event.rewards.length > 0 && (
              <>
                <div style={{ fontSize: 8, color: "var(--hbr-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Rewards</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {event.rewards.map((r, i) => (
                    <span key={i} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "var(--hbr-silver)", border: "0.5px solid var(--hbr-border)" }}>{r}</span>
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

export function EventsPage({ events }: { events: Event[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
  }

  // Sort all events by start date oldest → newest
  const sorted = [...events].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

  const liveCount     = events.filter(e => e.status === "live").length;
  const upcomingCount = events.filter(e => e.status === "upcoming").length;
  const endedCount    = events.filter(e => e.status === "ended").length;

  if (events.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--hbr-muted)" }}>
      <p style={{ fontSize: 13 }}>No events added yet.</p>
    </div>
  );

  return (
    <div style={{ padding: "28px 24px" }}>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {liveCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22CC66" }} />
              <span style={{ fontSize: 10, color: "#22CC66", fontFamily: "monospace" }}>Live ({liveCount})</span>
            </div>
          )}
          {upcomingCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8A050" }} />
              <span style={{ fontSize: 10, color: "#C8A050", fontFamily: "monospace" }}>Upcoming ({upcomingCount})</span>
            </div>
          )}
          {endedCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6A6A80" }} />
              <span style={{ fontSize: 10, color: "#6A6A80", fontFamily: "monospace" }}>Ended ({endedCount})</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => scroll("left")} style={{ width: 28, height: 28, borderRadius: 4, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", color: "var(--hbr-muted)", cursor: "pointer", fontSize: 12 }}>←</button>
          <button onClick={() => scroll("right")} style={{ width: 28, height: 28, borderRadius: 4, background: "var(--hbr-card)", border: "0.5px solid var(--hbr-border)", color: "var(--hbr-muted)", cursor: "pointer", fontSize: 12 }}>→</button>
        </div>
      </div>

      {/* Single unified timeline */}
      <div ref={scrollRef} style={{ overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{
          display: "grid",
          gridTemplateRows: "1fr 24px 1fr",
          gridAutoColumns: "210px",
          gridAutoFlow: "column",
          minWidth: "max-content",
        }}>
          {sorted.map((e, i) => {
            const isTop = i % 2 === 0;
            const dotColor = e.status === "live" ? "#22CC66" : e.status === "upcoming" ? "#C8A050" : "#6A6A80";

            return [
              /* Top cell */
              <div key={`top-${e.id}`} style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8, paddingRight: 10 }}>
                {isTop ? <EventCard event={e} /> : null}
              </div>,

              /* Middle — dot + line */
              <div key={`mid-${e.id}`} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.08)", transform: "translateY(-50%)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor, border: "2px solid var(--hbr-bg)", zIndex: 2, position: "relative", boxShadow: `0 0 6px ${dotColor}88` }} />
              </div>,

              /* Bottom cell */
              <div key={`bot-${e.id}`} style={{ display: "flex", alignItems: "flex-start", paddingTop: 8, paddingRight: 10 }}>
                {!isTop ? <EventCard event={e} /> : null}
              </div>,
            ];
          })}
        </div>
      </div>
    </div>
  );
}
