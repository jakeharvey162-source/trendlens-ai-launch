import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/trendlens-pages";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
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
