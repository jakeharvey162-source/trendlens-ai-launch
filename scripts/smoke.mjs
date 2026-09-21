import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const server = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "3197"],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
server.stdout.on("data", (c) => {
  logs += c;
});
server.stderr.on("data", (c) => {
  logs += c;
});
const base = "http://127.0.0.1:3197";
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      await fetch(base, { signal: AbortSignal.timeout(3000) });
      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  assert.ok(ready, `Server did not become ready: ${logs}`);
  for (const path of [
    "/",
    "/dashboard",
    "/research",
    "/processing?q=Solar%20energy",
    "/report",
    "/opportunity-lens",
    "/history",
    "/saved-reports",
    "/settings",
  ]) {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(10000) });
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.ok(html.includes("<body"), path);
    assert.ok(!html.includes("This page didn&#x27;t load"), path);
    console.log(`PASS SSR ${path}`);
  }
  const missing = await fetch(base + "/not-a-route");
  assert.equal(missing.status, 404);
  console.log("PASS unknown route returns 404");
} finally {
  server.kill("SIGTERM");
}
