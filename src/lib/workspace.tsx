import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/integrations/supabase/client";
import { listMyReports, toggleSaved, deleteReport } from "@/lib/reports.functions";
import { getResearchStatus } from "@/lib/intelligence.functions";
import { listReports, bookmarkReport, removeReport } from "@/lib/trendlens-store";
import type { Report } from "@/lib/trendlens-data";
type Workspace = {
  session: Session | null;
  authReady: boolean;
  mode: "demo" | "live";
  setMode: (v: "demo" | "live") => void;
  reports: Report[];
  loading: boolean;
  error: string;
  ready: boolean;
  refresh: () => Promise<void>;
  bookmark: (id: string, saved: boolean) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
const Context = createContext<Workspace | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [local, setLocal] = useState<Report[]>([]);
  const qc = useQueryClient();
  useEffect(() => {
    const c = getSupabase();
    if (!c) {
      setAuthReady(true);
      return;
    }
    void c.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
      if (data.session) setMode("live");
    });
    const { data } = c.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setAuthReady(true);
      if (event === "SIGNED_OUT") {
        setMode("demo");
        qc.removeQueries({ queryKey: ["cloud-reports"] });
      }
      if (event === "SIGNED_IN") setMode("live");
    });
    return () => data.subscription.unsubscribe();
  }, [qc]);
  useEffect(() => {
    const sync = () => setLocal(listReports());
    sync();
    window.addEventListener("trendlens:reports", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("trendlens:reports", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const cloud = useQuery({
    queryKey: ["cloud-reports", session?.user.id],
    queryFn: () => listMyReports(),
    enabled: !!session && mode === "live",
    retry: false,
  });
  const status = useQuery({
    queryKey: ["research-status"],
    queryFn: () => getResearchStatus(),
    retry: false,
    staleTime: 60000,
  });
  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["cloud-reports"] });
  };
  const bookmark = async (id: string, saved: boolean) => {
    if (mode === "live") {
      await toggleSaved({ data: { id, saved } });
      await refresh();
    } else bookmarkReport(id, saved);
  };
  const remove = async (id: string) => {
    if (mode === "live") {
      await deleteReport({ data: { id } });
      await refresh();
    } else removeReport(id);
  };
  return (
    <Context.Provider
      value={{
        session,
        authReady,
        mode,
        setMode,
        reports: mode === "live" ? (session ? (cloud.data ?? []) : []) : local,
        loading: !authReady || (mode === "live" && !!session && cloud.isPending),
        error: mode === "live" && cloud.error ? cloud.error.message : "",
        ready: status.data?.ready ?? false,
        refresh,
        bookmark,
        remove,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useWorkspace() {
  const v = useContext(Context);
  if (!v) throw new Error("Workspace provider missing");
  return v;
}
