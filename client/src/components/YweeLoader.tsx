import { useEffect, useState, useCallback, useRef } from "react";
import { HERO_POSTER, HERO_VIDEO } from "@/data/store";

/**
 * YweeLoader — YWEE brand loader
 * - Denim-blue background (#1B3A5C) with parchment text
 * - Denim-stitch progress bar
 * - YWEE wordmark + cycling brand phrases
 * - Curtain-wipe exit (denim panel sweeps up, parchment reveals)
 * - 6-second hard timeout safety net
 */

const HARD_TIMEOUT_MS = 6000;
const CRITICAL_IMAGES = [HERO_POSTER];
const CRITICAL_VIDEO = HERO_VIDEO;

const PHRASES = [
  "From the sandbox to the stage.",
  "Soft on the skin. Fierce in fit.",
  "Denim that grows with her.",
  "Cotton-Lycra comfort. Ages 1–14.",
  "Made in India. Priced under ₹1,500.",
];

export default function YweeLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "curtain" | "exit">("loading");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const progressRef = useRef(0);
  const doneRef = useRef(false);

  // Cycle brand phrases every 1.4s
  useEffect(() => {
    const t = setInterval(() => {
      setPhraseIdx(i => (i + 1) % PHRASES.length);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    setTimeout(() => setPhase("curtain"), 300);
    setTimeout(() => {
      setPhase("exit");
      setTimeout(onDone, 50);
    }, 1100);
  }, [onDone]);

  useEffect(() => {
    let cancelled = false;
    let progressRaf: number;
    let hardTimeout: ReturnType<typeof setTimeout>;

    const animateProgress = () => {
      if (cancelled || doneRef.current) return;
      const current = progressRef.current;
      const remaining = 85 - current;
      const step = Math.max(0.3, remaining * 0.04);
      const next = Math.min(85, current + step);
      progressRef.current = next;
      setProgress(next);
      progressRaf = requestAnimationFrame(animateProgress);
    };
    progressRaf = requestAnimationFrame(animateProgress);
    hardTimeout = setTimeout(() => { if (!cancelled) finish(); }, HARD_TIMEOUT_MS);

    const fontPromise: Promise<void> = document.fonts
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();

    const imagePromises = CRITICAL_IMAGES.filter(Boolean).map(
      src => new Promise<void>(resolve => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
        if (img.complete) resolve();
      })
    );

    const videoPromise: Promise<void> = CRITICAL_VIDEO
      ? new Promise<void>(resolve => {
          const v = document.createElement("video");
          v.preload = "metadata";
          const done = () => resolve();
          v.oncanplay = v.onerror = done;
          v.src = CRITICAL_VIDEO;
          setTimeout(done, 3000);
        })
      : Promise.resolve();

    const windowLoad: Promise<void> = document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>(resolve => {
          window.addEventListener("load", () => resolve(), { once: true });
        });

    Promise.all([fontPromise, ...imagePromises, videoPromise, windowLoad]).then(() => {
      if (!cancelled) finish();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(progressRaf);
      clearTimeout(hardTimeout);
    };
  }, [finish]);

  if (phase === "exit") return null;

  const curtainStyle: React.CSSProperties = phase === "curtain" ? {
    position: "fixed", inset: 0, zIndex: 10001,
    background: "#1B3A5C",
    transform: "translateY(-100%)",
    transition: "transform 0.75s cubic-bezier(0.76,0,0.24,1)",
    pointerEvents: "none",
  } : {
    position: "fixed", inset: 0, zIndex: 10001,
    background: "#1B3A5C",
    transform: "translateY(0)",
    transition: "none",
    pointerEvents: "none",
  };

  return (
    <>
      {/* Curtain sweep */}
      <div style={curtainStyle} aria-hidden="true" />

      {/* Main loader panel */}
      <div
        aria-label="Loading YWEE"
        role="status"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "#1B3A5C",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(16px, 3.5vw, 28px)",
          pointerEvents: phase === "curtain" ? "none" : "all",
          opacity: phase === "curtain" ? 0 : 1,
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Denim weave texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px,
            transparent 1px, transparent 8px
          ), repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px,
            transparent 1px, transparent 8px
          )`,
        }} />

        {/* YWEE wordmark */}
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(56px, 12vw, 96px)",
          fontWeight: 300,
          fontStyle: "italic",
          letterSpacing: "-0.04em",
          color: "#F4EFE6",
          lineHeight: 1,
          animation: "ywee-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          ywee
        </div>

        {/* Sub-brand line */}
        <div style={{
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: "clamp(9px, 1.8vw, 11px)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(244,239,230,0.4)",
          animation: "ywee-fade-up 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both",
          marginTop: "-4px",
        }}>
          Girls&apos; Stretch Denim · India
        </div>

        {/* Denim-stitch progress bar */}
        <div style={{
          width: "clamp(160px, 32vw, 280px)",
          height: "2px",
          background: "rgba(244,239,230,0.1)",
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px",
          animation: "ywee-fade-up 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both",
          marginTop: "8px",
        }}>
          <div style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            background: "linear-gradient(90deg, rgba(244,239,230,0.5) 0%, #F4EFE6 100%)",
            transition: "width 0.25s linear",
            borderRadius: "2px",
          }} />
          <div style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 5px, rgba(27,58,92,0.5) 5px, rgba(27,58,92,0.5) 7px)",
            transition: "width 0.25s linear",
          }} />
        </div>

        {/* Cycling brand phrase */}
        <div key={phraseIdx} style={{
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: "clamp(10px, 2vw, 12px)",
          letterSpacing: "0.06em",
          color: "rgba(244,239,230,0.3)",
          animation: "ywee-phrase-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
          textAlign: "center",
          maxWidth: "280px",
          lineHeight: 1.5,
        }}>
          {PHRASES[phraseIdx]}
        </div>

        {/* Bottom brand line */}
        <div style={{
          position: "absolute",
          bottom: "clamp(24px, 4vw, 40px)",
          left: 0, right: 0,
          textAlign: "center",
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(244,239,230,0.15)",
          animation: "ywee-fade-up 0.8s 0.4s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          Generations Clothing LLP · Est. 2024
        </div>
      </div>

      <style>{`
        @keyframes ywee-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ywee-phrase-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
