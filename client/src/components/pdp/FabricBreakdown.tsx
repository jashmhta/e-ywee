import type { Product } from "@/data/store";

interface Composition {
  cotton: number;
  lycra: number;
  other?: number;
}

function compositionFor(product: Product): Composition {
  // Embellished pieces: 95/5
  if (product.family === "Embellished") return { cotton: 95, lycra: 5 };
  // Black: 96/4
  if (product.family === "Black") return { cotton: 96, lycra: 4 };
  return { cotton: 98, lycra: 2 };
}

export function FabricBreakdown({ product }: { product: Product }) {
  const c = compositionFor(product);
  return (
    <div style={{ background: "var(--paper-soft)", padding: "clamp(20px, 2.5vw, 32px)", borderRadius: "2px" }}>
      <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
        Fabric breakdown
      </p>
      <div style={{ display: "flex", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
        <div
          aria-label={`${c.cotton}% cotton`}
          style={{ width: `${c.cotton}%`, background: "var(--ink)" }}
        />
        <div
          aria-label={`${c.lycra}% lycra`}
          style={{ width: `${c.lycra}%`, background: "var(--sage)" }}
        />
      </div>
      <div style={{ display: "flex", gap: "16px", fontSize: "12px", flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
          {c.cotton}% Cotton
          <span style={{ color: "var(--ink-faint)" }}>· breathable, soft</span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--sage)", display: "inline-block" }} />
          {c.lycra}% Lycra
          <span style={{ color: "var(--ink-faint)" }}>· four-way stretch</span>
        </span>
      </div>
    </div>
  );
}
