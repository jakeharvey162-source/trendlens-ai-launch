import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Search, Layers3, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, Eyebrow } from "@/components/trendlens-ui";

export function LandingPage() {
  return (
    <div className="landing min-h-screen overflow-hidden">
      <header className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-6 md:px-12">
        <Brand />
        <nav className="hidden gap-8 md:flex">
          <a href="#how" className="top-link">
            How it works
          </a>
          <a href="#features" className="top-link">
            Inside the brief
          </a>
        </nav>
        <Button variant="outline" asChild>
          <Link to="/settings">
            Sign in <ArrowUpRight />
          </Link>
        </Button>
      </header>
      <main>
        <section className="new-hero mx-auto grid max-w-[1440px] items-center gap-16 px-6 py-16 md:px-12 lg:grid-cols-[1.08fr_1fr] lg:py-24">
          <div>
            <Eyebrow>
              <span className="status-dot" /> A clearer view of what’s next
            </Eyebrow>
            <h1 className="mt-8 text-[clamp(3.5rem,6.1vw,6.3rem)] font-semibold leading-[1.02] tracking-[-.065em]">
              Less noise.
              <br />
              More <span className="text-primary">signal.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-muted-foreground">
              Turn your next market question into a clear, source-linked briefing. Understand the
              landscape. Find your opening. Decide what to do next.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Open your workspace <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/report">Explore a sample</Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Try the demo freely. Sign in for live research and cloud saves.
            </p>
            <div className="mt-12 flex gap-7 border-t border-border pt-6 text-xs text-muted-foreground">
              <span>Source transparency</span>
              <span>Practical next steps</span>
              <span>Private reports</span>
            </div>
          </div>
          <div className="hero-brief-wrap relative">
            <div className="hero-brief panel relative p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <Brand compact />
                <span className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">
                  Inside your briefing
                </span>
                <span className="text-xs text-primary">↗</span>
              </div>
              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">
                Opportunity lens / Sample
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight">
                Where does the
                <br />
                next opportunity sit?
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                A useful answer connects the market signals with the questions you still need to
                ask.
              </p>
              <div className="my-7 grid grid-cols-3 gap-2">
                {[
                  ["01", "The landscape"],
                  ["02", "The opening"],
                  ["03", "Your next move"],
                ].map(([n, t]) => (
                  <div key={n} className="border-t border-primary/30 pt-4">
                    <p className="text-xl text-primary">{n}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">{t}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="size-4" /> A point of view, with context
                </div>
                <p className="mt-3 text-sm leading-6">
                  Evidence, competing explanations and a practical validation plan — in one place.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Illustrative product preview</span>
                <Link to="/report" className="text-primary">
                  Read the sample →
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="how" className="border-y border-border bg-surface px-6 py-16 md:px-12">
          <div className="mx-auto max-w-[1344px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>From question to clarity</Eyebrow>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                  Your research. A little more resolved.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-muted-foreground">
                For founders testing an idea, operators exploring a market, and curious minds
                connecting the dots.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                [
                  Search,
                  "Ask a sharper question",
                  "Start with a market, a location or a business idea. Bring the question you actually need answered.",
                ],
                [
                  Layers3,
                  "Make sense of the evidence",
                  "Live mode combines web search snippets with AI synthesis, linked sources and explicit uncertainty.",
                ],
                [
                  Bookmark,
                  "Keep the useful thinking",
                  "Save your reports, revisit opportunities, and export a briefing for your next conversation.",
                ],
              ].map(([Icon, t, b], i) => {
                const I = Icon as typeof Search;
                return (
                  <div key={i} className="border-t border-border pt-6">
                    <div className="flex items-center justify-between">
                      <I className="size-5 text-primary" />
                      <span className="text-xs text-muted-foreground">0{i + 1}</span>
                    </div>
                    <h3 className="mt-7 text-xl font-semibold">{t as string}</h3>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{b as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id="features"
          className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:px-12 lg:grid-cols-2"
        >
          <div>
            <Eyebrow>Built around the decision</Eyebrow>
            <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Not just what’s happening.
              <br />
              <span className="text-primary">What it could mean for you.</span>
            </h2>
          </div>
          <div className="divide-y divide-border">
            {[
              ["Market research", "Understand signals, competitor candidates and risks."],
              ["Opportunity Lens", "Explore an idea’s gaps, assumptions and next steps."],
              [
                "Decision board",
                "Challenge assumptions, track experiments and export your decision memo.",
              ],
              [
                "Compare reports",
                "Put two possibilities side by side before choosing your next move.",
              ],
              [
                "Your research library",
                "Private cloud history, bookmarks, JSON and print exports.",
              ],
            ].map(([t, b]) => (
              <div className="flex gap-6 py-6 first:pt-0" key={t}>
                <ArrowUpRight className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{b}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="border-t border-border bg-primary/5 px-6 py-16 text-center">
          <Eyebrow>Your next good question starts here</Eyebrow>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">Find your next opening.</h2>
          <Button className="mt-8" size="lg" asChild>
            <Link to="/research">
              Start exploring <ArrowRight />
            </Link>
          </Button>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-12">
        <Brand />
        <p className="text-xs text-muted-foreground">
          AI supports your research. Your judgment leads the decision.
        </p>
      </footer>
    </div>
  );
}
