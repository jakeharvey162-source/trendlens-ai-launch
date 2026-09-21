import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { OpportunityPage } from "@/components/workspace-pages";

export const Route = createFileRoute("/opportunity-lens")({
  validateSearch: (search) =>
    z.object({ id: z.string().optional(), q: z.string().optional() }).parse(search),
  head: () => ({
    meta: [
      { title: "Opportunity Lens — TrendLens AI" },
      {
        name: "description",
        content: "Evaluate any business idea with AI-powered market intelligence.",
      },
      { property: "og:title", content: "Opportunity Lens — TrendLens AI" },
      {
        property: "og:description",
        content: "Evaluate any business idea with AI-powered market intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpportunityPage,
});
