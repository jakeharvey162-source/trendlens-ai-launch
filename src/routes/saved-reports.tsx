import { createFileRoute } from "@tanstack/react-router";
import { EmptyPage } from "@/components/trendlens-ui";
export const Route = createFileRoute("/saved-reports")({
  head: () => ({
    meta: [
      { title: "Saved Reports — TrendLens AI" },
      { name: "description", content: "Access your saved market intelligence briefings." },
      { property: "og:title", content: "Saved Reports — TrendLens AI" },
      { property: "og:description", content: "Access your saved market intelligence briefings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <EmptyPage type="Saved Reports" />,
});
