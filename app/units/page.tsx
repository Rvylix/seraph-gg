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
      {error && <p style={{ padding: 24, color: "var(--hbr-red)", fontFamily: "monospace", fontSize: 12 }}>Error: {error.message}</p>}
      {units && <UnitsGrid units={units} />}
    </div>
  );
}
