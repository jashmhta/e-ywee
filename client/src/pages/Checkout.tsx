import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useBag } from "@/contexts/BagContext";
import { ChevronLeft, Lock } from "lucide-react";

type Step = "shipping" | "payment" | "confirmation";

export default function Checkout() {
  const { items, subtotal, clearBag } = useBag();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("shipping");
  const [orderNumber] = useState(() => `YW-${Date.now().toString().slice(-6)}`);

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

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

              <FormField label="Name on Card" name="cardName" value={form.cardName} onChange={handleChange} required style={{ marginBottom: "12px" }} />
              <FormField label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="•••• •••• •••• ••••" required style={{ marginBottom: "12px" }} />
              <div className="form-row-2" style={{ marginBottom: "28px" }}>
                <FormField label="Expiry (MM/YY)" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" required />
                <FormField label="CVV" name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" required />
              </div>

              <button type="submit" style={{ width: "100%", padding: "16px", background: "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "var(--sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Lock size={13} strokeWidth={2} />
                Place Order · ₹{total.toLocaleString("en-IN")}
              </button>
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
                  <img src={product.imgPortrait} alt={product.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
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

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--ink-mute)" }}>
              <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--ink-mute)" }}>
              <span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div style={{ height: "1px", background: "rgba(26,25,22,0.10)", margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 500, color: "var(--ink)" }}>
              <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
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
