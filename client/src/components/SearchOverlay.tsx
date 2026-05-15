import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Search, X } from "lucide-react";
import { PRODUCTS, COLLECTIONS, imageSrc } from "@/data/store";
import { useCurrency } from "@/contexts/CurrencyContext";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { label: "New arrivals", href: "/shop?sort=newest" },
  { label: "Embellished line", href: "/shop/embellished" },
  { label: "Onyx black", href: "/shop/black" },
  { label: "Light wash", href: "/shop/light-wash" },
  { label: "Dark indigo", href: "/shop/dark-indigo" },
  { label: "Size guide", href: "/sizing" },
  { label: "Mending", href: "/mending" },
  { label: "Free shipping", href: "/shipping" },
];

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { format } = useCurrency();

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as typeof PRODUCTS;
    const tokens = q.split(/\s+/);
    return PRODUCTS
      .map((p) => {
        const haystack = [p.name, p.color, p.family, p.cut, p.style, p.sku].join(" ").toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (haystack.includes(t)) score += 1;
          if (p.name.toLowerCase().startsWith(t)) score += 2;
          if (p.color.toLowerCase().includes(t)) score += 1;
        }
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.p);
  }, [query]);

  const matchingCollections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as typeof COLLECTIONS;
    return COLLECTIONS.filter((c) => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)).slice(0, 3);
  }, [query]);

  if (!open) return null;
  return (
    <>
      <div className="search-overlay" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Search ywee" className="search-panel">
        {/* Search input */}
        <div className="search-input-row">
          <Search size={20} strokeWidth={1.4} aria-hidden="true" style={{ flexShrink: 0, color: "var(--ink-mute)" }} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search styles, washes, embellishments…"
            aria-label="Search products"
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "clamp(20px, 2.4vw, 28px)",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--ink)",
              padding: "8px 0",
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-faint)",
              padding: "8px",
              display: "inline-flex",
            }}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="search-body">
          {!query.trim() ? (
            <SearchEmpty />
          ) : results.length === 0 ? (
            <p style={{ padding: "32px 0", color: "var(--ink-mute)", textAlign: "center", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "20px" }}>
              No matches for "{query}". Try light wash, indigo, embellished, onyx.
            </p>
          ) : (
            <>
              {matchingCollections.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p className="search-eyebrow">Collections</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {matchingCollections.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/shop/${c.slug}`}
                        onClick={onClose}
                        className="pill-tab"
                      >
                        {c.name} ({c.count})
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <p className="search-eyebrow">{results.length} {results.length === 1 ? "piece" : "pieces"}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr", gap: "8px" }} className="search-results">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="search-result"
                    >
                      <img
                        src={imageSrc(p, 0, 480)}
                        alt={p.alt}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "60px", height: "76px", objectFit: "cover", flexShrink: 0, background: "var(--paper-warm)" }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>
                          {p.family}
                        </p>
                        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "16px", color: "var(--ink)", letterSpacing: "-0.01em", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--ink-mute)" }}>
                          {p.color} · {format(p.price)}
                        </p>
                      </div>
                      <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", flexShrink: 0 }}>
                        Open →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <style>{`
        .search-overlay {
          position: fixed; inset: 0;
          background: rgba(26,25,22,0.4);
          backdrop-filter: blur(6px);
          z-index: 70;
          animation: fadeIn 0.3s var(--ease-out);
        }
        .search-panel {
          position: fixed;
          top: 0; left: 0; right: 0;
          background: var(--paper);
          z-index: 71;
          max-height: 90dvh;
          display: flex;
          flex-direction: column;
          animation: searchIn 0.4s var(--ease-out);
          box-shadow: 0 16px 60px rgba(26,25,22,0.18);
        }
        @keyframes searchIn { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .search-input-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: clamp(20px, 3vw, 32px) clamp(20px, 4vw, 64px);
          border-bottom: 1px solid rgba(26,25,22,0.10);
        }
        .search-body {
          padding: clamp(16px, 3vw, 28px) clamp(20px, 4vw, 64px) clamp(28px, 4vw, 48px);
          overflow-y: auto;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        .search-eyebrow {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 12px;
        }
        .search-result {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px 12px;
          background: var(--paper-warm);
          text-decoration: none;
          color: inherit;
          transition: background 0.22s var(--ease-out), transform 0.22s var(--ease-out);
        }
        .search-result:hover {
          background: var(--paper-deep);
          transform: translateX(2px);
        }
      `}</style>
    </>
  );
}

function SearchEmpty() {
  return (
    <div>
      <p className="search-eyebrow">Quick links</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
        {QUICK_LINKS.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="pill-tab"
          >
            {q.label}
          </Link>
        ))}
      </div>
      <p className="search-eyebrow">Top searches</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: "20px", color: "var(--ink-mute)", display: "flex", flexWrap: "wrap", gap: "16px 24px" }}>
        {["Pebble Wash", "Atelier", "Onyx", "9–10 yrs", "Free shipping"].map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
