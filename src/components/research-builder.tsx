import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

// Ordinary form state and string building: no extra AI call or database required.
export function ResearchBuilder() {
  const navigate = useNavigate();
  const [market, setMarket] = useState("");
  const [place, setPlace] = useState("");
  const [goal, setGoal] = useState("customer demand");
  const question = market.trim()
    ? `Assess ${goal} for ${market.trim()}${place.trim() ? ` in ${place.trim()}` : ""}`
    : "";
  return (
    <form
      className="panel mt-8 rounded-2xl p-6 md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        if (question.length < 2 || question.length > 240) return;
        void navigate({ to: "/processing", search: { q: question, mode: "report" } });
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Start with a decision
      </p>
      <h3 className="mt-3 text-2xl font-semibold">A better question. A more useful brief.</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Choose what you want to learn. Your current Demo or Live research mode applies.
      </p>
      <div className="my-6 grid gap-4 md:grid-cols-3">
        <label className="text-sm">
          Business or market
          <input
            className="account-input mt-2"
            required
            maxLength={120}
            value={market}
            onChange={(event) => setMarket(event.target.value)}
            placeholder="Affordable student meals"
          />
        </label>
        <label className="text-sm">
          Location
          <input
            className="account-input mt-2"
            maxLength={60}
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Johannesburg"
          />
        </label>
        <label className="text-sm">
          Research goal
          <select
            aria-label="Research goal"
            className="account-input mt-2"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
          >
            <option>customer demand</option>
            <option>competitors and differentiation</option>
            <option>market-entry risks</option>
          </select>
        </label>
      </div>
      {question && (
        <p className="mb-5 break-words text-sm leading-6" aria-live="polite">
          {question}
        </p>
      )}
      <Button type="submit" disabled={!question || question.length > 240}>
        Research this decision
      </Button>
    </form>
  );
}
