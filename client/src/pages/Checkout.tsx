import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useBag } from "@/contexts/BagContext";
import { ChevronLeft, Lock, Gift } from "lucide-react";
import { imageSrc } from "@/data/store";
import { Meta } from "@/components/system/Meta";
import { useCurrency } from "@/contexts/CurrencyContext";

type Step = "shipping" | "payment" | "confirmation";
type PaymentMethod = "upi" | "card" | "cod";

const GIFT_WRAP_INR = 99;

export default function Checkout() {
  const { items, subtotal, clearBag } = useBag();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("shipping");
  const [orderNumber] = useState(() => `YW-${Date.now().toString().slice(-6)}`);
  const { format, currency } = useCurrency();

  // Extras
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [needsGstInvoice, setNeedsGstInvoice] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [gstName, setGstName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; pct: number } | null>(null);

  const shippingCost = subtotal >= 999 ? 0 : 99;
  const giftCost = giftWrap ? GIFT_WRAP_INR : 0;
  const codFee = paymentMethod === "cod" ? 49 : 0;
  const discount = promoApplied ? Math.round(subtotal * promoApplied.pct) : 0;
  const total = subtotal + shippingCost + giftCost + codFee - discount;

  function applyPromo() {
    const c = promo.trim().toUpperCase();
    if (c === "WELCOME10") setPromoApplied({ code: c, pct: 0.10 });
    else if (c === "STAY15") setPromoApplied({ code: c, pct: 0.15 });
    else if (c === "ATELIER20") setPromoApplied({ code: c, pct: 0.20 });
    else setPromoApplied(null);
  }

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "IN",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmation");
    clearBag();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <main style={{ minHeight: "60dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "24px", fontStyle: "italic", color: "var(--ink-mute)" }}>
          Your bag is empty.
        </p>
        <Link href="/shop" style={{ fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", textDecoration: "underline" }}>
          Return to Shop
        </Link>
      </main>
    );
  }

  if (step === "confirmation") {
    return (
      <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 48px)", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
            Order Confirmed
          </p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: "16px" }}>
            Thank you, {form.firstName || "friend"}.
          </h1>
          <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "8px" }}>
            Your order <strong style={{ fontFamily: "var(--mono)", fontSize: "13px" }}>{orderNumber}</strong> has been confirmed.
          </p>
          <p style={{ fontSize: "14px", color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: "40px" }}>
            A confirmation has been sent to <strong>{form.email || "your email"}</strong>. Your pieces will be carefully packed and dispatched within 2–3 business days.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--ink)", color: "var(--paper)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, padding: "14px 28px", fontFamily: "var(--sans)" }}>
              Continue Shopping
            </Link>
            <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "var(--ink)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, padding: "13px 28px", border: "1px solid rgba(26,25,22,0.18)", fontFamily: "var(--sans)" }}>
              View Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta title="Checkout" canonicalPath="/checkout" />
      {/* Header */}
      <div style={{ padding: "16px clamp(20px, 4vw, 48px)", borderBottom: "1px solid rgba(26,25,22,0.08)", maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink-faint)" }}>
          <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: "18px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)" }}>
            y<strong style={{ fontWeight: 600, fontStyle: "normal" }}>w</strong>ee
          </Link>
          <span style={{ opacity: 0.4, margin: "0 8px" }}>/</span>
          <span style={{ color: step === "shipping" ? "var(--ink)" : "var(--ink-faint)" }}>Shipping</span>
          <span style={{ opacity: 0.4 }}>→</span>
          <span style={{ color: step === "payment" ? "var(--ink)" : "var(--ink-faint)" }}>Payment</span>
        </div>
      </div>

      <div className="checkout-main-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(24px, 4vw, 48px) clamp(20px, 4vw, 48px)" }}>
        {/* Form */}
        <div>
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "28px" }}>
                Shipping Information
              </h2>

              <div className="form-row-2" style={{ marginBottom: "12px" }}>
                <FormField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                <FormField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required style={{ marginBottom: "12px" }} />
              <FormField label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={handleChange} style={{ marginBottom: "20px" }} />

              <div style={{ height: "1px", background: "rgba(26,25,22,0.08)", margin: "20px 0" }} />

              <FormField label="Street Address" name="address" value={form.address} onChange={handleChange} required style={{ marginBottom: "12px" }} />
              <div className="form-row-2" style={{ marginBottom: "12px" }}>
                <FormField label="City" name="city" value={form.city} onChange={handleChange} required />
                <FormField label="State / Province" name="state" value={form.state} onChange={handleChange} required />
              </div>
              <div className="form-row-2" style={{ marginBottom: "24px" }}>
                <FormField label="Postal Code" name="zip" value={form.zip} onChange={handleChange} required />
                <div>
                  <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Country</label>
                  <select name="country" value={form.country} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }}>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AE">UAE</option>
                    <option value="SG">Singapore</option>
                    <option value="AU">Australia</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>

              <button type="submit" style={{ width: "100%", padding: "16px", background: "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "var(--sans)", transition: "background 0.22s" }}>
                Continue to Payment
              </button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <button type="button" onClick={() => setStep("shipping")} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", letterSpacing: "0.06em" }}>
                  <ChevronLeft size={14} strokeWidth={1.5} /> Back
                </button>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)" }}>
                  Payment
                </h2>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "var(--paper-warm)", marginBottom: "24px", border: "1px solid rgba(26,25,22,0.08)" }}>
                <Lock size={12} strokeWidth={1.5} style={{ color: "var(--ink-faint)" }} />
                <span style={{ fontSize: "12px", color: "var(--ink-mute)", letterSpacing: "0.04em" }}>
                  Your payment information is encrypted and secure.
                </span>
              </div>

              {/* Payment method tabs */}
              <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
                Choose payment method
              </p>
              <div role="tablist" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", marginBottom: "20px" }}>
                {[
                  { id: "upi" as const, label: "UPI", sub: "GPay · PhonePe · Paytm" },
                  { id: "card" as const, label: "Card", sub: "Credit / Debit / Netbanking" },
                  { id: "cod" as const, label: "Cash on Delivery", sub: "+ ₹49 fee" },
                ].map((m) => {
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        background: active ? "var(--ink)" : "var(--paper)",
                        color: active ? "var(--paper)" : "var(--ink)",
                        border: `1px solid ${active ? "var(--ink)" : "rgba(26,25,22,0.18)"}`,
                        padding: "12px 10px",
                        fontFamily: "var(--sans)",
                        fontSize: "11px",
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.22s var(--ease-out)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>{m.label}</span>
                      <span style={{ fontSize: "9px", letterSpacing: "0.08em", opacity: 0.7, textTransform: "none" }}>{m.sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* Per-method panel */}
              {paymentMethod === "upi" && (
                <div style={{ background: "var(--paper-warm)", padding: "20px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "13px", color: "var(--ink-mute)", lineHeight: 1.5 }}>
                    On submit, you'll be redirected to your UPI app to approve the payment. Money never leaves until you tap approve.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                    {["GPay", "PhonePe", "Paytm", "BHIM", "Razorpay"].map((p) => (
                      <span key={p} style={{ fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", padding: "6px 10px", background: "var(--paper)", border: "1px solid rgba(26,25,22,0.10)" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {paymentMethod === "card" && (
                <>
                  <FormField label="Name on Card" name="cardName" value={form.cardName} onChange={handleChange} required style={{ marginBottom: "12px" }} />
                  <FormField label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="•••• •••• •••• ••••" required style={{ marginBottom: "12px" }} />
                  <div className="form-row-2" style={{ marginBottom: "20px" }}>
                    <FormField label="Expiry (MM/YY)" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" required />
                    <FormField label="CVV" name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" required />
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--ink-faint)", marginBottom: "20px" }}>
                    All major cards accepted via Razorpay. International cards supported.
                  </p>
                </>
              )}
              {paymentMethod === "cod" && (
                <div style={{ background: "var(--paper-warm)", padding: "20px", marginBottom: "24px" }}>
                  <p style={{ fontSize: "13px", color: "var(--ink-mute)", lineHeight: 1.6 }}>
                    Pay <strong style={{ color: "var(--ink)" }}>{format(total)}</strong> in cash to the courier on delivery.
                    A small ₹49 handling fee applies. Available across India for orders below ₹10,000.
                  </p>
                </div>
              )}

              {/* Gift wrapping */}
              <div style={{ background: "var(--paper-soft)", padding: "16px 18px", marginBottom: "12px", borderRadius: "2px", border: "1px solid rgba(26,25,22,0.08)" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} style={{ marginTop: "3px" }} />
                  <span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "16px", color: "var(--ink)" }}>
                      <Gift size={14} strokeWidth={1.5} /> Gift wrap this order · {format(GIFT_WRAP_INR)}
                    </span>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--ink-mute)", marginTop: "2px" }}>
                      Hand-tied ribbon, recyclable kraft paper, and a personalised note.
                    </span>
                  </span>
                </label>
                {giftWrap && (
                  <textarea
                    placeholder="Note for the recipient (optional)"
                    rows={2}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    maxLength={140}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      padding: "10px 12px",
                      border: "1px solid rgba(26,25,22,0.18)",
                      background: "var(--paper)",
                      fontFamily: "var(--sans)",
                      fontSize: "13px",
                      color: "var(--ink)",
                      resize: "vertical",
                    }}
                  />
                )}
              </div>

              {/* GST invoice */}
              <div style={{ background: "var(--paper-soft)", padding: "16px 18px", marginBottom: "20px", borderRadius: "2px", border: "1px solid rgba(26,25,22,0.08)" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={needsGstInvoice} onChange={(e) => setNeedsGstInvoice(e.target.checked)} style={{ marginTop: "3px" }} />
                  <span>
                    <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "16px", color: "var(--ink)" }}>
                      I need a GST invoice
                    </span>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--ink-mute)", marginTop: "2px" }}>
                      For business buyers. Invoice will be emailed once dispatched.
                    </span>
                  </span>
                </label>
                {needsGstInvoice && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginTop: "10px" }}>
                    <input type="text" required placeholder="Registered business name" value={gstName} onChange={(e) => setGstName(e.target.value)}
                      style={{ padding: "10px 12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", fontSize: "13px", fontFamily: "var(--sans)" }}
                    />
                    <input type="text" required placeholder="GSTIN (15 chars)" value={gstNumber} onChange={(e) => setGstNumber(e.target.value.toUpperCase())} maxLength={15}
                      style={{ padding: "10px 12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", fontSize: "13px", fontFamily: "var(--mono)", letterSpacing: "0.04em" }}
                    />
                  </div>
                )}
              </div>

              <button type="submit" style={{ width: "100%", padding: "16px", background: "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "var(--sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Lock size={13} strokeWidth={2} />
                {paymentMethod === "cod" ? "Place order · pay on delivery" : "Place order"} · {format(total)}
              </button>
              <p style={{ textAlign: "center", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "12px" }}>
                256-bit SSL · PCI DSS · Razorpay secured
              </p>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout-order-summary" style={{ background: "var(--paper-warm)", padding: "28px", border: "1px solid rgba(26,25,22,0.08)" }}>
          <h3 style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "20px" }}>
            Order Summary
          </h3>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {items.map(({ product, size, quantity }) => (
              <li key={`${product.id}-${size}`} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "12px" }}>
                <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-deep)", position: "relative" }}>
                  <img src={imageSrc(product, 0, 480)} alt={product.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", background: "var(--ink)", color: "var(--paper)", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {quantity}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "14px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "2px" }}>{product.name}</p>
                  <p style={{ fontSize: "11px", color: "var(--ink-faint)" }}>Size {size} · {product.color}</p>
                  <p style={{ fontSize: "13px", color: "var(--ink-soft)", marginTop: "4px" }}>₹{(product.price * quantity).toLocaleString("en-IN")}</p>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ height: "1px", background: "rgba(26,25,22,0.10)", margin: "16px 0" }} />

          {/* Promo code */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value.toUpperCase())}
                placeholder="Promo code"
                aria-label="Promo code"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "1px solid rgba(26,25,22,0.18)",
                  background: "var(--paper)",
                  fontSize: "12px",
                  fontFamily: "var(--mono)",
                  letterSpacing: "0.06em",
                  color: "var(--ink)",
                }}
              />
              <button
                type="button"
                onClick={applyPromo}
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  border: "none",
                  padding: "10px 16px",
                  fontSize: "11px",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                }}
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p style={{ fontSize: "11px", color: "var(--sage)", marginTop: "6px" }}>
                ✓ <strong>{promoApplied.code}</strong> applied — {Math.round(promoApplied.pct * 100)}% off subtotal
              </p>
            )}
            {promo && !promoApplied && (
              <p style={{ fontSize: "11px", color: "#993a3a", marginTop: "6px" }}>
                Code not recognised. Try WELCOME10, STAY15, ATELIER20.
              </p>
            )}
          </div>

          <div style={{ height: "1px", background: "rgba(26,25,22,0.10)", margin: "12px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Row label="Subtotal" value={format(subtotal)} />
            <Row label="Shipping" value={shippingCost === 0 ? "Free" : format(shippingCost)} accent={shippingCost === 0 ? "var(--sage)" : undefined} />
            {giftWrap && <Row label="Gift wrap" value={format(GIFT_WRAP_INR)} />}
            {paymentMethod === "cod" && <Row label="COD handling" value={format(codFee)} />}
            {discount > 0 && <Row label={`Promo (${promoApplied?.code})`} value={`− ${format(discount)}`} accent="var(--sage)" />}
            <div style={{ height: "1px", background: "rgba(26,25,22,0.10)", margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 500, color: "var(--ink)" }}>
              <span>Total</span>
              <span>{format(total)}{currency.code !== "INR" && (
                <span style={{ display: "block", fontSize: "10px", letterSpacing: "0.10em", color: "var(--ink-faint)", textTransform: "uppercase", marginTop: "2px", fontWeight: 400 }}>
                  ≈ ₹{total.toLocaleString("en-IN")}
                </span>
              )}</span>
            </div>
          </div>

          {/* Trust strip */}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(26,25,22,0.10)" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              We accept
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["UPI", "Visa", "MC", "Amex", "RuPay", "Netbanking", "COD"].map((p) => (
                <span key={p} style={{ fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", padding: "4px 8px", background: "var(--paper)", border: "1px solid rgba(26,25,22,0.10)", color: "var(--ink-mute)", fontFamily: "var(--sans)" }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: accent ?? "var(--ink-mute)" }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = "text", required = false, placeholder, style = {} }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; placeholder?: string; style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <label htmlFor={name} style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none", transition: "border-color 0.22s" }}
        onFocus={e => (e.target.style.borderColor = "var(--ink)")}
        onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
      />
    </div>
  );
}
