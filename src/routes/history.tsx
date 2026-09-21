import { createFileRoute } from "@tanstack/react-router";
import { EmptyPage } from "@/components/trendlens-ui";
export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Research History — TrendLens AI" },
      { name: "description", content: "Review your previous market intelligence research." },
      { property: "og:title", content: "Research History — TrendLens AI" },
      { property: "og:description", content: "Review your previous market intelligence research." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <EmptyPage type="History" />,
});
