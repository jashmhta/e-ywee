import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

const SHOWN_KEY = "ywee:exitIntentShown:v1";

/**
 * Detects an exit-intent gesture on desktop (cursor leaving viewport upwards)
 * and a slow-scroll-up fallback on mobile. Shows once per browser per ~30 days.
 */
export function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const last = window.localStorage.getItem(SHOWN_KEY);
    if (last) {
      const days = (Date.now() - new Date(last).getTime()) / 86_400_000;
      if (days < 30) return;
    }

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    let armed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const arm = () => { armed = true; };
    const disarm = () => { armed = false; };

    // Arm after 8s of browsing
    timer = setTimeout(arm, 8000);

    const onMouseOut = (e: MouseEvent) => {
      if (!armed || isMobile) return;
      if (e.relatedTarget) return;
      if (e.clientY > 8) return;
      armed = false;
      setOpen(true);
    };

    let lastScrollY = window.scrollY;
    let upwardCount = 0;
    const onScroll = () => {
      if (!armed || !isMobile) return;
      const y = window.scrollY;
      if (y < lastScrollY - 30) {
        upwardCount++;
        if (upwardCount >= 2 && y < 200) {
          armed = false;
          setOpen(true);
        }
      } else {
        upwardCount = 0;
      }
      lastScrollY = y;
    };

    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") disarm();
    });

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function close() {
    setOpen(false);
    try { window.localStorage.setItem(SHOWN_KEY, new Date().toISOString()); } catch {}
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    try { window.localStorage.setItem(SHOWN_KEY, new Date().toISOString()); } catch {}
    toast.success("Code sent. Check your inbox.", { description: "Use STAY15 at checkout for 15% off." });
    setTimeout(() => setOpen(false), 1500);
  }

  if (!open) return null;
  return (
    <>
      <div onClick={close} className="exit-overlay" />
      <div role="dialog" aria-modal="true" aria-label="Wait — 15% off your first order" className="exit-modal">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="exit-close"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          One more thing
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "16px" }}>
          Wait — take 15% off.
        </h2>
        <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: "24px" }}>
          A small thank-you for browsing. Drop your email and we'll send a code worth 15% off your first pair.
        </p>
        {submitted ? (
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "22px", color: "var(--ink)" }}>
            Sent. Use <strong>STAY15</strong> at checkout.
          </p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "14px 16px",
                border: "1px solid rgba(26,25,22,0.18)",
                background: "var(--paper)",
                fontSize: "14px",
                fontFamily: "var(--sans)",
                color: "var(--ink)",
              }}
            />
            <button type="submit" className="btn btn-primary">Send the code</button>
          </form>
        )}
        <button
          type="button"
          onClick={close}
          style={{
            background: "none",
            border: "none",
            color: "var(--ink-faint)",
            fontSize: "11px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            marginTop: "16px",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--sans)",
          }}
        >
          No thanks
        </button>
      </div>

      <style>{`
        .exit-overlay {
          position: fixed; inset: 0;
          background: rgba(26, 25, 22, 0.55);
          backdrop-filter: blur(6px);
          z-index: 92;
          animation: fadeIn 0.3s var(--ease-out);
        }
        .exit-modal {
          position: fixed;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: min(560px, calc(100vw - 32px));
          background: var(--paper-soft);
          z-index: 93;
          padding: clamp(28px, 4vw, 48px);
          animation: welcomeIn 0.45s var(--ease-out);
          box-shadow: 0 30px 80px rgba(26,25,22,0.32);
        }
        .exit-close {
          position: absolute;
          top: 14px; right: 14px;
          width: 32px; height: 32px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--paper-warm);
          border: 1px solid rgba(26,25,22,0.12);
          border-radius: 50%;
          cursor: pointer;
          color: var(--ink);
        }
      `}</style>
    </>
  );
}
