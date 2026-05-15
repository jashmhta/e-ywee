import { useMemo, useState } from "react";
import { StarRating } from "@/components/atoms/StarRating";
import { getRatingSummary, getReviewsFor } from "@/data/reviews";
import { useScrollReveal } from "@/hooks/useGsap";
import { ThumbsUp } from "lucide-react";
import { imageSrc, type Product, PRODUCTS } from "@/data/store";

interface ReviewsBlockProps {
  product: Product;
}

export function ReviewsBlock({ product }: ReviewsBlockProps) {
  const summary = useMemo(() => getRatingSummary(product.slug), [product.slug]);
  const all = useMemo(() => getReviewsFor(product.slug, 8), [product.slug]);
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? all : all.slice(0, 4);
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".rv", stagger: 0.06 });

  // Build a histogram from the 8 sampled reviews — for visual variety we
  // adjust slightly by rating distribution from the seed.
  const dist = [5, 4, 3, 2, 1].map((r) => {
    const c = all.filter((x) => x.rating === r).length;
    const pct = (c / all.length) * 100;
    return { rating: r, pct };
  });

  // Pick 3 photo stand-ins from the actual product imagery + 2 similar products
  const photoSources = [
    product,
    ...PRODUCTS.filter((p) => p.family === product.family && p.id !== product.id).slice(0, 3),
  ];

  return (
    <section
      ref={ref}
      id="reviews"
      style={{ background: "var(--paper-warm)", paddingBlock: "clamp(56px, 8vw, 120px)" }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
            Real reviews · Verified buyers
          </p>
          <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 4vw, 64px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            What parents are saying.
          </h2>
        </div>

        <div className="rv-summary">
          {/* Big rating column */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(56px, 7vw, 96px)", lineHeight: 1, color: "var(--ink)", letterSpacing: "-0.03em" }}>
                {summary.avg.toFixed(1)}
              </span>
              <div>
                <StarRating rating={summary.avg} size={18} />
                <p style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "4px" }}>
                  {summary.count.toLocaleString("en-IN")} reviews
                </p>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--ink-mute)", lineHeight: 1.5, maxWidth: "320px" }}>
              Reviews from verified buyers across India. We never edit, hide, or pay for them.
            </p>
          </div>

          {/* Histogram */}
          <div className="rv-histogram">
            {dist.map((d) => (
              <div key={d.rating} className="rv-row">
                <span style={{ fontSize: "11px", color: "var(--ink-mute)", width: "44px" }}>{d.rating} ★</span>
                <span className="rv-bar"><span className="rv-bar-fill" style={{ width: `${d.pct}%` }} /></span>
                <span style={{ fontSize: "11px", color: "var(--ink-faint)", width: "40px", textAlign: "right" }}>{Math.round(d.pct)}%</span>
              </div>
            ))}
          </div>

          {/* Photo strip */}
          <div className="rv-photos">
            <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>Customer photos</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
              {photoSources.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ aspectRatio: "1/1", overflow: "hidden", background: "var(--paper-deep)" }}>
                  <img
                    src={imageSrc(p, (i + 1) % p.images.length, 480)}
                    alt={`Customer photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review cards */}
        <ul style={{ listStyle: "none", padding: 0, margin: "clamp(28px, 4vw, 48px) 0 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(12px, 2vw, 20px)" }}>
          {visible.map((r) => (
            <li key={r.id} className="rv" style={{ background: "var(--paper)", padding: "clamp(20px, 2vw, 28px)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div>
                  <StarRating rating={r.rating} size={12} />
                  <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "18px", color: "var(--ink)", marginTop: "8px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                    {r.title}
                  </p>
                </div>
                {r.verified && (
                  <span style={{ fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sage)", padding: "4px 8px", border: "1px solid var(--sage)", borderRadius: "12px", flexShrink: 0 }}>
                    ✓ Verified
                  </span>
                )}
              </div>
              <p style={{ fontSize: "14px", color: "var(--ink-soft)", lineHeight: 1.6 }}>
                {r.body}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--ink-faint)", letterSpacing: "0.06em", paddingTop: "8px", borderTop: "1px solid rgba(26,25,22,0.08)" }}>
                <span>{r.name} · {r.city} · Size {r.size.replace(" Yrs", "")}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <ThumbsUp size={10} strokeWidth={1.5} /> {r.helpful}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {!expanded && all.length > 4 && (
          <div style={{ textAlign: "center", marginTop: "clamp(20px, 3vw, 32px)" }}>
            <button onClick={() => setExpanded(true)} className="btn btn-ghost">
              Show all {all.length} reviews
            </button>
          </div>
        )}
      </div>

      <style>{`
        .rv-summary {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(20px, 3vw, 36px);
          align-items: start;
        }
        @media (min-width: 768px) {
          .rv-summary { grid-template-columns: minmax(0, 220px) minmax(0, 1fr) minmax(0, 280px); }
        }
        .rv-histogram { display: flex; flex-direction: column; gap: 8px; }
        .rv-row { display: flex; align-items: center; gap: 10px; }
        .rv-bar { flex: 1; height: 4px; background: rgba(26,25,22,0.10); border-radius: 2px; overflow: hidden; }
        .rv-bar-fill { display: block; height: 100%; background: var(--ink); transition: width 0.6s var(--ease-out); }
      `}</style>
    </section>
  );
}
