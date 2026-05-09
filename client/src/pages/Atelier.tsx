import { useEffect, useRef } from "react";
import { Link } from "wouter";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    el.classList.add("reveal");
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

const STUDIOS = [
  {
    city: "Surat",
    country: "India",
    role: "Design & Production Studio",
    address: "Generations Clothing LLP, Surat, Gujarat",
    desc: "Where every YWEE collection begins. Our design team, fabric sourcing, and production are all based in Surat — the denim capital of India.",
    img: "/images/ywee-atelier-brand_a219e26f.jpg",
    open: "Mon–Sat, 10–18h",
  },
  {
    city: "Mumbai",
    country: "India",
    role: "Brand & Distribution",
    address: "Mumbai, Maharashtra",
    desc: "Our brand and distribution hub. Where we manage logistics, customer experience, and our growing retail partnerships across India.",
    img: "/images/ywee-atelier-fabric_92303576.jpg",
    open: "Mon–Fri, 10–18h",
  },
  {
    city: "Pan-India",
    country: "India",
    role: "Delivery Network",
    address: "Free delivery across all 28 states",
    desc: "We deliver free to every corner of India. Orders placed before 2pm are dispatched the same day. 30-day returns, no questions asked.",
    img: "/images/ywee-lookbook-school_24960550.jpg",
    open: "7 days a week",
  },
];

const VALUES = [
  {
    title: "Premium Cotton-Lycra",
    body: "Every YWEE jean is made in premium Cotton-Lycra blend. Soft on the skin, stretchy enough for every adventure, and durable through hundreds of washes.",
  },
  {
    title: "Adjustable waistband",
    body: "Our signature adjustable waistband grows with her. A pair of YWEE jeans can fit a child for two years instead of six months — less waste, more value.",
  },
  {
    title: "Made in India",
    body: "Designed and manufactured in India by Generations Clothing LLP. Every pair is crafted with care and quality-checked before it ships.",
  },
  {
    title: "Priced under ₹1,500",
    body: "Premium denim should not cost a premium price. Every YWEE style is priced under ₹1,500 with free delivery across India on every order.",
  },
];

export default function Atelier() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => { el.style.transform = `translateY(${window.scrollY * 0.25}px)`; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Hero */}
      <section style={{ position: "relative", height: "80dvh", minHeight: "480px", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <div ref={heroRef} style={{ position: "absolute", inset: "-10%", zIndex: 0, willChange: "transform" }}>
          <img
            src="/images/ywee-hero-indian-girl_14126918.jpg"
            alt="YWEE denim studio in Surat, India"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,25,22,0.65) 0%, rgba(26,25,22,0.15) 60%, transparent 100%)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "clamp(32px, 6vw, 64px) clamp(20px, 4vw, 48px)", maxWidth: "1440px", margin: "0 auto", width: "100%" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,239,230,0.6)", marginBottom: "12px" }}>Atelier</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(48px, 7vw, 100px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--paper)", lineHeight: 0.95, marginBottom: "20px" }}>
            Built for her.
            <br />
            Made in India.
          </h1>
        </div>
      </section>

      {/* Brand Story */}
      <section style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px, 10vw, 128px) clamp(20px, 4vw, 48px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }}>
          <div ref={useReveal()}>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "16px" }}>Our Story</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.05, marginBottom: "24px" }}>
              Denim for the girl who owns every day.
            </h2>
            <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.75, marginBottom: "20px" }}>
              YWEE was born from a simple observation: kids grow fast, and most denim doesn’t keep up. Too stiff to play in. Too small by December. We set out to build something better.
            </p>
            <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.75, marginBottom: "20px" }}>
              We make premium Cotton-Lycra stretch denim for girls aged 1 to 14. Every pair has our signature adjustable waistband — a small detail that means the same jean can fit her for two years instead of six months. Every pair is priced under ₹1,500 and delivered free across India.
            </p>
            <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.75 }}>
              We are Generations Clothing LLP, based in Surat — the denim capital of India. We design, manufacture, and deliver every pair ourselves. We know exactly what goes into every stitch, and we stand behind it.
            </p>
          </div>
          <div ref={useReveal(120)}>
            <div className="product-img-wrap" style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--paper-warm)" }}>
              <img
                src="/images/ywee-collection-hero_0b2ed6cf.jpg"
                alt="YWEE production workshop"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--ink)", padding: "clamp(64px, 10vw, 128px) clamp(20px, 4vw, 48px)" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div ref={useReveal()} style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,239,230,0.4)", marginBottom: "12px" }}>What We Believe</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--paper)", lineHeight: 1.05 }}>
              Four principles, no exceptions.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(32px, 4vw, 48px)" }}>
            {VALUES.map((v, i) => (
              <div key={v.title} ref={useReveal(i * 80)}>
                <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,239,230,0.35)", marginBottom: "12px" }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em", color: "var(--paper)", lineHeight: 1.2, marginBottom: "12px" }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(244,239,230,0.6)", lineHeight: 1.7 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studios */}
      <section style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px, 10vw, 128px) clamp(20px, 4vw, 48px)" }}>
        <div ref={useReveal()} style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>Our Locations</p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.05 }}>
            Where we work.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(24px, 3vw, 40px)" }}>
          {STUDIOS.map((studio, i) => (
            <div key={studio.city} ref={useReveal(i * 80)}>
              <div className="product-img-wrap" style={{ aspectRatio: "4/3", overflow: "hidden", background: "var(--paper-warm)", marginBottom: "20px" }}>
                <img src={studio.img} alt={`${studio.city} studio`} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
              <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
                {studio.role}
              </p>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: "4px" }}>
                {studio.city}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--ink-faint)", marginBottom: "12px" }}>{studio.country}</p>
              <p style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.65, marginBottom: "12px" }}>{studio.desc}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-faint)", letterSpacing: "0.04em" }}>{studio.address}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-faint)", letterSpacing: "0.04em", marginTop: "4px" }}>{studio.open}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mending CTA */}
      <section style={{ background: "var(--paper-warm)", padding: "clamp(48px, 7vw, 96px) clamp(20px, 4vw, 48px)", borderTop: "1px solid rgba(26,25,22,0.08)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <div ref={useReveal()}>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "16px" }}>30-Day Returns</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1, marginBottom: "16px" }}>
              Not happy? We'll make it right.
            </h2>
            <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "32px" }}>
              Every YWEE order comes with a 30-day no-questions-asked return policy. Wrong size, changed mind, or just not what you expected — we'll sort it out, fast.
            </p>
            <Link
              href="/mending"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--ink)", color: "var(--paper)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, padding: "14px 28px", fontFamily: "var(--sans)" }}
            >
              Returns &amp; Exchanges →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
