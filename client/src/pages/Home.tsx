import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { PRODUCTS, COLLECTIONS, JOURNAL, BRAND_IMAGES, HERO_POSTER, imageSrc, imageSrcSet } from "@/data/store";
import { ProductCard } from "@/components/ProductCard";
import { Marquee } from "@/components/atoms/Marquee";
import { MagneticButton } from "@/components/atoms/MagneticButton";
import { Slider, Slide } from "@/components/atoms/Slider";
import { Meta } from "@/components/system/Meta";
import { useGsap, gsap, ScrollTrigger, useScrollReveal, useCounter, useParallax } from "@/hooks/useGsap";
import { Star } from "lucide-react";
import { UGCFeed } from "@/components/UGCFeed";
import { RecentlyViewedRail } from "@/components/RecentlyViewedRail";

// ─── Curation ─────────────────────────────────────────────────────────────
const FEATURED_SLUGS = [
  "yw126-light-wash", "yw073-dark-indigo", "yw081-onyx-black",
  "yw123-embroidered", "yw131-light-wash", "yw188-dark-indigo",
  "yw232-light-wash", "yw228-light-wash",
];

const TRENDING_SLUGS = [
  "yw174-dark-indigo", "yw174-light-wash", "yw131-dark-indigo", "yw132-dark-indigo",
  "yw037-rinse-wash", "yw028-light-wash", "yw023-dark-indigo", "yw124-dark-indigo",
  "yw126-dark-indigo", "yw125-light-wash", "yw005-light-wash",
];

const BESTSELLER_SLUGS = [
  "yw123-embroidered", "yw123-embellished-c", "yw123-embellished-b",
  "yw081-onyx-black", "yw098-onyx-black", "yw236-onyx-black",
  "yw126-light-wash", "yw073-dark-indigo",
];

function pick(slugs: string[]) {
  return slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean) as typeof PRODUCTS;
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function Hero() {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Slow ken-burns + subtle parallax on the hero bg
      gsap.fromTo(
        ".hero-bg-img",
        { scale: 1.04 },
        { scale: 1.0, duration: 14, ease: "none" },
      );
      gsap.to(".hero-bg-img", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true },
      });
      // Split-line text reveal
      gsap.from(".hero-line span", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.15,
      });
      gsap.from(".hero-eyebrow, .hero-cta-row, .hero-scroll", {
        opacity: 0,
        y: 14,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.55,
      });
    }, heroBgRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: "640px",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        ref={heroBgRef}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <img
          className="hero-bg-img"
          src={HERO_POSTER}
          alt="ywee — From the sandbox to the stage"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            display: "block",
            willChange: "transform",
          }}
          fetchPriority="high"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(26,25,22,0.25) 0%, rgba(26,25,22,0.0) 25%, rgba(26,25,22,0.12) 55%, rgba(26,25,22,0.88) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(28px, 5vw, 64px)",
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          color: "var(--paper)",
        }}
      >
        <p
          className="hero-eyebrow"
          style={{
            fontSize: "11px",
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: "rgba(244,239,230,0.92)",
            marginBottom: "clamp(14px, 2vw, 24px)",
            fontFamily: "var(--sans)",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          Girls' stretch denim · Ages 1–14 · Made in Surat
        </p>
        <h1
          ref={heroTitleRef}
          className="hero-headline"
          style={{
            color: "var(--paper)",
            marginBottom: "clamp(24px, 3vw, 36px)",
            maxWidth: "1200px",
            textShadow: "0 4px 24px rgba(0,0,0,0.45)",
          }}
        >
          <span className="hero-line" style={{ display: "block", overflow: "hidden" }}>
            <span style={{ display: "inline-block" }}>From the</span>
          </span>
          <span className="hero-line" style={{ display: "block", overflow: "hidden" }}>
            <span style={{ display: "inline-block" }}>
              <span style={{ fontStyle: "italic" }}>sandbox</span>
              {"\u00a0"}to
            </span>
          </span>
          <span className="hero-line" style={{ display: "block", overflow: "hidden" }}>
            <span style={{ display: "inline-block" }}>
              the{"\u00a0"}<span className="upr">stage.</span>
            </span>
          </span>
        </h1>
        <div className="hero-cta-row" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <MagneticButton
            as={Link}
            href="/shop"
            className="btn btn-cream"
            style={{ background: "var(--paper)", color: "var(--ink)" }}
          >
            Shop the collection
          </MagneticButton>
          <Link
            href="/lookbook"
            className="btn btn-ghost"
            style={{ borderColor: "rgba(244,239,230,0.4)", color: "var(--paper)" }}
            data-cursor="hover"
          >
            View lookbook
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(20px, 3vw, 36px)",
          right: "clamp(20px, 4vw, 48px)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          color: "var(--paper)",
        }}
      >
        <p
          style={{
            fontSize: "9px",
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: "rgba(244,239,230,0.6)",
            writingMode: "vertical-rl",
            fontFamily: "var(--sans)",
          }}
        >
          Scroll
        </p>
        <div
          style={{
            width: "1px",
            height: "48px",
            background: "rgba(244,239,230,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              background: "var(--paper)",
              animation: "scrollLine 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`@keyframes scrollLine { 0%{height:0;top:0} 50%{height:100%;top:0} 100%{height:0;top:100%} }`}</style>
    </section>
  );
}

