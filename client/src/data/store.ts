// ywee — Data store
// Re-exports auto-generated product data + curated brand content (collections,
// lookbook, journal). Run `node scripts/build-products.mjs` to regenerate
// `products.generated.ts` after editing source images.

export type { Product, ProductImage } from "./products.generated";
import {
  PRODUCTS as RAW_PRODUCTS,
  PRODUCTS_BY_SLUG,
  PRODUCT_FAMILIES,
  PRODUCT_COLORS,
  PRODUCT_PATTERNS,
} from "./products.generated";
import type { Product } from "./products.generated";

export const PRODUCTS: Product[] = RAW_PRODUCTS;
export { PRODUCTS_BY_SLUG, PRODUCT_FAMILIES, PRODUCT_COLORS, PRODUCT_PATTERNS };

// ─── Helpers ────────────────────────────────────────────────────────────
export function imageSrc(p: Product, idx = 0, w = 1200): string {
  const img = p.images[idx] ?? p.images[0];
  if (!img) return "/products/placeholder.webp";
  const exact = img.sizes.find((s) => s.w === w);
  return (exact ?? img.sizes[Math.floor(img.sizes.length / 2)]).src;
}
export function imageSrcSet(p: Product, idx = 0): string {
  const img = p.images[idx] ?? p.images[0];
  if (!img) return "";
  return img.sizes.map((s) => `${s.src} ${s.w}w`).join(", ");
}

// ─── Collections (derived) ──────────────────────────────────────────────

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  count: number;
  season: string;
  family: string;            // family code used to filter PRODUCTS
  cover: string;             // cover image src (1600w)
  coverBlur: string;         // blur placeholder
  hex: string;
}

function buildCollection(
  slug: string,
  name: string,
  tagline: string,
  family: string,
  season: string,
  hex: string,
): Collection {
  const matches = PRODUCTS.filter((p) => p.family === family);
  const cover = matches[0];
  return {
    slug,
    name,
    tagline,
    family,
    count: matches.length,
    season,
    hex,
    cover: cover ? imageSrc(cover, 0, 1600) : "",
    coverBlur: cover?.images[0]?.blurDataUrl ?? "",
  };
}

export const COLLECTIONS: Collection[] = [
  buildCollection(
    "light-wash",
    "Light Wash",
    "Pebble, sky and pearl tones — soft, breezy denim for sunlit afternoons and weekend stories.",
    "Light Wash",
    "Resort 26",
    "#A8C8E8",
  ),
  buildCollection(
    "dark-indigo",
    "Dark Indigo",
    "Twilight, midnight and royal washes — depth and structure that goes with absolutely everything.",
    "Dark Indigo",
    "Year-Round",
    "#1E3A6A",
  ),
  buildCollection(
    "embellished",
    "Embellished",
    "Heirloom embroidery, crystals and bloom prints — denim treated like couture.",
    "Embellished",
    "New Arrivals",
    "#3A4A6E",
  ),
  buildCollection(
    "black",
    "Onyx Black",
    "Jet, carbon and onyx black — high-rise stretch denim for the room she's about to own.",
    "Black",
    "Spring 2026",
    "#1A1A1A",
  ),
];

// ─── Lookbook ───────────────────────────────────────────────────────────
// Curated using real product photography. Mixes square, portrait and
// landscape aspect ratios for editorial variety.

export interface LookbookEntry {
  id: number;
  productSlug: string;
  imageIdx: number;
  /** "tall" | "wide" | "square" — drives layout */
  aspect: "tall" | "wide" | "square";
  /** caption for the slide */
  caption: string;
  eyebrow?: string;
}

// Pick 18 standout pieces across families for an editorial mix
function lookbookFor(slug: string, idx: number, aspect: LookbookEntry["aspect"], eyebrow: string, caption: string, id: number): LookbookEntry {
  return { id, productSlug: slug, imageIdx: idx, aspect, eyebrow, caption };
}

