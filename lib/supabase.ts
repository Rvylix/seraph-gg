import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing — check .env.local");
  return createClient<Database>(url, key);
}

let _client: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop) {
    if (!_client) _client = getClient();
    return (_client as any)[prop];
  },
});