import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { PRODUCTS, imageSrc } from "@/data/store";

const NAMES = [
  "Aanya in Mumbai", "Riya in Delhi", "Priya in Bangalore",
  "Sara in Pune", "Diya in Hyderabad", "Mira in Chennai",
  "Tara in Surat", "Aarya in Goa", "Anika in Indore",
];

const TIMINGS = [
  "just now", "2 mins ago", "5 mins ago", "8 mins ago",
  "12 mins ago", "20 mins ago", "26 mins ago",
];

export function RecentlySold() {
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState<{ name: string; product: typeof PRODUCTS[0]; time: string } | null>(null);
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [location] = useLocation();

  // Don't show on checkout / account / login
  const suppressed = /^\/(checkout|account|login|register)/.test(location);

  useEffect(() => {
    if (suppressed) return;
    const STORAGE_KEY = "ywee:recentlySoldDismissed";
    if (sessionStorage.getItem(STORAGE_KEY) === "true") return;

    const showOne = () => {
      const product = PRODUCTS[idx.current % PRODUCTS.length];
      const name = NAMES[(idx.current * 3) % NAMES.length];
      const time = TIMINGS[(idx.current * 5) % TIMINGS.length];
      setItem({ name, product, time });
      setVisible(true);
      idx.current++;
      timer.current = setTimeout(() => {
        setVisible(false);
        timer.current = setTimeout(showOne, 9000);
      }, 5500);
    };

    // First toast after 8 seconds
    timer.current = setTimeout(showOne, 8000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [suppressed]);

  if (suppressed || !item) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rs-toast ${visible ? "is-visible" : ""}`}
      onClick={() => {
        sessionStorage.setItem("ywee:recentlySoldDismissed", "true");
        setVisible(false);
      }}
    >
      <img
        src={imageSrc(item.product, 0, 480)}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          width: "44px",
          height: "56px",
          objectFit: "cover",
          flexShrink: 0,
          background: "var(--paper-warm)",
        }}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "3px" }}>
          {item.time}
        </p>
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "14px", color: "var(--ink)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.name}
        </p>
        <p style={{ fontSize: "11px", color: "var(--ink-mute)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          bought the {item.product.name}
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={(e) => {
          e.stopPropagation();
          sessionStorage.setItem("ywee:recentlySoldDismissed", "true");
          setVisible(false);
        }}
        style={{
          background: "none",
          border: "none",
          color: "var(--ink-faint)",
          cursor: "pointer",
          fontSize: "18px",
          padding: "0 4px",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <style>{`
        .rs-toast {
          position: fixed;
          left: clamp(16px, 3vw, 24px);
          bottom: clamp(20px, 4vw, 36px);
          z-index: 47;
          display: flex;
          align-items: center;
          gap: 12px;
          width: min(320px, calc(100vw - 32px));
          padding: 10px 12px;
          background: rgba(244, 239, 230, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(26, 25, 22, 0.10);
          box-shadow: 0 12px 36px rgba(26,25,22,0.18);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
          cursor: pointer;
        }
        .rs-toast.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 767px) {
          .rs-toast {
            bottom: calc(80px + env(safe-area-inset-bottom));   /* above snitch nav */
            left: 12px;
            width: calc(100vw - 24px);
          }
        }
      `}</style>
    </div>
  );
}