export const LOOKBOOK: LookbookEntry[] = [
  lookbookFor("yw005-light-wash", 0, "tall",   "Chapter 01", "She owns every day.", 1),
  lookbookFor("yw037-rinse-wash", 1, "wide",   "Chapter 01", "Light blue. Heavy heart? Never.", 2),
  lookbookFor("yw081-onyx-black", 0, "square", "Chapter 02", "Dark for the bold ones.", 3),
  lookbookFor("yw123-embroidered", 0, "tall", "Chapter 02", "Heirloom embroidery, kid-proof construction.", 4),
  lookbookFor("yw028-light-wash", 1, "wide",   "Chapter 02", "Cotton-Lycra. Stretch for every adventure.", 5),
  lookbookFor("yw124-light-wash", 0, "square", "Chapter 03", "School days, her way.", 6),
  lookbookFor("yw126-light-wash", 0, "tall",   "Chapter 03", "From the sandbox to the stage.", 7),
  lookbookFor("yw131-light-wash", 1, "wide",   "Chapter 03", "Free delivery across India.", 8),
  lookbookFor("yw188-dark-indigo", 0, "square", "Chapter 04", "Dark indigo for the explorers.", 9),
  lookbookFor("yw023-light-wash", 0, "tall",   "Chapter 04", "Made in Surat. Worn everywhere.", 10),
  lookbookFor("yw073-dark-indigo", 0, "wide",   "Chapter 04", "Adjustable waistband. She grows. It grows.", 11),
  lookbookFor("yw236-onyx-black", 1, "square", "Chapter 05", "Onyx black for the room she'll own.", 12),
];

// ─── Journal ────────────────────────────────────────────────────────────

export interface JournalArticle {
  slug: string;
  title: string;
  deck: string;
  category: string;
  read: string;
  cover: string;
  coverBlur: string;
  alt: string;
  body?: string;
}

const journalCovers = {
  growsWithHer: "yw126-light-wash",
  fabric:       "yw073-dark-indigo",
  styleGuide:   "yw123-embroidered",
};

function articleCover(slug: string) {
  const p = PRODUCTS.find((pr) => pr.slug === slug);
  if (!p) return { cover: "", blur: "" };
  return {
    cover: imageSrc(p, 1, 1200),
    blur: p.images[1]?.blurDataUrl ?? "",
  };
}

