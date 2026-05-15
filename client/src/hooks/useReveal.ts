import { useEffect, useRef } from "react";

/**
 * IntersectionObserver-based reveal that:
 * 1. Marks visible immediately if the element is already in the initial viewport.
 * 2. Marks visible if the element is within 1.5x viewport of current scroll (handles
 *    full-page screenshot tools and pre-scrolled deep links).
 * 3. Has a 1500ms safety fallback so content is never permanently invisible
 *    (defensive — if observer never fires, e.g. headless browsers or reduced JS).
 */
export function useReveal<T extends HTMLElement>(opts: {
  threshold?: number;
  rootMargin?: string;
  delayMs?: number;
} = {}) {
  const { threshold = 0.04, rootMargin = "0px 0px -5% 0px", delayMs = 0 } = opts;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal");

    // Already visible? mark immediately
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const inView = r.top < vh * 1.5 && r.bottom > -vh * 0.5;
    if (inView) {
      if (delayMs) el.style.transitionDelay = `${delayMs}ms`;
      requestAnimationFrame(() => el.classList.add("visible"));
      // Don't bail — also wire observer so subsequent intersections (after
      // unmount/re-mount via routing) still work
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (delayMs) el.style.transitionDelay = `${delayMs}ms`;
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);

    // Safety fallback (1.5s)
    const t = setTimeout(() => {
      if (!el.classList.contains("visible")) {
        el.classList.add("visible");
      }
    }, 1500);

    return () => {
      obs.disconnect();
      clearTimeout(t);
    };
  }, [threshold, rootMargin, delayMs]);

  return ref;
}
