import { useState } from "react";
import { useParams, Link } from "wouter";
import { PRODUCTS } from "@/data/store";
import { useBag } from "@/contexts/BagContext";
import { ChevronLeft, Plus, Minus, Check } from "lucide-react";

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find(p => p.slug === slug);
  const { addItem } = useBag();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <main style={{ minHeight: "60dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "24px", fontStyle: "italic", color: "var(--ink-mute)" }}>
          Piece not found.
        </p>
        <Link href="/shop" style={{ fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", textDecoration: "underline" }}>
          Return to Shop
        </Link>
      </main>
    );
  }

  const images = [product.imgPortrait, product.imgLandscape, product.img];
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          padding: "16px clamp(20px, 4vw, 48px)",
          borderBottom: "1px solid rgba(26,25,22,0.06)",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink-faint)" }}>
          <Link href="/shop" style={{ display: "flex", alignItems: "center", gap: "4px", transition: "color 0.22s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-faint)")}
          >
            <ChevronLeft size={12} strokeWidth={1.5} />
            Shop
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "var(--ink-mute)" }}>{product.category}</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </div>
      </div>

      {/* Product Layout */}
      <div className="product-detail-grid" style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(24px, 4vw, 48px) clamp(20px, 4vw, 48px)" }}>
        {/* Image Gallery */}
        <div>
          {/* Main image */}
          <div
            style={{
              aspectRatio: "3/4",
              overflow: "hidden",
              background: "var(--paper-warm)",
              marginBottom: "12px",
            }}
          >
            <img
              src={images[activeImg]}
              alt={product.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }}
            />
          </div>

          {/* Thumbnails */}
          <div className="product-thumbs" style={{ display: "flex", gap: "8px" }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: "64px",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  border: `1px solid ${activeImg === i ? "var(--ink)" : "rgba(26,25,22,0.12)"}`,
                  cursor: "pointer",
                  padding: 0,
                  background: "none",
                  transition: "border-color 0.22s",
                  flexShrink: 0,
                }}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ position: "sticky", top: "80px" }}>
          {/* Category + SKU */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
              {product.category}
            </span>
            <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--ink-faint)", fontFamily: "var(--mono)" }}>
              {product.sku}
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "-0.025em",
              color: "var(--ink)",
              lineHeight: 1.05,
              marginBottom: "8px",
            }}
          >
            {product.name}
          </h1>

          {/* Color + Price */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
            <span style={{ fontSize: "13px", color: "var(--ink-mute)" }}>
              {product.color}
            </span>
            <span style={{ fontSize: "20px", fontWeight: 400, color: "var(--ink)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: "15px", color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: "28px" }}>
            {product.description}
          </p>

          {/* Size Selection */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "11.5px", letterSpacing: "0.10em", textTransform: "uppercase", color: sizeError ? "#8B1A1A" : "var(--ink-mute)" }}>
                {sizeError ? "Please select a size" : "Size"}
              </span>
              <Link
                href="/sizing"
                style={{ fontSize: "11.5px", letterSpacing: "0.06em", color: "var(--ink-faint)", textDecoration: "underline", transition: "color 0.22s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-faint)")}
              >
                Size Guide
              </Link>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    background: selectedSize === size ? "var(--ink)" : "transparent",
                    color: selectedSize === size ? "var(--paper)" : "var(--ink)",
                    border: `1px solid ${sizeError ? "rgba(139,26,26,0.4)" : selectedSize === size ? "var(--ink)" : "rgba(26,25,22,0.18)"}`,
                    cursor: "pointer",
                    transition: "all 0.22s",
                    fontFamily: "var(--sans)",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "11.5px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
              Qty
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(26,25,22,0.15)",
              }}
            >
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ink-mute)",
                }}
              >
                <Minus size={12} strokeWidth={1.5} />
              </button>
              <span style={{ width: "36px", textAlign: "center", fontSize: "14px" }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ink-mute)",
                }}
              >
                <Plus size={12} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Add to Bag */}
          <button
            onClick={handleAddToBag}
            style={{
              width: "100%",
              padding: "16px",
              background: added ? "var(--sage)" : "var(--ink)",
              color: "var(--paper)",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              transition: "background 0.4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            {added ? (
              <><Check size={14} strokeWidth={2} /> Added to Bag</>
            ) : (
              "Add to Bag"
            )}
          </button>

          {/* Details accordion */}
          <div style={{ borderTop: "1px solid rgba(26,25,22,0.10)", marginTop: "32px" }}>
            <DetailsSection title="Details">
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {product.details.map((d, i) => (
                  <li key={i} style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                    <span style={{ color: "var(--ink-faint)", flexShrink: 0 }}>—</span>
                    {d}
                  </li>
                ))}
              </ul>
            </DetailsSection>
            <DetailsSection title="Story">
              <p style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.7 }}>{product.story}</p>
            </DetailsSection>
            <DetailsSection title="Care">
              <p style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.7 }}>
                We recommend following the care instructions on the label. All ywee pieces are eligible for our{" "}
                <Link href="/mending" style={{ textDecoration: "underline", color: "var(--ink)" }}>lifetime mending program</Link>.
              </p>
            </DetailsSection>
            <DetailsSection title="Shipping & Returns">
              <p style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.7 }}>
                Free delivery across India on orders over ₹999. Returns accepted within 14 days of delivery.{" "}
                <Link href="/shipping" style={{ textDecoration: "underline", color: "var(--ink)" }}>Full shipping details →</Link>
              </p>
            </DetailsSection>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 48px)",
            borderTop: "1px solid rgba(26,25,22,0.08)",
          }}
        >
          <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
            You May Also Like
          </p>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(22px, 2.8vw, 36px)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: "clamp(20px, 3vw, 36px)",
            }}
          >
            More in {product.category}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "clamp(16px, 2vw, 24px)",
            }}
          >
            {related.map(p => (
              <Link key={p.id} href={`/product/${p.slug}`}>
                <div className="product-img-wrap" style={{ aspectRatio: "3/4", background: "var(--paper-warm)", marginBottom: "12px", overflow: "hidden" }}>
                  <img src={p.imgPortrait} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: "15px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "4px" }}>
                  {p.name}
                </p>
                <p style={{ fontSize: "13px", color: "var(--ink-faint)" }}>₹{p.price.toLocaleString("en-IN")}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function DetailsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(26,25,22,0.10)" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--sans)",
          fontSize: "12px",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        {title}
        <span
          style={{
            fontSize: "18px",
            color: "var(--ink-faint)",
            transition: "transform 0.3s",
            transform: open ? "rotate(45deg)" : "none",
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: "20px" }}>
          {children}
        </div>
      )}
    </div>
  );
}
