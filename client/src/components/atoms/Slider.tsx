import { useCallback, type ReactNode, useEffect, useState } from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type EmblaOptionsType = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;

interface SliderProps {
  children: ReactNode;
  options?: EmblaOptionsType;
  /** Show prev/next buttons on desktop. Defaults to true. */
  showButtons?: boolean;
  /** Show dot pagination at bottom. Defaults to true. */
  showDots?: boolean;
  /** Optional aria label */
  ariaLabel?: string;
  className?: string;
}

/**
 * Lightweight Embla carousel wrapper with prev/next buttons and dots.
 * Default options: drag-free with momentum, contain alignment, slide skip.
 */
export function Slider({
  children,
  options = { align: "start", containScroll: "trimSnaps", dragFree: false, loop: false },
  showButtons = true,
  showDots = true,
  ariaLabel,
  className,
}: SliderProps) {
  const [emblaRef, embla] = useEmblaCarousel(options);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    setScrollSnaps(embla.scrollSnapList());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <div className={`embla-wrap ${className ?? ""}`} aria-label={ariaLabel} role="region">
      <div className="embla-viewport" ref={emblaRef} style={{ overflow: "hidden" }}>
        <div className="embla-container" style={{ display: "flex", touchAction: "pan-y pinch-zoom" }}>
          {children}
        </div>
      </div>

      {showButtons && (
        <div className="embla-buttons" style={{ display: "none" }}>
          <button
            type="button"
            className="embla-btn"
            onClick={() => embla?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous"
            data-cursor="hover"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="embla-btn"
            onClick={() => embla?.scrollNext()}
            disabled={!canNext}
            aria-label="Next"
            data-cursor="hover"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <div className="embla-dots" role="tablist">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`Slide ${i + 1}`}
              className={`embla-dot ${selected === i ? "is-selected" : ""}`}
              onClick={() => embla?.scrollTo(i)}
            />
          ))}
        </div>
      )}

      <style>{`
        .embla-wrap { position: relative; }
        .embla-container > * { flex: 0 0 auto; min-width: 0; }
        .embla-buttons {
          position: absolute; top: -56px; right: 0;
          gap: 8px; z-index: 5;
        }
        @media (min-width: 768px) {
          .embla-buttons { display: flex !important; }
        }
        .embla-btn {
          width: 40px; height: 40px;
          border: 1px solid rgba(26,25,22,0.18);
          background: var(--paper);
          color: var(--ink);
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.22s var(--ease-out);
          border-radius: 100px;
        }
        .embla-btn:hover:not(:disabled) {
          background: var(--ink); color: var(--paper); border-color: var(--ink);
          transform: scale(1.04);
        }
        .embla-btn:disabled { opacity: 0.32; cursor: not-allowed; }
        .embla-dots {
          display: flex; gap: 6px; justify-content: center;
          margin-top: clamp(20px, 3vw, 32px);
        }
        .embla-dot {
          width: 24px; height: 2px;
          border: none; padding: 0;
          background: rgba(26,25,22,0.18);
          cursor: pointer;
          transition: background 0.3s var(--ease-out);
        }
        .embla-dot.is-selected { background: var(--ink); }
      `}</style>
    </div>
  );
}

/** Simple slide wrapper to standardize slide widths */
export function Slide({ children, basis = "auto" }: { children: ReactNode; basis?: string }) {
  return (
    <div className="embla-slide" style={{ flex: `0 0 ${basis}`, minWidth: 0 }}>
      {children}
    </div>
  );
}
