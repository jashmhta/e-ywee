// Generate multi-size WebP variants from v2 JPGs.
// Output: client/public/products/<slug>/v2/<slug>_v2_<angle>_<W>.webp
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";

const ROOT = "/home/ubuntu/ecom/e-ywee/client/public/products";
const SIZES = [480, 800, 1200, 1600];
const QUALITY = 82;

const slugs = (await readdir(ROOT, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && existsSync(join(ROOT, d.name, "v2")))
  .map((d) => d.name);

console.log(`Processing ${slugs.length} slugs × 4 angles × ${SIZES.length} sizes = ${slugs.length * 4 * SIZES.length} WebP files`);

let written = 0, skipped = 0, errors = 0;
const promises = [];

for (const slug of slugs) {
  for (const angle of ["three_quarter", "back", "motif", "infographic"]) {
    const inPath = join(ROOT, slug, "v2", `${slug}_v2_${angle}.jpg`);
    if (!existsSync(inPath)) continue;
    for (const w of SIZES) {
      const outPath = join(ROOT, slug, "v2", `${slug}_v2_${angle}_${w}.webp`);
      if (existsSync(outPath) && statSync(outPath).size > 1000) {
        skipped++;
        continue;
      }
      promises.push(
        sharp(inPath)
          .resize(w, w, { fit: "cover", position: "center" })
          .webp({ quality: QUALITY })
          .toFile(outPath)
          .then(() => { written++; })
          .catch((e) => { errors++; console.error(`✗ ${slug}/${angle}@${w}: ${e.message}`); }),
      );
      // throttle to avoid spawning thousands of workers
      if (promises.length >= 16) {
        await Promise.all(promises.splice(0));
      }
    }
  }
}
await Promise.all(promises);
console.log(`Done: ${written} written, ${skipped} skipped, ${errors} errors`);
