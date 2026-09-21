import { generateReport, type Report } from "./trendlens-data.ts";

const KEY = "trendlens.reports.v1";

function read(): Report[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter(isReport).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function write(reports: Report[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(reports.slice(0, 40)));
  } catch {
    throw new Error(
      "Your browser could not save this report. Enable local storage or free some space and retry.",
    );
  }
  window.dispatchEvent(new Event("trendlens:reports"));
}

export function listReports(): Report[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function getReport(id?: string): Report | undefined {
  const all = listReports();
  return id ? all.find((report) => report.id === id) : all[0];
}

export function saveReport(report: Report): Report {
  const existing = read().filter((entry) => entry.id !== report.id);
  write([report, ...existing]);
  return report;
}

export function runResearch(query: string, kind: "report" | "opportunity" = "report") {
  return saveReport(generateReport(query, kind));
}

export function clearReports() {
  write([]);
}

export function isReport(value: unknown): value is Report {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<Report>;
  return (
    typeof r.id === "string" &&
    typeof r.title === "string" &&
    typeof r.query === "string" &&
    typeof r.summary === "string" &&
    typeof r.secondary === "string" &&
    typeof r.createdAt === "number" &&
    Number.isFinite(r.createdAt) &&
    (r.kind === "report" || r.kind === "opportunity") &&
    !!r.metrics &&
    Object.values(r.metrics).length === 4 &&
    Object.values(r.metrics).every((n) => typeof n === "number" && Number.isFinite(n)) &&
    !!r.verdict &&
    typeof r.verdict.headline === "string" &&
    typeof r.verdict.body === "string" &&
    Array.isArray(r.sources) &&
    r.sources.every((s) => !!s && typeof s.url === "string" && typeof s.title === "string") &&
    Array.isArray(r.insights) &&
    r.insights.every((i) => !!i && typeof i.title === "string" && typeof i.body === "string") &&
    Array.isArray(r.competitors) &&
    r.competitors.every((c) => !!c && typeof c.name === "string" && typeof c.share === "number") &&
    Array.isArray(r.opportunities) &&
    r.opportunities.every(
      (row) => Array.isArray(row) && row.length === 4 && row.every((c) => typeof c === "string"),
    ) &&
    Array.isArray(r.risks) &&
    r.risks.every(
      (row) => Array.isArray(row) && row.length === 2 && row.every((c) => typeof c === "string"),
    ) &&
    Array.isArray(r.signals) &&
    r.signals.every((s) => typeof s === "string") &&
    Array.isArray(r.nextSteps) &&
    r.nextSteps.every((s) => typeof s === "string")
  );
}

export function bookmarkReport(id: string, saved: boolean) {
  write(read().map((report) => (report.id === id ? { ...report, saved } : report)));
}

export function removeReport(id: string) {
  write(read().filter((report) => report.id !== id));
}
