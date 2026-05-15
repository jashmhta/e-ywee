import { Link } from "wouter";
import { BRAND_IMAGES, PRODUCTS_BY_SLUG, imageSrc } from "@/data/store";
import { useReveal } from "@/hooks/useReveal";
import { Meta } from "@/components/system/Meta";
import { MagneticButton } from "@/components/atoms/MagneticButton";

export default function Atelier() {
  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta
        title="Atelier"
        description="The studio behind ywee — where every collection begins. Made in Surat, India by Generations Clothing."
        canonicalPath="/atelier"
      />

      <Hero />
      <Manifesto />
      <Fabric />
      <Studios />
      <Mending />
    </main>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────
function Hero() {
  const heroProduct = PRODUCTS_BY_SLUG.get("yw073-dark-indigo");
  return (
    <section
      style={{
        position: "relative",
        minHeight: "min(86dvh, 760px)",
        background: "var(--ink)",
        color: "var(--paper)",
        overflow: "hidden",
      }}
    >
      {heroProduct && (
        <img
          src={imageSrc(heroProduct, 1, 2400)}
          alt={heroProduct.alt}
          fetchPriority="high"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(26,25,22,0.65) 0%, rgba(26,25,22,0.25) 30%, rgba(26,25,22,0.25) 55%, rgba(26,25,22,0.88) 100%)" }} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1600px",
          margin: "0 auto",
          paddingInline: "clamp(20px, 4vw, 64px)",
          paddingBlock: "clamp(96px, 16vw, 200px) clamp(48px, 6vw, 80px)",
          minHeight: "min(86dvh, 760px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <p className="fade-rise" style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(244,239,230,0.75)", marginBottom: "16px" }}>
          The Atelier
        </p>
        <h1 className="hero-headline fade-rise d1" style={{ color: "var(--paper)", maxWidth: "1100px" }}>
          Stretch denim,<br />
          <span style={{ fontStyle: "italic" }}>built for her,</span><br />
          <span className="upr">made in India.</span>
        </h1>
        <div className="fade-rise d3" style={{ marginTop: "32px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          {[
            { t: "Stretch Comfort", s: "Cotton-Lycra" },
            { t: "Adjustable Waistband", s: "Years of fit" },
            { t: "All-Day Play", s: "Built to move" },
            { t: "Built to Last", s: "Mended for free" },
          ].map((p) => (
            <span key={p.t} style={{ display: "inline-flex", flexDirection: "column", padding: "12px 16px", background: "rgba(244,239,230,0.08)", border: "1px solid rgba(244,239,230,0.22)" }}>
              <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "16px", color: "var(--paper)" }}>{p.t}</span>
              <span style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,239,230,0.7)", marginTop: "2px" }}>{p.s}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Manifesto ──────────────────────────────────────────────────────────
function Manifesto() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(72px, 12vw, 180px)" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          A small, considered house
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 5vw, 72px)", color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "clamp(20px, 3vw, 32px)" }}>
          We make denim that fits her — for years.
        </h2>
        <p style={{ fontSize: "clamp(15px, 1.6vw, 20px)", color: "var(--ink-mute)", lineHeight: 1.7 }}>
          ywee is a small clothing house based in Surat, India. We make stretch denim for girls
          aged one to fourteen. Every pair is finished by hand, every pair has our signature
          adjustable waistband, every pair is delivered free across India under ₹1,800. We
          believe the small details — the right fabric, the right closure, the right inseam —
          are what make a wardrobe quietly excellent.
        </p>
      </div>
    </section>
  );
}

// ── Fabric story ───────────────────────────────────────────────────────
function Fabric() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div className="editorial-split">
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>The fabric</p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 4vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "clamp(20px, 3vw, 28px)" }}>
              Cotton, with stretch.
            </h2>
            <p style={{ fontSize: "clamp(15px, 1.4vw, 18px)", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "16px" }}>
              Our fabric is a deliberate blend: 95–98% cotton, 2–5% Lycra (elastane). The cotton
              gives breathability, softness, and the structure of proper denim. The Lycra adds
              four-way stretch — so the fabric moves with her body, recovers shape after washing,
              and holds its silhouette through hundreds of cycles.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.4vw, 18px)", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "24px" }}>
              We tested fourteen mills before settling on the current weave. The criteria was simple:
              soft from the first wear, durable past the hundredth wash, dyed in indigos that age
              gracefully into beautiful washes.
            </p>
            <Link href="/journal/cotton-lycra-why-it-matters" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>
              Read the fabric story →
            </Link>
          </div>
          <div style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--paper-warm)" }}>
            <img
              src={BRAND_IMAGES.atelierFabric}
              alt="ywee Cotton-Lycra fabric detail"
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Studios ────────────────────────────────────────────────────────────
function Studios() {
  const ref = useReveal<HTMLDivElement>();
  const STUDIOS = [
    {
      city: "Surat",
      role: "Design & production",
      desc: "Where every YWEE collection begins. Our design team, fabric sourcing and production sit together — the denim capital of India.",
      open: "Mon–Sat, 10–18h",
    },
    {
      city: "Mumbai",
      role: "Brand & distribution",
      desc: "Where we manage logistics, customer experience, and the growing retail partnerships across India.",
      open: "Mon–Fri, 10–18h",
    },
    {
      city: "Delhi",
      role: "Concept room",
      desc: "Our small concept room — by appointment — for fittings, partner meetings, and the occasional brand pop-up.",
      open: "By appointment",
    },
  ];
  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(28px, 4vw, 56px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Studios</p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 4vw, 64px)", color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.03em" }}>
              Three rooms. One philosophy.
            </h2>
          </div>
          <Link href="/contact" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>
            Book a visit →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(16px, 3vw, 32px)" }}>
          {STUDIOS.map((s, i) => (
            <article key={s.city} className="lift-card fade-rise" style={{ background: "var(--paper-warm)", padding: "clamp(20px, 3vw, 36px)", animationDelay: `${i * 80}ms` }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>India</p>
              <h3 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 3vw, 40px)", color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "12px" }}>
                {s.city}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--ink)", marginBottom: "12px" }}>{s.role}</p>
              <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: "16px" }}>{s.desc}</p>
              <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{s.open}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Mending ────────────────────────────────────────────────────────────
function Mending() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} style={{ background: "var(--ink)", color: "var(--paper)", paddingBlock: "clamp(72px, 12vw, 200px)", textAlign: "center" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", opacity: 0.7, marginBottom: "16px" }}>
          Mended for free, for life
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 6vw, 96px)", letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: "clamp(20px, 3vw, 32px)" }}>
          We'll mend her jeans. Always.
        </h2>
        <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.7, opacity: 0.85, marginBottom: "32px" }}>
          A torn knee. A snapped button. A frayed hem. Send it back to us and we'll mend it free of
          charge — for the lifetime of the garment. Less waste. Longer life.
        </p>
        <MagneticButton as={Link} href="/mending" className="btn btn-cream" style={{ background: "var(--paper)", color: "var(--ink)" }}>
          Read about mending
        </MagneticButton>
      </div>
    </section>
  );
}
