/* ywee — lookbook page logic
   - render an asymmetric editorial bento of looks (12 looks)
*/
(function () {
  const D = window.YWEE;
  const { bindImageLoaders, bindReveals } = window.YWEEHelpers;

  const LAYOUT = [
    { cls: "span-7",  ar: "wide" },
    { cls: "span-5",  ar: "tall" },
    { cls: "span-4",  ar: "tall" },
    { cls: "span-4",  ar: "tall" },
    { cls: "span-4",  ar: "tall" },
    { cls: "span-6",  ar: "wide" },
    { cls: "span-6",  ar: "" },
    { cls: "span-3",  ar: "tall" },
    { cls: "span-5",  ar: "" },
    { cls: "span-4",  ar: "tall" },
    { cls: "span-7",  ar: "wide" },
    { cls: "span-5",  ar: "tall" },
  ];
  const TITLES = [
    ["Look 01", "The Verre · in Trafaria river light"],
    ["Look 02", "Halden Trench · the boat ramp"],
    ["Look 03", "Briar Roll Neck · early morning"],
    ["Look 04", "Otae Linen · in the workroom"],
    ["Look 05", "Mille Wide Trouser · stillness"],
    ["Look 06", "Solène Slip · against the wall"],
    ["Look 07", "Maon Cashmere · against silver"],
    ["Look 08", "Plage Poplin · the long lunch"],
    ["Look 09", "Lanai Pleated · returning home"],
    ["Look 10", "Brume Wrap · soft architecture"],
    ["Look 11", "Verre &amp; Halden · the ferry"],
    ["Look 12", "Studio 04 · Édition close"],
  ];

  function render() {
    const root = document.getElementById("lb-pieces");
    // Use the curated PRODUCT photos (which are all cohesive editorial fashion shots)
    // Mix in some lookbook photos as accents.
    const products = D.products.slice();
    // shuffle deterministically — use a stable order based on indices
    const order = [0, 5, 11, 17, 23, 29, 4, 10, 16, 22, 28, 1];
    const items = order.map((i) => products[i % products.length]);

    root.innerHTML = LAYOUT.map((l, i) => {
      const item = items[i] || products[i % products.length];
      const title = TITLES[i] || ["Look " + (i+1).toString().padStart(2,"0"), "Resort 26"];
      const portrait = !l.ar || l.ar === "tall" || l.ar === "square";
      const imgSrc = portrait
        ? (item.img_portrait || item.img)
        : (item.img_landscape || item.img_portrait);
      const tiny = item.img_tiny || "";
      return `
        <a class="lb__look ${l.cls}" data-reveal data-reveal-delay="${i % 5}" href="product.html?id=${item.id}">
          <div class="pic ${l.ar}">
            <img data-src="${imgSrc}" data-tiny="${tiny}" alt="${(item.alt || title[0])}">
          </div>
          <div class="meta">
            <b>${title[0]}</b>
            <span>${item.name} — ${item.color}</span>
          </div>
        </a>`;
    }).join("");
    bindImageLoaders(root);
    bindReveals(root);
  }

  document.addEventListener("DOMContentLoaded", render);
})();
