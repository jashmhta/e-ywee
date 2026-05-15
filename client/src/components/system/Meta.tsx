import { useEffect } from "react";

interface MetaProps {
  title?: string;
  description?: string;
  /** Absolute path or full URL for OG image */
  ogImage?: string;
  /** "product" | "article" | "website" — defaults to website */
  ogType?: "website" | "article" | "product";
  /** JSON-LD structured data object(s) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  canonicalPath?: string;
}

const SITE = "ywee — Considered Clothing";
const DEFAULT_DESC =
  "Premium Cotton-Lycra stretch denim for girls aged 1 to 14. Adjustable waistband, free delivery across India. Made in Surat.";
const DEFAULT_OG = "/products/yw005-light-wash/0-1200.webp";

function setMeta(name: string, value: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

const JSONLD_ID = "ywee-jsonld";

export function Meta({
  title,
  description = DEFAULT_DESC,
  ogImage = DEFAULT_OG,
  ogType = "website",
  jsonLd,
  canonicalPath,
}: MetaProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE}` : SITE;
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", "ywee", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    if (canonicalPath) setLink("canonical", canonicalPath);

    // JSON-LD
    let s = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!s) {
        s = document.createElement("script");
        s.type = "application/ld+json";
        s.id = JSONLD_ID;
        document.head.appendChild(s);
      }
      s.textContent = JSON.stringify(jsonLd);
    } else if (s) {
      s.remove();
    }
  }, [title, description, ogImage, ogType, JSON.stringify(jsonLd), canonicalPath]);

  return null;
}
