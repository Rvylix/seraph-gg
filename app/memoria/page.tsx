import { supabase } from "@/lib/supabase";
import { MemoriaDB } from "./MemoriaDB";

export const dynamic = "force-dynamic";

export default async function MemoriaPage() {
  const { data: memorias, error } = await supabase
    .from("memorias")
    .select("*, units(id, name, company)")
    .order("rarity_order")
    .order("name");

  const { data: units } = await supabase
    .from("units")
    .select("id, name, company")
    .order("company")
    .order("name");

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>
      <div style={{ padding: "22px 24px 16px", background: "var(--hbr-surface)", borderBottom: "0.5px solid var(--hbr-border)" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 6 }}>// Database</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Memoria DB</h1>
        <p style={{ fontSize: 12, color: "var(--hbr-muted)" }}>
          {memorias?.length ?? 0} Memorias · Skills · Booster & Accessory recommendations
        </p>
      </div>
      {error && <p style={{ padding: 24, color: "var(--hbr-red)", fontFamily: "monospace", fontSize: 12 }}>Error: {error.message}</p>}
      {memorias && <MemoriaDB memorias={memorias} units={units ?? []} />}
    </div>
  );
}
