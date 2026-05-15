import { useEffect } from "react";

/**
 * Drives a CSS variable --progress on the given selector (default the
 * `.progress-fill` element) from 0 → 1 based on document scroll progress.
 */
export function useScrollProgress(selector = ".progress-fill") {
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.style.setProperty("--progress", String(p));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [selector]);
}
