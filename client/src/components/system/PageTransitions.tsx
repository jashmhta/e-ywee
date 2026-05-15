import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";

/**
 * Wraps the app to use the View Transitions API on route changes.
 * Falls back gracefully when unavailable.
 */
export function PageTransitions({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const startVT = (document as any).startViewTransition;
    if (typeof startVT !== "function") return;
    // Trigger a no-op view transition on each route change to animate in.
    // The actual DOM mutation has already happened by the time this effect
    // runs, so we wrap a forced reflow inside the callback.
    try {
      startVT.call(document, () => {
        document.body.getBoundingClientRect();
      });
    } catch {
      /* ignore */
    }
  }, [location]);

  return <>{children}</>;
}
