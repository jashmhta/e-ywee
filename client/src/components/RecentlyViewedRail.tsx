import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { PRODUCTS_BY_SLUG } from "@/data/store";
import { ProductCard } from "./ProductCard";
import { Slider, Slide } from "./atoms/Slider";

export function RecentlyViewedRail({ excludeSlug }: { excludeSlug?: string } = {}) {
  const { items } = useRecentlyViewed();
  const products = items
    .filter((s) => s !== excludeSlug)
    .map((s) => PRODUCTS_BY_SLUG.get(s))
    .filter(Boolean) as ReturnType<typeof PRODUCTS_BY_SLUG.get>[] & {};

  if (products.length < 3) return null;
  return (
    <section style={{ background: "var(--paper)", paddingBlock: "clamp(48px, 7vw, 100px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(24px, 3vw, 36px)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
            Recently viewed
          </p>
          <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            Pieces you've considered.
          </h2>
        </div>
        <Slider options={{ align: "start", containScroll: "trimSnaps", dragFree: true }} ariaLabel="Recently viewed">
          {products.map((p, i) => (
            <Slide key={p!.id} basis="clamp(200px, 28vw, 280px)">
              <div style={{ paddingInlineEnd: "clamp(12px, 2vw, 24px)" }}>
                <ProductCard product={p!} index={i} size="sm" showRating={false} />
              </div>
            </Slide>
          ))}
        </Slider>
      </div>
    </section>
  );
}
