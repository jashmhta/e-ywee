import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** seconds to scroll one full loop */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** number of times to repeat children for a seamless loop */
  repeat?: number;
}

/**
 * Seamless infinite marquee. The children are repeated `repeat` times
 * inside the track so the animation can loop without seams.
 */
export function Marquee({
  children,
  speed = 28,
  direction = "left",
  pauseOnHover = true,
  className,
  style,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden ${className ?? ""}`}
      style={{ overflow: "hidden", ...style }}
    >
      <div
        className={`marquee-track ${direction}`}
        style={{
          animationDuration: `${speed}s`,
          ...(pauseOnHover ? {} : { animationPlayState: "running" }),
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div
            key={i}
            style={{ display: "inline-flex", flexShrink: 0, alignItems: "center" }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
