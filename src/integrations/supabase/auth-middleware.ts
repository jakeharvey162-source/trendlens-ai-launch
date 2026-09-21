import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Account connection is not configured.");
    const header = getRequest().headers.get("authorization") ?? "";
    if (!header.startsWith("Bearer ")) throw new Error("Sign in to continue.");
    const supabase = createClient(url, key, {
      global: { headers: { Authorization: header } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(header.slice(7));
    if (error || !data.user || data.user.is_anonymous) throw new Error("Please sign in again.");
    if (!data.user.email_confirmed_at)
      throw new Error("Confirm your email before running research.");
    return next({ context: { supabase, userId: data.user.id } });
  },
);
