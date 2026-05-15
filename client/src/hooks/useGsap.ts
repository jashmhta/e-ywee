import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Run a GSAP setup function once on mount, in a context that auto-cleans
 * tweens & scrollTriggers on unmount. Pass deps to re-run.
 */
export function useGsap(setup: (ctx: gsap.Context) => void, deps: React.DependencyList = []) {
  const ref = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => setup(ctx as unknown as gsap.Context), ref.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * GSAP scroll-triggered reveal. Elements stay VISIBLE by default and animate
 * IN on viewport enter — so SSR/headless/no-JS users always see the content.
 *
 * If the element is below the fold on mount, ScrollTrigger animates from
 * hidden→visible when scrolled into view. If it's already in view on mount,
 * we play a quick reveal animation immediately.
 */
export function useScrollReveal<T extends HTMLElement>(opts: {
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
  childSelector?: string;
  stagger?: number;
} = {}) {
  const { delay = 0, y = 28, duration = 0.9, start = "top 88%", childSelector, stagger = 0.06 } = opts;
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const targets = childSelector
        ? gsap.utils.toArray<HTMLElement>(childSelector, el)
        : [el];
      if (!targets.length) return;

      const animateIn = () => {
        gsap.fromTo(
          targets,
          { y, opacity: 0 },
          { y: 0, opacity: 1, duration, ease: "expo.out", delay, stagger, immediateRender: false },
        );
      };

      // If already in viewport, play immediately. Otherwise, wait for ScrollTrigger.
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.95 && r.bottom > 0;
      if (inView) {
        animateIn();
      } else {
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: animateIn,
        });
      }
    }, el);
    return () => ctx.revert();
  }, [delay, y, duration, start, childSelector, stagger]);

  return ref;
}

/**
 * Counter animation: tweens a number from 0 → target inside the ref's
 * textContent. Initial state is the *target* value (so if JS doesn't run /
 * user never scrolls past, the final number is still visible). When the
 * element scrolls into view, animation plays from 0 → target.
 */
export function useCounter(target: number, opts: { duration?: number; suffix?: string; format?: (n: number) => string } = {}) {
  const { duration = 1.6, suffix = "", format } = opts;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finalText = (format ? format(target) : Math.round(target).toLocaleString("en-IN")) + suffix;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initial state = target value (so non-JS / pre-scroll users see it)
    el.textContent = finalText;
    if (reduced) return;

    const playFromZero = () => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = (format ? format(obj.value) : Math.round(obj.value).toLocaleString("en-IN")) + suffix;
        },
        onComplete: () => { el.textContent = finalText; },
      });
    };

    // If in viewport, animate immediately. Otherwise wait for scroll.
    const r = el.getBoundingClientRect();
    const inView = r.top < window.innerHeight && r.bottom > 0;
    if (inView) {
      // Reset to 0 then play (only when in initial viewport)
      el.textContent = "0" + suffix;
      requestAnimationFrame(() => requestAnimationFrame(playFromZero));
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          el.textContent = "0" + suffix;
          playFromZero();
        },
      });
    }
  }, [target, duration, suffix]);

  return ref;
}

/**
 * Parallax — translates element vertically based on scroll progress through
 * its trigger viewport. Strength of 0.3 is subtle, 0.6 is dramatic.
 */
export function useParallax<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -strength * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [strength]);

  return ref;
}
