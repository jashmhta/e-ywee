import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { Product } from "@/data/store";

interface NotifyMeModalProps {
  product: Product;
  size: string | null;
  onClose: () => void;
}

export function NotifyMeModal({ product, size, onClose }: NotifyMeModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !size) return;
    setSubmitted(true);
    toast.success("You'll be the first to know", { description: `We'll email ${email} when ${product.name} (${size}) is back.` });
    setTimeout(onClose, 1400);
  }

  return (
    <>
      <div onClick={onClose} className="nm-overlay" />
      <div role="dialog" aria-modal="true" aria-label={`Notify me when ${product.name} is back in stock`} className="nm-modal">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="nm-close"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          Out of stock — for now
        </p>
        <h3 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          We'll let you know.
        </h3>
        <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: "20px" }}>
          {product.name}{size ? ` in ${size}` : ""} is restocking soon. Drop your email and we'll send a one-time note when it's available.
        </p>
        {submitted ? (
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "20px", color: "var(--ink)" }}>
            Thanks. You're on the list.
          </p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
              style={{
                flex: 1,
                minWidth: "180px",
                padding: "12px 14px",
                border: "1px solid rgba(26,25,22,0.18)",
                background: "var(--paper)",
                fontSize: "14px",
                color: "var(--ink)",
                fontFamily: "var(--sans)",
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "12px 18px" }}>
              Notify me
            </button>
          </form>
        )}
        <style>{`
          .nm-overlay {
            position: fixed; inset: 0;
            background: rgba(26,25,22,0.55);
            backdrop-filter: blur(6px);
            z-index: 92;
            animation: fadeIn 0.3s var(--ease-out);
          }
          .nm-modal {
            position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
            width: min(440px, calc(100vw - 32px));
            background: var(--paper-soft);
            z-index: 93;
            padding: clamp(24px, 4vw, 40px);
            box-shadow: 0 30px 80px rgba(26,25,22,0.32);
            animation: welcomeIn 0.4s var(--ease-out);
          }
          .nm-close {
            position: absolute; top: 12px; right: 12px;
            width: 30px; height: 30px;
            display: inline-flex; align-items: center; justify-content: center;
            background: var(--paper-warm);
            border: 1px solid rgba(26,25,22,0.12);
            border-radius: 50%;
            cursor: pointer;
            color: var(--ink);
          }
        `}</style>
      </div>
    </>
  );
}
