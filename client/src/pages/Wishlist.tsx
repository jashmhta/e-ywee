import { Link } from "wouter";
import { useWishlist } from "@/contexts/WishlistContext";
import { PRODUCTS_BY_SLUG } from "@/data/store";
import { ProductCard } from "@/components/ProductCard";
import { Meta } from "@/components/system/Meta";

export default function Wishlist() {
  const { items, clear } = useWishlist();
  const products = items
    .map((s) => PRODUCTS_BY_SLUG.get(s))
    .filter(Boolean) as ReturnType<typeof PRODUCTS_BY_SLUG.get>[] & {};

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta title="Saved" description="Your saved pieces — pieces she'd love to wear next." canonicalPath="/wishlist" />

      <section
        style={{
          paddingBlock: "clamp(40px, 6vw, 80px) clamp(24px, 4vw, 40px)",
          paddingInline: "clamp(20px, 4vw, 64px)",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
          Saved · {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(40px, 7vw, 96px)", lineHeight: 0.92, letterSpacing: "-0.04em", color: "var(--ink)" }}>
            Your saved pieces.
          </h1>
          {products.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all saved pieces?")) clear();
              }}
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                color: "var(--ink-mute)",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                fontFamily: "var(--sans)",
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      {products.length === 0 ? (
        <section
          style={{
            paddingBlock: "clamp(40px, 6vw, 100px)",
            paddingInline: "clamp(20px, 4vw, 64px)",
            textAlign: "center",
            maxWidth: "640px",
            margin: "0 auto",
          }}
        >
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--ink-mute)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "20px" }}>
            Nothing saved — yet.
          </p>
          <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: "24px" }}>
            Tap the heart on any piece you'd like to come back to. Your saved list works across browsers and is private to you.
          </p>
          <Link href="/shop" className="btn btn-primary">Shop the collection</Link>
        </section>
      ) : (
        <section style={{ paddingBlock: "0 clamp(56px, 9vw, 120px)", paddingInline: "clamp(20px, 4vw, 64px)", maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "clamp(28px, 4vw, 56px) clamp(12px, 1.6vw, 24px)" }}>
            {products.map((p, i) => (
              <ProductCard key={p!.id} product={p!} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
