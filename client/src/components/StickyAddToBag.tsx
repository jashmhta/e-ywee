import { useEffect, useState } from "react";
import type { Product } from "@/data/store";
import { imageSrc } from "@/data/store";
import { useCurrency } from "@/contexts/CurrencyContext";

interface StickyAddToBagProps {
  product: Product;
  selectedSize: string | null;
  onAdd: () => void;
  added: boolean;
}

/**
 * Mobile-only sticky bar that appears once the user scrolls past the
 * top of the PDP — gives them constant access to add-to-bag.
 */
export function StickyAddToBag({ product, selectedSize, onAdd, added }: StickyAddToBagProps) {
  const [show, setShow] = useState(false);
  const { format } = useCurrency();

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="region"
      aria-label="Quick add to bag"
      className={`sab ${show ? "is-visible" : ""}`}
    >
      <img
        src={imageSrc(product, 0, 480)}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ width: "44px", height: "56px", objectFit: "cover", flexShrink: 0, background: "var(--paper-warm)" }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "14px", color: "var(--ink)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </p>
        <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>
          {selectedSize ? `Size ${selectedSize.replace(" Yrs", "")} · ${format(product.price)}` : `Pick a size · ${format(product.price)}`}
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="btn btn-primary"
        style={{ padding: "12px 14px", fontSize: "11px", flexShrink: 0, background: added ? "var(--sage)" : "var(--ink)" }}
      >
        {added ? "Added ✓" : selectedSize ? "Add to bag" : "Pick size"}
      </button>

      <style>{`
        .sab {
          position: fixed;
          bottom: calc(68px + env(safe-area-inset-bottom));   /* sit just above SnitchNav */
          left: 0; right: 0;
          z-index: 49;
          padding: 10px 14px;
          background: rgba(244, 239, 230, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid rgba(26, 25, 22, 0.12);
          display: flex;
          align-items: center;
          gap: 12px;
          transform: translateY(100%);
          transition: transform 0.36s var(--ease-out);
        }
        .sab.is-visible { transform: translateY(0); }
        @media (min-width: 768px) {
          .sab { display: none; }
        }
      `}</style>
    </div>
  );
}
