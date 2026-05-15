import { useEffect, useRef } from "react";

/**
 * Desktop custom cursor with magnetic snap to interactive elements.
 * Two layers — a small dot (immediate) and a ring (eased). Scales up on
 * hoverable targets. Uses mix-blend-mode: difference so it works on any bg.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      }
      // Determine hover state once per move
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, [data-cursor='hover'], .pcard, .pdp-thumb, .pdp-main, .pill-tab, .size-swatch",
      );
      const text = target?.closest("input, textarea, [contenteditable='true'], [data-cursor='text']");
      const body = document.body;
      body.classList.toggle("cursor-hover", !!interactive && !text);
      body.classList.toggle("cursor-text", !!text);
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onDown = () => document.body.classList.add("cursor-active");
    const onUp = () => document.body.classList.remove("cursor-active");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);
    document.body.classList.add("custom-cursor-on");
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-on", "cursor-hover", "cursor-text", "cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
