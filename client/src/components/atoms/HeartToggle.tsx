import { useState, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface HeartToggleProps {
  slug: string;
  productName: string;
  /** size variant */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "filled" | "ghost";
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

/**
 * Heart toggle button with pop animation. Persists via WishlistContext.
 */
export function HeartToggle({
  slug,
  productName,
  size = "md",
  variant = "ghost",
  className,
  style,
  ariaLabel,
}: HeartToggleProps) {
  const { has, toggle } = useWishlist();
  const liked = has(slug);
  const [popping, setPopping] = useState(false);

  const dims = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const icon = size === "sm" ? 14 : size === "lg" ? 20 : 16;

  function onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const wasLiked = liked;
    toggle(slug);
    setPopping(true);
    setTimeout(() => setPopping(false), 320);
    if (wasLiked) {
      toast("Removed from saved", { description: productName });
    } else {
      toast("Saved", { description: `${productName} · view your saved pieces` });
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? (liked ? `Remove ${productName} from saved` : `Save ${productName}`)}
      aria-pressed={liked}
      data-cursor="hover"
      className={`heart-toggle ${variant} ${liked ? "is-liked" : ""} ${popping ? "is-popping" : ""} ${className ?? ""}`}
      style={{
        width: `${dims}px`,
        height: `${dims}px`,
        ...style,
      }}
    >
      <Heart
        size={icon}
        strokeWidth={1.5}
        fill={liked ? "currentColor" : "none"}
      />
      <style>{`
        .heart-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.32s var(--ease-out), background 0.22s var(--ease-out), color 0.22s, border-color 0.22s;
          color: var(--ink);
          will-change: transform;
        }
        .heart-toggle.ghost {
          background: rgba(244, 239, 230, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(26, 25, 22, 0.12);
        }
        .heart-toggle.filled {
          background: var(--paper);
          border: 1px solid rgba(26, 25, 22, 0.18);
        }
        .heart-toggle:hover {
          transform: scale(1.08);
          color: var(--ink);
        }
        .heart-toggle.is-liked {
          color: #C53030;        /* warm red */
        }
        .heart-toggle.is-popping {
          animation: heartPop 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          25%  { transform: scale(1.4); }
          50%  { transform: scale(0.85); }
          75%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}
