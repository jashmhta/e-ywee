import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { PRODUCTS, CATEGORIES } from "@/data/store";
import { useBag } from "@/contexts/BagContext";
import { toast } from "sonner";

// ── Drag-to-scroll ────────────────────────────────────────────────────────────
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onDown = (e: MouseEvent) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const onUp = () => { isDown = false; };
    const onMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4; };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
  }, []);
  return ref;
}

// ── Quick-view ────────────────────────────────────────────────────────────────
function QuickView({ product, onClose }: { product: typeof PRODUCTS[0] | null; onClose: () => void }) {
  const { addItem } = useBag();
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => { if (product) { setSize(""); setAdded(false); } }, [product]);
  useEffect(() => { document.body.style.overflow = product ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [product]);

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
          <div style={{ background: "var(--paper-deep)", overflow: "hidden" }}>
            <img loading="lazy" src={product.imgPortrait} alt={product.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ padding: "clamp(20px, 3vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
            <button onClick={onClose} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: "20px" }}>×</button>
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
                  <button key={s} onClick={() => setSize(s)} className={`size-swatch ${size === s ? "selected" : ""}`}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
              <button onClick={handleAdd}
                style={{ flex: 1, padding: "14px", background: added ? "var(--sage)" : "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "var(--sans)", transition: "background 0.4s" }}>
                {added ? "Added ✓" : "Add to Bag"}
              </button>
              <Link href={`/product/${product.slug}`} onClick={onClose}
                style={{ padding: "14px 16px", background: "transparent", color: "var(--ink)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(26,25,22,0.2)", cursor: "pointer", fontFamily: "var(--sans)", textDecoration: "none", display: "flex", alignItems: "center" }}>
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onQuickView, index }: {
  product: typeof PRODUCTS[0];
  onQuickView: (p: typeof PRODUCTS[0]) => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal");
    el.style.transitionDelay = `${(index % 4) * 55}ms`;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link href={`/product/${product.slug}`}>
        <div style={{ position: "relative", overflow: "hidden", background: "var(--paper-warm)", aspectRatio: "3/4", marginBottom: "12px" }}>
          <img loading="lazy" src={product.imgPortrait} alt={product.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)" }} />
          {/* Color dot */}
          <div style={{ position: "absolute", top: "12px", right: "12px", width: "12px", height: "12px", borderRadius: "50%", background: product.colorHex, border: "1.5px solid rgba(244,239,230,0.6)" }} />
          {/* Quick view */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
            style={{
              position: "absolute", bottom: "12px", left: "50%",
              transform: `translateX(-50%) translateY(${hovered ? "0" : "8px"})`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s, transform 0.3s",
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
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "3px" }}>{product.category} · {product.color}</p>
          <Link href={`/product/${product.slug}`}>
            <p style={{ fontFamily: "var(--serif)", fontSize: "16px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", lineHeight: 1.3 }}>{product.name}</p>
          </Link>
        </div>
        <p style={{ fontSize: "14px", color: "var(--ink)", flexShrink: 0, marginLeft: "12px" }}>₹{product.price.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initCat = params.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(initCat);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [priceMax, setPriceMax] = useState(1500);
  const [showFilters, setShowFilters] = useState(false);

  const catRailRef = useDragScroll();

  useEffect(() => {
    const p = new URLSearchParams(search);
    setActiveCategory(p.get("category") || "All");
  }, [search]);

  const filtered = PRODUCTS
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => p.price <= priceMax)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <>
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      <main style={{ background: "var(--paper)", minHeight: "100dvh", paddingTop: "80px" }}>

        {/* ── Page header ─────────────────────────────────────── */}
        <div style={{ padding: "clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px) 0", borderBottom: "1px solid rgba(26,25,22,0.08)" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(20px, 3vw, 32px)", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p className="section-label" style={{ marginBottom: "8px" }}>New Arrivals</p>
                <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 0.95 }}>
                  Shop
                </h1>
              </div>
              <div className="shop-header-controls" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-faint)" }}>{filtered.length} piece{filtered.length !== 1 ? "s" : ""}</span>
                {/* View toggle */}
                <div style={{ display: "flex", gap: "0" }}>
                  {(["grid", "list"] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      style={{ padding: "7px 11px", background: viewMode === mode ? "var(--ink)" : "transparent", color: viewMode === mode ? "var(--paper)" : "var(--ink-faint)", border: "1px solid rgba(26,25,22,0.15)", cursor: "pointer", fontSize: "13px", fontFamily: "var(--sans)", transition: "all 0.22s", marginRight: "-1px" }}>
                      {mode === "grid" ? "⊞" : "≡"}
                    </button>
                  ))}
                </div>
                {/* Sort */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid rgba(26,25,22,0.15)", background: "transparent", color: "var(--ink)", fontSize: "12px", letterSpacing: "0.06em", fontFamily: "var(--sans)", cursor: "pointer", outline: "none" }}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low–High</option>
                  <option value="price-desc">Price: High–Low</option>
                  <option value="name">Name A–Z</option>
                </select>
                {/* Filter toggle */}
                <button onClick={() => setShowFilters(!showFilters)}
                  style={{ padding: "8px 16px", border: "1px solid rgba(26,25,22,0.15)", background: showFilters ? "var(--ink)" : "transparent", color: showFilters ? "var(--paper)" : "var(--ink)", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", fontFamily: "var(--sans)", cursor: "pointer", transition: "all 0.22s" }}>
                  Filter {showFilters ? "−" : "+"}
                </button>
              </div>
            </div>

            {/* Horizontal category rail */}
            <div ref={catRailRef} className="h-rail drag-scroll" style={{ paddingLeft: 0, paddingRight: 0, gap: "8px", paddingBottom: "0" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`pill-tab ${activeCategory === cat ? "active" : ""}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filter panel ─────────────────────────────────────── */}
        <div style={{ overflow: "hidden", maxHeight: showFilters ? "120px" : "0", transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)", background: "var(--paper-warm)", borderBottom: showFilters ? "1px solid rgba(26,25,22,0.08)" : "none" }}>
          <div style={{ padding: "clamp(16px, 3vw, 24px) clamp(20px, 4vw, 48px)", maxWidth: "1440px", margin: "0 auto", display: "flex", gap: "clamp(24px, 4vw, 48px)", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>Max Price: ₹{priceMax.toLocaleString("en-IN")}</p>
              <input type="range" min={100} max={1500} step={50} value={priceMax}
                onChange={e => setPriceMax(+e.target.value)}
                className="price-range-input"
                style={{ width: "200px", accentColor: "var(--ink)" }} />
            </div>
            <button onClick={() => { setPriceMax(1500); setActiveCategory("All"); setSortBy("featured"); }}
              style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", textDecoration: "underline" }}>
              Clear all
            </button>
          </div>
        </div>

        {/* ── Product grid / list ──────────────────────────────── */}
        <div style={{ padding: "clamp(32px, 5vw, 56px) clamp(20px, 4vw, 48px)", maxWidth: "1440px", margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: "24px", fontStyle: "italic", color: "var(--ink-mute)", marginBottom: "16px" }}>No pieces found.</p>
              <button onClick={() => { setActiveCategory("All"); setPriceMax(1500); }}
                style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", background: "none", border: "1px solid rgba(26,25,22,0.2)", padding: "12px 24px", cursor: "pointer", fontFamily: "var(--sans)" }}>
                Clear filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: "clamp(20px, 2.4vw, 36px)" }}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filtered.map(p => (
                <div key={p.id} className="shop-list-row" style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", gap: "20px", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(26,25,22,0.06)" }}>
                  <Link href={`/product/${p.slug}`}>
                    <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--paper-warm)" }}>
                      <img loading="lazy" src={p.imgPortrait} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.06)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")} />
                    </div>
                  </Link>
                  <div>
                    <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>{p.category} · {p.color}</p>
                    <Link href={`/product/${p.slug}`}>
                      <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(16px, 2vw, 22px)", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "8px" }}>{p.name}</p>
                    </Link>
                    <p style={{ fontSize: "13px", color: "var(--ink-mute)", lineHeight: 1.6, maxWidth: "480px" }}>{p.description}</p>
                  </div>
                  <div className="shop-list-row-actions" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                    <p style={{ fontSize: "18px", color: "var(--ink)" }}>₹{p.price.toLocaleString("en-IN")}</p>
                    <button onClick={() => setQuickViewProduct(p)}
                      style={{ padding: "10px 20px", background: "var(--ink)", color: "var(--paper)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "var(--sans)", whiteSpace: "nowrap" }}>
                      Quick View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom marquee ───────────────────────────────────── */}
        <div style={{ borderTop: "1px solid rgba(26,25,22,0.08)", overflow: "hidden", padding: "14px 0", background: "var(--paper-warm)" }}>
          <div className="marquee-track left" style={{ display: "flex", alignItems: "center" }}>
            {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                <span style={{ fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", padding: "0 clamp(16px, 2.5vw, 32px)", fontFamily: "var(--sans)", whiteSpace: "nowrap" }}>{cat}</span>
                <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--ink-faint)", opacity: 0.4, flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
