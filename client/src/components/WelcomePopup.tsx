import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

const SEEN_KEY = "ywee:welcomeSeen:v1";
const DELAY_MS = 6000;

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(SEEN_KEY)) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
    try { window.localStorage.setItem(SEEN_KEY, new Date().toISOString()); } catch {}
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    try { window.localStorage.setItem(SEEN_KEY, new Date().toISOString()); } catch {}
    toast.success("Welcome to ywee", { description: "Use code WELCOME10 at checkout for 10% off." });
    setTimeout(() => setOpen(false), 1500);
  }

  if (!open) return null;
  return (
    <>
      <div className="welcome-overlay" onClick={close} />
      <div role="dialog" aria-modal="true" aria-label="Welcome — 10% off your first order" className="welcome-modal">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="welcome-close"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", height: "100%" }} className="welcome-grid">
          <div
            style={{
              backgroundImage: `url(/images/ywee-hero-heroimage.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              minHeight: "200px",
            }}
            aria-hidden="true"
          />
          <div style={{ padding: "clamp(24px, 4vw, 40px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
              First order — on us
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--ink)" }}>
              10% off the first<br />pair she'll love.
            </h2>
            <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.5 }}>
              Drop your email and we'll send the code. Studio updates and early access too — never spam.
            </p>
            {submitted ? (
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "20px", color: "var(--ink)", marginTop: "8px" }}>
                Sent. Use <strong>WELCOME10</strong> at checkout.
              </p>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    padding: "12px 14px",
                    border: "1px solid rgba(26,25,22,0.18)",
                    background: "var(--paper-soft)",
                    fontSize: "14px",
                    fontFamily: "var(--sans)",
                    color: "var(--ink)",
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "12px 18px" }}>
                  Send code
                </button>
              </form>
            )}
            <p style={{ fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "6px" }}>
              Free shipping · 30-day returns · Mended for life
            </p>
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
                marginTop: "4px",
                textAlign: "left",
                padding: 0,
                cursor: "pointer",
                fontFamily: "var(--sans)",
              }}
            >
              No thanks, continue browsing
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .welcome-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26, 25, 22, 0.55);
          backdrop-filter: blur(4px);
          z-index: 90;
          animation: fadeIn 0.3s var(--ease-out);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .welcome-modal {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(720px, calc(100vw - 32px));
          max-height: 92dvh;
          background: var(--paper-soft);
          z-index: 91;
          overflow: auto;
          animation: welcomeIn 0.5s var(--ease-out);
          box-shadow: 0 30px 80px rgba(26,25,22,0.32);
        }
        .welcome-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(244,239,230,0.94);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(26,25,22,0.12);
          border-radius: 50%;
          cursor: pointer;
          color: var(--ink);
        }
        @keyframes welcomeIn {
          from { opacity: 0; transform: translate(-50%, -42%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @media (min-width: 768px) {
          .welcome-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