// ─── Marquee strip ────────────────────────────────────────────────────────
function HeroMarquee() {
  const items = [
    "Soft on the skin",
    "Fierce in fit",
    "Cotton-Lycra",
    "Adjustable waistband",
    "Made in Surat",
    "Ages 1–14",
    "Free delivery",
  ];
  return (
    <section style={{ background: "var(--ink)", color: "var(--paper)", paddingBlock: "clamp(20px, 3vw, 32px)" }}>
      <Marquee speed={36} pauseOnHover={false}>
        <div style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
          {items.map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: "clamp(24px, 4vw, 56px)",
                fontWeight: 300,
                paddingInline: "clamp(16px, 3vw, 40px)",
              }}>
                {t}
              </span>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--paper)", opacity: 0.65 }} />
            </span>
          ))}
        </div>
      </Marquee>
    </section>
  );
}

// ─── Trending Now (Embla slider) ──────────────────────────────────────────
function TrendingNow() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: "h2, .section-eyebrow, .embla-wrap" });
  const products = pick(TRENDING_SLUGS);
  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "clamp(28px, 4vw, 48px)" }}>
          <div>
            <p className="section-eyebrow" style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              Trending now · Drop 04
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              The pieces she'll<br />reach for first.
            </h2>
          </div>
          <Link href="/shop" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>
            View all 54 pieces →
          </Link>
        </div>
        <Slider
          options={{ align: "start", containScroll: "trimSnaps", dragFree: true }}
          ariaLabel="Trending products"
        >
          {products.map((p, i) => (
            <Slide key={p.id} basis="clamp(200px, 30vw, 320px)">
              <div style={{ paddingInlineEnd: "clamp(12px, 2vw, 24px)" }}>
                <ProductCard product={p} index={i} priority={i < 3} />
              </div>
            </Slide>
          ))}
        </Slider>
      </div>
    </section>
  );
}

