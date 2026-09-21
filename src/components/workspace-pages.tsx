import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Bookmark, Download, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AppShell,
  Eyebrow,
  MetricDial,
  SearchBox,
  SearchChips,
  useStoredReports,
} from "@/components/trendlens-ui";
import {
  categoryChips,
  generateReport,
  suggestedResearch,
  type Report,
} from "@/lib/trendlens-data";
import { useWorkspace } from "@/lib/workspace";
import { useQuery } from "@tanstack/react-query";
import { getMyReport } from "@/lib/reports.functions";
import { runIntelligence } from "@/lib/intelligence.functions";
import { saveReport } from "@/lib/trendlens-store";
import { DecisionBoard, CompareReports } from "@/components/decision-studio";
import { SourceExplorer } from "@/components/source-explorer";
import { ResearchBuilder } from "@/components/research-builder";

const provenance = (r: Report) =>
  r.engine === "serpapi+gemini"
    ? "AI synthesis with live search results"
    : r.engine === "serpapi"
      ? "Demo analysis with live search links"
      : r.engine === "gemini"
        ? "AI analysis without live evidence"
        : "Illustrative demo — not live research";

function Notice({ report }: { report?: Report }) {
  const w = useWorkspace();
  if (!report && w.mode === "live")
    return (
      <aside className="my-6 border-l-2 border-primary bg-primary/5 p-4 text-sm leading-6">
        <strong className="block">Live research · your private cloud workspace</strong>
        <span className="text-muted-foreground">
          {!w.session
            ? "Sign in in Settings to start live research."
            : w.ready
              ? "Web search evidence, AI synthesis and practical next steps. Up to five attempts per UTC day."
              : "Account connected. The owner needs to add provider keys before live research is available."}
        </span>
        {!w.session && (
          <Link to="/settings" className="ml-2 text-primary underline">
            Sign in
          </Link>
        )}
      </aside>
    );
  return (
    <aside className="my-6 border-l-2 border-primary bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
      <strong className="block text-foreground">
        {report ? provenance(report) : "Demo workspace · no API key required"}
      </strong>
      {report?.engine === "serpapi+gemini"
        ? "AI synthesis of search snippets, not full articles. Recommendations are hypotheses; verify claims, dates and context in the original sources."
        : "Reports use curated industry examples. Scores, growth, competitors and sample sources are illustrative, not verified facts about your query. Demo reports stay in this browser."}
    </aside>
  );
}

