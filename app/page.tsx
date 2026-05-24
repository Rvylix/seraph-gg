import { supabase } from "@/lib/supabase";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch current + adjacent chapters
  const { data: chapters } = await supabase
    .from("story_chapters")
    .select("id, chapter_number, title, chapter_type, is_released, image_url")
    .eq("chapter_type", "main")
    .order("chapter_number");

  // Fetch newest memorias (last 6 added)
  const { data: newMemorias } = await supabase
    .from("memorias")
    .select("id, name, rarity, image_url, role, element, attack_type, unit_id, units!memorias_unit_id_fkey(id, name)")
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch live + upcoming events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .in("status", ["live", "upcoming"])
    .order("starts_at")
    .limit(6);

  return (
    <HomeClient
      chapters={chapters ?? []}
      newMemorias={newMemorias ?? []}
      events={events ?? []}
    />
  );
}
