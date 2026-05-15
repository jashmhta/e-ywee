import { Link } from "wouter";
import { LOOKBOOK, PRODUCTS_BY_SLUG, imageSrc, imageSrcSet } from "@/data/store";
import { useReveal } from "@/hooks/useReveal";
import { Meta } from "@/components/system/Meta";
import { MagneticButton } from "@/components/atoms/MagneticButton";

const HERO_PRODUCT_SLUG = "yw126-light-wash";

export default function Lookbook() {
  const heroProduct = PRODUCTS_BY_SLUG.get(HERO_PRODUCT_SLUG);

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta
        title="Lookbook · Resort 26"
        description="The Resort 26 lookbook from ywee. Editorial photography of premium girls' Cotton-Lycra stretch denim, made in Surat."
        canonicalPath="/lookbook"
        ogImage={heroProduct ? imageSrc(heroProduct, 1, 1200) : undefined}
      />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "min(80dvh, 720px)",
          background: "var(--ink)",
          color: "var(--paper)",
          overflow: "hidden",
        }}
      >
        {heroProduct && (
          <img
            src={imageSrc(heroProduct, 0, 2400)}
            srcSet={imageSrcSet(heroProduct, 0)}
            sizes="100vw"
            alt={heroProduct.alt}
            fetchPriority="high"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(26,25,22,0.55) 0%, rgba(26,25,22,0.25) 30%, rgba(26,25,22,0.25) 55%, rgba(26,25,22,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1600px",
            margin: "0 auto",
            paddingInline: "clamp(20px, 4vw, 64px)",
            paddingBlock: "clamp(96px, 16vw, 200px) clamp(48px, 6vw, 80px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            minHeight: "min(80dvh, 720px)",
          }}
        >
          <p className="fade-rise" style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(244,239,230,0.75)", marginBottom: "16px" }}>
            Lookbook · Resort 26
          </p>
          <h1
            className="hero-headline fade-rise d1"
            style={{
              color: "var(--paper)",
              maxWidth: "1100px",
            }}
          >
            From the<br />
            <span style={{ fontStyle: "italic" }}>sandbox</span> to the <span className="upr">stage.</span>
          </h1>
          <div className="fade-rise d3" style={{ marginTop: "32px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <MagneticButton as={Link} href="/shop" className="btn btn-cream" style={{ background: "var(--paper)", color: "var(--ink)" }}>
              Shop the looks
            </MagneticButton>
            <Link href="/atelier" className="btn btn-ghost" style={{ borderColor: "rgba(244,239,230,0.4)", color: "var(--paper)" }}>
              Visit the atelier
            </Link>
          </div>
        </div>
      </section>

      {/* ── Editorial Slides ───────────────────────────────── */}
      <Slides />

      {/* ── Closing campaign ──────────────────────────────── */}
      <Closing />
    </main>
  );
}

// ── Slides ─────────────────────────────────────────────────────────────
function Slides() {
  // Group entries into chapters
  const byChapter: Record<string, typeof LOOKBOOK> = {};
  LOOKBOOK.forEach((e) => {
    const ch = e.eyebrow ?? "Chapter";
    if (!byChapter[ch]) byChapter[ch] = [];
    byChapter[ch].push(e);
  });
  return (
    <>
      {Object.entries(byChapter).map(([chapter, entries], chIdx) => (
        <section
          key={chapter}
          style={{
            background: chIdx % 2 === 0 ? "var(--paper)" : "var(--paper-warm)",
            paddingBlock: "clamp(56px, 9vw, 140px)",
          }}
        >
          <div
            style={{
              maxWidth: "1600px",
              margin: "0 auto",
              paddingInline: "clamp(20px, 4vw, 64px)",
            }}
          >
            <ChapterHeader chapter={chapter} idx={chIdx} />
            <ChapterGrid entries={entries} />
          </div>
        </section>
      ))}
    </>
  );
}

function ChapterHeader({ chapter, idx }: { chapter: string; idx: number }) {
  const titles = [
    "Light, leaning into the day.",
    "Black, owns every room.",
    "Made in Surat. Worn everywhere.",
    "Indigo, depth and structure.",
    "Onyx, structured silhouettes.",
  ];
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "clamp(28px, 4vw, 56px)",
      }}
    >
      <div>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
          {chapter}
        </p>
        <h2 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px, 5vw, 80px)", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
          {titles[idx % titles.length]}
        </h2>
      </div>
    </div>
  );
}

