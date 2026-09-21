import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import assert from "node:assert/strict";
const require = createRequire(
  process.env.BROWSER_TOOLS_DIR
    ? resolve(process.env.BROWSER_TOOLS_DIR, "package.json")
    : import.meta.url,
);
const { chromium: playwright } = require("playwright-core");
const out = process.env.BROWSER_ARTIFACTS_DIR || resolve("artifacts");
await mkdir(out, { recursive: true });
const binary = process.env.BROWSER_EXECUTABLE || playwright.executablePath();
const server = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "3197"],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
server.stdout.on("data", (c) => (logs += c));
server.stderr.on("data", (c) => (logs += c));
let browser;
try {
  for (let n = 0; n < 60; n++) {
    try {
      await fetch("http://127.0.0.1:3197");
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  browser = await playwright.launch({
    executablePath: binary,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-zygote"],
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3197", { waitUntil: "networkidle" });
  await page.screenshot({ path: out + "/trendlens-home.png", fullPage: true });
  await page.goto("http://127.0.0.1:3197/research", { waitUntil: "networkidle" });
  await page.getByLabel("Business or market").fill("student meals");
  await page.getByLabel("Location", { exact: true }).fill("Johannesburg");
  await page.getByLabel("Research goal", { exact: true }).selectOption("market-entry risks");
  await page.screenshot({ path: out + "/trendlens-guided-research.png", fullPage: true });
  await page.getByRole("button", { name: "Research this decision" }).click();
  await page.waitForURL(/\/report\?id=/, { timeout: 20000 });
  await page
    .getByText("Assess market-entry risks for student meals in Johannesburg", { exact: false })
    .first()
    .waitFor();
  await page.goto("http://127.0.0.1:3197/dashboard", { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Research query" }).fill("Solar energy in Nigeria");
  await page.getByRole("button", { name: "Start research", exact: true }).click();
  await page.waitForURL(/\/report\?id=/, { timeout: 20000 });
  await page.getByText("Solar Energy in Nigeria", { exact: false }).first().waitFor();
  await page.screenshot({ path: out + "/trendlens-report.png", fullPage: true });
  const firstReportUrl = page.url();
  const firstReportId = new URL(firstReportUrl).searchParams.get("id");
  await page.getByRole("button", { name: "Source explorer", exact: true }).click();
  await page.getByLabel("Search evidence").fill("unmatchable-xyz-987");
  await page.getByText("No references match these filters.", { exact: false }).waitFor();
  await page.getByLabel("Search evidence").fill("");
  const publisher = await page
    .getByLabel("Publisher", { exact: true })
    .locator("option")
    .nth(1)
    .getAttribute("value");
  const publisherText = await page
    .getByLabel("Publisher", { exact: true })
    .locator("option")
    .nth(1)
    .textContent();
  await page.getByLabel("Publisher", { exact: true }).selectOption(publisher ?? publisherText);
  const sourceDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export source pack" }).click();
  const pack = await sourceDownload;
  assert.match(pack.suggestedFilename(), /^trendlens-sources-.*\.md$/);
  await pack.saveAs(out + "/test-source-pack.md");
  assert.match(
    await readFile(out + "/test-source-pack.md", "utf8"),
    /Illustrative sample references/,
  );
  await page.getByLabel("Publisher", { exact: true }).selectOption("");
  await page.getByRole("region", { name: "Source explorer", exact: true }).screenshot({
    path: out + "/trendlens-sources.png",
    style: "header.sticky { visibility: hidden !important; }",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
    "source explorer mobile overflow",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Decision board", exact: true }).click();
  await page.getByRole("checkbox", { name: "Complete experiment 1" }).check();
  await page
    .getByLabel("What did you learn?")
    .fill("Demo note: speak to five prospective customers before committing budget.");
  await page.getByLabel("Current position").selectOption("pilot");
  const memoDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export decision memo" }).click();
  const memo = await memoDownload;
  await memo.saveAs(out + "/test-decision-memo.md");
  assert.match(await readFile(out + "/test-decision-memo.md", "utf8"), /Run a small pilot/);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Decision board", exact: true }).click();
  assert.equal(
    await page.getByRole("checkbox", { name: "Complete experiment 1" }).isChecked(),
    true,
  );
  assert.match(await page.getByLabel("What did you learn?").inputValue(), /five prospective/);
  await page.getByRole("region", { name: "Decision board", exact: true }).screenshot({
    path: out + "/trendlens-decision-board.png",
    style: "header.sticky { visibility: hidden !important; }",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
    "decision board mobile overflow",
  );
  await page.getByRole("region", { name: "Decision board", exact: true }).screenshot({
    path: out + "/trendlens-decision-mobile.png",
    style: "header.sticky { visibility: hidden !important; }",
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  const bookmark = page.getByRole("button", { name: "Save report", exact: true });
  await bookmark.click();
  await page.goto("http://127.0.0.1:3197/processing?q=AI%20startups%20in%20South%20Africa", {
    waitUntil: "networkidle",
  });
  await page.waitForURL(/\/report\?id=/, { timeout: 20000 });
  await page.getByRole("button", { name: "Compare reports", exact: true }).click();
  await page.getByLabel("Compare with").selectOption(firstReportId);
  await page.getByRole("region", { name: "Compare reports", exact: true }).screenshot({
    path: out + "/trendlens-comparison.png",
    style: "header.sticky { visibility: hidden !important; }",
  });
  assert.ok(
    (await page.getByRole("region", { name: "Compare reports", exact: true }).innerText()).includes(
      "Solar Energy in Nigeria",
    ),
  );
  await page.goto("http://127.0.0.1:3197/saved-reports", { waitUntil: "networkidle" });
  assert.ok((await page.locator("body").innerText()).includes("Solar Energy"));
  await page.goto("http://127.0.0.1:3197/dashboard", { waitUntil: "networkidle" });
  await page.screenshot({ path: out + "/trendlens-dashboard.png", fullPage: true });
  await page.getByLabel("Research mode").selectOption("live");
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).waitFor();
  await page.screenshot({ path: out + "/trendlens-account.png", fullPage: true });
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.screenshot({ path: out + "/trendlens-dark.png", fullPage: true });
  await page.goto(firstReportUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Decision board", exact: true }).click();
  await page.getByRole("region", { name: "Decision board", exact: true }).screenshot({
    path: out + "/trendlens-decision-dark.png",
    style: "header.sticky { visibility: hidden !important; }",
  });
  await page.goto("http://127.0.0.1:3197/settings", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3197", { waitUntil: "networkidle" });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
    "mobile overflow",
  );
  await page.screenshot({ path: out + "/trendlens-mobile.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    "PASS desktop/mobile rendering, research, bookmarks, decision progress/notes persistence, memo export, report comparison, live sign-in gate and themes; no page errors.",
  );
} catch (e) {
  await writeFile(out + "/browser-server.log", logs);
  throw e;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
