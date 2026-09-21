import test from "node:test";
import assert from "node:assert/strict";
import { generateReport, resolveIndustry, resolveRegion } from "../src/lib/trendlens-data.ts";
import {
  listReports,
  getReport,
  saveReport,
  bookmarkReport,
  removeReport,
  clearReports,
} from "../src/lib/trendlens-store.ts";

const data = new Map();
globalThis.window = Object.assign(new EventTarget(), {
  localStorage: {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  },
});

test("different industries produce different example reports", () => {
  const ev = generateReport("Electric cars in South Africa");
  const ai = generateReport("AI startups in Nigeria", "opportunity");
  assert.notEqual(ev.summary, ai.summary);
  assert.equal(ai.kind, "opportunity");
  assert.equal(ai.region, "Nigeria");
  assert.equal(ev.engine, "corpus");
  assert.equal(ev.live, false);
  assert.equal(ev.sourceCount, ev.sources.length);
  assert.equal(ev.signalCount, ev.signals.length);
});

test("short keywords match words, not unrelated substrings", () => {
  assert.notEqual(resolveIndustry("haircare").key, "ai");
  assert.notEqual(resolveIndustry("career advice").key, "mobility");
  assert.equal(resolveRegion("Electric cars in South Africa"), "South Africa");
});

test("save, bookmark, unbookmark, lookup and delete", () => {
  clearReports();
  const report = generateReport("Solar energy");
  saveReport(report);
  assert.equal(listReports().length, 1);
  bookmarkReport(report.id, true);
  assert.equal(getReport(report.id).saved, true);
  bookmarkReport(report.id, false);
  assert.equal(getReport(report.id).saved, false);
  removeReport(report.id);
  assert.equal(getReport(report.id), undefined);
});

test("storage cap and newest-first order", () => {
  clearReports();
  for (let i = 0; i < 45; i++)
    saveReport({ ...generateReport("AI"), id: `test-${i}`, createdAt: i });
  assert.equal(listReports().length, 40);
  assert.equal(listReports()[0].id, "test-44");
});

test("malformed storage is safely ignored", () => {
  for (const raw of ["{broken", "{}", '[null,1,"x",{"id":"bad"}]']) {
    data.set("trendlens.reports.v1", raw);
    assert.deepEqual(listReports(), []);
  }
});

test("storage failure is surfaced instead of reporting false success", () => {
  const original = window.localStorage.setItem;
  window.localStorage.setItem = () => {
    throw new Error("Quota exceeded");
  };
  assert.throws(() => saveReport(generateReport("AI")), /could not save/);
  window.localStorage.setItem = original;
});
