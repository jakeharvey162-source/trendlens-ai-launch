import { createFileRoute } from "@tanstack/react-router";
import { EmptyPage } from "@/components/trendlens-ui";
export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TrendLens AI" },
      { name: "description", content: "Configure your TrendLens intelligence workspace." },
      { property: "og:title", content: "Settings — TrendLens AI" },
      { property: "og:description", content: "Configure your TrendLens intelligence workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <EmptyPage type="Settings" />,
});
