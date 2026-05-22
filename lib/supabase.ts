import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser / server component client (anon, read-only for public data) */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnon);
