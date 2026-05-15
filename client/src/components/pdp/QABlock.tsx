import { useState } from "react";

const QA_BANK = [
  {
    q: "How does the adjustable waistband work?",
    a: "There's an internal elastic with two button positions on each side. You can move the button as she grows — it lasts approximately 2 years per pair before reaching the second position.",
  },
  {
    q: "What size should I order if she's between sizes?",
    a: "We recommend sizing up. The adjustable waistband can be tightened, but you can't add length. For the in-between cases, the size guide on the right will give you a precise fit recommendation.",
  },
  {
    q: "Can I machine wash these?",
    a: "Yes — cold wash, inside out, low tumble dry. The Cotton-Lycra blend retains its shape through hundreds of cycles. Avoid bleach and dry cleaning.",
  },
  {
    q: "How long does delivery take in India?",
    a: "Free shipping across India. Standard delivery is 3–5 working days from our Surat studio. Metros usually arrive in 2–3 days.",
  },
  {
    q: "Do these run small or big?",
    a: "True to size. We use age-based sizing (1–14 yrs) calibrated to Indian children. Compare the cm measurements in the size guide for the best fit.",
  },
  {
    q: "Can the embellishment / embroidery come off in the wash?",
    a: "No. Crystals, rhinestones, and embroidery are heat-pressed and stitched at the studio. Wash inside out and they'll stay put for years.",
  },
];

export function QABlock() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 8vw, 120px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
            Q&A · Common questions
          </p>
          <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 4vw, 56px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            Ask before you buy.
          </h2>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid rgba(26,25,22,0.10)" }}>
          {QA_BANK.map((qa, i) => {
            const open = openIdx === i;
            return (
              <li key={i} style={{ borderBottom: "1px solid rgba(26,25,22,0.10)" }}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "clamp(20px, 2.4vw, 28px) 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "var(--ink)",
                  }}
                >
                  <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px, 1.8vw, 24px)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                    {qa.q}
                  </span>
                  <span style={{ fontSize: "20px", flexShrink: 0, lineHeight: 1, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.32s var(--ease-out)" }}>+</span>
                </button>
                <div
                  style={{
                    maxHeight: open ? "320px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.5s var(--ease-out)",
                  }}
                >
                  <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.7, paddingBottom: open ? "clamp(20px, 2.4vw, 28px)" : 0 }}>
                    {qa.a}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <p style={{ fontSize: "13px", color: "var(--ink-mute)", marginTop: "20px", textAlign: "center" }}>
          Have another question?{" "}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Chat on WhatsApp
          </a>
          {" "}— we usually reply within 30 minutes.
        </p>
      </div>
    </section>
  );
}
