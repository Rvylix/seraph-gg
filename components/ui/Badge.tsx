type Variant = "red"|"gold"|"blue"|"green"|"purple"|"muted"|"fire"|"water"|"wind"|"thunder";

const styles: Record<Variant, React.CSSProperties> = {
  red:     { background: "rgba(204,34,34,0.15)",   color: "#FF8080", border: "0.5px solid rgba(204,34,34,0.3)" },
  gold:    { background: "rgba(200,160,80,0.15)",  color: "#C8A050", border: "0.5px solid rgba(200,160,80,0.3)" },
  blue:    { background: "rgba(34,100,204,0.15)",  color: "#80AAFF", border: "0.5px solid rgba(34,100,204,0.3)" },
  green:   { background: "rgba(34,180,100,0.15)",  color: "#22CC66", border: "0.5px solid rgba(34,180,100,0.3)" },
  purple:  { background: "rgba(120,80,200,0.15)",  color: "#AA88FF", border: "0.5px solid rgba(120,80,200,0.3)" },
  muted:   { background: "rgba(255,255,255,0.05)", color: "#6A6A80", border: "0.5px solid rgba(255,255,255,0.1)" },
  fire:    { background: "rgba(204,80,34,0.15)",   color: "#FF7755", border: "0.5px solid rgba(204,80,34,0.3)" },
  water:   { background: "rgba(34,100,204,0.15)",  color: "#80AAFF", border: "0.5px solid rgba(34,100,204,0.3)" },
  wind:    { background: "rgba(34,180,100,0.15)",  color: "#80FFAA", border: "0.5px solid rgba(34,180,100,0.3)" },
  thunder: { background: "rgba(200,160,34,0.15)",  color: "#FFD966", border: "0.5px solid rgba(200,160,34,0.3)" },
};

export function Badge({ children, variant = "muted", style }: {
  children: React.ReactNode; variant?: Variant; style?: React.CSSProperties;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 9, padding: "2px 7px", borderRadius: 2,
      letterSpacing: "0.05em", ...styles[variant], ...style,
    }}>
      {children}
    </span>
  );
}
