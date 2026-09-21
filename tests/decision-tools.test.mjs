import test from "node:test";
import assert from "node:assert/strict";
import { generateReport } from "../src/lib/trendlens-data.ts";
import { decisionTests, parseDraft, decisionMemo } from "../src/lib/decision-tools.ts";
test("older reports get an honest starter checklist using their own risks and next steps", () => {
  const r = generateReport("Solar in Nigeria");
  const t = decisionTests(r);
  assert.equal(t[0].counterargument, r.risks[0][0]);
  assert.equal(t[0].experiment, r.nextSteps[0]);
  assert.ok(t.length <= 3);
});
test("damaged decision drafts reject invalid progress and bound user notes", () => {
  assert.deepEqual(parseDraft("{oops", 3), { completed: [], notes: "", decision: "explore" });
  const d = parseDraft(
    JSON.stringify({
      completed: [0, 0, -1, 1.3, "2", 9, 2],
      notes: "a".repeat(6000),
      decision: "guaranteed success",
    }),
    3,
  );
  assert.deepEqual(d.completed, [0, 2]);
  assert.equal(d.notes.length, 5000);
  assert.equal(d.decision, "explore");
});
test("decision memo preserves notes, test status, provenance and source URLs", () => {
  const r = generateReport("Solar in Nigeria");
  const m = decisionMemo(r, {
    notes: "Customer interviews remain incomplete.",
    completed: [0],
    decision: "pause",
  });
  assert.match(m, /Illustrative demo/);
  assert.match(m, /Pause and gather evidence/);
  assert.match(m, /- \[x\]/);
  assert.ok(m.includes(r.sources[0].url));
  assert.match(m, /interviews remain incomplete/);
});
