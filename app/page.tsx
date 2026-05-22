import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section style={{
        position: "relative", padding: "40px 24px 32px",
        borderBottom: "0.5px solid var(--hbr-border)",
        background: "var(--hbr-surface)", overflow: "hidden",
      }}>
        <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 8 }}>
          // Heaven Burns Red — Global Resource Hub
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 6 }}>
          Fight. Survive.<br />
          <span style={{ color: "var(--hbr-red)" }}>Never Burn Out.</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--hbr-muted)", marginBottom: 24 }}>
          Memoria database · Event tracker · Squad showcase · Progression guides
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/memoria" className="hbr-btn-primary">Browse Memoria DB</Link>
          <Link href="/guides"  className="hbr-btn-outline">New Player Guide</Link>
        </div>
      </section>
      <div style={{ padding: "32px 24px", color: "var(--hbr-muted)", fontSize: 13 }}>
        Connect Supabase to load live events, Memorias, and guides.
      </div>
    </div>
  );
}
