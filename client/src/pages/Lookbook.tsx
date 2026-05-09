import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { LOOKBOOK, PRODUCTS, type LookbookImage } from "@/data/store";

const CAPTIONS = [
  "She owns every day.",
  "Light blue. Heavy heart? Never.",
  "Dark blue for the bold ones.",
  "Black denim. No rules.",
  "Prints that speak louder than words.",
  "The adjustable waistband. She grows. It grows.",
  "Made in India. Worn everywhere.",
  "Cotton-Lycra. Stretch for every adventure.",
  "Denim that keeps up with her.",
  "Summer shorts. All day energy.",
  "Floral prints for the free spirit.",
  "Classic blues, timeless style.",
  "School days, her way.",
];

const PIECE_NAMES: string[][] = [
  ["Light Blue Classic Jeans", "Ages 1–14"],
  ["Light Blue Solid Jeans"],
  ["Dark Blue Slim Jeans"],
  ["Black Solid Jeans"],
  ["Cartoon Print Jeans", "Bold Prints Collection"],
  ["Adjustable Waistband", "Signature Feature"],
  ["Made in India", "Generations Clothing LLP"],
  ["Cotton-Lycra Blend", "Stretch Denim"],
  ["Premium Denim", "Under ₹1,500"],
  ["Denim Shorts", "Summer 2026"],
  ["Floral Print Jeans"],
  ["Light Blue Classic Jeans"],
  ["Dark Blue School Jeans"],
];

export default function Lookbook() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => { el.style.transform = `translateY(${window.scrollY * 0.25}px)`; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featured = PRODUCTS.slice(0, 6);

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Hero */}
      <section style={{ position: "relative", height: "85dvh", minHeight: "500px", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <div ref={heroRef} style={{ position: "absolute", inset: "-10%", zIndex: 0, willChange: "transform" }}>
          <img
            src={LOOKBOOK[0]?.srcLandscape || "/images/ywee-lookbook-hero_56f56321.jpg"}
            alt="YWEE Girls Denim Lookbook"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,25,22,0.65) 0%, rgba(26,25,22,0.15) 60%, transparent 100%)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "clamp(32px, 6vw, 64px) clamp(20px, 4vw, 48px)", maxWidth: "1440px", margin: "0 auto", width: "100%" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,239,230,0.6)", marginBottom: "12px" }}>Lookbook</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(48px, 7vw, 100px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--paper)", lineHeight: 0.95, marginBottom: "20px" }}>
            She Owns
            <br />
            Every Day.
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(244,239,230,0.75)", maxWidth: "480px", lineHeight: 1.65 }}>
            The YWEE Lookbook — girls aged 1 to 14, wearing denim built for their world. Stretch, style, and stories.
          </p>
        </div>
      </section>

      {/* Editorial Grid */}
      <section style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(48px, 7vw, 96px) clamp(20px, 4vw, 48px)" }}>
        {LOOKBOOK.map((look, i) => (
          <LookbookEntry
            key={look.id}
            look={look}
            index={i}
            isEven={i % 2 === 0}
            isWide={i % 5 === 0}
            caption={CAPTIONS[i] || look.alt}
            pieces={PIECE_NAMES[i] || []}
          />
        ))}
      </section>

      {/* Shop the Look */}
      <section style={{ background: "var(--paper-warm)", padding: "clamp(48px, 7vw, 96px) clamp(20px, 4vw, 48px)", borderTop: "1px solid rgba(26,25,22,0.08)" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Shop the Look</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 3vw, 44px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)" }}>
              Shop the collection.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "clamp(16px, 2vw, 24px)" }}>
            {featured.map(p => (
              <Link key={p.id} href={`/product/${p.slug}`}>
                <div className="product-img-wrap" style={{ aspectRatio: "3/4", background: "var(--paper-deep)", marginBottom: "12px", overflow: "hidden" }}>
                  <img src={p.imgPortrait} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: "15px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "4px" }}>{p.name}</p>
                <p style={{ fontSize: "13px", color: "var(--ink-faint)" }}>₹{p.price.toLocaleString("en-IN")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function LookbookEntry({
  look, index, isEven, isWide, caption, pieces
}: {
  look: LookbookImage; index: number; isEven: boolean; isWide: boolean; caption: string; pieces: string[];
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [imgRef.current, textRef.current].forEach((el, i) => {
      if (!el) return;
      el.style.transitionDelay = `${i * 80}ms`;
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      el.classList.add("reveal");
      obs.observe(el);
    });
  }, []);

  if (isWide) {
    return (
      <div style={{ marginBottom: "clamp(48px, 7vw, 96px)" }}>
        <div ref={imgRef} className="product-img-wrap" style={{ aspectRatio: "21/9", overflow: "hidden", background: "var(--paper-warm)", marginBottom: "20px" }}>
          <img src={look.srcLandscape} alt={look.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        </div>
        <div ref={textRef} style={{ maxWidth: "560px", margin: isEven ? "0" : "0 0 0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
            Look {String(index + 1).padStart(2, "0")}
          </p>
          <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px, 2.2vw, 28px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em", color: "var(--ink)", lineHeight: 1.3, marginBottom: "12px" }}>
            {caption}
          </p>
          {pieces.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {pieces.map((name: string) => (
                <span key={name} style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", padding: "4px 10px", border: "1px solid rgba(26,25,22,0.12)" }}>
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="lookbook-editorial-row"
      style={{
        gridTemplateColumns: isEven ? "3fr 2fr" : "2fr 3fr",
        marginBottom: "clamp(48px, 7vw, 96px)",
      }}
    >
      {isEven ? (
        <>
          <div ref={imgRef} className="product-img-wrap" style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-warm)" }}>
            <img src={look.srcPortrait} alt={look.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
          </div>
          <div ref={textRef}>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
              Look {String(index + 1).padStart(2, "0")}
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.5vw, 36px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.2, marginBottom: "16px" }}>
              {caption}
            </p>
            {pieces.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {pieces.map((name: string) => (
                  <span key={name} style={{ fontSize: "12px", color: "var(--ink-mute)", letterSpacing: "0.04em" }}>
                    — {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div ref={textRef} style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
              Look {String(index + 1).padStart(2, "0")}
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.5vw, 36px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.2, marginBottom: "16px" }}>
              {caption}
            </p>
            {pieces.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                {pieces.map((name: string) => (
                  <span key={name} style={{ fontSize: "12px", color: "var(--ink-mute)", letterSpacing: "0.04em" }}>
                    {name} —
                  </span>
                ))}
              </div>
            )}
          </div>
          <div ref={imgRef} className="product-img-wrap" style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-warm)" }}>
            <img src={look.srcPortrait} alt={look.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
          </div>
        </>
      )}
    </div>
  );
}
