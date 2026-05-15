import { useEffect, type ReactNode } from "react";

/**
 * Lightweight smooth-scroll. Uses lerp on window.scrollY without hijacking
 * native scrolling: we listen to wheel/touch events and animate scrollY
 * with rAF. Disabled for users who prefer reduced motion or use coarse pointers.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let active = false;
    const FRICTION = 0.12;

    const tick = () => {
      current += (target - current) * FRICTION;
      window.scrollTo(0, current);
      if (Math.abs(target - current) > 0.4) {
        raf = requestAnimationFrame(tick);
      } else {
        current = target;
        active = false;
        raf = 0;
      }
    };

    const start = () => {
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return; // pinch zoom
      e.preventDefault();
      target = Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          target + e.deltaY,
        ),
      );
      start();
    };

    const onScroll = () => {
      if (!active) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const step = window.innerHeight * 0.85;
      const small = 80;
      let delta = 0;
      switch (e.key) {
        case "ArrowDown": delta = small; break;
        case "ArrowUp": delta = -small; break;
        case "PageDown": case " ": delta = step; break;
        case "PageUp": delta = -step; break;
        case "Home": target = 0; start(); return;
        case "End":
          target = document.documentElement.scrollHeight - window.innerHeight;
          start();
          return;
        default: return;
      }
      e.preventDefault();
      target = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, target + delta));
      start();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <>{children}</>;
}
