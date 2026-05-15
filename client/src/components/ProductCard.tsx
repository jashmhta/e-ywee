import { useState } from "react";
import { Link } from "wouter";
import type { Product } from "@/data/store";
import { Picture } from "./atoms/Picture";
import { useBag } from "@/contexts/BagContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";
import { HeartToggle } from "./atoms/HeartToggle";
import { StarRating } from "./atoms/StarRating";
import { getRatingSummary, getStockFor } from "@/data/reviews";

interface ProductCardProps {
  product: Product;
  /** index in the rendered grid — drives stagger delay */
  index?: number;
  /** size of card; "sm" = compact rail card */
  size?: "default" | "sm" | "lg";
  /** show second-image swap on hover (default true) */
  swapOnHover?: boolean;
  /** show inline quick-add button on hover (default true) */
  quickAdd?: boolean;
  /** show heart toggle (default true) */
  showHeart?: boolean;
  /** show star rating row (default true) */
  showRating?: boolean;
  priority?: boolean;
}

export function ProductCard({
  product,
  index = 0,
  size = "default",
  swapOnHover = true,
  quickAdd = true,
  showHeart = true,
  showRating = true,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useBag();
  const { format } = useCurrency();
  const [showSizes, setShowSizes] = useState(false);
  const primary = product.images[0];
  const secondary = product.images[1] ?? primary;

  const rating = getRatingSummary(product.slug);
  const stock = getStockFor(product.slug, product.sizes);
  const lowStock = stock.find((s) => s.stock > 0 && s.stock <= 3);
  const fewLeft = lowStock ? `Only ${lowStock.stock} left in ${lowStock.size.replace(" Yrs", "")}` : null;

  function handleQuickAdd(sizeLabel: string) {
    const stockEntry = stock.find((s) => s.size === sizeLabel);
    if (stockEntry && stockEntry.stock === 0) {
      toast.error("Out of stock — try Notify Me on the product page");
      return;
    }
    addItem(product, sizeLabel);
    setShowSizes(false);
    toast.success("Added to bag", {
      description: `${product.name} · ${sizeLabel}`,
    });
  }

  const sizesClass = size === "sm" ? "is-sm" : size === "lg" ? "is-lg" : "";
  const aspect = size === "sm" ? "3/4" : "4/5";

  return (
    <article
      className={`pcard fade-rise ${sizesClass}`}
      style={{
        animationDelay: `${(index % 8) * 50}ms`,
        position: "relative",
      }}
    >
      {/* Heart toggle — outside the link so it doesn't navigate */}
      {showHeart && (
        <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 3 }}>
          <HeartToggle slug={product.slug} productName={product.name} size="sm" />
        </div>
      )}

      <Link href={`/product/${product.slug}`} aria-label={product.name}>
        <div className="pcard-imgwrap" style={{ aspectRatio: aspect }}>
          {primary ? (
            <Picture
              image={primary}
              priority={priority}
              imgClassName="pcard-img is-first"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
              aspect={aspect}
              alt={product.alt}
            />
          ) : null}
          {swapOnHover && secondary && secondary !== primary ? (
            <Picture
              image={secondary}
              imgClassName="pcard-img is-second"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
              aspect={aspect}
              alt={product.alt}
            />
          ) : null}

          {/* Low stock badge */}
          {fewLeft && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "rgba(255,255,255,0.94)",
                backdropFilter: "blur(8px)",
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#993a3a",
                padding: "5px 9px",
                fontFamily: "var(--sans)",
                fontWeight: 500,
              }}
            >
              {fewLeft}
            </div>
          )}

          {quickAdd ? (
            <button
              type="button"
              className="pcard-quickadd"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSizes((v) => !v);
              }}
              aria-haspopup="menu"
              aria-expanded={showSizes}
            >
              {showSizes ? "Pick a size" : "Quick add"}
            </button>
          ) : null}

          {showSizes ? (
            <div
              role="menu"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                left: 12,
                right: 12,
                bottom: 12,
                background: "rgba(244,239,230,0.96)",
                backdropFilter: "blur(10px)",
                padding: "10px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "4px",
              }}
            >
              {product.sizes.slice(0, 8).map((s) => {
                const stockEntry = stock.find((x) => x.size === s);
                const oos = stockEntry?.stock === 0;
                return (
                  <button
                    key={s}
                    role="menuitem"
                    className={`pill-tab ${oos ? "oos" : ""}`}
                    style={{ padding: "8px 4px", fontSize: "10px", opacity: oos ? 0.4 : 1, textDecoration: oos ? "line-through" : "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickAdd(s);
                    }}
                  >
                    {s.replace(" Yrs", "")}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="pcard-meta">
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="pcard-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {product.name}
            </p>
            <p className="pcard-color">{product.color}</p>
            {showRating && (
              <div style={{ marginTop: "6px" }}>
                <StarRating rating={rating.avg} size={11} count={rating.count} showValue />
              </div>
            )}
          </div>
          <p className="pcard-price">{format(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
