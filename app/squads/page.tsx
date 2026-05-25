import { supabase } from "@/lib/supabase";
import { SquadsPage } from "./SquadsPage";

export const dynamic = "force-dynamic";

export default async function Squads() {
  const { data: squads } = await supabase
    .from("squads")
    .select("*, squad_slots(*, memorias(id, name, rarity, image_url, role, element, attack_type, unit_id, units!memorias_unit_id_fkey(name)))")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const { data: memorias } = await supabase
    .from("memorias")
    .select("id, name, rarity, image_url, role, element, attack_type, units!memorias_unit_id_fkey(name)")
    .order("rarity_order")
    .order("name");

  return (
    <div style={{ background: "var(--hbr-bg)", minHeight: "100vh" }}>
      <div style={{
        position: "relative", height: 180, overflow: "hidden",
        background: "var(--hbr-surface)", borderBottom: "0.5px solid var(--hbr-border)",
      }}>
        <div className="bg-hbr-grid" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(204,34,34,0.07) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "40px 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "var(--hbr-red)", textTransform: "uppercase", marginBottom: 8 }}>// Community</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1 }}>Squads</h1>
          <p style={{ fontSize: 13, color: "var(--hbr-muted)" }}>
            PvE Memoria builds · {squads?.length ?? 0} squads shared
          </p>
        </div>
      </div>
      <SquadsPage squads={squads ?? []} memorias={memorias ?? []} />
    </div>
  );
}
