import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "ywee:recentlyViewed:v1";
const MAX = 12;

interface RecentlyViewedContextValue {
  items: string[];                              // most-recent first
  push: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  // Stable refs — passing fresh closures here would cause any consumer
  // useEffect depending on these to re-run every render and clobber state
  // (e.g. Product.tsx's slug-change reset would fire on every keystroke).
  const push = useCallback(
    (slug: string) => setItems((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX)),
    [],
  );
  const remove = useCallback(
    (slug: string) => setItems((prev) => prev.filter((s) => s !== slug)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, push, remove, clear }), [items, push, remove, clear]);

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
