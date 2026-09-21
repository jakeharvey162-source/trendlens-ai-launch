import { createFileRoute } from "@tanstack/react-router";
import { ResearchPage } from "@/components/workspace-pages";
export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Market Research — TrendLens AI" },
      { name: "description", content: "Research any market, trend, industry or business idea." },
      { property: "og:title", content: "Market Research — TrendLens AI" },
      {
        property: "og:description",
        content: "Research any market, trend, industry or business idea.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});
