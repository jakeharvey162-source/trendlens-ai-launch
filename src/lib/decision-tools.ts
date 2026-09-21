import type { Report } from "./trendlens-data";
export type DecisionTest = {
  assumption: string;
  counterargument: string;
  experiment: string;
  successCriterion: string;
};
export type DecisionDraft = {
  completed: number[];
  notes: string;
  decision: "explore" | "pilot" | "pause";
};
export function decisionTests(report: Report): DecisionTest[] {
  if (report.decisionTests?.length) return report.decisionTests;
  return report.risks.slice(0, 3).map(([risk], i) => ({
    assumption: report.opportunities[i]?.[0] ?? "The proposed opportunity can work",
    counterargument: risk,
    experiment:
      report.nextSteps[i] ??
      "Interview potential customers and document evidence that supports or challenges the idea.",
    successCriterion:
      "Set a measurable threshold before testing. Record the result and supporting evidence.",
  }));
}
export function parseDraft(raw: string | null, count: number): DecisionDraft {
  const empty: DecisionDraft = { completed: [], notes: "", decision: "explore" };
  try {
    const d = JSON.parse(raw ?? "null");
    if (!d || typeof d !== "object") return empty;
    return {
      notes: typeof d.notes === "string" ? d.notes.slice(0, 5000) : "",
      decision: ["explore", "pilot", "pause"].includes(d.decision) ? d.decision : "explore",
      completed: Array.isArray(d.completed)
        ? [
            ...new Set<number>(
              d.completed.filter(
                (v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= 0 && v < count,
              ),
            ),
          ]
        : [],
    };
  } catch {
    return empty;
  }
}
export function decisionMemo(report: Report, draft: DecisionDraft): string {
  const tests = decisionTests(report);
  const mode = report.live
    ? "AI synthesis of search snippets; verify original sources."
    : "Illustrative demo; not live market evidence.";
  const lines = [
    "# Decision memo: " + report.title,
    "",
    mode,
    "",
    "## Current position",
    draft.decision === "pilot"
      ? "Run a small pilot"
      : draft.decision === "pause"
        ? "Pause and gather evidence"
        : "Explore further",
    "",
    "## Executive view",
    report.summary,
    "",
    "## Assumptions to test",
  ];
  tests.forEach((t, i) =>
    lines.push(
      "",
      (draft.completed.includes(i) ? "- [x] " : "- [ ] ") + t.assumption,
      "  - Challenge: " + t.counterargument,
      "  - Test: " + t.experiment,
      "  - Success criterion: " + t.successCriterion,
    ),
  );
  lines.push("", "## Research notes", draft.notes || "No notes yet.", "", "## Source links");
  report.sources.forEach((s) => lines.push("- " + s.title + ": " + s.url));
  lines.push(
    "",
    "Completing a task does not validate a market. Record what you learned and what would change your decision.",
  );
  return lines.join("\n");
}
export function downloadText(content: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
