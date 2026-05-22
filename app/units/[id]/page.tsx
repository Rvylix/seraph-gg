import { supabase } from "@/lib/supabase";
import { ELEMENT_ICON, ELEMENT_COLOR, ATTACK_ICON, ROLE_COLOR, RARITY_COLOR } from "@/lib/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function UnitProfilePage({ params }: Props) {
  const { id } = await params;

  const { data: unit } = await supabase
    .from("units").select("*").eq("id", id).single();

  if (!unit) {
    return (
      <div style={{ padding: 48, color: "var(--hbr-red)", fontFamily: "monospace" }}>
        <p>Unit not found for ID: {id}</p>
        <a href="/units" style={{ color: "var(--hbr-muted)", fontSize: 12 }}>← Back to units</a>
      </div>
    );
  }

  const u = unit as {
    id: string; name: string; name_jp: string | null; cv: string | null;
    company: string; position: string; description: string | null;
    image_url: string | null; is_limited: boolean;
  };

  const { data: memorias } = await supabase
    .from("memorias").select("*").eq("unit_id", id).order("rarity").order("name");

  const { data: socializations } = await supabase
    .from("socializations").select("*").eq("unit_id", id).order("order_index");

  const { data: recollections } = await supabase
    .from("recollections").select("*").eq("unit_id", id).order("order_index");

  return (
    <div style={{ padding: 24, color: "white" }}>
      <Link href="/units" style={{ color: "var(--hbr-muted)", fontSize: 12 }}>← Back</Link>
      <h1 style={{ color: "#fff", marginTop: 16 }}>{u.name}</h1>
      <p style={{ color: "var(--hbr-muted)" }}>ID: {id}</p>
      <p style={{ color: "var(--hbr-muted)" }}>Memorias: {memorias?.length ?? 0}</p>
    </div>
  );
}
