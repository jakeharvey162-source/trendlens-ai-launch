import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/lib/workspace";
export function AccountPanel() {
  const { session, authReady } = useWorkspace();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState<"signin" | "signup" | "reset">("signin");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) {
      setMessage("Account connection is not configured.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const redirect = window.location.origin + "/settings";
      const result = session
        ? await client.auth.updateUser({ password })
        : action === "signin"
          ? await client.auth.signInWithPassword({ email, password })
          : action === "signup"
            ? await client.auth.signUp({ email, password, options: { emailRedirectTo: redirect } })
            : await client.auth.resetPasswordForEmail(email, { redirectTo: redirect });
      if (result.error) throw result.error;
      setPassword("");
      setMessage(
        session
          ? "Password updated."
          : action === "signup"
            ? "Check your email to confirm your account."
            : action === "reset"
              ? "If this account exists, a reset link is on its way."
              : "Signed in. Your cloud workspace is ready.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not complete request.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="editorial-section">
      <h3 className="text-xl font-semibold">
        {session ? "Your account" : "Your private research workspace"}
      </h3>
      <p className="my-4 text-sm leading-7 text-muted-foreground">
        {session
          ? session.user.email
          : "Sign in to run live research and keep reports across devices. You can explore Demo mode without an account."}
      </p>
      {!authReady ? (
        <p role="status">Checking session…</p>
      ) : (
        <form onSubmit={submit} className="grid max-w-md gap-4">
          {!session && (
            <label className="grid gap-2 text-sm">
              Email
              <input
                className="account-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          )}
          {(session || action !== "reset") && (
            <label className="grid gap-2 text-sm">
              {session ? "New password" : "Password"}
              <input
                className="account-input"
                type="password"
                autoComplete={action === "signin" && !session ? "current-password" : "new-password"}
                required
                minLength={action === "signin" && !session ? 1 : 12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          <Button disabled={busy} type="submit">
            {busy
              ? "Working…"
              : session
                ? "Update password"
                : action === "signin"
                  ? "Sign in"
                  : action === "signup"
                    ? "Create account"
                    : "Send reset link"}
          </Button>
        </form>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {session ? (
          <Button
            variant="outline"
            onClick={async () => {
              const result = await getSupabase()?.auth.signOut();
              setMessage(result?.error?.message ?? "Signed out.");
            }}
          >
            Sign out
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={() => setAction(action === "signup" ? "signin" : "signup")}
            >
              {action === "signup" ? "Back to sign in" : "Create an account"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setAction(action === "reset" ? "signin" : "reset")}
            >
              {action === "reset" ? "Back to sign in" : "Forgot password?"}
            </Button>
          </>
        )}
      </div>
      <p role="status" className="mt-4 text-sm">
        {message}
      </p>
    </section>
  );
}
