import { useState } from "react";
import { Meta } from "@/components/system/Meta";
import { Check, Package, Truck, Home as HomeIcon } from "lucide-react";

interface TrackingState {
  orderNumber: string;
  status: 0 | 1 | 2 | 3;     // 0 confirmed, 1 packed, 2 shipped, 3 delivered
  customer: string;
  estimate: string;
  carrier: string;
  awb: string;
  items: number;
  total: number;
}

const STAGES = [
  { label: "Order confirmed", icon: Check, sub: "Receipt sent to your email" },
  { label: "Packed in Surat", icon: Package, sub: "Made-in-India tag applied" },
  { label: "Shipped via Bluedart", icon: Truck, sub: "Tracking link active" },
  { label: "Delivered", icon: HomeIcon, sub: "Enjoy — and remember mending is free" },
];

function lookup(orderNumber: string): TrackingState | null {
  const trimmed = orderNumber.trim().toUpperCase();
  if (!trimmed) return null;
  // Deterministic fake — based on the digits of the order number
  const digits = (trimmed.match(/\d+/) ?? ["123"])[0];
  const seed = parseInt(digits, 10) || 1;
  return {
    orderNumber: trimmed.startsWith("YW-") ? trimmed : `YW-${trimmed}`,
    status: (seed % 4) as 0 | 1 | 2 | 3,
    customer: ["Aanya M.", "Riya S.", "Priya G.", "Sara K."][seed % 4],
    estimate: ["Today", "Tomorrow", "Wed, 21 Apr", "Mon, 26 Apr"][seed % 4],
    carrier: "Bluedart",
    awb: `BD${seed * 7919}`.slice(0, 14),
    items: 1 + (seed % 3),
    total: 1499 * (1 + (seed % 3)),
  };
}

export default function OrderTracking() {
  const [order, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<TrackingState | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setResult(lookup(order));
  }

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta title="Track your order" description="Track your ywee order — Surat to your door." canonicalPath="/track" />
      <section style={{ paddingBlock: "clamp(40px, 6vw, 80px)", paddingInline: "clamp(20px, 4vw, 64px)", maxWidth: "920px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
          Track an order
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.92, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: "clamp(20px, 3vw, 32px)" }}>
          From our studio to her doorstep.
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: "clamp(24px, 4vw, 40px)" }}>
          Enter your order number (starts with <span style={{ fontFamily: "var(--mono)" }}>YW-</span>) and the email used to place it.
          For any issues, message us on WhatsApp — we usually reply within 30 minutes.
        </p>

        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", maxWidth: "520px" }}>
          <input
            type="text"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="YW-000123"
            required
            aria-label="Order number"
            style={{
              padding: "14px 16px",
              border: "1px solid rgba(26,25,22,0.18)",
              background: "var(--paper-soft)",
              fontFamily: "var(--mono)",
              fontSize: "14px",
              color: "var(--ink)",
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email used at checkout"
            required
            aria-label="Email"
            style={{
              padding: "14px 16px",
              border: "1px solid rgba(26,25,22,0.18)",
              background: "var(--paper-soft)",
              fontSize: "14px",
              color: "var(--ink)",
              fontFamily: "var(--sans)",
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: "4px" }}>
            Track this order
          </button>
        </form>

        {submitted && (
          <div style={{ marginTop: "clamp(32px, 5vw, 56px)", paddingTop: "clamp(28px, 4vw, 40px)", borderTop: "1px solid rgba(26,25,22,0.10)" }}>
            {result ? (
              <>
                <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
                  {result.orderNumber} · for {result.customer}
                </p>
                <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "20px" }}>
                  Arriving {result.estimate}.
                </h2>

                {/* Stages */}
                <ol style={{ listStyle: "none", padding: 0, margin: "32px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", position: "relative" }}>
                  {STAGES.map((stage, i) => {
                    const Icon = stage.icon;
                    const done = i <= result.status;
                    const current = i === result.status;
                    return (
                      <li key={stage.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                        <span
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: done ? "var(--ink)" : "var(--paper-warm)",
                            color: done ? "var(--paper)" : "var(--ink-faint)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: current ? "2px solid var(--sage)" : "1px solid rgba(26,25,22,0.10)",
                            transition: "all 0.32s var(--ease-out)",
                          }}
                        >
                          <Icon size={18} strokeWidth={1.5} />
                        </span>
                        <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "16px", color: done ? "var(--ink)" : "var(--ink-mute)", lineHeight: 1.2 }}>
                          {stage.label}
                        </span>
                        <span style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                          {stage.sub}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {/* Details */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", paddingTop: "20px", borderTop: "1px solid rgba(26,25,22,0.10)" }}>
                  <div>
                    <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>Carrier</p>
                    <p style={{ fontSize: "14px", color: "var(--ink)" }}>{result.carrier}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>AWB</p>
                    <p style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "var(--mono)" }}>{result.awb}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>Items</p>
                    <p style={{ fontSize: "14px", color: "var(--ink)" }}>{result.items}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>Total</p>
                    <p style={{ fontSize: "14px", color: "var(--ink)" }}>₹{result.total.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "20px", color: "var(--ink-mute)" }}>
                We couldn't find that order. Double-check the number, or chat to us on WhatsApp.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
