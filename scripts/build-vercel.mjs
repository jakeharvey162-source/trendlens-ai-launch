import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const result = spawnSync(process.execPath, ["node_modules/vite/bin/vite.js", "build"], {
  stdio: "inherit",
  env: { ...process.env, NITRO_PRESET: "vercel" },
});
if (result.error) console.error(result.error.message);
if (result.status !== 0) process.exit(result.status ?? 1);
// Catch a static-only build before it becomes a deployment full of 404 pages.
const config = JSON.parse(readFileSync(".vercel/output/config.json", "utf8"));
if (
  config.version !== 3 ||
  !config.routes?.some((route) => route.dest === "/__server") ||
  !existsSync(".vercel/output/functions/__server.func/.vc-config.json")
) {
  throw new Error("Vercel server output is missing. Do not deploy this as a static dist folder.");
}
console.log("PASS Vercel server function and catch-all route are present.");
