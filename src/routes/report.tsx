import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ReportPage } from "@/components/workspace-pages";

export const Route = createFileRoute("/report")({
  validateSearch: (search) => z.object({ id: z.string().optional() }).parse(search),
  head: () => ({
    meta: [
      { title: "Market Intelligence Report — TrendLens AI" },
      {
        name: "description",
        content: "A decision-ready market intelligence briefing built from live web sources.",
      },
      { property: "og:title", content: "Market Intelligence Report — TrendLens AI" },
      {
        property: "og:description",
        content: "A decision-ready market intelligence briefing built from live web sources.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});
