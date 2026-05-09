import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useBag } from "@/contexts/BagContext";
import { X, Minus, Plus } from "lucide-react";
import { PRODUCTS } from "@/data/store";

const FREE_SHIPPING_THRESHOLD = 999;

export default function BagDrawer() {
  const { items, isOpen, closeBag, removeItem, updateQuantity, subtotal } = useBag();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Track last-added item for micro-animation
  useEffect(() => {
    if (items.length > 0 && isOpen) {
      const last = items[items.length - 1];
      setJustAdded(`${last.product.id}-${last.size}`);
      const t = setTimeout(() => setJustAdded(null), 1800);
      return () => clearTimeout(t);
    }
  }, [items.length]);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Suggested items (not in bag, same category as first bag item)
  const bagCategories = items.map(i => i.product.category);
  const suggestions = PRODUCTS
    .filter(p => !items.find(i => i.product.id === p.id) && bagCategories.includes(p.category))
    .slice(0, 3);

  return (
    <>
      {/* Overlay */}
      <div
        className={`bag-overlay ${isOpen ? "open" : ""}`}
        onClick={closeBag}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`bag-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(26,25,22,0.10)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Bag</span>
            {items.length > 0 && (
              <span style={{ fontSize: "11px", color: "var(--ink-faint)" }}>
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            )}
          </div>
          <button onClick={closeBag} aria-label="Close bag"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(26,25,22,0.06)", border: "none", cursor: "pointer", transition: "background 0.22s", color: "var(--ink)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(26,25,22,0.12)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(26,25,22,0.06)")}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Free shipping progress bar ──────────────────────── */}
        {items.length > 0 && (
          <div style={{ padding: "12px 24px", background: "var(--paper-warm)", borderBottom: "1px solid rgba(26,25,22,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
                {remaining === 0 ? "✓ Free shipping unlocked" : `₹${remaining} away from free shipping`}
              </span>
              <span style={{ fontSize: "11px", color: "var(--ink-faint)" }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: "2px", background: "rgba(26,25,22,0.10)", borderRadius: "1px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: remaining === 0 ? "var(--sage)" : "var(--ink)", borderRadius: "1px", transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
        )}

        {/* ── Items ──────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", paddingTop: "80px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{ fontFamily: "var(--serif)", fontSize: "20px", fontStyle: "italic", fontWeight: 300, color: "var(--ink-mute)" }}>Your bag is empty</p>
              <p style={{ fontSize: "13px", color: "var(--ink-faint)", textAlign: "center", maxWidth: "220px", lineHeight: 1.6 }}>
                Discover considered pieces made to last a lifetime.
              </p>
              <Link href="/shop" onClick={closeBag}
                style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--ink)", color: "var(--paper)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, padding: "12px 24px", textDecoration: "none", fontFamily: "var(--sans)" }}>
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map(({ product, size, quantity }) => {
                  const key = `${product.id}-${size}`;
                  const isNew = justAdded === key;
                  return (
                    <li key={key}
                      style={{
                        display: "grid", gridTemplateColumns: "80px 1fr", gap: "16px",
                        padding: "20px 0", borderBottom: "1px solid rgba(26,25,22,0.08)",
                        background: isNew ? "rgba(110,122,102,0.06)" : "transparent",
                        transition: "background 0.6s",
                        borderRadius: isNew ? "4px" : "0",
                      }}
                    >
                      {/* Image */}
                      <Link href={`/product/${product.slug}`} onClick={closeBag}>
                        <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-warm)" }}>
                          <img src={product.imgPortrait} alt={product.alt}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s" }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                            loading="lazy" />
                        </div>
                      </Link>

                      {/* Info */}
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <Link href={`/product/${product.slug}`} onClick={closeBag}>
                            <p style={{ fontFamily: "var(--serif)", fontSize: "15px", fontStyle: "italic", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: "4px", textDecoration: "none", color: "var(--ink)" }}>
                              {product.name}
                            </p>
                          </Link>
                          <p style={{ fontSize: "12px", color: "var(--ink-faint)", letterSpacing: "0.04em" }}>
                            Size {size} · {product.color}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                          {/* Quantity stepper */}
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(26,25,22,0.15)" }}>
                            <button onClick={() => updateQuantity(product.id, size, quantity - 1)}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", transition: "color 0.22s" }}
                              aria-label="Decrease quantity">
                              <Minus size={10} strokeWidth={2} />
                            </button>
                            <span style={{ fontSize: "12px", width: "24px", textAlign: "center" }}>{quantity}</span>
                            <button onClick={() => updateQuantity(product.id, size, quantity + 1)}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", transition: "color 0.22s" }}
                              aria-label="Increase quantity">
                              <Plus size={10} strokeWidth={2} />
                            </button>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "14px", fontWeight: 400 }}>₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                            <button onClick={() => removeItem(product.id, size)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.22s", fontFamily: "var(--sans)" }}
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-faint)")}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* ── You may also like ─────────────────────────── */}
              {suggestions.length > 0 && (
                <div style={{ padding: "20px 0", borderTop: "1px solid rgba(26,25,22,0.08)" }}>
                  <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "14px" }}>You may also like</p>
                  <div style={{ display: "flex", gap: "10px", overflowX: "auto", scrollbarWidth: "none" }}>
                    {suggestions.map(p => (
                      <div key={p.id} style={{ flexShrink: 0, width: "90px" }}>
                        <Link href={`/product/${p.slug}`} onClick={closeBag}>
                          <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-warm)", marginBottom: "6px" }}>
                            <img src={p.imgPortrait} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.06)")}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")} />
                          </div>
                          <p style={{ fontSize: "10px", color: "var(--ink-mute)", lineHeight: 1.3, fontFamily: "var(--serif)", fontStyle: "italic" }}>{p.name}</p>
                          <p style={{ fontSize: "10px", color: "var(--ink-faint)" }}>₹{p.price.toLocaleString("en-IN")}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(26,25,22,0.10)", background: "var(--paper-soft)" }}>
            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--ink-mute)" }}>
                <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--ink-mute)" }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? "var(--sage)" : "var(--ink-mute)" }}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 500, paddingTop: "10px", borderTop: "1px solid rgba(26,25,22,0.10)" }}>
                <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/checkout" onClick={closeBag}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", background: "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, padding: "16px", textDecoration: "none", fontFamily: "var(--sans)", transition: "background 0.22s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--ink-soft)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--ink)")}
            >
              Proceed to Checkout
            </Link>

            <button onClick={closeBag}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", background: "transparent", color: "var(--ink-mute)", fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", padding: "12px", border: "none", cursor: "pointer", fontFamily: "var(--sans)", marginTop: "8px", transition: "color 0.22s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}
            >
              Continue Shopping
            </button>

            {/* Trust signals */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(26,25,22,0.06)" }}>
              {["Free returns", "Lifetime mending", "Carbon neutral"].map(s => (
                <span key={s} style={{ fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