// ─── Shop by Age ──────────────────────────────────────────────────────────
function ShopByAge() {
  const ages = [
    { range: "Ages 1–4", subtitle: "Toddler", desc: "Pull-on comfort", productSlug: "yw005-light-wash" },
    { range: "Ages 5–8", subtitle: "Explorer", desc: "Bold prints", productSlug: "yw037-rinse-wash" },
    { range: "Ages 9–12", subtitle: "Style", desc: "Embellished line", productSlug: "yw123-embroidered" },
    { range: "Ages 13–14", subtitle: "Tween", desc: "Statement pieces", productSlug: "yw081-onyx-black" },
  ];
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".age-card", stagger: 0.08 });

  return (
    <section ref={ref} style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
            Shop by age
          </p>
          <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            Built to grow with her.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(12px, 2vw, 24px)",
          }}
        >
          {ages.map((age) => {
            const product = PRODUCTS.find((p) => p.slug === age.productSlug);
            if (!product) return null;
            return (
              <Link
                key={age.range}
                href="/shop"
                data-cursor="hover"
                className="age-card lift-card"
                style={{
                  position: "relative",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  background: "var(--paper-deep)",
                  textDecoration: "none",
                  display: "block",
                  isolation: "isolate",
                }}
              >
                <img
                  src={imageSrc(product, 0, 1200)}
                  srcSet={imageSrcSet(product, 0)}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  alt={`Shop ${age.range}`}
                  decoding="async"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 1.2s var(--ease-out)" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(26,25,22,0.55) 0%, rgba(26,25,22,0.10) 28%, rgba(26,25,22,0.10) 52%, rgba(26,25,22,0.85) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, padding: "clamp(16px, 2vw, 28px)", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "var(--paper)" }}>
                  <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.95, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                    {age.subtitle}
                  </p>
                  <div>
                    <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "6px", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                      {age.range}
                    </p>
                    <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.92, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                      {age.desc} →
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Editor's Pick (split, big card) ──────────────────────────────────────
function EditorsPick() {
  const product = PRODUCTS.find((p) => p.slug === "yw123-embroidered");
  const ref = useScrollReveal<HTMLElement>();
  if (!product) return null;
  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div className="editorial-split">
          <div style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--paper-warm)", position: "relative" }}>
            <img
              src={imageSrc(product, 0, 1600)}
              srcSet={imageSrcSet(product, 0)}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={product.alt}
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "var(--paper)",
                color: "var(--ink)",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "8px 14px",
                fontFamily: "var(--sans)",
              }}
            >
              Editor's pick
            </span>
          </div>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              The Atelier line
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              {product.name}.
            </h2>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 19px)", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "24px" }}>
              {product.description}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Hand-finished crystal embellishment",
                "Premium 95% Cotton, 5% Lycra blend",
                "Adjustable waistband for years of fit",
                "Made in Surat, India",
              ].map((b) => (
                <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "var(--ink-soft)" }}>
                  <span aria-hidden style={{ display: "inline-block", width: "16px", height: "1px", background: "var(--ink-mute)", marginTop: "10px", flexShrink: 0 }} />
                  {b}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <Link href={`/product/${product.slug}`} className="btn btn-primary">
                Shop · ₹{product.price.toLocaleString("en-IN")}
              </Link>
              <Link href="/shop/embellished" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>
                Explore the line →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Bestsellers slider ──────────────────────────────────────────────────
function Bestsellers() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: "h2, p, .embla-wrap" });
  const products = pick(BESTSELLER_SLUGS);
  return (
    <section ref={ref} style={{ background: "var(--paper-soft)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(28px, 4vw, 48px)", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              Bestsellers · Resort 26
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              Loved by parents.
            </h2>
          </div>
          <Link href="/shop" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>
            Shop all bestsellers →
          </Link>
        </div>
        <Slider
          options={{ align: "start", containScroll: "trimSnaps", dragFree: true, loop: false }}
          ariaLabel="Bestsellers"
        >
          {products.map((p, i) => (
            <Slide key={p.id} basis="clamp(220px, 32vw, 360px)">
              <div style={{ paddingInlineEnd: "clamp(12px, 2vw, 24px)" }}>
                <ProductCard product={p} index={i} priority={i < 4} />
              </div>
            </Slide>
          ))}
        </Slider>
      </div>
    </section>
  );
}

// ─── Editorial fabric story (split) ──────────────────────────────────────
function FabricStory() {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div className="editorial-split flip">
          <div style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--paper-warm)" }}>
            <img
              src={BRAND_IMAGES.atelierFabric}
              alt="ywee Cotton-Lycra fabric detail"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              The fabric story
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 72px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Soft on the skin.<br />Fierce in fit.
            </h2>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 19px)", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "16px" }}>
              Traditional denim is built for adults. Stiff, unforgiving, designed for structure
              over movement. For a child running, jumping, climbing — that's a problem.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 19px)", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "28px" }}>
              Cotton-Lycra changes everything. Our 95–98% cotton, 2–5% Lycra weave gives a
              four-way stretch that moves with her body and recovers shape after washing.
            </p>
            <Link href="/journal/cotton-lycra-why-it-matters" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>
              Read the fabric story →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Brand Values Strip with counters ────────────────────────────────────
