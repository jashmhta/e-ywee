import { Link } from "wouter";
import { Meta } from "@/components/system/Meta";
import { useScrollReveal } from "@/hooks/useGsap";

const COVERAGE = [
  { outlet: "Vogue India", title: "Why this little Indian denim brand is going global", date: "Mar 2026" },
  { outlet: "ELLE India", title: "Five Indian DTC brands rewriting kidswear", date: "Feb 2026" },
  { outlet: "Mint Lounge", title: "The Surat workshop building denim with stretch", date: "Jan 2026" },
  { outlet: "Verve", title: "Rajasthan to Resort 26 — ywee's slow growth", date: "Dec 2025" },
  { outlet: "Cosmopolitan", title: "Brand on our radar: ywee", date: "Nov 2025" },
  { outlet: "Femina", title: "Made-in-India clothing that lasts", date: "Oct 2025" },
];

const FACTS = [
  { k: "Founded", v: "2024" },
  { k: "Studio", v: "Surat, Gujarat" },
  { k: "Manufacturer", v: "Generations Clothing LLP" },
  { k: "Range", v: "Girls aged 1–14 yrs" },
  { k: "Fabric", v: "Cotton-Lycra (95–98% cotton)" },
  { k: "Price band", v: "₹1,499–₹1,799" },
  { k: "Distribution", v: "DTC + select Indian retailers" },
  { k: "Delivery", v: "Free across India" },
];

export default function PressKit() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".press-card, .fact-card", stagger: 0.05 });
  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta title="Press" description="ywee press kit, brand assets, and recent coverage." canonicalPath="/press" />

      <section style={{ paddingBlock: "clamp(40px, 6vw, 80px) clamp(28px, 4vw, 48px)", paddingInline: "clamp(20px, 4vw, 64px)", maxWidth: "1440px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
          Press · Media · Stockists
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(40px, 7vw, 96px)", lineHeight: 0.92, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: "clamp(20px, 3vw, 32px)" }}>
          For journalists, retailers and friends.
        </h1>
        <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.6, maxWidth: "640px", marginBottom: "clamp(28px, 4vw, 40px)" }}>
          Below: brand facts at a glance, recent press, downloadable assets, and our press contact.
          For interviews and product loans, write to{" "}
          <a href="mailto:press@ywee.in" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>press@ywee.in</a>.
        </p>
      </section>

      <section ref={ref} style={{ paddingBlock: "clamp(28px, 4vw, 48px)", paddingInline: "clamp(20px, 4vw, 64px)", maxWidth: "1440px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "20px" }}>
          Brand at a glance
        </p>
        <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(12px, 2vw, 20px)", margin: 0 }}>
          {FACTS.map((f) => (
            <div key={f.k} className="fact-card" style={{ background: "var(--paper-warm)", padding: "20px" }}>
              <dt style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "6px" }}>{f.k}</dt>
              <dd style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "20px", color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section style={{ paddingBlock: "clamp(40px, 6vw, 80px)", paddingInline: "clamp(20px, 4vw, 64px)", maxWidth: "1440px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          Recent coverage
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 56px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "clamp(20px, 3vw, 32px)" }}>
          Where we've been written about.
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid rgba(26,25,22,0.10)" }}>
          {COVERAGE.map((c, i) => (
            <li key={i} className="press-card" style={{ borderBottom: "1px solid rgba(26,25,22,0.10)", padding: "clamp(20px, 2.4vw, 28px) 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "baseline" }}>
                <div>
                  <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "6px" }}>
                    {c.outlet} · {c.date}
                  </p>
                  <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2.4vw, 32px)", color: "var(--ink)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                    {c.title}
                  </p>
                </div>
                <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)" }}>Read →</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 9vw, 120px)", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(16px, 3vw, 32px)" }}>
          <article style={{ background: "var(--paper)", padding: "28px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Logo pack</p>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "22px", color: "var(--ink)", marginBottom: "16px" }}>Wordmark · monogram · social profile.</p>
            <a href="#" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>Download (.zip)</a>
          </article>
          <article style={{ background: "var(--paper)", padding: "28px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Brand book</p>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "22px", color: "var(--ink)", marginBottom: "16px" }}>Tone, palette and typography.</p>
            <a href="#" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>Download (.pdf)</a>
          </article>
          <article style={{ background: "var(--paper)", padding: "28px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Resort 26 photography</p>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "22px", color: "var(--ink)", marginBottom: "16px" }}>Hi-res campaign + product photography.</p>
            <a href="#" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>Download (.zip · 240MB)</a>
          </article>
        </div>
      </section>

      <section style={{ paddingBlock: "clamp(56px, 9vw, 120px)", paddingInline: "clamp(20px, 4vw, 64px)", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          Press contact
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "16px" }}>
          press@ywee.in
        </h2>
        <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>
          We respond within two working days. Indian timezone (IST).
        </p>
      </section>
    </main>
  );
}
