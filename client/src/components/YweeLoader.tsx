import { useEffect, useState, useCallback, useRef } from "react";
import { HERO_POSTER } from "@/data/store";

const HERO_VIDEO = "";

/**
 * YweeLoader — Premium brand loader
 * Denim canvas background with animated weave texture
 * Stitched wordmark, thread-stitch progress bar, crossfading phrases
 * Split-curtain exit (denim panels sweep apart)
 */

const HARD_TIMEOUT_MS = 5500;
const CRITICAL_IMAGES = [HERO_POSTER];
const CRITICAL_VIDEO = HERO_VIDEO;

const PHRASES = [
  "From the sandbox to the stage.",
  "Soft on the skin. Fierce in fit.",
  "Denim that grows with her.",
  "Cotton-Lycra comfort. Ages 1\u201314.",
  "Made in India. Priced under \u20B91,500.",
];

export default function YweeLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "curtain" | "exit">("loading");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const progressRef = useRef(0);
  const doneRef = useRef(false);
  const [shimmer, setShimmer] = useState(0);

  // Shimmer sweep across wordmark
  useEffect(() => {
    if (phase !== "loading") return;
    let raf: number;
    const animate = () => {
      setShimmer(p => (p >= 200 ? -50 : p + 0.6));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Cycle brand phrases every 1.3s
  useEffect(() => {
    const t = setInterval(() => {
      setPhraseIdx(i => (i + 1) % PHRASES.length);
    }, 1300);
    return () => clearInterval(t);
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    setTimeout(() => setPhase("curtain"), 250);
    setTimeout(() => {
      setPhase("exit");
      setTimeout(onDone, 50);
    }, 900);
  }, [onDone]);

  useEffect(() => {
    let cancelled = false;
    let progressRaf: number;
    let hardTimeout: ReturnType<typeof setTimeout>;

    const animateProgress = () => {
      if (cancelled || doneRef.current) return;
      const current = progressRef.current;
      const remaining = 88 - current;
      const step = Math.max(0.4, remaining * 0.045);
      const next = Math.min(88, current + step);
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

  const isCurtain = phase === "curtain";

  return (
    <>
      {/* Split-curtain exit panels */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10001,
        display: "flex", pointerEvents: "none",
      }} aria-hidden="true">
        <div style={{
          flex: 1, background: "#1B3A5C",
          transform: isCurtain ? "translateX(-101%)" : "translateX(0)",
          transition: "transform 0.9s cubic-bezier(0.76,0,0.24,1)",
        }} />
        <div style={{
          flex: 1, background: "#1B3A5C",
          transform: isCurtain ? "translateX(101%)" : "translateX(0)",
          transition: "transform 0.9s cubic-bezier(0.76,0,0.24,1) 0.08s",
        }} />
      </div>

      {/* Main loader panel */}
      <div
        aria-label="Loading YWEE"
        role="status"
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "#1B3A5C",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(14px, 3vw, 24px)",
          pointerEvents: isCurtain ? "none" : "all",
          opacity: isCurtain ? 0 : 1,
          transition: "opacity 0.35s ease",
        }}
      >
        {/* Animated denim weave texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
        }}>
          <div className="loader-weave" style={{
            position: "absolute", inset: "-50%",
            width: "200%", height: "200%",
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 10px),
              repeating-linear-gradient(-45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 10px)
            `,
            animation: "loader-weave-drift 20s linear infinite",
          }} />
        </div>

        {/* ── YWEE Brand Lockup ─────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(10px, 2vw, 18px)",
          animation: "loader-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          {/* Stitched circular seal with Y */}
          <div style={{
            width: "clamp(72px, 14vw, 110px)",
            height: "clamp(72px, 14vw, 110px)",
            borderRadius: "50%",
            border: "2px solid rgba(244,239,230,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginBottom: "2px",
          }}>
            {/* Inner stitch ring */}
            <div style={{
              position: "absolute", inset: "8px",
              borderRadius: "50%",
              border: "1px dashed rgba(244,239,230,0.12)",
            }} />
            {/* Y mark */}
            <span style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(28px, 5.5vw, 44px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(244,239,230,0.55)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>Y</span>
          </div>

          {/* YWEE wordmark — large and central */}
          <div style={{
            position: "relative",
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(64px, 13vw, 104px)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "-0.04em",
            color: "#F4EFE6",
            lineHeight: 0.9,
            overflow: "hidden",
          }}>
            {/* Shimmer sweep */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(110deg, transparent ${shimmer}%, rgba(255,255,255,0.07) ${shimmer + 12}%, transparent ${shimmer + 25}%)`,
              pointerEvents: "none",
            }} />
            y<strong style={{ fontWeight: 600, fontStyle: "normal" }}>w</strong>ee
          </div>

          {/* Sub-brand line */}
          <div style={{
            fontFamily: "'Geist', system-ui, sans-serif",
            fontSize: "clamp(10px, 2vw, 13px)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(244,239,230,0.45)",
          }}>
            Girls&apos; Stretch Denim &middot; India
          </div>
        </div>

        {/* Thread-stitch progress bar */}
        <div style={{
          width: "clamp(140px, 30vw, 240px)",
          height: "3px",
          background: "rgba(244,239,230,0.08)",
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px",
          animation: "loader-fade-up 0.7s 0.24s cubic-bezier(0.16,1,0.3,1) both",
          marginTop: "6px",
        }}>
          {/* Fill track */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            background: "rgba(244,239,230,0.55)",
            transition: "width 0.2s linear",
            borderRadius: "2px",
          }} />
          {/* Stitch dots overlay */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(27,58,92,0.6) 6px, rgba(27,58,92,0.6) 8px)",
            transition: "width 0.2s linear",
          }} />
          {/* Leading glow */}
          <div style={{
            position: "absolute",
            left: `${progress}%`, top: "-2px",
            width: "8px", height: "7px",
            borderRadius: "50%",
            background: "rgba(244,239,230,0.3)",
            filter: "blur(3px)",
            transform: "translateX(-50%)",
            transition: "left 0.2s linear",
            opacity: progress > 5 ? 1 : 0,
          }} />
        </div>

        {/* Cycling brand phrase with crossfade */}
        <div style={{
          position: "relative",
          height: "24px",
          overflow: "hidden",
          marginTop: "4px",
          animation: "loader-fade-up 0.7s 0.32s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          <div key={phraseIdx} style={{
            fontFamily: "'Geist', system-ui, sans-serif",
            fontSize: "clamp(10px, 2vw, 12px)",
            letterSpacing: "0.06em",
            color: "rgba(244,239,230,0.28)",
            animation: "loader-phrase-in 0.45s cubic-bezier(0.16,1,0.3,1) both",
            textAlign: "center",
            lineHeight: 1.5,
            whiteSpace: "nowrap",
          }}>
            {PHRASES[phraseIdx]}
          </div>
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
          color: "rgba(244,239,230,0.12)",
          animation: "loader-fade-up 0.7s 0.48s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          Generations Clothing LLP &middot; Est. 2024
        </div>
      </div>

      <style>{`
        @keyframes loader-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loader-phrase-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loader-weave-drift {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(10px, 10px); }
        }
      `}</style>
    </>
  );
}
