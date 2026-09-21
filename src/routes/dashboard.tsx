import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/workspace-pages";
export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Intelligence Command Center — TrendLens AI" },
      { name: "description", content: "Monitor market signals and recent intelligence reports." },
      { property: "og:title", content: "Intelligence Command Center — TrendLens AI" },
      {
        property: "og:description",
        content: "Monitor market signals and recent intelligence reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});
