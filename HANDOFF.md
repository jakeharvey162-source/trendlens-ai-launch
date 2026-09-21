# TrendLens AI — launch guide

Updated 20 September 2026. The app code and database integration are implemented. It is not deployed, and real Gemini/SerpApi calls and email delivery still need verification with your keys and live URL.

## Added in the hackathon refinement

Decision Board adds testable assumptions, counterarguments, experiment checklists, device-local notes and a human decision. Reports can be compared side by side, and both a decision memo and comparison can be exported as Markdown. New live reports request 2–4 AI-proposed experiments in the existing analysis call; older/demo reports use a labelled starter checklist. No new database migration or API key is required. See HACKATHON-BRIEF.md for the product pitch, demo flow and next priorities.

## What is ready

- Redesigned landing page, responsive workspace, light/dark modes, and the original color variables unchanged.
- Market research and Opportunity Lens: separate demo and live modes.
- Email/password signup, signin, password recovery, password update and signout through your Supabase project.
- Private cloud reports, saved reports, searchable recent history, deletion, JSON export and print/PDF.
- Direct Gemini analysis of SerpApi organic search snippets, original source links, and validated source-rank references.
- Authenticated generation, confirmed-email requirement, durable daily limits (5 attempts per user; 50 globally), duplicate-request protection, and provider timeouts.
- A 25-second Higgsfield motion-graphics pitch, supplied separately. It contains an illustrative product view and a synthesized ambient audio bed, not a narrated customer testimonial.

## Your Supabase project

Name: jakeharvey162@gmail.com
Project reference: ftsomveafuskrutqzsvs
Dashboard: https://supabase.com/dashboard/project/ftsomveafuskrutqzsvs

The paused project was restored. These migrations have already been applied there:
- supabase/migrations/20260919233704_trendlens_live.sql
- supabase/migrations/20260919234840_repair_legacy_auth.sql

The app uses trendlens_reports, trendlens_jobs and trendlens_usage. It does not use the old Lovable reports/profiles tables. No original Lovable data was deleted or migrated. Existing data stays in its original project.

The target contained no public tables but retained old authentication functions. Its signup trigger referenced a nonexistent user_profiles table. It now skips that missing legacy table; if the table exists later, it assigns only the fixed user role. The legacy is_admin helper now reads server-controlled app metadata only. Search paths and public function access were restricted.

Do not apply the old drizzle migrations to the selected project: they are retained historical scaffolding, not the current schema.

## Variables to enter in Vercel

Use the values in VERCEL-ENV.txt or .env.example. Four connection values are already filled in. Public publishable keys are intended for browser use.

| Variable | Value or source |
| --- | --- |
| VITE_SUPABASE_URL | https://ftsomveafuskrutqzsvs.supabase.co |
| VITE_SUPABASE_PUBLISHABLE_KEY | sb_publishable_x3SYM26ShPtf_JIYdvOkEg_kLXb2kIz |
| SUPABASE_URL | https://ftsomveafuskrutqzsvs.supabase.co |
| SUPABASE_PUBLISHABLE_KEY | sb_publishable_x3SYM26ShPtf_JIYdvOkEg_kLXb2kIz |
| SUPABASE_SERVICE_ROLE_KEY | Your selected project's server secret key or legacy service_role key, from Supabase Settings → API Keys. Never use a VITE_ prefix. |
| GEMINI_API_KEY | Your Google AI Studio API key |
| SERPAPI_API_KEY | Your SerpApi private key |
| GEMINI_MODEL | gemini-2.5-flash, or another available generateContent model in your account |
| ENABLE_LIVE_RESEARCH | true after all required values are present; false disables paid research |

Add private keys directly to Vercel's environment-variable settings. Do not commit them or paste them into the chat. Deleting a message does not rotate a key. No private keys are included in this package.

Provider billing/quota must be available. No Lovable gateway key is required. A Supabase personal access token or database password is not the service-role key.

## Deploy from the updated code

1. Extract trendlens-ai-main.zip. The directory containing package.json must be the project root.
2. Put this updated code into your GitHub repository on a new branch, review it, and merge it when ready. Preserve existing Git history; do not force-push. The old source on GitHub has NOT been updated here: the Jake Harvey GitHub connection still returned 404 for jakeharvey162-source/trendlens-ai.
3. Import that updated repository into Vercel. Use Node 24, install command npm ci, and build command npm run build:vercel. The included vercel.json sets the commands. The project uses TanStack Start and Nitro, not Next.js.
4. Use the Vercel/TanStack or Other framework setting as appropriate. Leave Output Directory unoverridden; Nitro generates .vercel/output. Do not publish a static-only dist folder because research needs the server.
5. Add the variables above for the intended deployment environment and deploy. Changing VITE_ values requires a rebuild because Vite embeds them at build time.
6. In Supabase Authentication → URL Configuration, set Site URL to your production URL and add https://YOUR-DOMAIN/settings to the allowed redirect URLs. Add exact preview URLs only if you want email callbacks to work there. Keep email confirmation enabled.
7. Configure a verified email sender/custom SMTP in Supabase for public signups and password resets. Supabase's default email service is for limited testing with project-team addresses, not public production use. SMTP host, port, username, password and sender belong in Supabase, not Vercel.
8. Visit Settings, create and confirm an account, then choose Live research. Run one market question, open its source links, save it, reload and check History. Verify a second account cannot view the first account's report. Test password recovery with the live domain.
9. Share the deployed URL here so we can complete the real provider, email and deployment checks.

