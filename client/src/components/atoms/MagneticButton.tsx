import { useRef, type ReactNode, type MouseEvent, type ElementType } from "react";

interface MagneticButtonProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** how strongly the element follows the cursor (0–1). default 0.18 */
  strength?: number;
  /** range from element bounds in px to start magnetic effect. default 80 */
  range?: number;
  onClick?: (e: MouseEvent) => void;
  href?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}

/**
 * Wraps a button/link with a subtle "magnetic" cursor follow effect,
 * driven via CSS variables --mx / --my consumed by the .magnetic class.
 */
export function MagneticButton({
  as: Component = "button",
  children,
  className,
  style,
  strength = 0.18,
  range = 80,
  ariaLabel,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > range + Math.max(r.width, r.height) / 2) return;
    el.style.setProperty("--mx", `${dx * strength}px`);
    el.style.setProperty("--my", `${dy * strength}px`);
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

  return (
    <Component
      ref={ref as any}
      className={`magnetic ${className ?? ""}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </Component>
  );
}
