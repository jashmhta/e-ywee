import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import type { ProductImage } from "@/data/products.generated";

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes"> {
  image: ProductImage;
  /** Responsive sizes attribute (e.g. "(min-width: 1024px) 33vw, 50vw") */
  sizes?: string;
  /** preload eagerly (above-the-fold) */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** outer wrapper aspect ratio – defaults to 4/5 */
  aspect?: string;
}

/**
 * Responsive product image with blur-up placeholder.
 * Renders a wrapper with the blur dataUrl as background; the real image
 * fades in once `onLoad` fires.
 */
export function Picture({
  image,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
  imgClassName,
  aspect = "4/5",
  alt = "",
  ...rest
}: PictureProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  const srcSet = image.sizes.map((s) => `${s.src} ${s.w}w`).join(", ");
  // Default `src` = mid-size for non-srcset fallback
  const fallback = image.sizes.find((s) => s.w === 1200) ?? image.sizes[image.sizes.length - 1];

  return (
    <div
      className={`blur-img ${loaded ? "loaded" : ""} ${className ?? ""}`}
      style={{
        aspectRatio: aspect,
        backgroundImage: `url(${image.blurDataUrl})`,
      }}
    >
      <img
        ref={ref}
        src={fallback.src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={imgClassName}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        {...rest}
      />
    </div>
  );
}
