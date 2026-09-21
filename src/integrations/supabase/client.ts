import { createClient, type SupabaseClient } from "@supabase/supabase-js";
let client: SupabaseClient | undefined;
export function getSupabase() {
  const url = import.meta.env["VITE_SUPABASE_URL"];
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return (client ??= createClient(url, key));
}
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const c = getSupabase();
    if (!c) throw new Error("Account connection is not configured.");
    return Reflect.get(c, prop);
  },
});
