import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Clock3,
  Compass,
  ExternalLink,
  History,
  Lightbulb,
  Menu,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Report, ReportSource } from "@/lib/trendlens-data";
import { clearReports } from "@/lib/trendlens-store";
import { useWorkspace } from "@/lib/workspace";
import { AccountPanel } from "@/components/account-panel";
import { useTheme } from "@/lib/theme";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="TrendLens AI home">
      <img src="/trendlens-icon.svg" alt="" width={32} height={32} className="size-8 rounded-md" />
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          TrendLens <span className="text-primary">AI</span>
        </span>
      )}
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function EngineBadge() {
  return (
    <span className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="status-dot" />
      Demo workspace · illustrative data
    </span>
  );
}

/** Shared research entry point: always routes into the cinematic processing flow. */
export function SearchBox({
  compact = false,
  defaultValue = "",
  placeholder = "Search any market, trend, industry or business idea...",
  mode = "report",
}: {
  compact?: boolean;
  defaultValue?: string;
  placeholder?: string;
  mode?: "report" | "opportunity";
}) {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (value.length >= 2 && value.length <= 240)
      void navigate({ to: "/processing", search: { q: value, mode } });
  };
  return (
    <form
      onSubmit={submit}
      className={`search-shell group ${compact ? "search-shell-compact" : ""}`}
    >
      <Search className="size-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground md:text-lg"
        placeholder={placeholder}
        aria-label="Research query"
        required
        minLength={2}
        maxLength={240}
      />
      <Button type="submit" size={compact ? "icon" : "lg"} aria-label="Start research">
        <span className="hidden sm:inline">Research</span>
        <ArrowRight />
      </Button>
    </form>
  );
}

/** Suggestion / category chips that fill the search intent and launch the generator. */
export function SearchChips({
  items,
  variant = "link",
}: {
  items: readonly string[];
  variant?: "link" | "chip";
}) {
  const navigate = useNavigate();
  const run = (item: string) =>
    void navigate({ to: "/processing", search: { q: item, mode: "report" } });
  if (variant === "chip") {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button key={item} type="button" onClick={() => run(item)} className="category-chip">
            {item}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <button key={item} type="button" onClick={() => run(item)} className="suggestion-link">
          <ArrowUpRight />
          {item}
        </button>
      ))}
    </div>
  );
}

const nav = [
  { to: "/dashboard", label: "Overview", icon: Compass },
  { to: "/research", label: "Research", icon: Search },
  { to: "/opportunity-lens", label: "Opportunity Lens", icon: Lightbulb },
  { to: "/history", label: "History", icon: History },
  { to: "/saved-reports", label: "Saved Reports", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  children,
  title,
  action,
}: {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const workspace = useWorkspace();
  const path = useRouterState({ select: (state) => state.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <aside
        className={`app-sidebar ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <Brand />
          <button
            onClick={() => setOpen(false)}
            className="icon-button lg:hidden"
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase text-muted-foreground">
            Intelligence suite
          </p>
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`sidebar-link ${path === to ? "sidebar-link-active" : ""}`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="m-4 border-t border-border pt-5">
          <div className="flex items-center gap-3 px-2">
            <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">
              TL
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {workspace.session?.user.email ?? "Guest workspace"}
              </p>
              <p className="text-xs text-muted-foreground">
                {workspace.mode === "live" ? "Cloud · private to you" : "Demo · this browser"}
              </p>
            </div>
          </div>
        </div>
      </aside>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-overlay lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-border bg-background/90 px-5 py-3 backdrop-blur-xl md:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="icon-button lg:hidden"
              aria-label="Open navigation"
            >
              <Menu />
            </button>
            <h1 className="text-sm font-semibold md:text-base">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              aria-label="Research mode"
              className="rounded-md border border-border bg-background px-2 py-2 text-xs"
              value={workspace.mode}
              onChange={(e) => workspace.setMode(e.target.value as "demo" | "live")}
            >
              <option value="demo">Demo mode</option>
              <option value="live">Live research</option>
            </select>
            {action}
          </div>
        </header>
        <div className="mx-auto max-w-[1480px] px-5 py-8 md:px-9 md:py-12">
          {workspace.error && (
            <p role="alert" className="mb-5 border border-border p-4">
              {workspace.error}{" "}
              <button className="text-primary underline" onClick={() => void workspace.refresh()}>
                Retry
              </button>
            </p>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

/** Smooth count-up used by metric dials and gauges; respects reduced motion. */
export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const frame = useRef(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);
  return value;
}

export function MetricDial({
  value,
  label,
  caption,
  tone = "primary",
}: {
  value: number;
  label: string;
  caption: string;
  tone?: "primary" | "positive";
}) {
  const animated = useCountUp(value);
  return (
    <div className="metric-dial">
      <div
        className={`metric-ring ${tone === "positive" ? "metric-ring-positive" : ""}`}
        style={{ "--score": `${animated * 3.6}deg` } as React.CSSProperties}
      >
        <div>
          <strong>{animated}</strong>
          <span>{label.includes("Sentiment") || label.includes("Confidence") ? "%" : "/100"}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-xs font-semibold uppercase text-foreground">{caption}</p>
      </div>
    </div>
  );
}

export function ConfidenceMeter({ value }: { value: number }) {
  const animated = useCountUp(value, 1200);
  return (
    <div>
      <div className="flex items-baseline gap-1">
        <strong className="text-5xl">{animated}</strong>
        <span className="text-xl text-muted-foreground">%</span>
      </div>
      <p className="mt-2 text-[10px] uppercase text-muted-foreground">Confidence score</p>
      <div className="mt-4 h-1 w-full bg-secondary">
        <div
          className="h-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${animated}%` }}
        />
      </div>
    </div>
  );
}

export function MiniTrendChart() {
  return (
    <div
      className="relative h-64 overflow-hidden"
      aria-label="Illustrative trend chart showing growth from September 2025 to September 2026"
    >
      <div className="chart-grid absolute inset-0" />
      <svg
        viewBox="0 0 800 240"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
      >
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity=".22" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 205 C80 194 105 182 155 187 S235 151 288 160 S372 112 430 123 S510 92 565 101 S650 54 705 65 S770 30 800 25 L800 240 L0 240Z"
          fill="url(#area)"
          className="chart-area"
        />
        <path
          d="M0 205 C80 194 105 182 155 187 S235 151 288 160 S372 112 430 123 S510 92 565 101 S650 54 705 65 S770 30 800 25"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          className="chart-line"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] uppercase text-muted-foreground">
        <span>Sep ‘25</span>
        <span>Jan ‘26</span>
        <span>May ‘26</span>
        <span>Sep ‘26</span>
      </div>
    </div>
  );
}

