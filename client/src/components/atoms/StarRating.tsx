import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;                  // 0-5, supports decimals
  size?: number;                   // px
  showValue?: boolean;
  count?: number;                  // total reviews
  inline?: boolean;
  color?: string;
}

export function StarRating({
  rating,
  size = 12,
  showValue = false,
  count,
  inline = true,
  color = "var(--ink)",
}: StarRatingProps) {
  const full = Math.floor(rating);
  const partial = rating - full;     // 0..1
  return (
    <div
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars${count ? `, ${count} reviews` : ""}`}
      style={{
        display: inline ? "inline-flex" : "flex",
        alignItems: "center",
        gap: "4px",
        color,
      }}
    >
      <span style={{ display: "inline-flex", gap: "1px", position: "relative" }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < full;
          const isPartial = i === full && partial > 0;
          return (
            <span key={i} style={{ position: "relative", display: "inline-flex" }}>
              <Star
                size={size}
                strokeWidth={1.4}
                fill={isFull ? color : "transparent"}
                stroke={color}
                style={{ opacity: isFull ? 1 : 0.55 }}
              />
              {isPartial && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    width: `${partial * 100}%`,
                    pointerEvents: "none",
                  }}
                >
                  <Star size={size} strokeWidth={1.4} fill={color} stroke={color} />
                </span>
              )}
            </span>
          );
        })}
      </span>
      {showValue && (
        <span style={{ fontSize: "11px", color: "var(--ink-mute)", letterSpacing: "0.04em" }}>
          {rating.toFixed(1)}
          {count !== undefined && (
            <span style={{ color: "var(--ink-faint)", marginInlineStart: "4px" }}>· {count.toLocaleString("en-IN")}</span>
          )}
        </span>
      )}
    </div>
  );
}
