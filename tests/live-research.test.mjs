import test from "node:test";
import assert from "node:assert/strict";
import { research } from "../src/lib/live-research-core.ts";
const input = {
  query: "Solar in Nigeria",
  kind: "report",
  id: "11111111-1111-4111-8111-111111111111",
};
const keys = { search: "test-search", gemini: "test-gemini", model: "test-model" };
const sources = {
  organic_results: [
    { title: "Source A", link: "https://example.org/a", snippet: "Evidence A" },
    { title: "Source B", link: "https://example.net/b", snippet: "Evidence B" },
  ],
};
const analysis = {
  industry: "Energy",
  region: "Nigeria",
  summary: "A limited signal [1].",
  secondary: "More evidence needed.",
  insights: [
    { impact: "Early", title: "Signal A", body: "A [1]" },
    { impact: "Watch", title: "Signal B", body: "B [2]" },
  ],
  competitors: [],
  opportunities: [["Pilot", "Hypothesis", "Moderate", "Needs validation"]],
  risks: [["Limited evidence", "High"]],
  verdict: { label: "Validate", headline: "Test the assumption", body: "Evidence is preliminary." },
  signals: ["Signal"],
  nextSteps: ["Interview customers", "Verify source"],
  demand: "Uncertain",
  pressure: "Unknown",
  gap: "Unproven",
  decisionTests: [
    {
      assumption: "Customers value faster service",
      counterargument: "They may prefer lower cost",
      experiment: "Interview ten prospective customers",
      successCriterion: "Proposed threshold: six identify speed as a top priority",
    },
    {
      assumption: "A small pilot is feasible",
      counterargument: "Delivery costs may be too high",
      experiment: "Obtain three supplier quotes",
      successCriterion: "Proposed threshold: one viable quote within the pilot budget",
    },
  ],
  evidence: [{ claim: "A signal", sourceRanks: [1] }],
};
function mock(a = analysis) {
  let calls = 0;
  return async (url, init) => {
    calls++;
    if (calls === 1) return Response.json(sources);
    assert.equal(init.headers["x-goog-api-key"], keys.gemini);
    return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(a) }] } }] });
  };
}
test("live report uses real result links and validated evidence, without fabricated scores", async () => {
  const r = await research(input, keys, mock());
  assert.equal(r.live, true);
  assert.equal(r.engine, "serpapi+gemini");
  assert.equal(r.sources[0].url, "https://example.org/a");
  assert.equal(r.metrics.trend, null);
  assert.equal(r.evidence[0].sourceRanks[0], 1);
});
test("provider error never silently creates a demo", async () => {
  await assert.rejects(
    () => research(input, keys, async () => new Response("", { status: 429 })),
    /Web search is unavailable/,
  );
});
test("insufficient evidence stops before AI charges", async () => {
  let count = 0;
  await assert.rejects(
    () =>
      research(input, keys, async () => {
        count++;
        return Response.json({ organic_results: [] });
      }),
    /Not enough/,
  );
  assert.equal(count, 1);
});
test("out-of-range citations and malformed analysis are rejected", async () => {
  await assert.rejects(
    () =>
      research(input, keys, mock({ ...analysis, evidence: [{ claim: "bad", sourceRanks: [99] }] })),
    /could not be validated/,
  );
  await assert.rejects(
    () => research(input, keys, mock({ summary: "incomplete" })),
    /could not be validated/,
  );
});
