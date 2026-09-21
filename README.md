# TrendLens AI

A responsive market-research product built with TanStack Start, React 19, TypeScript, Supabase, Gemini and SerpApi.

The updated UI, authentication, cloud persistence and live research pipeline are implemented. Your selected Supabase database is configured. Private provider keys, email delivery configuration and a Vercel deployment are still required for a verified live launch.

Start with [HANDOFF.md](HANDOFF.md) for exact variables, deployment steps, verification and remaining limitations. [VERCEL-ENV.txt](VERCEL-ENV.txt) is a ready-to-fill variable template. The original specification is retained in [ORIGINAL_BRIEF.md](ORIGINAL_BRIEF.md).

## Run

The new Source Explorer lets users search references, filter publishers and attributed claims, open original sources, and export an evidence pack. See [GITHUB-SYNC.md](GITHUB-SYNC.md) to apply this package to the existing Lovable-connected repository.

Use Node 24:

```sh
npm ci
cp .env.example .env
npm run dev
```

Demo mode works without private API keys. Select Live research after setting up the keys and signing in. Keep server secrets out of VITE_ variables.

## Verify

```sh
npm test
npm run typecheck
npm run lint
npm run test:smoke
npm run build:vercel
```

The original color palette is preserved. The current app uses the prefixed tables in supabase/migrations; drizzle is historical scaffolding.
