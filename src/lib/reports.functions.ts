import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Report } from "@/lib/trendlens-data";
type Row = { id: string; saved: boolean; payload: Report };
const convert = (r: Row) => ({ ...r.payload, id: r.id, saved: r.saved });
export const listMyReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("trendlens_reports")
      .select("id,saved,payload")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error("Could not load cloud reports. Please retry.");
    return (data as Row[]).map(convert);
  });
export const getMyReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("trendlens_reports")
      .select("id,saved,payload")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("Could not load report.");
    return row ? convert(row as Row) : null;
  });
export const toggleSaved = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid(), saved: z.boolean() }).parse(v))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("trendlens_reports")
      .update({ saved: data.saved })
      .eq("id", data.id)
      .select("id");
    if (error || !rows?.length) throw new Error("Could not bookmark report.");
    return { ok: true };
  });
export const deleteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ id: z.string().uuid() }).parse(v))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("trendlens_reports").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete report.");
    return { ok: true };
  });
