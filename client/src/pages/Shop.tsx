import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearch } from "wouter";
import { PRODUCTS_PUBLIC as PRODUCTS, COLLECTIONS } from "@/data/store";
import { ProductCard } from "@/components/ProductCard";
import { Meta } from "@/components/system/Meta";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

interface Filters {
  family: string | null;        // matches Product.family
  size: string | null;          // matches an item in Product.sizes
  priceMax: number | null;
  hasEmbroidery: boolean;
}

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  newest: "Newest first",
  "price-asc": "Price · Low to high",
  "price-desc": "Price · High to low",
};

const FAMILIES = ["All", ...COLLECTIONS.map((c) => c.name)];
const SIZE_FACETS = ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"];

const FAMILY_ROUTE_TO_NAME: Record<string, string> = {
  "light-wash": "Light Wash",
  "dark-indigo": "Dark Indigo",
  "embellished": "Embellished",
  "black": "Black",
};

export default function Shop() {
  const params = useParams<{ family?: string }>();
  const search = useSearch();

  const initialFamily = params.family ? FAMILY_ROUTE_TO_NAME[params.family] ?? null : null;
  const [filters, setFilters] = useState<Filters>({
    family: initialFamily,
    size: null,
    priceMax: null,
    hasEmbroidery: false,
  });
  const [sort, setSort] = useState<SortKey>("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync filter family on route change
  useEffect(() => {
    setFilters((f) => ({ ...f, family: initialFamily }));
  }, [initialFamily]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();
    if (filters.family) list = list.filter((p) => p.family === filters.family);
    if (filters.size) list = list.filter((p) => p.sizes.includes(filters.size!));
    if (filters.priceMax) list = list.filter((p) => p.price <= filters.priceMax!);
    if (filters.hasEmbroidery) list = list.filter((p) => p.family === "Embellished");

    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest":     list.sort((a, b) => b.pNum - a.pNum); break;
      default: /* featured: keep original order */ break;
    }
    return list;
  }, [filters, sort]);

  const familyName = filters.family ?? "All pieces";
  const totalText = `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`;

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <Meta
        title={`Shop · ${familyName}`}
        description={`Premium Cotton-Lycra stretch denim — ${familyName.toLowerCase()}. Adjustable waistband, free delivery across India.`}
        canonicalPath={params.family ? `/shop/${params.family}` : "/shop"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `ywee · ${familyName}`,
          description: "Premium Cotton-Lycra stretch denim for girls aged 1 to 14.",
        }}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(32px, 5vw, 56px) clamp(16px, 3vw, 32px)",
          paddingInline: "clamp(20px, 4vw, 64px)",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
          {filters.family ? "Collection" : "All pieces"}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(40px, 7vw, 96px)", lineHeight: 0.9, letterSpacing: "-0.04em", color: "var(--ink)" }}>
            {familyName}.
          </h1>
          <p style={{ fontSize: "13px", color: "var(--ink-mute)", letterSpacing: "0.08em" }}>{totalText}</p>
        </div>
      </section>

      {/* ── Filter / Sort bar ──────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: "60px",
          background: "color-mix(in oklab, var(--paper) 90%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 30,
          borderBlock: "1px solid rgba(26,25,22,0.08)",
          paddingBlock: "12px",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            paddingInline: "clamp(20px, 4vw, 64px)",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "8px", overflow: "auto", flex: 1, scrollbarWidth: "none" }} className="filter-pills">
            {FAMILIES.map((fam) => (
              <button
                key={fam}
                onClick={() =>
                  setFilters((f) => ({ ...f, family: fam === "All" ? null : fam }))
                }
                className={`pill-tab ${(filters.family ?? "All") === fam ? "active" : ""}`}
                data-cursor="hover"
              >
                {fam}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="pill-tab"
              data-cursor="hover"
              aria-expanded={filterOpen}
            >
              Filters {(filters.size || filters.priceMax || filters.hasEmbroidery) ? "(•)" : ""}
            </button>
            <select
              aria-label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={{
                fontSize: "11px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                fontFamily: "var(--sans)",
                padding: "7px 10px",
                border: "1px solid rgba(26,25,22,0.18)",
                background: "var(--paper)",
                color: "var(--ink)",
                cursor: "pointer",
              }}
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>{SORT_LABELS[k]}</option>
              ))}
            </select>
          </div>
        </div>

        {filterOpen && (
          <div
            style={{
              maxWidth: "1600px",
              margin: "12px auto 0",
              paddingInline: "clamp(20px, 4vw, 64px)",
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              borderTop: "1px solid rgba(26,25,22,0.08)",
              paddingTop: "16px",
            }}
          >
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>Size</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {SIZE_FACETS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilters((f) => ({ ...f, size: f.size === s ? null : s }))}
                    className={`pill-tab ${filters.size === s ? "active" : ""}`}
                  >
                    {s.replace(" Yrs", "")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>Price (max)</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[1499, 1799].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters((f) => ({ ...f, priceMax: f.priceMax === p ? null : p }))}
                    className={`pill-tab ${filters.priceMax === p ? "active" : ""}`}
                  >
                    Under ₹{p.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "10px" }}>Special</p>
              <button
                onClick={() => setFilters((f) => ({ ...f, hasEmbroidery: !f.hasEmbroidery }))}
                className={`pill-tab ${filters.hasEmbroidery ? "active" : ""}`}
              >
                Embellished only
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={() => setFilters({ family: null, size: null, priceMax: null, hasEmbroidery: false })}
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  color: "var(--ink-mute)",
                  cursor: "pointer",
                  padding: "8px 0",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: "clamp(24px, 4vw, 56px) clamp(56px, 9vw, 120px)",
          paddingInline: "clamp(20px, 4vw, 64px)",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingBlock: "120px" }}>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "32px", color: "var(--ink-mute)", marginBottom: "16px" }}>
              No pieces match those filters.
            </p>
            <button
              onClick={() => setFilters({ family: null, size: null, priceMax: null, hasEmbroidery: false })}
              className="btn btn-ghost"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "clamp(28px, 4vw, 56px) clamp(12px, 1.6vw, 24px)",
            }}
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} priority={i < 4} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        .filter-pills { -ms-overflow-style: none; scrollbar-width: none; }
        .filter-pills::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
