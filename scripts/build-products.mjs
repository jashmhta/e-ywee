#!/usr/bin/env node
// Build optimized product images + manifest from /home/ubuntu/ywee_assets
//
// Output layout:
//   client/public/products/<slug>/<n>-<W>.webp   (5 sizes per image)
//   client/public/products/<slug>/<n>.blur       (tiny base64 placeholder)
//   client/public/products/manifest.json         (machine-readable index)
//   client/src/data/products.generated.ts        (typed export for app)

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import os from "node:os";

const SOURCE_ROOT = "/home/ubuntu/ywee_assets/01. YWEE - PICTURES SORTED";
const PUBLIC_OUT = path.resolve("client/public/products");
const TS_OUT = path.resolve("client/src/data/products.generated.ts");
const MANIFEST_OUT = path.resolve("client/public/products/manifest.json");
const SIZES = [480, 800, 1200, 1600, 2400];
const QUALITY = 78;

// ─── Folder name parser ──────────────────────────────────────────────
const FOLDER_RE =
  /^YW\s+(?<num>\d+)[\s-]*(?<variant>D|L|R|B|C|emb|Black)?\s*(?<color>blue|Black)?\s*P(?<pnum>\d+)\s*$/i;

// Variant naming → marketing label, slug fragment, hex
const VARIANT_INFO = {
  // colorCode: { label, slug, hex, kind }
  "D-blue":  { label: "Dark Indigo",     slug: "dark-indigo",   hex: "#1E3A6A", kind: "wash" },
  "L-blue":  { label: "Light Wash",      slug: "light-wash",    hex: "#A8C8E8", kind: "wash" },
  "R-blue":  { label: "Rinse Wash",      slug: "rinse-wash",    hex: "#3D6CA0", kind: "wash" },
  "B-—":     { label: "Embellished B",   slug: "embellished-b", hex: "#3A4A6E", kind: "embellishment" },
  "C-—":     { label: "Embellished C",   slug: "embellished-c", hex: "#3A4A6E", kind: "embellishment" },
  "emb-—":   { label: "Embroidered",     slug: "embroidered",   hex: "#3A4A6E", kind: "embellishment" },
  "—-black": { label: "Onyx Black",      slug: "onyx-black",    hex: "#1A1A1A", kind: "wash" },
  "—-—":     { label: "Original",        slug: "original",      hex: "#A8C8E8", kind: "wash" },
};

function parseFolder(name) {
  const m = FOLDER_RE.exec(name);
  if (!m) return null;
  const g = m.groups;
  let variant = g.variant ?? null;
  let color = g.color ?? null;
  if (variant?.toLowerCase() === "black") {
    color = "Black";
    variant = null;
  }
  const variantKey = `${variant ?? "—"}-${(color ?? "—").toLowerCase()}`;
  const info = VARIANT_INFO[variantKey] ?? VARIANT_INFO["—-—"];
  const styleNum = parseInt(g.num, 10);
  return {
    folder: name,
    styleNum,
    style: `YW${String(styleNum).padStart(3, "0")}`,
    variantCode: variant,
    color,
    pNum: parseInt(g.pnum, 10),
    variantInfo: info,
    slug: `yw${String(styleNum).padStart(3, "0")}-${info.slug}`,
    sku: `YW${String(styleNum).padStart(3, "0")}-${info.slug.toUpperCase()}`,
  };
}

// ─── Worker pool for image processing ─────────────────────────────────
async function processImage(srcPath, slug, idx) {
  const outDir = path.join(PUBLIC_OUT, slug);
  await fs.mkdir(outDir, { recursive: true });

  // Read once, reuse for all sizes
  const buf = await fs.readFile(srcPath);
  const meta = await sharp(buf).metadata();
  const srcW = meta.width ?? 4000;
  const srcH = meta.height ?? 4000;

  const tasks = SIZES.map(async (w) => {
    if (w > srcW) w = srcW;
    const outPath = path.join(outDir, `${idx}-${w}.webp`);
    try {
      await fs.access(outPath);
      return { w, path: outPath, skipped: true };
    } catch {}
    await sharp(buf)
      .resize(w, w, { fit: "cover", position: "center" })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(outPath);
    return { w, path: outPath };
  });
  const results = await Promise.all(tasks);

  // Tiny blur placeholder (16px base64)
  const blurBuf = await sharp(buf)
    .resize(16, 16, { fit: "cover" })
    .webp({ quality: 50 })
    .toBuffer();
  const blurDataUrl = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  return {
    idx,
    width: srcW,
    height: srcH,
    sizes: results.map((r) => ({ w: r.w, src: `/products/${slug}/${idx}-${r.w}.webp` })),
    blurDataUrl,
  };
}

