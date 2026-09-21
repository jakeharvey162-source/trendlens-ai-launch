# TrendLens AI — product and hackathon brief

## The idea

TrendLens is an AI research and decision workspace for founders, students and small businesses. A person brings a market question; the product organizes web evidence, explains potential opportunities and risks, and helps them decide what to test next.

One-line pitch: Turn a market question into an evidence-linked decision and a practical validation plan.

Example: “Should I start a solar business in Nigeria?” Explore the market briefing, examine the original source links, compare it with another opportunity, and leave with small experiments to run before committing money.

## What the app does

| Capability | What a user gets |
| --- | --- |
| Market research | Executive summary, signals, competitor candidates, opportunities, risks and next steps |
| Opportunity Lens | An assessment of a business idea and assumptions to investigate |
| Source transparency | Original result URLs and source-rank references behind live AI claims |
| Decision Board — new | Assumptions, counterarguments, experiments and proposed success criteria |
| Validation progress — new | Checklists, research notes and a human-selected “explore / pilot / pause” position |
| Report comparison — new | Two reports side by side, including opportunities, key risks and next steps |
| Decision memo — new | Downloadable Markdown with the assessment, completed tasks, notes and source links |
| Private workspace | Supabase login, cloud reports, saved reports and deletion |
| Exports | Report JSON, print/PDF, decision memo and comparison |
| Device support | Responsive layout and matching light/dark themes with the original color palette |

Live research uses SerpApi search snippets plus Gemini. It does not read full articles or produce measured market shares. Sources need human verification. The app does not guarantee that a business will succeed.

New live reports request AI-proposed experiments in the same analysis call. Existing and demo reports get a clearly labelled starter checklist built from their own opportunities, risks and next steps. Comparison and memo export require no additional paid API calls.

Notes, experiment progress and the human decision are stored on the current device and isolated by report/account. They do not sync through Supabase yet. The reports themselves use private cloud storage in Live mode.

## Why this is a stronger hackathon demo

The demonstration now has a complete story: question → evidence → assessment → compare → experiment → decision memo.

A judge can see the search integration feeding a practical product workflow. Counterarguments discourage blindly accepting the AI's answer; the original source links and the distinction between an AI assessment and a human decision make the output easier to assess.

Suggested two-minute demonstration:
1. State a concrete founder problem.
2. Run a live market question using configured provider keys.
3. Open a source and explain the limits of snippet-based evidence.
4. Compare two reports.
5. Open Decision Board, explain one test, record a note and export the memo.
6. Close with the value: a clearer next step before committing time or money.

The previously delivered 25-second Higgsfield marketing video is a promotional pitch. It does not replace an end-to-end recording of the working live product.

## What was verified in this update

- 13 automated tests pass, covering reports, live-response validation, decision drafts and exports.
- TypeScript passes; ESLint reports zero errors and 11 development Fast Refresh warnings.
- Desktop and mobile browser checks pass, including new decision notes/progress persistence, memo download, comparison, themes and no horizontal mobile overflow.
- The Vercel build passes.
- Original light and dark color token blocks were compared directly with the previous delivered ZIP and are unchanged.

The app is still not deployed from this workspace. Real Gemini and SerpApi calls, email delivery and the deployed URL need verification with your credentials. The variables and deployment steps are in HANDOFF.md. GitHub still was not accessible through the selected connection during the previous check; upload the revised code before deployment.

## What to improve next

1. Validate actual AI output against a small set of real founder questions and source evidence.
2. Add deeper source retrieval and dates; avoid presenting snippet synthesis as verified fact.
3. Sync decision notes across devices and add a durable job queue.
4. Add an operator contact, account deletion and launch policies before broad public use.
5. Record a genuine live walkthrough and measure completion time and usefulness with a few real users.

## Event context

The official page for the original DevNetwork API + Cloud + AI 2026 event now says it has ended (August 17–September 3, 2026). Treat this as preparation for another suitable hackathon unless you have a separate current entry. Its SerpApi challenge highlighted originality, technical execution, integration, usability and impact; those are useful design priorities, not a guarantee of winning.

Official event page: https://api-cloud-ai-hackathon-2026.devpost.com/
