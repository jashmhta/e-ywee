import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { Link, useLocation } from "wouter";
import { PRODUCTS, COLLECTIONS, JOURNAL, LOOKBOOK, HERO_VIDEO, HERO_POSTER } from "@/data/store";
import { useBag } from "@/contexts/BagContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ── Utility hooks ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal");
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function useStaggerReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("stagger-reveal");
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Drag-to-scroll rail ───────────────────────────────────────────────────────
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onDown = (e: MouseEvent) => {
      isDown = true; el.classList.add("active");
      startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft;
    };
    const onUp = () => { isDown = false; el.classList.remove("active"); };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return; e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.4;
    };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mousemove", onMove);
    };
  }, []);
  return ref;
}

// ── Scroll progress bar ───────────────────────────────────────────────────────
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const el = barRef.current;
      if (!el) return;
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div ref={barRef} className="scroll-progress" />;
}


// ── Quick-view modal ──────────────────────────────────────────────────────────
function QuickView({ product, onClose }: { product: typeof PRODUCTS[0] | null; onClose: () => void }) {
  const { addItem } = useBag();
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (product) { setSize(""); setAdded(false); }
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    if (!size) { toast.error("Please select a size"); return; }
    addItem(product, size);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <>
      <div className={`quickview-overlay ${product ? "open" : ""}`} onClick={onClose} />
      <div className={`quickview-panel ${product ? "open" : ""}`}>
        <div className="quickview-inner">
          {/* Image */}
          <div style={{ background: "var(--paper-deep)", overflow: "hidden" }}>
            <img loading="lazy" src={product.imgPortrait} alt={product.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          {/* Info */}
          <div style={{ padding: "clamp(20px, 3vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
            <button onClick={onClose} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: "20px", lineHeight: 1 }}>×</button>
            <div>
              <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>{product.category}</p>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.5vw, 28px)", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", lineHeight: 1.1 }}>{product.name}</h3>
              <p style={{ fontSize: "18px", color: "var(--ink)", marginTop: "8px" }}>₹{product.price.toLocaleString("en-IN")}</p>
            </div>
            <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.65 }}>{product.description}</p>
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>Size</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`size-swatch ${size === s ? "selected" : ""}`}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
              <button onClick={handleAdd}
                style={{ flex: 1, padding: "14px", background: added ? "var(--sage)" : "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "var(--sans)", transition: "background 0.4s" }}>
                {added ? "Added ✓" : "Add to Bag"}
              </button>
              <button onClick={() => { onClose(); navigate(`/product/${product.slug}`); }}
                style={{ padding: "14px 16px", background: "transparent", color: "var(--ink)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(26,25,22,0.2)", cursor: "pointer", fontFamily: "var(--sans)", transition: "border-color 0.22s" }}>
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onQuickView, width = 280 }: {
  product: typeof PRODUCTS[0];
  onQuickView: (p: typeof PRODUCTS[0]) => void;
  width?: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ width: `${width}px`, flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="img-swap" style={{ aspectRatio: "3/4", background: "var(--paper-deep)", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
          <img loading="lazy" src={product.imgPortrait} alt={product.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)" }} />
          {/* Quick view button */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
            style={{
              position: "absolute", bottom: "12px", left: "50%", transform: `translateX(-50%) translateY(${hovered ? "0" : "8px"})`,
              opacity: hovered ? 1 : 0, transition: "opacity 0.3s, transform 0.3s",
              padding: "9px 18px", background: "rgba(244,239,230,0.92)", color: "var(--ink)",
              fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
              border: "none", cursor: "pointer", fontFamily: "var(--sans)", whiteSpace: "nowrap",
              backdropFilter: "blur(4px)"
            }}
          >
            Quick View
          </button>
        </div>
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "3px" }}>{product.category}</p>
          <Link href={`/product/${product.slug}`}>
            <p style={{ fontSize: "14px", color: "var(--ink)", fontWeight: 400, lineHeight: 1.3 }}>{product.name}</p>
          </Link>
        </div>
        <p style={{ fontSize: "14px", color: "var(--ink)", flexShrink: 0, marginLeft: "12px" }}>₹{product.price.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}

// ── Marquee band ──────────────────────────────────────────────────────────────
function MarqueeBand({ items, direction = "left", bg = "var(--ink)", color = "var(--paper)", size = "clamp(13px, 1.4vw, 16px)" }: {
  items: string[];
  direction?: "left" | "right";
  bg?: string;
  color?: string;
  size?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div style={{ background: bg, overflow: "hidden", padding: "14px 0", position: "relative" }}>
      <div className={`marquee-track ${direction}`} style={{ display: "flex", alignItems: "center" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0" }}>
            <span style={{ fontSize: size, letterSpacing: "0.08em", textTransform: "uppercase", color, padding: "0 clamp(20px, 3vw, 40px)", fontFamily: "var(--sans)", fontWeight: 400, whiteSpace: "nowrap" }}>
              {item}
            </span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: color, opacity: 0.4, flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Story strip (mobile-first vertical video cards) ───────────────────────────
function StoryStrip() {
  const stories = [
    { label: "New Arrivals", img: LOOKBOOK[0].srcPortrait, link: "/lookbook" },
    { label: "Classic Blues", img: PRODUCTS[0].imgPortrait, link: "/shop" },
    { label: "Bold Prints", img: PRODUCTS[6].imgPortrait, link: "/shop" },
    { label: "Midnight Black", img: PRODUCTS[4].imgPortrait, link: "/shop" },
    { label: "Journal", img: JOURNAL[0].img, link: "/journal" },
    { label: "Atelier", img: LOOKBOOK[7].srcPortrait, link: "/atelier" },
  ];
  return (
    <section style={{ padding: "clamp(32px, 5vw, 64px) 0", background: "var(--paper)" }}>
      <div style={{ padding: "0 clamp(20px, 4vw, 48px)", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <p className="section-label">Explore</p>
        <Link href="/shop" style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}>
          View all →
        </Link>
      </div>
      <div className="story-strip">
        {stories.map((s, i) => (
          <Link key={i} href={s.link}>
            <div className="story-item lift-card">
              <img src={s.img} alt={s.label} loading="lazy" />
              <div className="story-item-label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Video feature section ─────────────────────────────────────────────────────
function VideoSection({ src, poster, title, subtitle, cta, ctaHref, side = "left" }: {
  src: string; poster: string; title: string; subtitle: string;
  cta: string; ctaHref: string; side?: "left" | "right";
}) {
  const ref = useReveal();
  return (
    <section className="video-feature-section">
      <div className="video-section" style={{ order: side === "left" ? 0 : 1 }}>
        {src ? (
          <video autoPlay muted loop playsInline poster={poster}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <img src={poster} alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
        )}
      </div>
      <div ref={ref} style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(32px, 6vw, 80px)", background: "var(--paper-warm)",
        order: side === "left" ? 1 : 0
      }}>
        <p className="section-label" style={{ marginBottom: "16px" }}>Film</p>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.05, marginBottom: "20px" }}>
          {title}
        </h2>
        <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.75, marginBottom: "32px", maxWidth: "400px" }}>
          {subtitle}
        </p>
        <Link href={ctaHref} style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--ink)", textDecoration: "none", fontFamily: "var(--sans)"
        }}>
          {cta}
          <span style={{ display: "inline-block", width: "32px", height: "1px", background: "var(--ink)", transition: "width 0.3s" }} />
        </Link>
      </div>
    </section>
  );
}

// ── Outfit builder section ────────────────────────────────────────────────────
function OutfitBuilder() {
  const outfits = [
    {
      label: "The Studio Look",
      pieces: [PRODUCTS[5], PRODUCTS[4], PRODUCTS[7]],
      total: PRODUCTS[5].price + PRODUCTS[4].price + PRODUCTS[7].price,
    },
    {
      label: "The Weekend",
      pieces: [PRODUCTS[6], PRODUCTS[3], PRODUCTS[2]],
      total: PRODUCTS[6].price + PRODUCTS[3].price + PRODUCTS[2].price,
    },
    {
      label: "The Evening",
      pieces: [PRODUCTS[9], PRODUCTS[8], PRODUCTS[1]],
      total: PRODUCTS[9].price + PRODUCTS[8].price + PRODUCTS[1].price,
    },
  ];
  const ref = useReveal();
  return (
    <section style={{ padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 48px)", background: "var(--paper-warm)" }}>
      <div ref={ref} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "clamp(24px, 4vw, 48px)", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p className="section-label" style={{ marginBottom: "8px" }}>Curated</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.0 }}>
              Build an outfit.
            </h2>
          </div>
          <Link href="/shop" style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}>
            Shop all →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(16px, 2.5vw, 28px)" }}>
          {outfits.map((outfit, i) => (
            <div key={i} style={{ background: "var(--paper)", padding: "0 0 20px" }}>
              <div className="outfit-thumbs-grid" style={{ marginBottom: "16px" }}>
                {outfit.pieces.map(p => (
                  <div key={p.id} className="outfit-card" style={{ aspectRatio: "2/3" }}>
                    <img loading="lazy" src={p.imgPortrait} alt={p.alt}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div className="outfit-card-overlay">
                      <span className="outfit-card-cta">Add</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "0 16px" }}>
                <p style={{ fontFamily: "var(--serif)", fontSize: "17px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "4px" }}>{outfit.label}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "13px", color: "var(--ink-faint)" }}>{outfit.pieces.length} pieces</p>
                  <p style={{ fontSize: "14px", color: "var(--ink)" }}>₹{outfit.total.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Collections grid ──────────────────────────────────────────────────────────
function CollectionsGrid() {
  const ref = useStaggerReveal();
  return (
    <section style={{ padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 48px)", background: "var(--paper)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "clamp(24px, 4vw, 40px)", flexWrap: "wrap", gap: "12px" }}>
          <p className="section-label">Collections</p>
          <Link href="/shop" style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}>
            All collections →
          </Link>
        </div>
        <div ref={ref} className="collections-grid" style={{ gap: "clamp(8px, 1.5vw, 16px)" }}>
          {COLLECTIONS.map((col, i) => (
            <Link key={i} href="/shop">
              <div className="lift-card" style={{ position: "relative", overflow: "hidden", aspectRatio: i === 0 ? "3/4" : "3/4", background: "var(--paper-deep)", cursor: "pointer" }}>
                <img loading="lazy" src={col.img} alt={col.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.04)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,25,22,0.55) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(16px, 2.5vw, 28px)" }}>
                  <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,239,230,0.65)", marginBottom: "4px" }}>{col.season}</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px, 2.5vw, 28px)", fontStyle: "italic", fontWeight: 300, color: "var(--paper)", lineHeight: 1.1 }}>{col.name}</p>
                  <p style={{ fontSize: "12px", color: "rgba(244,239,230,0.7)", marginTop: "4px" }}>{col.count} pieces</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Horizontal product rail ───────────────────────────────────────────────────
function ProductRail({ title, subtitle, products, onQuickView }: {
  title: string; subtitle?: string;
  products: typeof PRODUCTS;
  onQuickView: (p: typeof PRODUCTS[0]) => void;
}) {
  const railRef = useDragScroll();
  const headerRef = useReveal();
  return (
    <section style={{ padding: "clamp(48px, 8vw, 96px) 0", background: "var(--paper)" }}>
      <div ref={headerRef} style={{ padding: "0 clamp(20px, 4vw, 48px)", marginBottom: "clamp(24px, 4vw, 36px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
        <div>
          {subtitle && <p className="section-label" style={{ marginBottom: "8px" }}>{subtitle}</p>}
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.0 }}>
            {title}
          </h2>
        </div>
        <Link href="/shop" style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none", flexShrink: 0 }}>
          View all →
        </Link>
      </div>
      <div className="h-rail-wrap">
        <div ref={railRef} className="h-rail drag-scroll" style={{ paddingLeft: "clamp(20px, 4vw, 48px)", paddingRight: "clamp(20px, 4vw, 48px)" }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} width={260} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Lookbook strip ────────────────────────────────────────────────────────────
function LookbookStrip() {
  const railRef = useDragScroll();
  const ref = useReveal();
  return (
    <section style={{ padding: "clamp(48px, 8vw, 96px) 0", background: "var(--paper-warm)" }}>
      <div ref={ref} style={{ padding: "0 clamp(20px, 4vw, 48px)", marginBottom: "clamp(24px, 4vw, 36px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p className="section-label" style={{ marginBottom: "8px" }}>Lookbook</p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.0 }}>
            New Arrivals.
          </h2>
        </div>
        <Link href="/lookbook" style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}>
          Full lookbook →
        </Link>
      </div>
      <div className="h-rail-wrap">
        <div ref={railRef} className="h-rail drag-scroll" style={{ paddingLeft: "clamp(20px, 4vw, 48px)", paddingRight: "clamp(20px, 4vw, 48px)" }}>
          {LOOKBOOK.map((img, i) => (
            <Link key={img.id} href="/lookbook">
              <div style={{ width: "clamp(220px, 25vw, 340px)", flexShrink: 0, aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-deep)" }}>
                <img src={img.srcPortrait} alt={img.alt} loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                    transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.04)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Journal section ───────────────────────────────────────────────────────────
function JournalSection() {
  const ref = useStaggerReveal();
  return (
    <section style={{ padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 48px)", background: "var(--paper)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "clamp(24px, 4vw, 40px)", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p className="section-label" style={{ marginBottom: "8px" }}>Journal</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.0 }}>
              Field notes.
            </h2>
          </div>
          <Link href="/journal" style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}>
            All articles →
          </Link>
        </div>
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(20px, 3vw, 32px)" }}>
          {JOURNAL.map(article => (
            <Link key={article.slug} href={`/journal/${article.slug}`}>
              <div className="lift-card" style={{ cursor: "pointer" }}>
                <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "var(--paper-deep)", marginBottom: "16px" }}>
                  <img src={article.img} alt={article.alt} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.04)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                  />
                </div>
                <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "6px" }}>
                  {article.category} · {article.read}
                </p>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(17px, 2vw, 22px)", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", lineHeight: 1.2, marginBottom: "8px" }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.65 }}>{article.deck}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Brand values strip ────────────────────────────────────────────────────────
function ValuesStrip() {
  const values = [
    { n: "96", label: "Styles in range", sub: "jeans · shorts · prints" },
    { n: "1–14", label: "Years of fit", sub: "toddler to tween" },
    { n: "100%", label: "Cotton-Lycra blend", sub: "soft · stretchy · durable" },
    { n: "₹0", label: "Delivery charge", sub: "free across India" },
  ];
  const ref = useStaggerReveal();
  return (
    <section style={{ padding: "clamp(48px, 8vw, 80px) clamp(20px, 4vw, 48px)", background: "var(--ink)", position: "relative" }} className="grain-dark">
      <div ref={ref} style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "clamp(24px, 4vw, 48px)" }}>
        {values.map(v => (
          <div key={v.n} style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px, 6vw, 72px)", fontStyle: "italic", fontWeight: 300, color: "var(--paper)", lineHeight: 1.0, marginBottom: "8px" }}>{v.n}</p>
            <p style={{ fontSize: "13px", letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(244,239,230,0.7)", marginBottom: "4px" }}>{v.label}</p>
            <p style={{ fontSize: "12px", color: "rgba(244,239,230,0.4)" }}>{v.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setSent(true),
    onError: () => toast.error("Please enter a valid email address"),
  });
  const ref = useReveal();
  return (
    <section ref={ref} style={{ padding: "clamp(64px, 10vw, 120px) clamp(20px, 4vw, 48px)", background: "var(--paper-warm)", textAlign: "center" }}>
      <p className="section-label" style={{ marginBottom: "16px" }}>Stay close</p>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.0, marginBottom: "16px" }}>
        Studio notes.
      </h2>
      <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.75, marginBottom: "36px", maxWidth: "480px", margin: "0 auto 36px" }}>
        Style guides, fabric stories, and news from the YWEE studio. For parents and girls who love denim.
      </p>
      {sent ? (
        <p style={{ fontFamily: "var(--serif)", fontSize: "20px", fontStyle: "italic", color: "var(--ink)" }}>
          Thank you. We'll be in touch.
        </p>
      ) : (
        <form onSubmit={e => { e.preventDefault(); subscribe.mutate({ email }); }}
          style={{ display: "flex", gap: "0", maxWidth: "440px", margin: "0 auto" }}>
          <input
            type="email" required placeholder="your@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, padding: "14px 16px", border: "1px solid rgba(26,25,22,0.18)", borderRight: "none", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }}
            onFocus={e => (e.target.style.borderColor = "var(--ink)")}
            onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
          />
          <button type="submit" disabled={subscribe.isPending}
            style={{ padding: "14px 24px", background: "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "var(--sans)", whiteSpace: "nowrap" }}>
            {subscribe.isPending ? "…" : "Subscribe"}
          </button>
        </form>
      )}
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax hero — desktop only (mobile has no overflow room for -10% inset)
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      el.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const newArrivals = PRODUCTS.slice(0, 6);
  const bestsellers = [...PRODUCTS].sort((a, b) => b.price - a.price).slice(0, 6);

  return (
    <>
      <ScrollProgress />
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      <main style={{ background: "var(--paper)" }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="hero-section" style={{ position: "relative", height: "100dvh", minHeight: "600px", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <div ref={heroRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            {HERO_VIDEO ? (
              <video
                ref={videoRef}
                autoPlay muted loop playsInline
                poster={HERO_POSTER}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
            ) : (
              <img
                src={HERO_POSTER}
                alt="YWEE — She Owns Every Day"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
              />
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,25,22,0.72) 0%, rgba(26,25,22,0.25) 40%, rgba(26,25,22,0.05) 70%, transparent 100%)" }} />
          </div>

          {/* Hero content */}
          <div style={{ position: "relative", zIndex: 1, padding: "clamp(32px, 5vw, 64px)", width: "100%", maxWidth: "1200px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,239,230,0.65)", marginBottom: "16px", fontFamily: "var(--sans)" }}>
              Girls' Stretch Denim · Ages 1–14 · Made in India
            </p>
            <h1 className="hero-title" style={{ fontFamily: "var(--serif)", fontSize: "clamp(52px, 10vw, 128px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.04em", color: "var(--paper)", lineHeight: 0.92, marginBottom: "32px" }}>
              <span className="split-line"><span style={{ animationDelay: "0ms" }}>From the</span></span>
              <span className="split-line"><span style={{ animationDelay: "120ms" }}>Sandbox to</span></span>
              <span className="split-line"><span style={{ animationDelay: "240ms" }}>the Stage.</span></span>
            </h1>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", background: "var(--paper)", color: "var(--ink)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--sans)", transition: "background 0.3s, color 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--ink)"; (e.currentTarget as HTMLElement).style.color = "var(--paper)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--paper)"; (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
              >
                Shop the collection
              </Link>
              <Link href="/lookbook" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", background: "transparent", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--sans)", border: "1px solid rgba(244,239,230,0.4)", transition: "border-color 0.3s" }}>
                View lookbook
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: "absolute", bottom: "clamp(24px, 4vw, 40px)", right: "clamp(24px, 4vw, 40px)", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "1px", height: "48px", background: "rgba(244,239,230,0.4)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", background: "var(--paper)", animation: "scrollLine 1.8s ease-in-out infinite" }} />
            </div>
            <p style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,239,230,0.5)", writingMode: "vertical-rl", fontFamily: "var(--sans)" }}>Scroll</p>
          </div>
          <style>{`@keyframes scrollLine { 0%{height:0;top:0} 50%{height:100%;top:0} 100%{height:0;top:100%} }`}</style>
        </section>

        {/* ── Marquee 1 ─────────────────────────────────────────── */}
        <MarqueeBand
          items={["Girls\' Stretch Denim", "Ages 1–14 Years", "Free Delivery India", "Cotton-Lycra Blend", "Adjustable Waistband", "Made in India"]}
          direction="left"
        />

        {/* ── Story strip ───────────────────────────────────────── */}
        <StoryStrip />

        {/* ── New arrivals rail ─────────────────────────────────── */}
        <ProductRail
          title="New arrivals."
          subtitle="New Arrivals"
          products={newArrivals}
          onQuickView={setQuickViewProduct}
        />

        {/* ── Video feature ─────────────────────────────────────── */}
        <VideoSection
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          title="Built for her energy."
          subtitle="Premium Cotton-Lycra stretch denim that moves as freely as she does. Our signature adjustable waistband grows with her — no compromise on fit, ever."
          cta="Our story"
          ctaHref="/atelier"
          side="left"
        />

        {/* ── Marquee 2 (reversed, warm bg) ─────────────────────── */}
        <MarqueeBand
          items={["Free Delivery Across India", "30-Day Returns", "Adjustable Waistband", "Premium Cotton-Lycra", "Made in India"]}
          direction="right"
          bg="var(--paper-warm)"
          color="var(--ink)"
        />

        {/* ── Collections grid ──────────────────────────────────── */}
        <CollectionsGrid />

        {/* ── Bestsellers rail ──────────────────────────────────── */}
        <ProductRail
          title="Bestsellers."
          subtitle="Customer Favourites"
          products={bestsellers}
          onQuickView={setQuickViewProduct}
        />

        {/* ── Lookbook strip ────────────────────────────────────── */}
        <LookbookStrip />

        {/* ── Values strip ──────────────────────────────────────── */}
        <ValuesStrip />

        {/* ── Outfit builder ────────────────────────────────────── */}
        <OutfitBuilder />

        {/* ── Journal ───────────────────────────────────────────── */}
        <JournalSection />

        {/* ── Newsletter ────────────────────────────────────────── */}
        <Newsletter />

      </main>
    </>
  );
}