function ChapterGrid({ entries }: { entries: typeof LOOKBOOK }) {
  // Build a grid where 'tall' takes 1 column × 2 rows, 'wide' takes 2 col × 1 row, 'square' takes 1 × 1
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "clamp(12px, 2vw, 24px)",
      }}
    >
      {entries.map((entry, i) => {
        const product = PRODUCTS_BY_SLUG.get(entry.productSlug);
        if (!product) return null;
        const { aspect } = entry;
        const aspectStyle: React.CSSProperties =
          aspect === "tall"
            ? { aspectRatio: "3/4", gridRow: "auto" }
            : aspect === "wide"
            ? { aspectRatio: "4/3", gridColumn: "span 2" }
            : { aspectRatio: "1/1" };
        return (
          <SlideCard
            key={entry.id}
            entry={entry}
            product={product}
            index={i}
            aspectStyle={aspectStyle}
          />
        );
      })}
    </div>
  );
}

function SlideCard({
  entry,
  product,
  index,
  aspectStyle,
}: {
  entry: (typeof LOOKBOOK)[number];
  product: ReturnType<typeof PRODUCTS_BY_SLUG.get> & {};
  index: number;
  aspectStyle: React.CSSProperties;
}) {
  const ref = useReveal<HTMLDivElement>({ delayMs: (index % 4) * 80 });
  return (
    <Link
      href={`/product/${product.slug}`}
      data-cursor="hover"
      style={{ textDecoration: "none", color: "inherit", display: "block", minWidth: 0 }}
    >
      <div
        ref={ref}
        className="lift-card"
        style={{
          ...aspectStyle,
          position: "relative",
          overflow: "hidden",
          background: "var(--paper-warm)",
          borderRadius: "2px",
        }}
      >
        <img
          src={imageSrc(product, entry.imageIdx, 1200)}
          srcSet={imageSrcSet(product, entry.imageIdx)}
          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
          alt={entry.caption}
          loading="eager"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 1.4s var(--ease-out)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.0)")}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(26,25,22,0.30) 0%, rgba(26,25,22,0.0) 28%, rgba(26,25,22,0.0) 50%, rgba(26,25,22,0.88) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "clamp(16px, 2.4vw, 28px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "var(--paper)",
          }}
        >
          <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.95, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
            {entry.eyebrow}
          </p>
          <div>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2.8vw, 36px)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "6px", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
              {entry.caption}
            </p>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.92, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {product.name} · ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Closing band ────────────────────────────────────────────────────────
function Closing() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section
      ref={ref}
      style={{ background: "var(--ink)", color: "var(--paper)", paddingBlock: "clamp(72px, 12vw, 200px)", textAlign: "center" }}
    >
      <div style={{ maxWidth: "920px", margin: "0 auto", paddingInline: "clamp(20px, 4vw, 64px)" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.20em", textTransform: "uppercase", opacity: 0.7, marginBottom: "16px" }}>
          Resort 26 · January 2026
        </p>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(36px, 7vw, 110px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            marginBottom: "clamp(24px, 4vw, 48px)",
          }}
        >
          Considered.<br />Made for play.<br />Built to stay.
        </h2>
        <MagneticButton
          as={Link}
          href="/shop"
          className="btn btn-cream"
          style={{ background: "var(--paper)", color: "var(--ink)" }}
        >
          Shop Resort 26
        </MagneticButton>
      </div>
    </section>
  );
}
