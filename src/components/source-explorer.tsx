import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/lib/decision-tools";
import type { Report } from "@/lib/trendlens-data";

export function SourceExplorer({ report }: { report: Report }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [claim, setClaim] = useState("");
  const domains = [...new Set(report.sources.map((source) => source.domain))].sort();
  const evidence = report.live ? (report.evidence ?? []) : [];
  const selected = claim === "" ? undefined : evidence[Number(claim)];
  const sources = report.sources.filter(
    (source) =>
      (!domain || source.domain === domain) &&
      (!selected || selected.sourceRanks.includes(source.rank)) &&
      `${source.title} ${source.snippet} ${source.domain}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const label = report.live
    ? "Search snippets — verify against original publications"
    : "Illustrative sample references — not live evidence";
  function exportSources() {
    downloadText(
      [
        `# Source pack: ${report.title}`,
        label,
        `Report compiled: ${new Date(report.createdAt).toISOString()}. This is not a publication date.`,
        `Export includes ${sources.length} currently filtered references. Citations indicate attribution, not independent verification.`,
        ...sources.map(
          (source) =>
            `## ${source.rank}. ${source.title}\n\nPublisher: ${source.domain}\n\n${source.snippet}\n\nOriginal URL: ${/^https?:\/\//i.test(source.url) ? source.url : "Unavailable"}`,
        ),
      ].join("\n\n"),
      `trendlens-sources-${report.id}.md`,
    );
  }
  return (
    <section className="mt-7" aria-label="Source explorer">
      <div className="rounded-2xl border bg-primary/5 p-6 md:p-10">
        <p className="text-xs uppercase tracking-widest text-primary">Evidence workspace</p>
        <h3 className="mt-4 text-3xl font-semibold">Follow the claim. Inspect the source.</h3>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          {label}. Search results can omit context; open the original page before making a decision.
        </p>
        <p className="mt-5 text-sm">
          {report.sources.length} references · {domains.length} publisher domains ·{" "}
          {evidence.length} attributed claims
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Compiled {new Date(report.createdAt).toLocaleString()}. Publication dates are not
          available in this report.
        </p>
      </div>
      <div className="my-6 grid gap-4 md:grid-cols-3">
        <label className="text-sm">
          Search evidence
          <input
            className="mt-2 w-full rounded-xl border bg-background p-3"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles or snippets"
          />
        </label>
        <label className="text-sm">
          Publisher
          <select
            className="mt-2 w-full rounded-xl border bg-background p-3"
            aria-label="Publisher"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          >
            <option value="">All publishers</option>
            {domains.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Attributed claim
          <select
            className="mt-2 w-full rounded-xl border bg-background p-3"
            aria-label="Attributed claim"
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
          >
            <option value="">All references</option>
            {evidence.map((item, index) => (
              <option key={index} value={index}>
                {item.claim}
              </option>
            ))}
          </select>
        </label>
      </div>
      {selected && (
        <p className="mb-5 border-l-2 border-primary pl-4 leading-7">{selected.claim}</p>
      )}
      {domains.length < 2 && (
        <p className="mb-5 text-sm text-muted-foreground">
          Evidence gap: seek another independent publisher before relying on these findings.
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm">
          Showing {sources.length} of {report.sources.length} references
        </p>
        <Button variant="outline" onClick={exportSources}>
          Export source pack
        </Button>
      </div>
      <div className="grid gap-4">
        {sources.map((source) => (
          <article key={source.rank} className="rounded-2xl border p-6">
            <p className="text-xs uppercase tracking-wide text-primary">
              Reference {source.rank} · {source.domain}
            </p>
            <h4 className="mt-3 text-xl font-semibold">{source.title}</h4>
            <p className="mt-3 leading-7 text-muted-foreground">{source.snippet}</p>
            {/^https?:\/\//i.test(source.url) && (
              <a
                className="mt-4 inline-block text-sm text-primary underline underline-offset-4"
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {report.live ? "Open original publication ↗" : "Open sample reference ↗"}
              </a>
            )}
          </article>
        ))}
      </div>
      {sources.length === 0 && (
        <p className="rounded-2xl border p-8 text-muted-foreground">
          No references match these filters. Try another keyword or publisher.
        </p>
      )}
    </section>
  );
}