/** SerpApi-style source transparency card. */
export function SourceRow({ domain, title, snippet, rank }: ReportSource) {
  const initials = domain
    .replace(/^www\./, "")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="source-row">
      <span
        className="grid size-10 shrink-0 place-items-center border border-border bg-secondary text-[11px] font-semibold text-primary"
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-[10px] font-semibold uppercase text-primary">{domain}</p>
          <span className="border border-border px-2 py-0.5 text-[9px] uppercase text-muted-foreground">
            SerpApi organic rank #{rank}
          </span>
        </div>
        <h3 className="mt-2 font-medium text-foreground">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{snippet}</p>
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase text-foreground transition-colors hover:text-primary"
        >
          Built from live web intelligence <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

/** Live list of persisted reports, shared by History and Saved Reports. */
export function useStoredReports() {
  return useWorkspace().reports;
}

export function timeAgo(timestamp: number) {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function ReportListPage({ type }: { type: "History" | "Saved Reports" }) {
  const allReports = useStoredReports();
  const [filter, setFilter] = useState("");
  const reports = allReports.filter(
    (r) => (type === "History" || r.saved) && r.title.toLowerCase().includes(filter.toLowerCase()),
  );
  const Icon = type === "History" ? Clock3 : Bookmark;
  return (
    <AppShell title={type}>
      <input
        aria-label="Filter reports"
        placeholder="Filter reports…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 w-full border border-border bg-background p-3"
      />
      {reports.length === 0 ? (
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
          <span className="mb-6 grid size-14 place-items-center rounded-full border border-border bg-secondary">
            <Icon className="size-5 text-primary" />
          </span>
          <Eyebrow>{type}</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">
            Your {type.toLowerCase()} will appear here.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            Run your first market analysis to start building a private intelligence library.
          </p>
          <Button asChild className="mt-8">
            <Link to="/research">
              Start research <Sparkles />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl">
          <Eyebrow>{type}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {reports.length} {reports.length === 1 ? "briefing" : "briefings"}
          </h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={report.kind === "opportunity" ? "/opportunity-lens" : "/report"}
                search={
                  report.kind === "opportunity"
                    ? { id: report.id, q: undefined }
                    : { id: report.id }
                }
                className="report-row"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{report.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {report.industry} · {report.region}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-lg font-semibold text-primary">
                    {report.live ? report.sourceCount : report.metrics.trend}
                  </p>
                  <p className="text-[9px] uppercase text-muted-foreground">
                    {report.live ? "Sources" : "Demo score"}
                  </p>
                </div>
                <p className="hidden text-xs text-muted-foreground md:block">
                  {timeAgo(report.createdAt)}
                </p>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

export function EmptyPage({ type }: { type: "History" | "Saved Reports" | "Settings" }) {
  if (type !== "Settings") return <ReportListPage type={type} />;
  return <SettingsPage />;
}

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [message, setMessage] = useState("");
  return (
    <AppShell title="Settings">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>Your workspace</Eyebrow>
        <h2 className="mt-5 text-4xl font-semibold">Your intelligence, your way.</h2>
        <AccountPanel />
        <section className="editorial-section">
          <h3 className="text-xl font-semibold">Appearance</h3>
          <Button onClick={toggle} className="mt-5" variant="outline">
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </Button>
        </section>
        <section className="editorial-section">
          <h3 className="text-xl font-semibold">Privacy and storage</h3>
          <p className="my-5 leading-7 text-muted-foreground">
            Demo reports stay in this browser (up to 40 reports). Live reports are private to your
            account and sync across devices. Export important briefings before deleting them.
            Clearing demo data does not delete cloud reports.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              if (
                window.confirm("Permanently delete all reports and bookmarks from this browser?")
              ) {
                try {
                  clearReports();
                  setMessage("Local reports and bookmarks cleared.");
                } catch (e) {
                  setMessage(e instanceof Error ? e.message : "Could not clear reports.");
                }
              }
            }}
          >
            Clear local reports
          </Button>
          <p role="status" className="mt-4">
            {message}
          </p>
        </section>
        <section className="editorial-section">
          <h3 className="text-xl font-semibold">Research mode</h3>
          <p className="mt-5 leading-7 text-muted-foreground">
            Choose Demo or Live in the workspace header. Live research uses web search snippets and
            AI synthesis, with up to five attempts per account per UTC day. Failed attempts count
            toward the limit. Queries are sent to the search and AI providers. Check original
            sources before acting on conclusions.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
