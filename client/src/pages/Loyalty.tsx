import { Link } from "wouter";
import { Meta } from "@/components/system/Meta";
import { useScrollReveal } from "@/hooks/useGsap";

const TIERS = [
  {
    name: "Insider",
    range: "₹0 – ₹4,999 / year",
    perks: [
      "Free shipping on every order",
      "Birthday gift card (₹250)",
      "Mended for life — guaranteed",
    ],
    accent: "var(--paper-warm)",
  },
  {
    name: "Studio",
    range: "₹5,000 – ₹14,999 / year",
    perks: [
      "Everything in Insider",
      "5% cashback on every order",
      "Early access to new drops (48h)",
      "Priority WhatsApp support",
    ],
    accent: "var(--bone)",
  },
  {
    name: "Atelier",
    range: "₹15,000+ / year",
    perks: [
      "Everything in Studio",
      "10% cashback on every order",
      "First look at lookbooks (1 week)",
      "Complimentary gift wrapping",
      "Annual studio visit (Surat)",
    ],
    accent: "var(--ink)",
    inverted: true,
  },
];

export default function Loyalty() {
  const heroRef = useScrollReveal<HTMLElement>({ childSelector: "h1, p, .btn", stagger: 0.08 });
  const tiersRef = useScrollReveal<HTMLElement>({ childSelector: ".tier-card", stagger: 0.1 });

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta
        title="ywee Insiders"
        description="Three-tier loyalty programme. Cashback, early access, and a free studio visit."
        canonicalPath="/loyalty"
      />

      <section ref={heroRef} style={{ paddingBlock: "clamp(56px, 9vw, 140px)", paddingInline: "clamp(20px, 4vw, 64px)", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          ywee Insiders
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(40px, 7vw, 112px)", lineHeight: 0.92, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: "20px", maxWidth: "1100px", marginInline: "auto" }}>
          Cashback. Early access.<br />A studio visit on us.
        </h1>
        <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.6, maxWidth: "560px", marginInline: "auto", marginBottom: "32px" }}>
          A simple, three-tier programme that rewards the parents who shop ywee for the long run.
          Sign up free — your first order earns toward Studio status.
        </p>
        <div style={{ display: "inline-flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" className="btn btn-primary">Join free</Link>
          <Link href="/shop" className="btn btn-ghost">Shop the collection</Link>
        </div>
      </section>

      <section ref={tiersRef} style={{ paddingBlock: "clamp(40px, 6vw, 80px)", paddingInline: "clamp(20px, 4vw, 64px)", maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(16px, 2vw, 28px)" }}>
          {TIERS.map((t) => (
            <article
              key={t.name}
              className="tier-card"
              style={{
                background: t.accent,
                color: t.inverted ? "var(--paper)" : "var(--ink)",
                padding: "clamp(24px, 3vw, 40px)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", opacity: t.inverted ? 0.65 : 0.6 }}>
                Tier
              </p>
              <h3 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                {t.name}
              </h3>
              <p style={{ fontSize: "13px", letterSpacing: "0.06em", opacity: 0.8 }}>{t.range}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                {t.perks.map((p) => (
                  <li key={p} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: 1.5, opacity: t.inverted ? 0.92 : 0.85 }}>
                    <span aria-hidden style={{ display: "inline-block", width: "16px", height: "1px", background: "currentColor", marginTop: "10px", flexShrink: 0, opacity: 0.6 }} />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Refer a friend */}
      <section style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 9vw, 120px)", paddingInline: "clamp(20px, 4vw, 64px)", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
          Refer a friend
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 72px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Give ₹500. Get ₹500.
        </h2>
        <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 24px" }}>
          Share your referral link, and when a friend places their first order, you both receive ₹500 of YWEE credit. No limits, no expiry.
        </p>
        <Link href="/account" className="btn btn-primary">Get your link</Link>
      </section>
    </main>
  );
}
