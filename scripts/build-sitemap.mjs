#!/usr/bin/env node
// Build a sitemap.xml from the product manifest + static routes.
import fs from "node:fs/promises";
import path from "node:path";

const MANIFEST = "client/public/products/manifest.json";
const OUT = "client/public/sitemap.xml";
const SITE = process.env.SITE_URL || "https://ywee.in";

const STATIC_ROUTES = [
  { path: "/",        changefreq: "weekly",  priority: 1.0 },
  { path: "/shop",    changefreq: "daily",   priority: 0.9 },
  { path: "/lookbook", changefreq: "monthly", priority: 0.8 },
  { path: "/atelier", changefreq: "monthly", priority: 0.7 },
  { path: "/journal", changefreq: "monthly", priority: 0.7 },
  { path: "/sizing",  changefreq: "yearly",  priority: 0.5 },
  { path: "/care",    changefreq: "yearly",  priority: 0.5 },
  { path: "/shipping",changefreq: "yearly",  priority: 0.5 },
  { path: "/contact", changefreq: "yearly",  priority: 0.5 },
  { path: "/mending", changefreq: "yearly",  priority: 0.5 },
  { path: "/stockists", changefreq: "monthly", priority: 0.5 },
  { path: "/press",   changefreq: "monthly", priority: 0.4 },
  { path: "/privacy", changefreq: "yearly",  priority: 0.3 },
  { path: "/terms",   changefreq: "yearly",  priority: 0.3 },
  { path: "/cookies", changefreq: "yearly",  priority: 0.3 },
];

const COLLECTIONS = ["light-wash", "dark-indigo", "embellished", "black"];

const JOURNAL_SLUGS = [
  "denim-that-grows-with-her",
  "cotton-lycra-why-it-matters",
  "style-guide-ages-1-to-14",
];

const today = new Date().toISOString().slice(0, 10);

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  const productUrls = manifest.products.map((p) => ({
    path: `/product/${p.slug}`,
    changefreq: "weekly",
    priority: 0.8,
    lastmod: today,
  }));
  const collectionUrls = COLLECTIONS.map((slug) => ({
    path: `/shop/${slug}`,
    changefreq: "weekly",
    priority: 0.7,
    lastmod: today,
  }));
  const journalUrls = JOURNAL_SLUGS.map((slug) => ({
    path: `/journal/${slug}`,
    changefreq: "monthly",
    priority: 0.6,
    lastmod: today,
  }));

  const all = [...STATIC_ROUTES, ...collectionUrls, ...productUrls, ...journalUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (e) => `  <url>
    <loc>${SITE}${e.path}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  await fs.writeFile(OUT, xml);
  console.log(`Wrote ${OUT} (${all.length} URLs)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