export function DashboardPage() {
  const reports = useStoredReports();
  return (
    <AppShell
      title="Overview"
      action={
        <Button asChild>
          <Link to="/research">
            New research <ArrowRight />
          </Link>
        </Button>
      }
    >
      <Eyebrow>Your intelligence workspace</Eyebrow>
      <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
        What should we understand today?
      </h2>
      <Notice />
      <SearchBox />
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          [reports.length, "Reports in this workspace"],
          [reports.filter((r) => r.saved).length, "Bookmarked briefings"],
          [new Set(reports.map((r) => r.industry)).size, "Industries explored"],
        ].map(([value, label]) => (
          <div className="panel p-6" key={label}>
            <strong className="text-4xl text-primary">{value}</strong>
            <p className="mt-3 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>
      <section className="mt-12">
        <Eyebrow>Start exploring</Eyebrow>
        <div className="mt-6">
          <SearchChips items={suggestedResearch} variant="chip" />
        </div>
      </section>
      <section className="mt-12">
        <Eyebrow>Recent research</Eyebrow>
        <ReportRows reports={reports.slice(0, 5)} />
      </section>
    </AppShell>
  );
}

export function ResearchPage() {
  const reports = useStoredReports();
  return (
    <AppShell title="Research">
      <div className="mx-auto max-w-5xl py-6 md:py-14">
        <Eyebrow>Research engine</Eyebrow>
        <h2 className="mt-6 text-4xl font-semibold md:text-6xl">Ask a market question.</h2>
        <Notice />
        <SearchBox />
        <ResearchBuilder />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <section>
            <Eyebrow>Suggested research</Eyebrow>
            <div className="mt-6">
              <SearchChips items={suggestedResearch} variant="chip" />
            </div>
          </section>
          <section>
            <Eyebrow>Explore by category</Eyebrow>
            <div className="mt-6">
              <SearchChips items={categoryChips} variant="chip" />
            </div>
          </section>
        </div>
        <section className="mt-12">
          <Eyebrow>Your recent searches</Eyebrow>
          <ReportRows reports={reports.slice(0, 4)} />
        </section>
      </div>
    </AppShell>
  );
}

export function ProcessingPage() {
  const { q, mode } = useSearch({ from: "/processing" });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const w = useWorkspace();
  const wRef = useRef(w);
  wRef.current = w;
  const userId = w.session?.user.id;
  const request = useRef<{ key: string; promise: Promise<Report> } | null>(null);
  useEffect(() => {
    const query = q?.trim() ?? "";
    if (query.length < 2 || query.length > 240) {
      setError("Enter a question between 2 and 240 characters.");
      return;
    }
    setError("");
    if (!w.authReady) return;
    let cancelled = false;
    // A stable promise and request ID prevent duplicate paid calls during effect replay.
    const timer = window.setTimeout(async () => {
      try {
        let report: Report;
        if (w.mode === "live") {
          if (!userId) throw new Error("Sign in in Settings before running live research.");
          const key = JSON.stringify([query, mode, attempt, userId]);
          if (request.current?.key !== key)
            request.current = {
              key,
              promise: runIntelligence({
                data: { query, kind: mode ?? "report", requestId: crypto.randomUUID() },
              }),
            };
          report = await request.current.promise;
          await wRef.current.refresh();
        } else {
          report = { ...generateReport(query, mode ?? "report"), id: crypto.randomUUID() };
          saveReport(report);
        }
        if (cancelled) return;
        void navigate({
          to: mode === "opportunity" ? "/opportunity-lens" : "/report",
          search: { id: report.id },
          replace: true,
        });
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Report creation failed. Please retry.");
      }
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [q, mode, navigate, attempt, w.authReady, w.mode, userId]);
  return (
    <AppShell title="Preparing your briefing">
      <div className="mx-auto max-w-3xl py-16">
        <Eyebrow>{w.mode === "live" ? "Research in progress" : "Demo research task"}</Eyebrow>
        <h2 className="mt-6 break-words text-4xl font-semibold">{q || "No question entered"}</h2>
        <Notice />
        <p role="status" aria-live="polite" className="mt-8">
          {error ||
            (w.mode === "live"
              ? "Finding sources, synthesizing the evidence and saving your briefing… This can take about a minute."
              : "Matching an industry example and preparing your report…")}
        </p>
        <div className="mt-8 flex gap-3">
          {error && <Button onClick={() => setAttempt((n) => n + 1)}>Retry</Button>}
          <Button variant="outline" asChild>
            <Link to="/research">{error ? "Edit question" : "Cancel"}</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

export function ReportPage() {
  const { id } = useSearch({ from: "/report" });
  return <ReportReader id={id} />;
}

export function OpportunityPage() {
  const { id } = useSearch({ from: "/opportunity-lens" });
  if (id) return <ReportReader id={id} />;
  return (
    <AppShell title="Opportunity Lens">
      <div className="mx-auto max-w-4xl py-12">
        <Eyebrow>Decision intelligence</Eyebrow>
        <h2 className="mt-6 text-5xl font-semibold md:text-7xl">Should you build it?</h2>
        <p className="mt-6 text-muted-foreground">
          Explore an idea, its risks, possible competitors, and practical validation steps.
        </p>
        <Notice />
        <SearchBox mode="opportunity" placeholder="Describe your business idea…" />
      </div>
    </AppShell>
  );
}

function ReportReader({ id }: { id?: string | undefined }) {
  const [view, setView] = useState<"briefing" | "decision" | "compare" | "sources">("briefing");
  const stored = useStoredReports();
  const w = useWorkspace();
  const detail = useQuery({
    queryKey: ["cloud-reports", w.session?.user.id, id],
    queryFn: () => getMyReport({ data: { id: id! } }),
    enabled: !!id && !!w.session && w.mode === "live",
    retry: false,
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [sample, setSample] = useState<Report>();
  const navigate = useNavigate();
  useEffect(() => {
    setReady(true);
    setSample(generateReport("Electric cars in South Africa"));
  }, []);
  const report = id ? (stored.find((r) => r.id === id) ?? detail.data) : sample;
  if (!ready || w.loading || (!!id && !!w.session && w.mode === "live" && detail.isPending))
    return (
      <AppShell title="Report">
        <p role="status">Loading report…</p>
      </AppShell>
    );
  if (!report)
    return (
      <AppShell title="Report not found">
        <h2 className="text-3xl font-semibold">This report is unavailable in this workspace.</h2>
        <p className="my-6 text-muted-foreground">
          {detail.error
            ? detail.error.message
            : "Check the selected research mode and sign in to the account that created it. Demo links work only in the original browser."}
        </p>
        <Button asChild>
          <Link to="/research">Start new research</Link>
        </Button>
      </AppShell>
    );
  const perform = async (action: () => void | Promise<void>) => {
    try {
      await action();
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    }
  };
  const bookmark = () =>
    perform(async () => {
      if (!id) {
        w.setMode("demo");
        const copy = saveReport({ ...report, id: crypto.randomUUID(), saved: true });
        void navigate({ to: "/report", search: { id: copy.id } });
      } else await w.bookmark(id, !report.saved);
    });
  return (
    <AppShell
      title={report.kind === "opportunity" ? "Opportunity analysis" : "Intelligence report"}
      action={
        <Button variant="outline" size="sm" onClick={bookmark}>
          <Bookmark />
          {report.saved ? "Unsave" : "Save report"}
        </Button>
      }
    >
      <article className="mx-auto max-w-6xl">
        <header className="report-header">
          <div>
            <Eyebrow>
              {report.industry} / {report.region}
            </Eyebrow>
            <h2 className="mt-6 break-words text-4xl font-semibold md:text-6xl">{report.title}</h2>
            <p className="mt-5 text-xs text-muted-foreground">
              {new Date(report.createdAt).toLocaleString()} · {report.sources.length}{" "}
              {report.live ? "search results" : "sample references"}
            </p>
          </div>
        </header>
        <Notice report={report} />
        <div className="report-actions flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => exportReport(report)}>
            <Download />
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer />
            Print / PDF
          </Button>
          {id && (
            <Button
              variant="ghost"
              onClick={() => {
                if (window.confirm("Delete this report? This cannot be undone."))
                  perform(async () => {
                    await w.remove(id);
                    void navigate({ to: "/history" });
                  });
              }}
            >
              <Trash2 />
              Delete
            </Button>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-4 text-negative">
            {error}
          </p>
        )}
        <nav className="report-view-tabs" aria-label="Report views">
          {(
            [
              ["briefing", "Research briefing"],
              ["decision", "Decision board"],
              ["compare", "Compare reports"],
              ["sources", "Source explorer"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={view === key ? "active" : ""}
            >
              {label}
            </button>
          ))}
        </nav>
        {view === "decision" && <DecisionBoard key={report.id} report={report} />}
        {view === "sources" && <SourceExplorer key={report.id} report={report} />}
        {view === "compare" && <CompareReports key={report.id} report={report} reports={stored} />}
        <div hidden={view !== "briefing"}>
          <section className="editorial-section">
            <Eyebrow>01 / Executive summary</Eyebrow>
            <p className="briefing-lead mt-8">{report.summary}</p>
            <p className="mt-6 leading-7 text-muted-foreground">{report.secondary}</p>
          </section>
          <section className="editorial-section">
            <Eyebrow>
              02 /{" "}
              {report.engine === "corpus" || !report.engine
                ? "Illustrative scores"
                : "Evidence to verify"}
            </Eyebrow>
            {report.live ? (
              <div className="mt-8 grid gap-5">
                {report.evidence?.map((e, i) => (
                  <div key={i} className="border-l border-primary/40 pl-5">
                    <p className="leading-7">{e.claim}</p>
                    <div className="mt-2 flex gap-3">
                      {e.sourceRanks.map((n) => (
                        <a key={n} className="text-sm text-primary underline" href={"#source-" + n}>
                          Source {n}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="metrics-composition mt-8">
                {Object.entries(report.metrics).map(([label, value]) => (
                  <MetricDial
                    key={label}
                    value={value ?? 0}
                    label={label}
                    caption="Not a measured statistic"
                  />
                ))}
              </div>
            )}
          </section>
          <section className="editorial-section">
            <Eyebrow>03 / Key insights</Eyebrow>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {report.insights.map((item, i) => (
                <div className="border-t border-border pt-6" key={i}>
                  <span className="impact-label">{item.impact}</span>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="editorial-section">
            <Eyebrow>04 / Competitor landscape</Eyebrow>
            <p className="mt-4 text-sm text-muted-foreground">
              {report.live
                ? "Candidates mentioned in the available evidence. This is not a complete market map or a market-share ranking."
                : "Candidate competitors to investigate; bars are illustrative scores, not verified market shares."}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {report.competitors.map((c, i) => (
                <div key={i}>
                  <div className="mb-3 flex justify-between gap-4">
                    <strong>{c.name}</strong>
                    <span className="text-sm text-muted-foreground">{c.signal}</span>
                  </div>
                  {!report.live && (
                    <div className="h-1 bg-secondary">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min(100, Math.max(0, c.share ?? 0))}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="editorial-section">
            <Eyebrow>05 / Opportunities</Eyebrow>
            <div className="mt-8 overflow-x-auto">
              <table className="intelligence-table">
                <thead>
                  <tr>
                    {["Opportunity", "Potential", "Difficulty", "Gap"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.opportunities.map((row, i) => (
                    <tr key={i}>
                      {row.map((c, j) => (
                        <td key={j}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="editorial-section grid gap-10 md:grid-cols-2">
            <div>
              <Eyebrow>06 / Risks</Eyebrow>
              {report.risks.map(([risk, severity], i) => (
                <div className="flex justify-between gap-4 border-b border-border py-5" key={i}>
                  <span>{risk}</span>
                  <span className="text-muted-foreground">{severity}</span>
                </div>
              ))}
            </div>
            <div className="verdict-panel">
              <Eyebrow>Assessment to validate</Eyebrow>
              <h3 className="mt-8 text-3xl font-semibold text-primary">
                {report.verdict.headline}
              </h3>
              <p className="mt-5 leading-7 text-muted-foreground">{report.verdict.body}</p>
            </div>
          </section>
          <section className="editorial-section">
            <Eyebrow>07 / Next steps</Eyebrow>
            <ol className="mt-6 list-decimal space-y-4 pl-5">
              {report.nextSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
          <section className="editorial-section">
            <Eyebrow>
              08 / {report.live ? "Search results" : "Sample reference publications"}
            </Eyebrow>
            <p className="mt-4 text-sm text-muted-foreground">
              {report.live
                ? "Follow each original link and check its date and evidence."
                : "These are publisher homepages, not citations supporting the demo's claims. No articles were fetched."}
            </p>
            <div className="mt-6 divide-y divide-border">
              {report.sources.map((s, i) => (
                <a
                  key={i}
                  id={"source-" + s.rank}
                  href={safeHref(s.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-5 hover:text-primary"
                >
                  <span className="text-xs text-muted-foreground">{s.domain}</span>
                  <h3 className="mt-2 font-medium">
                    {report.live ? s.title : `Explore ${s.domain}`}
                  </h3>
                  {report.live && <p className="mt-2 text-sm text-muted-foreground">{s.snippet}</p>}
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </AppShell>
  );
}

function safeHref(url: string) {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}

function exportReport(report: Report) {
  const blob = new Blob([JSON.stringify({ ...report, disclosure: provenance(report) }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trendlens-${report.title.replace(/[^a-z0-9]+/gi, "-").slice(0, 65)}.json`;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ReportRows({ reports }: { reports: Report[] }) {
  return reports.length ? (
    <div className="mt-6 divide-y divide-border border-y border-border">
      {reports.map((r) => (
        <Link
          key={r.id}
          to={r.kind === "opportunity" ? "/opportunity-lens" : "/report"}
          search={{ id: r.id }}
          className="report-row"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{r.title}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {r.industry} · {r.region} · {r.saved ? "Bookmarked" : "History"}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{r.kind}</span>
          <ArrowRight className="size-4" />
        </Link>
      ))}
    </div>
  ) : (
    <p className="my-8 text-muted-foreground">
      No reports yet. Start a search to create your first briefing.
    </p>
  );
}
