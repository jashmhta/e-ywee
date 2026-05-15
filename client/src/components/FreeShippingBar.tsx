import { useBag } from "@/contexts/BagContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const FREE_SHIPPING_THRESHOLD_INR = 999;

/**
 * Inline progress bar showing how close the user is to free shipping.
 * Renders only when there's at least one item in the bag.
 */
export function FreeShippingBar() {
  const { subtotal, totalItems } = useBag();
  const { format } = useCurrency();
  if (totalItems === 0) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_INR) * 100);
  const unlocked = remaining === 0;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: unlocked ? "var(--sage)" : "var(--ink)",
        color: "var(--paper)",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "0 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: `${progress}%`,
          background: "rgba(244,239,230,0.10)",
          transition: "width 0.6s var(--ease-out)",
        }}
      />
      <span style={{ position: "relative", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center" }}>
        {unlocked ? (
          <>✓ Free shipping unlocked · enjoy</>
        ) : (
          <>Add {format(remaining)} for free shipping · {Math.round(progress)}%</>
        )}
      </span>
    </div>
  );
}
