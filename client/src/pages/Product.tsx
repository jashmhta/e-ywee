import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { PRODUCTS, PRODUCTS_BY_SLUG, imageSrc, imageSrcSet } from "@/data/store";
import { useBag } from "@/contexts/BagContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { ChevronLeft, Plus, Minus, Check, Truck, Repeat, Wrench, ShieldCheck, Star } from "lucide-react";
import { Picture } from "@/components/atoms/Picture";
import { ProductCard } from "@/components/ProductCard";
import { Meta } from "@/components/system/Meta";
import { HeartToggle } from "@/components/atoms/HeartToggle";
import { StarRating } from "@/components/atoms/StarRating";
import { getRatingSummary, getStockFor } from "@/data/reviews";
import { ReviewsBlock } from "@/components/pdp/ReviewsBlock";
import { QABlock } from "@/components/pdp/QABlock";
import { FabricBreakdown } from "@/components/pdp/FabricBreakdown";
import { CareIcons } from "@/components/pdp/CareIcons";
import { NotifyMeModal } from "@/components/pdp/NotifyMeModal";
import { SizeQuiz } from "@/components/pdp/SizeQuiz";
import { StickyAddToBag } from "@/components/StickyAddToBag";
import { RecentlyViewedRail } from "@/components/RecentlyViewedRail";

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS_BY_SLUG.get(slug ?? "");
  const { addItem } = useBag();
  const { format } = useCurrency();
  const { push: pushRecentlyViewed } = useRecentlyViewed();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [openSection, setOpenSection] = useState<"details" | "story" | "shipping" | null>("details");
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Reset state on slug change + push to recently viewed
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setAdded(false);
    setActiveImg(0);
    setZoomed(false);
    if (slug) pushRecentlyViewed(slug);
  }, [slug, pushRecentlyViewed]);

  // Keyboard nav across thumbnails
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") setActiveImg((i) => Math.min(product.images.length - 1, i + 1));
      if (e.key === "ArrowLeft") setActiveImg((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product]);

  const variants = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.style === product.style && p.id !== product.id);
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.family === product.family && p.style !== product.style).slice(0, 4);
  }, [product]);

  // "Complete the look" — pick complementary pieces from different families
  const completeTheLook = useMemo(() => {
    if (!product) return [];
    const others = PRODUCTS.filter((p) => p.family !== product.family && p.style !== product.style);
    // deterministic shuffle by hashing slug
    const seed = product.slug.split("").reduce((s, c) => (s * 33) ^ c.charCodeAt(0), 5381);
    return others
      .map((p, i) => ({ p, k: ((seed + i * 17) >>> 0) % 1000 }))
      .sort((a, b) => a.k - b.k)
      .slice(0, 3)
      .map((x) => x.p);
  }, [product]);

  if (!product) {
    return (
      <main style={{ minHeight: "60dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <Meta title="Piece not found" canonicalPath="/shop" />
        <p style={{ fontFamily: "var(--serif)", fontSize: "32px", fontStyle: "italic", color: "var(--ink-mute)" }}>
          Piece not found.
        </p>
        <Link href="/shop" className="btn btn-ghost">Back to shop</Link>
      </main>
    );
  }

  const productNonNull = product;
  const mainImg = productNonNull.images[activeImg];
  const summary = getRatingSummary(product.slug);
  const stock = getStockFor(product.slug, product.sizes);
  const totalStock = stock.reduce((s, x) => s + x.stock, 0);
  const lowStock = stock.find((s) => s.stock > 0 && s.stock <= 3);
  const selectedStock = selectedSize ? stock.find((s) => s.size === selectedSize) : null;
  const completeTotal = product.price + completeTheLook.slice(0, 2).reduce((s, p) => s + p.price, 0);
  const completeBundlePrice = Math.round(completeTotal * 0.92);

  function handleAddToBag() {
    if (!selectedSize) {
      mainRef.current?.classList.add("size-shake");
      setTimeout(() => mainRef.current?.classList.remove("size-shake"), 600);
      return;
    }
    if (selectedStock?.stock === 0) {
      setNotifyOpen(true);
      return;
    }
    addItem(productNonNull, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const img = e.currentTarget.querySelector<HTMLImageElement>("img.zoom-target");
    if (img) {
      img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
    }
  }

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta
        title={product.name}
        description={product.description}
        ogImage={imageSrc(product, 0, 1200)}
        ogType="product"
        canonicalPath={`/product/${product.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            sku: product.sku,
            description: product.description,
            color: product.color,
            image: product.images.map((i) => i.sizes[i.sizes.length - 1].src),
            brand: { "@type": "Brand", name: "ywee" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: summary.avg,
              reviewCount: summary.count,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: product.currency,
              price: product.price,
              availability: totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              priceValidUntil: "2030-12-31",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Shop", item: "/shop" },
              { "@type": "ListItem", position: 2, name: product.family, item: `/shop` },
              { "@type": "ListItem", position: 3, name: product.name },
            ],
          },
        ]}
      />

      {/* Notify-me modal */}
      {notifyOpen && (
        <NotifyMeModal product={product} size={selectedSize} onClose={() => setNotifyOpen(false)} />
      )}
      {/* Size quiz */}
      <SizeQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onResult={(s) => setSelectedSize(s)}
      />

      {/* Sticky mobile add-to-bag */}
      <StickyAddToBag
        product={product}
        selectedSize={selectedSize}
        added={added}
        onAdd={handleAddToBag}
      />

      {/* Breadcrumb */}
      <div style={{ paddingBlock: "16px", paddingInline: "clamp(20px, 4vw, 64px)", maxWidth: "1600px", margin: "0 auto", borderBottom: "1px solid rgba(26,25,22,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          <Link href="/shop" className="ink-link" style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--ink-mute)" }}>
            <ChevronLeft size={12} strokeWidth={1.5} /> Shop
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <Link href="/shop" style={{ color: "var(--ink-mute)" }}>{product.family}</Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </div>
      </div>

      {/* Main PDP layout */}
      <div ref={mainRef} className="pdp-grid" style={{ maxWidth: "1600px", margin: "0 auto", paddingBlock: "clamp(24px, 3vw, 40px) clamp(48px, 6vw, 80px)", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        {/* Gallery */}
        <div className="pdp-gallery">
          <div className="pdp-thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`pdp-thumb ${activeImg === i ? "active" : ""}`}
                aria-label={`View image ${i + 1}`}
                data-cursor="hover"
              >
                <Picture image={img} aspect="4/5" sizes="64px" alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
          <div
            className="pdp-main"
            onMouseMove={onMouseMove}
            onClick={() => setZoomed((v) => !v)}
            data-cursor="hover"
            role="button"
            tabIndex={0}
            aria-label="Click to toggle zoom"
            style={{ position: "relative" }}
          >
            <Picture
              key={activeImg}
              image={mainImg}
              priority
              aspect="4/5"
              sizes="(min-width: 1024px) 60vw, 100vw"
              alt={product.alt}
              imgClassName={`zoom-target ${zoomed ? "is-zoomed" : ""}`}
            />
            {/* Heart toggle floating in top-right */}
            <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 3 }}>
              <HeartToggle slug={product.slug} productName={product.name} size="md" variant="filled" />
            </div>
          </div>
        </div>

        {/* Details */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 2vw, 18px)", paddingTop: "clamp(0px, 1vw, 16px)" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
              {product.family} · {product.sku}
            </p>
            <h1 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.05 }}>
              {product.name}
            </h1>
            <a href="#reviews" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px", textDecoration: "none", color: "inherit" }}>
              <StarRating rating={summary.avg} size={13} />
              <span style={{ fontSize: "12px", color: "var(--ink-mute)" }}>
                {summary.avg.toFixed(1)} · {summary.count.toLocaleString("en-IN")} reviews
              </span>
            </a>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: product.colorHex, border: "1px solid rgba(26,25,22,0.2)" }} />
                <span style={{ fontSize: "12px", letterSpacing: "0.06em", color: "var(--ink-mute)" }}>{product.color}</span>
              </div>
              <p style={{ fontSize: "20px", color: "var(--ink)", fontFamily: "var(--sans)" }}>{format(product.price)}</p>
            </div>
          </div>

          <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.7 }}>{product.description}</p>

          {/* Variant swatches */}
          {variants.length > 0 && (
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
                Also in this style
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[product, ...variants].map((v) => (
                  <Link
                    key={v.id}
                    href={`/product/${v.slug}`}
                    className={`material-swatch ${v.id === product.id ? "selected" : ""}`}
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundImage: `url(${imageSrc(v, 0, 480)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    data-cursor="hover"
                    aria-label={v.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Size</p>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setQuizOpen(true)}
                  className="ink-link"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "11px", letterSpacing: "0.10em", color: "var(--ink)", fontFamily: "var(--sans)" }}
                >
                  Find her fit →
                </button>
                <Link href="/sizing" className="ink-link" style={{ fontSize: "11px", letterSpacing: "0.10em", color: "var(--ink-mute)" }}>
                  Size guide
                </Link>
              </div>
            </div>
            <div className="pdp-sizes" style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "6px" }}>
              {product.sizes.map((s) => {
                const stockEntry = stock.find((x) => x.size === s);
                const oos = stockEntry?.stock === 0;
                const low = !oos && (stockEntry?.stock ?? 99) <= 3;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`size-swatch ${selectedSize === s ? "selected" : ""} ${oos ? "oos" : ""}`}
                    style={{
                      width: "100%",
                      padding: "10px 4px",
                      height: "auto",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                      position: "relative",
                    }}
                    title={oos ? `${s} — out of stock` : low ? `${s} — only ${stockEntry?.stock} left` : `${s}`}
                  >
                    {s.replace(" Yrs", "")}
                    {low && !oos && <span style={{ position: "absolute", top: "-3px", right: "-3px", width: "8px", height: "8px", borderRadius: "50%", background: "#C53030" }} />}
                  </button>
                );
              })}
            </div>
            {selectedSize && selectedStock && (
              <p style={{ fontSize: "12px", color: selectedStock.stock === 0 ? "#993a3a" : selectedStock.stock <= 3 ? "#993a3a" : "var(--ink-mute)", marginTop: "10px" }}>
                {selectedStock.stock === 0
                  ? "Out of stock — tap below to be notified."
                  : selectedStock.stock <= 3
                  ? `Only ${selectedStock.stock} left in ${selectedSize.replace(" Yrs", "")}`
                  : `In stock · ships from Surat`}
              </p>
            )}
          </div>

          {/* Quantity + Add */}
          <div style={{ display: "flex", gap: "12px", alignItems: "stretch" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(26,25,22,0.18)" }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" style={{ background: "none", border: "none", padding: "0 14px", cursor: "pointer", color: "var(--ink)", display: "flex", alignItems: "center", height: "100%" }}>
                <Minus size={14} strokeWidth={1.5} />
              </button>
              <span style={{ minWidth: "32px", textAlign: "center", fontSize: "14px", color: "var(--ink)" }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity" style={{ background: "none", border: "none", padding: "0 14px", cursor: "pointer", color: "var(--ink)", display: "flex", alignItems: "center", height: "100%" }}>
                <Plus size={14} strokeWidth={1.5} />
              </button>
            </div>
            <button
              onClick={handleAddToBag}
              className="btn btn-primary"
              style={{ flex: 1, padding: "14px 20px", background: added ? "var(--sage)" : "var(--ink)" }}
            >
              {added
                ? <><Check size={14} strokeWidth={1.5} /> Added</>
                : !selectedSize
                ? "Select a size"
                : selectedStock?.stock === 0
                ? "Notify me"
                : `Add to bag · ${format(product.price * quantity)}`}
            </button>
          </div>

          {/* Promises strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", paddingTop: "12px", borderTop: "1px solid rgba(26,25,22,0.10)" }}>
            {[
              { icon: Truck, t: "Free delivery", s: "Across India · 3–5 days" },
              { icon: Wrench, t: "Mended for life", s: "Free repairs always" },
              { icon: Repeat, t: "30-day exchange", s: "Free returns" },
              { icon: ShieldCheck, t: "Secure checkout", s: "UPI · Cards · COD" },
            ].map((p) => (
              <div key={p.t} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <p.icon size={16} strokeWidth={1.4} style={{ color: "var(--ink)", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "14px", color: "var(--ink)", lineHeight: 1.2 }}>{p.t}</p>
                  <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "2px" }}>{p.s}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fabric breakdown */}
          <FabricBreakdown product={product} />

          {/* Care icons */}
          <CareIcons />

          {/* Accordions */}
          <div style={{ borderTop: "1px solid rgba(26,25,22,0.10)", marginTop: "8px" }}>
            {[
              { key: "details" as const, title: "Details", body: (
                <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0 }}>
                  <li>Premium Cotton-Lycra blend — soft, stretchy, skin-friendly</li>
                  <li>Signature adjustable waistband for years of fit</li>
                  <li>5-pocket construction · zip fly + button closure</li>
                  <li>Made in Surat, India by Generations Clothing LLP</li>
                  <li>Inseam: appropriate to age range; cuffed silhouette</li>
                </ul>
              )},
              { key: "story" as const, title: "The story", body: (
                <p style={{ lineHeight: 1.7 }}>
                  Soft on the skin. Fierce in fit. Designed for the chapters between sandbox and stage,
                  this {product.cut.toLowerCase()} silhouette pairs the {product.color.toLowerCase()} wash with our
                  Cotton-Lycra stretch — built to keep up with her energy from morning to bedtime.
                </p>
              )},
              { key: "shipping" as const, title: "Shipping & returns", body: (
                <p style={{ lineHeight: 1.7 }}>
                  Free delivery across India on every order. Standard delivery 3–5 working days
                  from Surat. Returns and exchanges are free within 30 days. Mending is free, for
                  the life of the garment.
                </p>
              )},
            ].map(({ key, title, body }) => (
              <div key={key} style={{ borderBottom: "1px solid rgba(26,25,22,0.10)" }}>
                <button
                  onClick={() => setOpenSection(openSection === key ? null : key)}
                  aria-expanded={openSection === key}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    fontFamily: "var(--sans)",
                  }}
                >
                  {title}
                  <span style={{ fontSize: "16px" }}>{openSection === key ? "−" : "+"}</span>
                </button>
                <div
                  style={{
                    maxHeight: openSection === key ? "640px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.5s var(--ease-out)",
                    fontSize: "14px",
                    color: "var(--ink-mute)",
                    paddingBottom: openSection === key ? "16px" : "0",
                  }}
                >
                  {body}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* "Complete the look" */}
      {completeTheLook.length > 0 && (
        <section style={{ background: "var(--paper-warm)", paddingBlock: "clamp(48px, 7vw, 100px)" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "clamp(24px, 3vw, 40px)" }}>
              <div>
                <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
                  Complete the look
                </p>
                <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 56px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                  Three pieces, one wardrobe.
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.10em", color: "var(--ink-faint)", textDecoration: "line-through" }}>
                  {format(completeTotal)}
                </p>
                <p style={{ fontSize: "20px", color: "var(--ink)", fontFamily: "var(--sans)" }}>
                  Bundle: {format(completeBundlePrice)}
                  <span style={{ fontSize: "10px", letterSpacing: "0.10em", color: "var(--sage)", marginInlineStart: "8px", textTransform: "uppercase" }}>Save 8%</span>
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(12px, 1.6vw, 24px)" }}>
              {completeTheLook.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} showRating={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <ReviewsBlock product={product} />

      {/* Q&A */}
      <QABlock />

      {/* Recently viewed */}
      <RecentlyViewedRail excludeSlug={product.slug} />

      {/* Related */}
      {related.length > 0 && (
        <section style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 8vw, 120px)" }}>
          <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
              You may also like
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 56px)", color: "var(--ink)", marginBottom: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.02em" }}>
              More in {product.family}.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "clamp(12px, 1.6vw, 24px)" }}>
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky bar pads bottom */}
      <div style={{ height: "100px" }} className="pdp-mobile-pad" aria-hidden="true" />

      <style>{`
        .zoom-target { transition: transform 0.6s var(--ease-out); }
        .zoom-target.is-zoomed { transform: scale(2); }
        .pdp-main:hover .zoom-target:not(.is-zoomed) { transform: scale(1.02); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        .size-shake .pdp-sizes { animation: shake 0.5s; }
        @media (min-width: 768px) { .pdp-mobile-pad { display: none; } }
      `}</style>
    </main>
  );
}
