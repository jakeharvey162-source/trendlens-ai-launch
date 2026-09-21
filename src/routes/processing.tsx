import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProcessingPage } from "@/components/workspace-pages";

export const Route = createFileRoute("/processing")({
  validateSearch: (search) =>
    z
      .object({
        q: z.string().optional(),
        mode: z.enum(["report", "opportunity"]).optional(),
      })
      .parse(search),
  head: () => ({
    meta: [
      { title: "Analyzing Market Intelligence — TrendLens AI" },
      {
        name: "description",
        content: "TrendLens is resolving live market signals into a strategic report.",
      },
      { property: "og:title", content: "Analyzing Market Intelligence — TrendLens AI" },
      {
        property: "og:description",
        content: "TrendLens is resolving live market signals into a strategic report.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProcessingPage,
});
