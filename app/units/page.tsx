import { supabase } from "@/lib/supabase";
import { UnitsGrid } from "./UnitsGrid";

export const dynamic = "force-dynamic";

export default async function UnitsPage() {
  const { data: units, error } = await supabase
    .from("units")
    .select("*")
    .order("company")
    .order("name");

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>
      <div style={{ padding: "22px 24px 0", background: "var(--hbr-surface)", borderBottom: "0.5px solid var(--hbr-border)" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 6 }}>// Roster</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Units</h1>
        <p style={{ fontSize: 12, color: "var(--hbr-muted)", marginBottom: 16 }}>
          {units?.length ?? 0} characters · Click any unit to view full profile
        </p>
      </div>
      {error && <p style={{ padding: 24, color: "var(--hbr-red)", fontFamily: "monospace", fontSize: 12 }}>Error: {error.message}</p>}
      {units && <UnitsGrid units={units} />}
    </div>
  );
}