function ValuesStrip() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".value-num", y: 12, stagger: 0.08 });

  // Each counter
  const c1 = useCounter(54, { suffix: "" });
  const c2 = useCounter(2, { suffix: " yrs" });
  const c3 = useCounter(98, { suffix: "% cotton" });
  const c4 = useCounter(0, { suffix: " ₹ delivery", format: (n) => Math.round(n).toString() });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        paddingBlock: "clamp(56px, 9vw, 120px)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", opacity: 0.65, marginBottom: "clamp(28px, 4vw, 48px)" }}>
          The math of growing up
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "clamp(24px, 4vw, 56px)",
          }}
        >
          {[
            { ref: c1, label: "SKU variants", sub: "across 4 collections" },
            { ref: c2, label: "Of fit per pair", sub: "via adjustable waistband" },
            { ref: c3, label: "Premium cotton", sub: "with Lycra stretch" },
            { ref: c4, label: "Delivery cost", sub: "free across India" },
          ].map((v, i) => (
            <div key={i}>
              <p
                ref={v.ref as React.RefObject<HTMLParagraphElement>}
                className="value-num"
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(56px, 9vw, 120px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  marginBottom: "8px",
                }}
              >
                0
              </p>
              <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.78, marginBottom: "4px" }}>
                {v.label}
              </p>
              <p style={{ fontSize: "12px", opacity: 0.55 }}>{v.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Outfit Builder / Curated Sets ───────────────────────────────────────
function CuratedSets() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".set-card", stagger: 0.1 });
  const sets = [
    {
      title: "The Schoolyard Set",
      subtitle: "Light · Indigo · Onyx",
      slugs: ["yw126-light-wash", "yw073-dark-indigo", "yw081-onyx-black"],
    },
    {
      title: "The Atelier Set",
      subtitle: "Embellished trio",
      slugs: ["yw123-embroidered", "yw123-embellished-b", "yw123-embellished-c"],
    },
    {
      title: "The Indigo Three",
      subtitle: "Twilight to royal",
      slugs: ["yw126-dark-indigo", "yw188-dark-indigo", "yw132-dark-indigo"],
    },
  ];
  return (
    <section ref={ref} style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(28px, 4vw, 48px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              Curated sets
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              Build her bag.
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "var(--ink-mute)", maxWidth: "320px", lineHeight: 1.5 }}>
            Three pieces, one wardrobe. Save 8% when you buy any set.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(16px, 3vw, 32px)" }}>
          {sets.map((s) => {
            const products = s.slugs.map((sl) => PRODUCTS.find((p) => p.slug === sl)).filter(Boolean) as typeof PRODUCTS;
            const total = products.reduce((sum, p) => sum + p.price, 0);
            const discounted = Math.round(total * 0.92);
            return (
              <article key={s.title} className="set-card" style={{ background: "var(--paper)", padding: "clamp(16px, 2vw, 24px)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
                  {products.map((p) => (
                    <Link key={p.id} href={`/product/${p.slug}`} data-cursor="hover" style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-warm)", display: "block", textDecoration: "none" }}>
                      <img
                        src={imageSrc(p, 0, 480)}
                        alt={p.alt}
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                      />
                    </Link>
                  ))}
                </div>
                <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "6px" }}>
                  {s.subtitle}
                </p>
                <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2vw, 26px)", color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "12px" }}>
                  {s.title}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(26,25,22,0.10)" }}>
                  <div>
                    <p style={{ fontSize: "11px", color: "var(--ink-faint)", textDecoration: "line-through" }}>
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                    <p style={{ fontSize: "16px", color: "var(--ink)" }}>
                      ₹{discounted.toLocaleString("en-IN")}
                      <span style={{ fontSize: "10px", letterSpacing: "0.10em", color: "var(--sage)", marginInlineStart: "8px", textTransform: "uppercase" }}>
                        Save 8%
                      </span>
                    </p>
                  </div>
                  <Link href="/shop" className="btn btn-ghost" style={{ padding: "10px 18px", fontSize: "11px" }}>
                    Build →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── As Seen In (press marquee) ──────────────────────────────────────────
function PressStrip() {
  const press = ["Vogue India", "ELLE India", "Cosmopolitan", "Verve", "The Hindu", "Business Standard", "Mint Lounge", "Grazia", "Femina", "Harper's Bazaar"];
  return (
    <section style={{ background: "var(--paper-soft)", paddingBlock: "clamp(40px, 6vw, 80px)", borderBlock: "1px solid rgba(26,25,22,0.10)" }}>
      <div style={{ textAlign: "center", marginBottom: "clamp(24px, 3vw, 32px)" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          As seen in
        </p>
      </div>
      <Marquee speed={48} pauseOnHover>
        <div style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
          {press.map((p, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.6vw, 32px)",
                fontWeight: 300,
                paddingInline: "clamp(20px, 3vw, 48px)",
                color: "var(--ink)",
                opacity: 0.45,
              }}>
                {p}
              </span>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--ink)", opacity: 0.3 }} />
            </span>
          ))}
        </div>
      </Marquee>
    </section>
  );
}