export const JOURNAL: JournalArticle[] = [
  {
    slug: "denim-that-grows-with-her",
    title: "Denim That Grows With Her",
    deck: "Why we built the adjustable waistband — and how one small detail changes everything about kids' clothing.",
    category: "Brand Story",
    read: "4 min read",
    cover: articleCover(journalCovers.growsWithHer).cover,
    coverBlur: articleCover(journalCovers.growsWithHer).blur,
    alt: "YWEE light wash stretch denim — 'denim that grows with her' editorial.",
    body: `There is a problem every parent knows: kids grow fast. A pair of jeans that fits perfectly in September is too small by December. The waistband digs in. The length is wrong. You buy new ones.\n\nWe built YWEE to solve this. Our signature adjustable waistband is a simple idea — an internal elastic with button positions that can be moved as she grows. It sounds small. In practice, it means a pair of YWEE jeans can fit a child for two years instead of six months.\n\nThis is not just about saving money (though it does). It is about reducing waste. It is about the confidence that comes from wearing something that fits properly. And it is about the freedom to focus on what matters — her adventures, her creativity, her energy — without worrying about whether her jeans are keeping up.\n\nWe make stretch denim for girls aged 1 to 14. Every pair is crafted in premium Cotton-Lycra that moves as freely as she does. Every pair has our adjustable waistband. Every pair is priced under ₹1,800 and delivered free across India.\n\nFrom the sandbox to the stage. From toddler sass to tween class. Denim that grows with her.`,
  },
  {
    slug: "cotton-lycra-why-it-matters",
    title: "Why Cotton-Lycra Changes Everything",
    deck: "The fabric story behind YWEE's signature stretch — and why we chose comfort over convention.",
    category: "Material",
    read: "5 min read",
    cover: articleCover(journalCovers.fabric).cover,
    coverBlur: articleCover(journalCovers.fabric).blur,
    alt: "YWEE Cotton-Lycra stretch denim — fabric story.",
    body: `Traditional denim is stiff. It is designed for durability, not movement. For adults, this can be a feature — the structure of a raw denim jean is part of its appeal. For a child who is running, jumping, climbing, and sitting cross-legged on a classroom floor, stiff denim is a problem.\n\nCotton-Lycra changes this. The Lycra (elastane) content — typically 2–5% in our fabric — gives the denim a four-way stretch that moves with the body. The cotton component keeps it breathable, soft against the skin, and durable through hundreds of washes.\n\nWe spent months testing fabrics before settling on our current blend. The criteria were simple: it had to feel soft from the first wear, it had to stretch without losing its shape, and it had to look like proper denim — not leggings pretending to be jeans.\n\nThe result is a fabric that parents trust and kids love. Soft on the skin. Fierce in fit. That is the YWEE promise.`,
  },
  {
    slug: "style-guide-ages-1-to-14",
    title: "YWEE Style Guide: Ages 1 to 14",
    deck: "How to style YWEE denim at every age — from toddler pull-ons to tween statement pieces.",
    category: "Style",
    read: "6 min read",
    cover: articleCover(journalCovers.styleGuide).cover,
    coverBlur: articleCover(journalCovers.styleGuide).blur,
    alt: "YWEE embroidered jeans — style guide editorial.",
    body: `YWEE makes denim for girls aged 1 to 14. That is a wide range — and the styling possibilities are just as wide.\n\n**Ages 1–4 — The Toddler Years.** For our youngest customers, we recommend our pull-on styles with the adjustable waistband set to its most relaxed position. Pair with a bright t-shirt and soft-soled shoes. The Cotton-Lycra stretch makes nappy changes easy and playground adventures effortless.\n\n**Ages 5–8 — The Explorer Years.** This is the age of bold colours and statement washes. Our Light Wash and Dark Indigo silhouettes are bestsellers in this age group. Pair with a graphic tee and colourful sneakers. The adjustable waistband means the same pair can last through a full school year.\n\n**Ages 9–12 — The Style Years.** As she develops her own sense of style, our Embellished line — with crystal and bloom embroidery — gives her something to express herself with. Pair with a plain white or black top to let the denim do the talking.\n\n**Ages 13–14 — The Tween Years.** Our Onyx Black silhouettes are popular with our oldest customers. High-rise fit, structured silhouette, and the same Cotton-Lycra comfort she has grown up with. Pair with a crop top or oversized hoodie.\n\nAt every age, the YWEE adjustable waistband means the fit is always right. From toddler sass to tween class — she owns it in YWEE.`,
  },
];

// ─── Hero & brand imagery ──────────────────────────────────────────────
// Hero campaigns reuse existing AI brand photography from /public/images.

export const HERO_POSTER = "/images/ywee-hero-heroimage.jpg";
export const BRAND_IMAGES = {
  heroMain:        "/images/ywee-hero-indian-girl_14126918.jpg",
  heroGroup:       "/images/ywee-hero-2-girls_58816b6d.jpg",
  collectionHero:  "/images/ywee-collection-hero_0b2ed6cf.jpg",
  lookbookHero:    "/images/ywee-lookbook-hero_56f56321.jpg",
  atelierBrand:    "/images/ywee-atelier-brand_a219e26f.jpg",
  atelierFabric:   "/images/ywee-atelier-fabric_92303576.jpg",
  lookbookSchool:  "/images/ywee-lookbook-school_24960550.jpg",
  journalCare:     "/images/ywee-journal-denim-care_3f2a9b2d.jpg",
  journalStyle:    "/images/ywee-journal-style-guide_fe19142c.jpg",
  journalSchool:   "/images/ywee-journal-back-to-school_8cad1efb.jpg",
};

export const CATEGORIES = ["All", "Light Wash", "Dark Indigo", "Embellished", "Black"] as const;
export type Category = (typeof CATEGORIES)[number];
