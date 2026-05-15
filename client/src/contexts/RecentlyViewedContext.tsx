import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

  const push = (slug: string) => setItems((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX));
  const remove = (slug: string) => setItems((prev) => prev.filter((s) => s !== slug));
  const clear = () => setItems([]);

  return (
    <RecentlyViewedContext.Provider value={{ items, push, remove, clear }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
