import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/trendlens-pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrendLens AI — Market Intelligence" },
      {
        name: "description",
        content:
          "Turn live web intelligence into decisive market insights, opportunities and strategic signals.",
      },
      { property: "og:title", content: "TrendLens AI — Market Intelligence" },
      {
        property: "og:description",
        content: "See the market before everyone else with AI-powered market intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
