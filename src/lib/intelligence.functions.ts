import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { research } from "@/lib/live-research-core";
import type { Report } from "@/lib/trendlens-data";
const configured = () =>
  process.env["ENABLE_LIVE_RESEARCH"] === "true" &&
  [
    "SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SERPAPI_API_KEY",
    "GEMINI_API_KEY",
    "GEMINI_MODEL",
  ].every((k) => !!process.env[k]);
export const getResearchStatus = createServerFn({ method: "GET" }).handler(async () => ({
  ready: configured(),
}));
export const runIntelligence = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) =>
    z
      .object({
        query: z.string().trim().min(2).max(240),
        kind: z.enum(["report", "opportunity"]),
        requestId: z.string().uuid(),
      })
      .parse(v),
  )
  .handler(async ({ data, context }): Promise<Report> => {
    if (!configured())
      throw new Error(
        "Live research is not configured yet. Use Demo mode or ask the owner to finish setup.",
      );
    const admin = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: reserved, error } = await admin.rpc("trendlens_reserve_research", {
      p_user: context.userId,
      p_request: data.requestId,
      p_query: data.query,
      p_kind: data.kind,
    });
    if (error)
      throw new Error(
        error.message.includes("limit")
          ? "Daily research limit reached. Try again tomorrow (UTC)."
          : "Could not start research. Please retry.",
      );
    if (!reserved) {
      const { data: row } = await context.supabase
        .from("trendlens_reports")
        .select("payload")
        .eq("id", data.requestId)
        .maybeSingle();
      if (row) return row.payload as Report;
      throw new Error("This request was already started. Check History before retrying.");
    }
    try {
      const report = await research(
        { query: data.query, kind: data.kind, id: data.requestId },
        {
          search: process.env["SERPAPI_API_KEY"]!,
          gemini: process.env["GEMINI_API_KEY"]!,
          model: process.env["GEMINI_MODEL"]!,
        },
      );
      const { error: saveError } = await admin
        .from("trendlens_reports")
        .insert({ id: report.id, user_id: context.userId, payload: report });
      if (saveError)
        throw new Error("Research completed but could not be saved. Please contact the owner.");
      await admin.from("trendlens_jobs").update({ status: "complete" }).eq("id", data.requestId);
      return report;
    } catch (e) {
      await admin.from("trendlens_jobs").update({ status: "failed" }).eq("id", data.requestId);
      throw e;
    }
  });