// ─── Customer Reviews Slider ─────────────────────────────────────────────
function Reviews() {
  const reviews = [
    {
      name: "Aanya Mehta",
      city: "Mumbai",
      rating: 5,
      text: "These have lasted my daughter through two growth spurts. The adjustable waistband is genius — no more replacing jeans every six months.",
      product: "Pebble Wash Skinny Jeans",
    },
    {
      name: "Riya Sharma",
      city: "Bangalore",
      rating: 5,
      text: "The Cotton-Lycra is unbelievably soft. My 7-year-old refuses to wear anything else now. Beautifully made and reasonably priced.",
      product: "Atelier Straight Jeans",
    },
    {
      name: "Priya Iyer",
      city: "Chennai",
      rating: 5,
      text: "Free delivery, gorgeous packaging, and the embroidery on the embellished line is exquisite. A new favourite Indian brand.",
      product: "Heirloom Embroidered Jeans",
    },
    {
      name: "Sara Kapoor",
      city: "Delhi",
      rating: 5,
      text: "Finally — denim that fits my daughter properly. The cuts are slim but stretch comfortably, and the quality justifies the price.",
      product: "Onyx Wide-Leg Jeans",
    },
    {
      name: "Diya Khanna",
      city: "Pune",
      rating: 4,
      text: "Lovely fabric, fast delivery. Slightly large in the waist but the adjustable button fixed it instantly.",
      product: "Indigo Skinny Jeans",
    },
  ];
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(28px, 4vw, 48px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              4.8 ★ · 2,400 reviews
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              From parents,<br />for their daughters.
            </h2>
          </div>
        </div>

        <Slider options={{ align: "start", containScroll: "trimSnaps", loop: true }} ariaLabel="Customer reviews">
          {reviews.map((r, i) => (
            <Slide key={i} basis="clamp(280px, 38vw, 480px)">
              <article
                style={{
                  background: "var(--paper-warm)",
                  padding: "clamp(24px, 3vw, 40px)",
                  marginInlineEnd: "clamp(12px, 2vw, 24px)",
                  height: "100%",
                  minHeight: "320px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star
                        key={k}
                        size={14}
                        strokeWidth={1.4}
                        fill={k < r.rating ? "var(--ink)" : "transparent"}
                        stroke={k < r.rating ? "var(--ink)" : "var(--ink-faint)"}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--serif)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "clamp(16px, 1.5vw, 22px)",
                      lineHeight: 1.5,
                      color: "var(--ink)",
                      marginBottom: "20px",
                    }}
                  >
                    "{r.text}"
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{r.name}</p>
                  <p style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                    {r.city} · {r.product}
                  </p>
                </div>
              </article>
            </Slide>
          ))}
        </Slider>
      </div>
    </section>
  );
}

