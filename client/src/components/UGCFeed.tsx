import { Link } from "wouter";
import { Instagram } from "lucide-react";
import { PRODUCTS, imageSrc } from "@/data/store";
import { useScrollReveal } from "@/hooks/useGsap";

const HANDLES = [
  "@aanya.styles", "@theriya.diaries", "@littlelola.in",
  "@miniwithmummy", "@thelittlefroks", "@anika.in.denim",
  "@petitstars.india", "@bhindrastories",
];

const CAPTIONS = [
  "Off to school in the bunny pebble wash 🐰",
  "Birthday twirl in the Bloom Atelier 💐",
  "Sandbox days, jet onyx jeans ✨",
  "Studio rinse for our weekend brunch ☕",
  "Heart on her sleeve, Y² on her hip 💛",
  "First sleepover. Pebble wash, of course 🌙",
  "Soft denim, fierce fit ⚡",
  "Indigo for indigo days 💙",
];

export function UGCFeed() {
  const ref = useScrollReveal<HTMLElement>({ childSelector: ".ugc-tile", stagger: 0.06 });

  // 8 deterministic photos from the catalog
  const tiles = [
    PRODUCTS.find((p) => p.slug === "yw126-light-wash"),
    PRODUCTS.find((p) => p.slug === "yw081-onyx-black"),
    PRODUCTS.find((p) => p.slug === "yw037-rinse-wash"),
    PRODUCTS.find((p) => p.slug === "yw123-embroidered"),
    PRODUCTS.find((p) => p.slug === "yw131-light-wash"),
    PRODUCTS.find((p) => p.slug === "yw073-dark-indigo"),
    PRODUCTS.find((p) => p.slug === "yw188-dark-indigo"),
    PRODUCTS.find((p) => p.slug === "yw236-onyx-black"),
  ].filter(Boolean) as typeof PRODUCTS;

  return (
    <section ref={ref} style={{ background: "var(--paper)", paddingBlock: "clamp(56px, 9vw, 140px)" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "clamp(28px, 4vw, 48px)" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>
              #YweeOnTheirOwn
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              From their<br />Instagram, ours.
            </h2>
          </div>
          <a
            href="https://instagram.com/ywee.in"
            target="_blank"
            rel="noopener noreferrer"
            className="ink-link"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}
          >
            <Instagram size={14} strokeWidth={1.5} />
            Follow @ywee.in
          </a>
        </div>

        <div className="ugc-grid">
          {tiles.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              data-cursor="hover"
              className="ugc-tile"
              style={{
                position: "relative",
                aspectRatio: "1/1",
                overflow: "hidden",
                background: "var(--paper-warm)",
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <img
                src={imageSrc(p, (i % p.images.length))}
                alt={CAPTIONS[i % CAPTIONS.length]}
                loading={i < 4 ? "eager" : "lazy"}
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.9s var(--ease-out)" }}
              />
              <div className="ugc-overlay">
                <span className="ugc-handle">{HANDLES[i % HANDLES.length]}</span>
                <p className="ugc-caption">{CAPTIONS[i % CAPTIONS.length]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .ugc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(8px, 1.4vw, 16px);
        }
        @media (min-width: 640px) { .ugc-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1024px) { .ugc-grid { grid-template-columns: repeat(8, 1fr); } }
        .ugc-tile:hover img { transform: scale(1.05); }
        .ugc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(26,25,22,0.45) 70%, rgba(26,25,22,0.92) 100%);
          padding: clamp(10px, 1.6vw, 16px);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: var(--paper);
          opacity: 0;
          transition: opacity 0.36s var(--ease-out);
        }
        .ugc-tile:hover .ugc-overlay,
        .ugc-tile:focus-within .ugc-overlay {
          opacity: 1;
        }
        @media (hover: none), (pointer: coarse) {
          .ugc-overlay { opacity: 1; }
        }
        .ugc-handle {
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.95;
          margin-bottom: 4px;
          font-family: var(--sans);
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }
        .ugc-caption {
          font-family: var(--serif);
          font-style: italic;
          font-size: clamp(12px, 1.4vw, 14px);
          line-height: 1.3;
          font-weight: 300;
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
        }
      `}</style>
    </section>
  );
}