// Map style number → marketing copy. Uses style number as a stable seed so
// the same item always gets the same name across regenerations.
const CUT_LIBRARY = [
  "Slim",        // 0
  "Wide-Leg",    // 1
  "Flare",       // 2
  "Straight",    // 3
  "Tapered",     // 4
  "Bootcut",     // 5
  "Skinny",      // 6
  "Cropped",     // 7
  "Mom-Fit",     // 8
  "Carpenter",   // 9
];

const COLOR_NAMES = {
  light:  ["Pebble Wash", "Sky Wash", "Sand Wash", "Cloud Wash", "Mist Wash", "Pearl Wash"],
  dark:   ["Indigo", "Midnight Indigo", "Twilight Indigo", "Atlantic Indigo", "Cobalt Indigo", "Royal Indigo"],
  rinse:  ["Rinse Indigo", "Studio Rinse"],
  black:  ["Onyx", "Jet Black", "Carbon Black"],
  emb:    ["Bloom", "Crystal", "Garden", "Atelier", "Heirloom"],
};

function pickStable(arr, n) {
  return arr[n % arr.length];
}

function deriveProductCopy(meta) {
  const { variantInfo, color, styleNum } = meta;
  const variant = variantInfo.label.toLowerCase();
  const isDark  = variant.includes("dark")  || variant.includes("indigo") && !variant.includes("rinse");
  const isLight = variant.includes("light");
  const isRinse = variant.includes("rinse");
  const isEmb   = variantInfo.kind === "embellishment";
  const isBlack = color === "Black" || variant.includes("onyx");

  const cut = pickStable(CUT_LIBRARY, styleNum);
  let colorName, family, name;

  if (isEmb) {
    // Differentiate sister embellishment variants on the same style number
    // ("emb" embroidery, "B" bloom-print, "C" crystal-print) by mapping the
    // variant code to a unique colour name.
    const v = (variantInfo.label || "").toLowerCase();
    if (v.includes("embroider")) colorName = "Bloom";
    else if (v.includes("b") && variantInfo.slug.includes("-b")) colorName = "Crystal";
    else if (v.includes("c") && variantInfo.slug.includes("-c")) colorName = "Garden";
    else colorName = pickStable(COLOR_NAMES.emb, styleNum);
    family = "Embellished";
    name = `${colorName} Atelier Jeans`;
  } else if (isBlack) {
    colorName = pickStable(COLOR_NAMES.black, styleNum);
    family = "Black";
    name = `${colorName} ${cut} Jeans`;
  } else if (isLight) {
    colorName = pickStable(COLOR_NAMES.light, styleNum);
    family = "Light Wash";
    name = `${colorName} ${cut} Jeans`;
  } else if (isRinse) {
    colorName = pickStable(COLOR_NAMES.rinse, styleNum);
    family = "Rinse";
    name = `${colorName} ${cut} Jeans`;
  } else if (isDark) {
    colorName = pickStable(COLOR_NAMES.dark, styleNum);
    family = "Dark Indigo";
    name = `${colorName} ${cut} Jeans`;
  } else {
    // Fallback (e.g. YW04 with no variant code)
    colorName = pickStable(COLOR_NAMES.light, styleNum);
    family = "Light Wash";
    name = `${colorName} ${cut} Jeans`;
  }

  const description = isEmb
    ? `Hand-finished ${colorName.toLowerCase()} detailing on premium Cotton-Lycra stretch denim. ${cut} silhouette with the signature adjustable waistband — no compromise on fit, ever.`
    : isBlack
    ? `Deep ${colorName.toLowerCase()} in premium Cotton-Lycra stretch denim. ${cut} cut with the adjustable waistband, made in India by Generations Clothing.`
    : isLight
    ? `Soft, breezy ${colorName.toLowerCase()} in our premium Cotton-Lycra. ${cut} cut with adjustable waistband — the everyday pair she'll reach for first.`
    : isRinse
    ? `Crisp ${colorName.toLowerCase()} in premium Cotton-Lycra stretch denim. Clean ${cut.toLowerCase()} silhouette with the signature adjustable waistband.`
    : `Rich ${colorName.toLowerCase()} in our premium Cotton-Lycra blend. ${cut} fit with the adjustable waistband — built to keep up with her.`;

  return { name, colorCopy: colorName, family, cut, description };
}

const PRICE_TABLE = {
  embellishment: 1799,
  wash: 1499,
};

const SIZES_DEFAULT = ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"];

