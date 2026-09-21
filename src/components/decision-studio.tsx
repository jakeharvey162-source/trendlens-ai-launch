import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  FlaskConical,
  ShieldQuestion,
  Check,
  Scale,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Report } from "@/lib/trendlens-data";
import {
  decisionTests,
  decisionMemo,
  downloadText,
  parseDraft,
  type DecisionDraft,
} from "@/lib/decision-tools";
import { useWorkspace } from "@/lib/workspace";

export function DecisionBoard({ report }: { report: Report }) {
  const { session } = useWorkspace();
  // Cloud report notes are explicitly device-local and isolated by account.
  const storageKey =
    "trendlens.decision.v1:" +
    (report.live ? (session?.user.id ?? "guest") : "demo") +
    ":" +
    report.id;
  const tests = decisionTests(report);
  const [draft, setDraft] = useState<DecisionDraft>({
    completed: [],
    notes: "",
    decision: "explore",
  });
  const [loaded, setLoaded] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      setDraft(parseDraft(localStorage.getItem(storageKey), tests.length));
      setError("");
    } catch {
      setDraft(parseDraft(null, tests.length));
      setError("Device storage is unavailable. Export your memo before leaving.");
    }
    setLoaded(storageKey);
  }, [storageKey, tests.length]);
  function update(next: DecisionDraft) {
    if (loaded !== storageKey) return;
    setDraft(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setError("");
    } catch {
      setError("Changes could not be saved on this device. Export your memo before leaving.");
    }
  }
  const ready = loaded === storageKey;
  return (
    <section className="mt-7" aria-label="Decision board">
      <div className="decision-hero">
        <div>
          <p className="eyebrow">
            <FlaskConical className="size-4" /> From insight to experiment
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            A good idea deserves
            <br />
            <span className="text-primary">a real-world test.</span>
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Challenge the assumptions. Plan a small experiment. Keep the evidence that changes your
            mind.
          </p>
        </div>
        <div className="decision-progress">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Validation tasks
          </span>
          <p className="mt-3 text-5xl font-semibold text-primary">
            {ready ? draft.completed.length : 0}
            <span className="text-xl text-muted-foreground"> / {tests.length}</span>
          </p>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Tasks completed, not a confidence score.
          </p>
        </div>
      </div>
      <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow">Your assumptions to test</p>
        <span className="text-xs text-muted-foreground">
          {report.decisionTests?.length
            ? "AI-proposed experiments · validate before use"
            : "Starter checklist from this report · adapt before use"}
        </span>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {tests.map((t, i) => (
          <article key={i} className="decision-test">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-primary">EXPERIMENT 0{i + 1}</span>
              <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary">
                {draft.completed.includes(i) ? (
                  <Check className="size-4" />
                ) : (
                  <FlaskConical className="size-4" />
                )}
              </span>
            </div>
            <h4 className="mt-5 text-lg font-semibold leading-7">{t.assumption}</h4>
            <div className="mt-5 border-t border-border pt-4">
              <p className="flex items-center gap-2 text-xs font-semibold">
                <ShieldQuestion className="size-3.5 text-primary" /> What could prove this wrong?
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.counterargument}</p>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold">The smallest useful test</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.experiment}</p>
            </div>
            <div className="my-5 rounded-md bg-primary/5 p-3">
              <p className="text-xs font-semibold text-primary">Define success before you start</p>
              <p className="mt-2 text-sm leading-6">{t.successCriterion}</p>
            </div>
            <label className="mt-auto flex cursor-pointer items-center gap-3 border-t border-border pt-4 text-sm">
              <input
                aria-label={"Complete experiment " + (i + 1)}
                type="checkbox"
                className="size-4 accent-primary"
                disabled={!ready}
                checked={ready && draft.completed.includes(i)}
                onChange={(e) =>
                  update({
                    ...draft,
                    completed: e.target.checked
                      ? [...draft.completed, i]
                      : draft.completed.filter((n) => n !== i),
                  })
                }
              />{" "}
              Test completed
            </label>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="panel p-6">
          <label htmlFor="decision-notes" className="font-semibold">
            What did you learn?
          </label>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Capture customer feedback, source links and reasons to change direction.
          </p>
          <textarea
            id="decision-notes"
            className="account-input mt-4 min-h-40 resize-y text-sm leading-7"
            maxLength={5000}
            disabled={!ready}
            value={ready ? draft.notes : ""}
            onChange={(e) => update({ ...draft, notes: e.target.value })}
            placeholder="We spoke to… The evidence suggests… What remains uncertain…"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Notes and task progress stay on this device. Export to take them with you.
          </p>
        </div>
        <div className="panel p-6">
          <p className="flex items-center gap-2 font-semibold">
            <Lightbulb className="size-4 text-primary" /> Your call
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Your decision stays separate from the AI’s assessment.
          </p>
          <label className="mt-4 grid gap-2 text-sm">
            Current position
            <select
              className="account-input"
              value={draft.decision}
              disabled={!ready}
              onChange={(e) =>
                update({ ...draft, decision: e.target.value as DecisionDraft["decision"] })
              }
            >
              <option value="explore">Explore further</option>
              <option value="pilot">Run a small pilot</option>
              <option value="pause">Pause and gather evidence</option>
            </select>
          </label>
          <Button
            className="mt-5 w-full"
            disabled={!ready}
            onClick={() => downloadText(decisionMemo(report, draft), "trendlens-decision-memo.md")}
          >
            <ArrowDownToLine /> Export decision memo
          </Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-negative">
          {error}
        </p>
      )}
    </section>
  );
}
export function CompareReports({ report, reports }: { report: Report; reports: Report[] }) {
  const candidates = reports.filter((r) => r.id !== report.id && !!r.live === !!report.live);
  const [selected, setSelected] = useState("");
  const other = candidates.find((r) => r.id === selected);
  return (
    <section className="mt-7" aria-label="Compare reports">
      <div className="decision-hero">
        <div>
          <p className="eyebrow">
            <Scale className="size-4" /> Compare the thinking
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight">
            Two possibilities.
            <br />
            <span className="text-primary">One clearer decision.</span>
          </h3>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Compare the opportunity, risk and next move. These are report assessments, not a
            measured market ranking.
          </p>
        </div>
      </div>
      <label className="my-6 grid max-w-xl gap-2 text-sm font-medium">
        Compare with
        <select
          aria-label="Compare with"
          className="account-input"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select another {report.live ? "live" : "demo"} report</option>
          {candidates.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </label>
      {!candidates.length && (
        <p className="my-6 text-sm text-muted-foreground">
          Create a second report in {report.live ? "Live" : "Demo"} mode, then return here to
          compare.
        </p>
      )}
      {other && (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {[report, other].map((r, i) => (
              <article className="panel overflow-hidden" key={r.id}>
                <div className="border-b border-border bg-primary/5 p-6">
                  <p className="eyebrow">
                    Option {i + 1} · {r.live ? "Live" : "Demo"}
                  </p>
                  <h4 className="mt-3 text-2xl font-semibold">{r.title}</h4>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {r.region} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <dl className="divide-y divide-border px-6">
                  {[
                    ["The assessment", r.verdict.headline],
                    ["Opportunity to test", r.opportunities[0]?.[0] ?? "Not identified"],
                    ["Key risk", r.risks[0]?.[0] ?? "Not identified"],
                    ["Next useful step", r.nextSteps[0] ?? "Gather more evidence"],
                    [
                      "Evidence available",
                      r.live
                        ? r.sourceCount +
                          " search snippets from " +
                          new Set(r.sources.map((s) => s.domain)).size +
                          " domains"
                        : "Illustrative sample references only",
                    ],
                  ].map(([label, value]) => (
                    <div className="py-5" key={label}>
                      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
                      <dd className="mt-2 text-sm leading-7">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() =>
              downloadText(
                "# TrendLens comparison\n\n" +
                  [report, other]
                    .map(
                      (r) =>
                        "## " +
                        r.title +
                        "\n" +
                        (r.live ? "Live AI synthesis — verify sources." : "Illustrative demo.") +
                        "\n\n" +
                        r.summary +
                        "\n\nOpportunity: " +
                        r.opportunities[0]?.[0] +
                        "\nRisk: " +
                        r.risks[0]?.[0] +
                        "\nNext step: " +
                        r.nextSteps[0],
                    )
                    .join("\n\n"),
                "trendlens-comparison.md",
              )
            }
          >
            <ArrowUpRight /> Export comparison
          </Button>
        </>
      )}
    </section>
  );
}