Vercel can be managed through the connected tools when access is available. Following your latest instruction, no Vercel deployment was created in this session.

## Verification completed

- Thirteen automated tests pass, including decision draft recovery and memo export: demo generation/storage and mocked live-provider success, insufficient evidence, provider failure and invalid citations.
- TypeScript passes; ESLint has zero errors and 11 Fast Refresh warnings from mixed helper/component exports.
- Vercel production build passes. Browser assets do not contain private key variable names or the Gemini HTTP integration.
- Real Chromium checks pass at 1440px and 390px: page rendering, query-to-report, save, saved list, live signin gate, account screen and theme toggle. Decision task/notes persistence, memo download and report comparison were also exercised. No page errors or mobile horizontal overflow.
- Real database transaction tests pass: signup trigger, user-metadata privilege prevention, request deduplication, five/day quota, owner reads, bookmarks and cross-user isolation. Test records were rolled back.
- Privilege checks: anonymous users cannot read reports; authenticated clients cannot insert forged reports, reassign owners or reserve paid jobs.
- Supabase advisor review completed. jobs/usage intentionally have no client RLS policies (deny all; server-only). The preexisting authenticated is_admin function still produces a definer warning; its controlled metadata lookup is intentional. Leaked-password protection remains disabled in project settings and should be enabled where supported.
- Video checked as 25 seconds, 1280×720, H.264 with AAC audio; representative frames reviewed.

Not verified yet: real provider responses/billing, real email signup/reset delivery, production Vercel behavior, and printed PDF pagination. Keys and a deployed domain are still needed.

## Practical limits and next improvements

This is a launchable beta implementation once configured and verified, not a complete commercial SaaS.

- Research reads search snippets, not full articles. Citation validation checks source existence, not whether an AI claim is true. Verify dates and context in the originals.
- Live reports deliberately avoid fabricated confidence scores, growth percentages and market-share charts. Add licensed time-series/data sources before offering measured trend analytics.
- Lists show the latest 100 cloud reports; older authenticated links remain retrievable. Add pagination for a growing library.
- Demo mode stores up to 40 reports in one browser. It is separate from the account's cloud library.
- Failed attempts count against quotas. Closing the page does not reliably cancel paid server work. Check History before retrying; a server timeout may leave an incomplete job.
- Jobs run inside one server request. A durable queue, progress events and retry/recovery tooling are the next reliability improvements.
- No subscriptions/payments, scheduled monitoring, team workspaces, public sharing, account self-deletion or admin dashboard are implemented.
- Add provider budgets, CAPTCHA/abuse controls, production monitoring, backups, retention rules, account deletion, an operator contact and reviewed privacy/terms before a wider commercial launch.
- An evidence-quality evaluation set and deeper source retrieval will improve research quality more than adding decorative scores.

## Local development

Use Node 24 and npm with package-lock.json.

npm ci
cp .env.example .env
npm run dev

Demo mode works without private keys. Live mode requires the variables above.

npm test
npm run typecheck
npm run lint
npm run test:smoke
npm run build:vercel

The optional browser script uses playwright-core. Install it separately or set BROWSER_TOOLS_DIR to a directory containing its node_modules. Set BROWSER_EXECUTABLE to your Chromium binary if needed. Browser screenshots go to BROWSER_ARTIFACTS_DIR or ./artifacts.

## Reference documentation

### Source Explorer upgrade

Reports now include a Source Explorer with keyword, publisher and attributed-claim filters, original publication links, and filtered Markdown exports. Demo references are labelled illustrative. Report compilation times are not presented as source publication dates. These controls make attribution inspectable but do not independently verify claims. See GITHUB-SYNC.md for the existing Lovable repository update workflow.

- Gemini model: https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash
- Supabase SMTP: https://supabase.com/docs/guides/auth/auth-smtp
- Supabase password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Supabase server-only RLS notes: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- Supabase definer review: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- TanStack on Vercel: https://vercel.com/docs/frameworks/full-stack/tanstack-start
