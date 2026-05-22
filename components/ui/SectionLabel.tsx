export function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: "block",
      fontFamily: "'Courier New', monospace",
      fontSize: 10, letterSpacing: "0.2em",
      color: "var(--hbr-red)", textTransform: "uppercase",
      marginBottom: 12, ...style,
    }}>
      // {children}
    </span>
  );
}
