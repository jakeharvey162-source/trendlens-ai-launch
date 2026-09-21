# Update the existing Lovable project

This package contains the refined app, Decision Board, report comparison, and Source Explorer. It has not been pushed to GitHub or deployed. The Jake GitHub connection returned 404 for the supplied repository, which can mean missing access or an incorrect repository URL.

## GitHub Desktop route

1. Open your existing Lovable project → Project settings → Git. Copy its connected repository URL and note the active synced branch. Keep this connection.
2. Sign into GitHub Desktop with the account that owns that repository. Clone that exact repository and fetch/pull the latest changes. Create a branch named `trendlens-upgrade` from the synced branch.
3. Extract `trendlens-ai-main.zip`. Copy the **contents inside** its `trendlens-ai-main` folder into the cloned repository root, alongside the existing `package.json`. Replace matching files. Do not put the whole folder inside another project folder. Preserve `.git` and review differences so any newer Lovable work is not overwritten accidentally. Do not commit local `.env`, credentials, `node_modules`, or generated build folders.
4. Open a terminal in the cloned folder. Run `npm ci`, `npm run typecheck`, `npm test`, and `npm run build:vercel`. Review the changes in GitHub Desktop, commit them, and publish the branch.
5. Open a pull request targeting the branch Lovable currently syncs. Review and merge using a regular merge commit. Avoid rewriting published history or force pushing, as required by this project's AGENTS.md.
6. Open Lovable and check the synced preview. Lovable syncs changes from its active GitHub branch. If Vercel is connected, deployment follows its own configured branch settings.

Use the ZIP as source files for the connected repository. Simply attaching it to Lovable chat is not the same as committing the updated code.

## To let me push it

Send the exact repository URL copied from Lovable and grant the ChatGPT GitHub connection access to that repository. No GitHub password or personal access token in chat is needed.

## Live service setup

Code sync does not copy environment variables between hosts. Use `VERCEL-ENV.txt` and `HANDOFF.md` for configuration. Server-only `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `SERPAPI_API_KEY` are still required. Set `ENABLE_LIVE_RESEARCH=true` only after configuration. Set Supabase auth site URL, redirects and email delivery for the production host. Enter secrets in the host's environment settings, not project source code.

The selected Supabase project is `ftsomveafuskrutqzsvs`. Database setup was completed earlier; real provider calls and production email delivery still need end-to-end verification after keys and hosting are configured. Decision notes remain device-local even for cloud reports.

## What this upgrade adds

Source Explorer provides snippet search, publisher and attributed-claim filters, original-page links, and a filtered Markdown source pack. It distinguishes demo references from live snippets and report compilation dates from publication dates. Attribution is not independent fact-checking. The existing violet design is retained.

## Product focus

TrendLens helps founders and small teams move from scattered market information to a research brief and a testable decision. Its strongest demo is research → inspect evidence → compare options → run an experiment → export a decision memo. This addresses a plausible practical problem; customer demand and time savings still require user testing. Next, test with five intended users and record whether they complete this workflow and make a more informed decision. No feature guarantees a hackathon win.

Official sync reference: https://docs.lovable.dev/integrations/github
