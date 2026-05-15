import { useEffect, useState } from "react";

interface CountdownProps {
  /** ISO datetime string */
  endsAt: string;
  /** label before the timer */
  label?: string;
  /** className for the wrapper */
  className?: string;
  style?: React.CSSProperties;
}

function fmt(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown({ endsAt, label = "Ends in", className, style }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, new Date(endsAt).getTime() - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);

  if (diff === 0) return null;

  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", ...style }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span aria-hidden="true">{d > 0 ? `${d}d ` : ""}{fmt(h)}:{fmt(m)}:{fmt(s)}</span>
      <span className="sr-only">{`${d} days, ${h} hours, ${m} minutes, ${s} seconds remaining`}</span>
    </span>
  );
}

/**
 * A full-width promo banner with countdown that sits below the announcement bar.
 */
export function CountdownBanner({ endsAt, message, ctaText, ctaHref }: { endsAt: string; message: string; ctaText?: string; ctaHref?: string }) {
  return (
    <div
      style={{
        background: "var(--bone)",
        color: "var(--ink)",
        padding: "10px 16px",
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        fontSize: "11px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        borderBottom: "1px solid rgba(26,25,22,0.10)",
      }}
    >
      <span>{message}</span>
      <Countdown endsAt={endsAt} label="" />
      {ctaText && ctaHref && (
        <a href={ctaHref} style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          {ctaText} →
        </a>
      )}
    </div>
  );
}