// ─── Why YWEE / Promises ─────────────────────────────────────────────────
function Promises() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".promise", stagger: 0.1 });
  const promises = [
    {
      title: "Mended for life",
      desc: "Tear, fray, or snap? Send it back. We'll mend it free of charge — for the lifetime of the garment.",
      icon: "⊕",
    },
    {
      title: "Fits for years",
      desc: "Our signature adjustable waistband stretches with her. One pair, two growth spurts.",
      icon: "↔",
    },
    {
      title: "Free across India",
      desc: "Every order, every time. Standard delivery in 3–5 working days from our Surat studio.",
      icon: "✈",
    },
    {
      title: "30-day exchange",
      desc: "Wrong size? No questions. Free returns and exchanges within 30 days of delivery.",
      icon: "↻",
    },
  ];
  return (
    <section ref={ref} style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(28px, 4vw, 56px)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
            The ywee promises
          </p>
          <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            Built to last. Priced to share.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(20px, 3vw, 40px)" }}>
          {promises.map((p) => (
            <div key={p.title} className="promise" style={{ borderTop: "1px solid var(--ink)", paddingTop: "20px" }}>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "32px", color: "var(--ink)", marginBottom: "12px" }}>
                {p.icon}
              </p>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2vw, 26px)", color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "10px" }}>
                {p.title}
              </p>
              <p style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.6 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pinned horizontal scroll: Collections ────────────────────────────────
function PinnedCollections() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    if (window.matchMedia("(max-width: 767px)").matches) return; // mobile uses vertical layout

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;
      const distance = track.scrollWidth - window.innerWidth + 64;
      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${distance}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pin-collections"
      style={{
        background: "var(--paper)",
        paddingBlock: "clamp(56px, 9vw, 100px) 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)", marginBottom: "clamp(28px, 4vw, 48px)" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
          Four collections
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
          Four worlds.<br />One waistband.
        </h2>
      </div>
      <div
        ref={trackRef}
        className="pin-track"
        style={{
          display: "flex",
          gap: "clamp(16px, 2vw, 32px)",
          paddingInline: "clamp(20px, 4vw, 64px)",
          paddingBlock: "20px clamp(24px, 4vw, 56px)",
          willChange: "transform",
        }}
      >
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            data-cursor="hover"
            className="lift-card"
            style={{
              flexShrink: 0,
              width: "clamp(280px, 36vw, 560px)",
              aspectRatio: "3/4",
              position: "relative",
              overflow: "hidden",
              background: "var(--paper-warm)",
              textDecoration: "none",
              isolation: "isolate",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${c.coverBlur})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px)",
                transform: "scale(1.05)",
              }}
            />
            <img
              src={c.cover}
              alt={c.name}
              decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(26,25,22,0.45) 0%, rgba(26,25,22,0.05) 25%, rgba(26,25,22,0.05) 45%, rgba(26,25,22,0.88) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, padding: "clamp(20px, 3vw, 36px)", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "var(--paper)" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.20em", textTransform: "uppercase", opacity: 0.95, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                {c.season} · {c.count} pieces
              </p>
              <div>
                <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "8px", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
                  {c.name}
                </p>
                <p style={{ fontSize: "13px", lineHeight: 1.5, opacity: 0.95, maxWidth: "360px", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                  {c.tagline}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .pin-collections .pin-track {
            flex-direction: column;
            transform: none !important;
          }
          .pin-collections .pin-track > * {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Lookbook teaser ─────────────────────────────────────────────────────
function LookbookTeaser() {
  const ref = useScrollReveal<HTMLElement>();
  const slides = [
    PRODUCTS.find((p) => p.slug === "yw126-light-wash"),
    PRODUCTS.find((p) => p.slug === "yw081-onyx-black"),
    PRODUCTS.find((p) => p.slug === "yw123-embroidered"),
  ].filter(Boolean) as typeof PRODUCTS;

  return (
    <section ref={ref} style={{ background: "var(--ink)", color: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "clamp(32px, 4vw, 56px)" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", opacity: 0.6, marginBottom: "10px" }}>
              Lookbook · Resort 26
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              From the sandbox<br />to the stage.
            </h2>
          </div>
          <MagneticButton as={Link} href="/lookbook" className="btn btn-cream" style={{ background: "var(--paper)", color: "var(--ink)" }}>
            Open the lookbook
          </MagneticButton>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(12px, 2vw, 24px)",
          }}
        >
          {slides.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              data-cursor="hover"
              style={{
                position: "relative",
                aspectRatio: "3/4",
                overflow: "hidden",
                background: "rgba(255,255,255,0.06)",
                textDecoration: "none",
                color: "inherit",
              }}
              className="lift-card"
            >
              <img
                src={imageSrc(p, 0, 1200)}
                srcSet={imageSrcSet(p, 0)}
                sizes="(min-width: 768px) 33vw, 100vw"
                alt={p.alt}
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.85) 100%)" }} />
              <p
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  right: "16px",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(20px, 2.4vw, 32px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                {p.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Journal teaser ──────────────────────────────────────────────────────
function JournalTeaser() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".journal-card", stagger: 0.1 });
  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "clamp(28px, 4vw, 48px)" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>Field notes</p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--ink)" }}>
              From the studio.
            </h2>
          </div>
          <Link href="/journal" className="ink-link" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}>
            All field notes →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(20px, 3vw, 40px)" }}>
          {JOURNAL.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              href={`/journal/${a.slug}`}
              data-cursor="hover"
              className="journal-card"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div
                style={{
                  aspectRatio: "5/4",
                  overflow: "hidden",
                  background: "var(--paper-warm)",
                  marginBottom: "16px",
                  position: "relative",
                  backgroundImage: `url(${a.coverBlur})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={a.cover}
                  alt={a.alt}
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
                {a.category} · {a.read}
              </p>
              <h3 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2vw, 26px)", letterSpacing: "-0.01em", lineHeight: 1.15, color: "var(--ink)", marginBottom: "8px" }}>
                {a.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.55 }}>{a.deck}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ──────────────────────────────────────────────────────────
function Newsletter() {
  const ref = useScrollReveal<HTMLElement>();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section
      ref={ref}
      style={{
        background: "var(--paper-warm)",
        paddingBlock: "clamp(72px, 12vw, 160px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          The dispatch
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: "20px" }}>
          New drops, first.
        </h2>
        <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: "32px" }}>
          A short, considered note every other Friday. Studio updates, fabric stories, and
          early access to new pieces. Never spam — unsubscribe in one click.
        </p>
        {sent ? (
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "22px", color: "var(--ink)" }}>
            Thank you. We'll be in touch.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              setSent(true);
              setEmail("");
              import("sonner").then(({ toast }) => toast.success("Welcome to the dispatch"));
            }}
            style={{
              display: "flex",
              gap: "8px",
              maxWidth: "440px",
              margin: "0 auto",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "14px 16px",
                border: "1px solid rgba(26,25,22,0.18)",
                background: "var(--paper-soft)",
                fontSize: "14px",
                fontFamily: "var(--sans)",
                color: "var(--ink)",
              }}
            />
            <button type="submit" className="btn btn-primary">Sign up</button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────
export default function Home() {
  // Refresh ScrollTrigger when DOM finishes loading (images can shift heights)
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{ background: "var(--paper)" }}>
      <Meta
        title="Considered denim for her"
        description="Premium Cotton-Lycra stretch denim for girls aged 1 to 14. Adjustable waistband. Free delivery across India. Made in Surat."
        ogImage={HERO_POSTER}
        canonicalPath="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ywee",
          description: "Premium Cotton-Lycra stretch denim for girls aged 1 to 14, made in Surat, India.",
        }}
      />
      <Hero />
      <HeroMarquee />
      <TrendingNow />
      <ShopByAge />
      <EditorsPick />
      <Bestsellers />
      <FabricStory />
      <ValuesStrip />
      <CuratedSets />
      <PressStrip />
      <Reviews />
      <Promises />
      <PinnedCollections />
      <UGCFeed />
      <LookbookTeaser />
      <RecentlyViewedRail />
      <JournalTeaser />
      <Newsletter />
    </main>
  );
}