async function main() {
  console.log("→ Scanning source folder…");
  const entries = await fs.readdir(SOURCE_ROOT, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  await fs.mkdir(PUBLIC_OUT, { recursive: true });

  const products = [];
  let totalImages = 0;

  // Use limited concurrency — sharp uses libvips with worker threads internally.
  const concurrency = Math.max(1, Math.min(os.cpus().length, 6));
  console.log(`→ Processing ${folders.length} folders with concurrency ${concurrency}…`);

  let inFlight = 0;
  let queue = [...folders];
  let completed = 0;
  await new Promise((resolve) => {
    const next = async () => {
      if (queue.length === 0 && inFlight === 0) return resolve();
      while (inFlight < concurrency && queue.length > 0) {
        const folder = queue.shift();
        inFlight++;
        (async () => {
          try {
            const meta = parseFolder(folder);
            if (!meta) {
              console.warn(`  skip (unparseable): ${folder}`);
              return;
            }
            const fullDir = path.join(SOURCE_ROOT, folder);
            const files = (await fs.readdir(fullDir))
              .filter((f) => /\.(jpe?g)$/i.test(f))
              .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

            const images = [];
            for (let i = 0; i < files.length; i++) {
              const src = path.join(fullDir, files[i]);
              const img = await processImage(src, meta.slug, i);
              images.push(img);
              totalImages++;
            }

            const copy = deriveProductCopy(meta, 0);
            products.push({
              ...meta,
              ...copy,
              price: PRICE_TABLE[meta.variantInfo.kind] ?? 1499,
              currency: "INR",
              sizes: SIZES_DEFAULT,
              images,
              colorHex: meta.variantInfo.hex,
              alt: `YWEE ${copy.name} — girls' Cotton-Lycra stretch denim, ${copy.colorCopy.toLowerCase()}.`,
            });
            completed++;
            if (completed % 5 === 0 || completed === folders.length) {
              console.log(`  [${completed}/${folders.length}] ${meta.slug} (${images.length} imgs)`);
            }
          } catch (err) {
            console.error(`  fail: ${folder} — ${err.message}`);
          } finally {
            inFlight--;
            next();
          }
        })();
      }
    };
    next();
  });

  // Sort: pinned hero styles first, then by style number
  products.sort((a, b) => a.pNum - b.pNum);

  // Write manifest (compact for runtime)
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    totalImages,
    products: products.map((p) => ({
      id: p.pNum,
      sku: p.sku,
      slug: p.slug,
      style: p.style,
      pNum: p.pNum,
      name: p.name,
      family: p.family,
      cut: p.cut,
      color: p.colorCopy,
      colorHex: p.colorHex,
      pattern: p.variantInfo.kind === "embellishment" ? p.variantInfo.label : "Solid",
      price: p.price,
      currency: p.currency,
      sizes: p.sizes,
      description: p.description,
      alt: p.alt,
      images: p.images,
    })),
  };
  await fs.writeFile(MANIFEST_OUT, JSON.stringify(manifest, null, 2));

  // TS file (typed import for the app)
  const ts = `// AUTO-GENERATED — do not edit. Run \`node scripts/build-products.mjs\` to regenerate.
// ${manifest.totalProducts} products × ${manifest.totalImages} images, ${SIZES.length} sizes each.

export interface ProductImage {
  idx: number;
  width: number;
  height: number;
  blurDataUrl: string;
  sizes: { w: number; src: string }[];
}

export interface Product {
  id: number;
  sku: string;
  slug: string;
  style: string;
  pNum: number;
  name: string;
  family: string;
  cut: string;
  color: string;
  colorHex: string;
  pattern: string;
  price: number;
  currency: string;
  sizes: string[];
  description: string;
  alt: string;
  images: ProductImage[];
}

export const PRODUCTS: Product[] = ${JSON.stringify(manifest.products, null, 2)};

export const PRODUCTS_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));
export const PRODUCT_FAMILIES = Array.from(new Set(PRODUCTS.map((p) => p.family)));
export const PRODUCT_COLORS = Array.from(new Set(PRODUCTS.map((p) => p.color)));
export const PRODUCT_PATTERNS = Array.from(new Set(PRODUCTS.map((p) => p.pattern)));
`;
  await fs.mkdir(path.dirname(TS_OUT), { recursive: true });
  await fs.writeFile(TS_OUT, ts);

  console.log(`\n✓ Generated ${manifest.totalProducts} products with ${totalImages} source images`);
  console.log(`✓ Wrote ${MANIFEST_OUT}`);
  console.log(`✓ Wrote ${TS_OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
