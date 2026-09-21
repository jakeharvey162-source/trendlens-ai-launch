# TrendLens: independent deployment

Lovable is optional as an editor. This app can run on Vercel with Supabase, Gemini and SerpApi. Keeping the existing Lovable build package does not require using the Lovable editor.

## Vercel import settings

- Import the repository containing these source files, not a ZIP uploaded as one file.
- Root Directory: the folder containing package.json (normally the repository root).
- Let Vercel detect the framework. This is TanStack Start, not Next.js or a static HTML site.
- Install Command: npm ci
- Build Command: npm run build:vercel
- Output Directory: leave the override disabled. Do not set it to dist.
- Use Node.js 24.
- Add the values from VERCEL-ENV.txt to Vercel Environment Variables before building.
- Keep ENABLE_LIVE_RESEARCH=false for a demo-only launch; set it true after adding all server keys.

The build script checks that Nitro generated both the server function and the catch-all route. This reduces configuration-related 404s; a real deployed URL still needs checking. A deliberately unknown URL should return 404.

After deployment open /, /research, /dashboard, /report, and /settings directly and refresh each. Configure Supabase Site URL to the deployed origin and allow the /settings redirect. Verify signup, email confirmation, sign-in, one live search, saving and reopening a report. See HANDOFF.md for the full launch checks.

## Keys still needed

SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, SERPAPI_API_KEY are server-only secrets. Do not put them in VITE_ variables or commit them to GitHub. The public Supabase URL and publishable key are already in the example configuration. The selected database is ftsomveafuskrutqzsvs; its three TrendLens tables and RLS were rechecked on September 21, 2026.

## Beginner code map

This app uses TypeScript (JavaScript with type checks), React, CSS and SQL. It is not written in machine code or assembly. A secure AI app has some intermediate server code; removing that would not make it safer or easier to deploy.

- Colours and spacing: src/styles.css. Start with :root and .dark variables.
- Landing-page wording: src/components/trendlens-pages.tsx.
- Guided form: src/components/research-builder.tsx. Three state variables and a simple string build the question.
- Report screens: src/components/workspace-pages.tsx.
- Evidence filters: src/components/source-explorer.tsx.
- Experiment notes: src/components/decision-studio.tsx.
- AI/search calls: src/lib/live-research-core.ts.
- Authentication and quotas: src/lib/intelligence.functions.ts. Preserve the server-side checks.

Run npm ci, then npm run dev. Before sharing changes run npm run typecheck, npm test, and npm run build:vercel.

## Hackathon story

Show a real problem: a founder considering affordable student meals in Johannesburg needs to assess demand and competitors before spending money. Use the guided form, inspect source evidence, compare reports, and export a decision memo with an experiment. Demo reports are labelled illustrative; they are not proof of market demand. Test the workflow with potential users and measure its usefulness. No feature guarantees a prize.
