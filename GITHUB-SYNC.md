# GitHub deployment workflow

Source repository: https://github.com/jakeharvey162-source/trendlens-ai-launch

Commit changes to GitHub. Vercel builds the connected production branch automatically. Before pushing, run `npm run typecheck`, `npm run build:vercel`, and `npm run test:smoke`. Keep API secrets in Vercel environment variables, never in GitHub.

Optional maintenance settings: `DATABASE_URL` is the direct PostgreSQL connection for Drizzle migrations. `CRON_SECRET` and `CRON_SECRET_PREVIOUS` protect any future scheduled endpoints; no cron endpoints are currently configured.
