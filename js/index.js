/* ywee — index page logic
   - hydrate hero video
   - render bento product grid
   - render lookbook rail
   - render collections trio
   - render craft rows
   - render journal grid
*/
(function () {
  const D = window.YWEE;
  const { fmtMoney } = window.YWEEUtil;
  const { bindImageLoaders, bindReveals, bindMagnetic } = window.YWEEHelpers;

  // ---------- hero video ----------
  function hydrateHero() {
    const v = document.querySelector(".hero__media video");
    const poster = document.querySelector(".hero__media__poster");
    if (!v) return;
    const data = D.hero.video;
    // pick a high-quality portrait still as poster fallback
    const fallback = D.hero.portraits[0]?.src_portrait || D.hero.portraits[0]?.src;
    if (poster && fallback) {
      const onload = () => poster.classList.add("loaded");
      poster.addEventListener("load", onload);
      poster.src = fallback;
    }
    if (!data || !data.src) return;
    v.poster = data.poster || fallback || "";
    v.src = data.src;
    const showVideo = () => v.classList.add("loaded");
    v.addEventListener("loadeddata", showVideo);
    v.addEventListener("canplay", showVideo);
    v.addEventListener("error", () => { /* leave poster visible */ });
  }

  // ---------- bento grid (new arrivals) ----------
  function renderBento() {
    const grid = document.querySelector("#new-arrivals");
    if (!grid) return;
    const products = D.products;
    // 8 products in an asymmetric bento layout
    // pattern: feature(span 7, row 2), card(5), card(3,5,4) cards…
    const layout = [
      { idx: 0, cls: "feature span-7 row-2" },
      { idx: 1, cls: "span-5" },
      { idx: 2, cls: "span-5" },
      { idx: 3, cls: "span-3" },
      { idx: 4, cls: "span-4" },
      { idx: 5, cls: "span-4" },
      { idx: 6, cls: "span-4" },
      { idx: 7, cls: "span-4" },
    ];
    const html = layout.map(({ idx, cls }) => {
      const p = products[idx];
      if (!p) return "";
      if (cls.includes("feature")) {
        return `
          <a href="product.html?id=${p.id}" class="card feature ${cls}" data-reveal>
            <div class="card__media">
              <img data-src="${p.img_portrait}" data-tiny="${p.img_tiny}" alt="${p.alt || p.name}">
            </div>
            <div class="feature__caption">
              <span class="eyebrow">New · ${p.category}</span>
              <h3>${p.name}</h3>
              <p>${p.description}</p>
              <span class="btn btn--paper" data-magnet>
                <span>View piece</span>
                <span class="arrow">↗</span>
              </span>
            </div>
          </a>`;
      }
      return `
        <a href="product.html?id=${p.id}" class="card ${cls}" data-reveal>
          <div class="card__media">
            <span class="card__chip">${p.category}</span>
            <img data-src="${p.img_portrait}" data-tiny="${p.img_tiny}" alt="${p.alt || p.name}">
            <span class="card__quick">Quick add ↗</span>
          </div>
          <div class="card__body">
            <div>
              <h3>${p.name}</h3>
              <span class="cat">${p.color} · ${p.sizes.length} sizes</span>
            </div>
            <span class="price">${fmtMoney(p.price, p.currency)}</span>
          </div>
        </a>`;
    }).join("");
    grid.innerHTML = html;
    bindImageLoaders(grid);
    bindReveals(grid);
    bindMagnetic(grid);
  }

  // ---------- collection split (mid feature) ----------
  function renderCollectionSplit() {
    const left = document.querySelector("[data-csplit-left]");
    if (!left) return;
    // pull 2 supporting images from products + collection cover
    const cov = D.collections[0];
    const supA = D.products[10];
    const supB = D.products[15];
    const right = document.querySelector("[data-csplit-right]");
    right.innerHTML = `
      <div class="pic pic--tall" data-reveal data-reveal-delay="1">
        <img data-src="${cov.img}" alt="${cov.name} collection">
      </div>
      <div class="pic pic--short" data-reveal data-reveal-delay="2">
        <img data-src="${supA.img_portrait}" data-tiny="${supA.img_tiny}" alt="${supA.alt || supA.name}">
      </div>`;
    bindImageLoaders(right);
    bindReveals(right);
  }

  // ---------- lookbook ----------
  function renderLookbook() {
    const rail = document.querySelector("#lookbook-rail");
    if (!rail) return;
    // pull a varied set of product images (each is editorial fashion)
    const order = [0, 5, 11, 17, 23, 29, 4, 10, 16, 22, 28, 1];
    const items = order.map((i) => D.products[i % D.products.length]);
    const captions = [
      "Resort 26 · Trafaria, Lisbon",
      "Resort 26 · Atlas Studio, Paris",
      "Studio 04 · Atelier Porto",
      "Studio 04 · Hossegor",
      "Daywear · Marseille",
      "Resort 26 · Trieste",
      "Editorial · Mallorca",
      "Atelier · Firenze",
      "Daywear · Brooklyn",
      "Studio 04 · Tangier",
      "Resort 26 · Toulouse",
      "Editorial · Lisboa",
    ];
    rail.innerHTML = items.map((it, i) => `
      <a href="lookbook.html" class="lookbook__card" data-reveal data-reveal-delay="${i % 5}">
        <div class="lookbook__card__media">
          <img data-src="${it.img_landscape}" data-tiny="${it.img_tiny}" alt="${it.alt || it.name}">
        </div>
        <div class="lookbook__card__body">
          <h4>Look ${(i+1).toString().padStart(2,"0")}</h4>
          <span>${captions[i] || "Resort 26"}</span>
        </div>
      </a>`).join("");
    bindImageLoaders(rail);
    bindReveals(rail);
  }

  // ---------- collections trio ----------
  function renderCollections() {
    const grid = document.querySelector("#collections");
    if (!grid) return;
    grid.innerHTML = D.collections.map((c, i) => `
      <a href="shop.html?cat=${encodeURIComponent('All')}" class="col" data-reveal data-reveal-delay="${i + 1}">
        <span class="col__cta">Enter ↗</span>
        <div class="col__media">
          <img data-src="${c.img}" alt="${c.name} collection">
        </div>
        <div class="col__body">
          <span class="eyebrow">${c.season} · ${c.count} pieces</span>
          <h3>${c.name}</h3>
          <p>${c.tagline}</p>
        </div>
      </a>`).join("");
    bindImageLoaders(grid);
    bindReveals(grid);
  }

  // ---------- craft rows ----------
  function renderCraft() {
    const list = document.querySelector("#craft-list");
    if (!list) return;
    const rows = [
      { num: "01", title: "We start with the cloth", copy: "Every piece begins at the mill. We visit our cloth partners in Biella, Porto and Okayama at the beginning of each season — selecting yarn weights, swatching colours, and pulling samples by hand.", img: D.craft[0]?.src },
      { num: "02", title: "Patterns that travel", copy: "Block patterns are built in Lisbon and shipped to a small network of family-run ateliers. We don't subcontract — every workshop sees its own block, its own grade, its own finish.", img: D.craft[1]?.src },
      { num: "03", title: "A garment, in your wardrobe", copy: "Each item is mended for free for life. We will repair, reweave and re-finish your garment as long as you wear it — because slow cloth is meant to last decades.", img: D.craft[2]?.src },
    ];
    list.innerHTML = rows.map((r) => `
      <div class="craft__row" data-reveal>
        <span class="num">${r.num}</span>
        <div class="copy">
          <h3>${r.title}</h3>
          <p>${r.copy}</p>
        </div>
        <div class="pic"><img data-src="${r.img || ''}" alt=""></div>
      </div>`).join("");
    bindImageLoaders(list);
    bindReveals(list);
  }

  // ---------- journal ----------
  function renderJournal() {
    const grid = document.querySelector("#journal");
    if (!grid) return;
    grid.innerHTML = D.journal.map((p, i) => `
      <a href="journal.html#${i}" class="post" data-reveal data-reveal-delay="${i + 1}">
        <div class="post__media">
          <img data-src="${p.img}" alt="${p.alt || p.title}">
        </div>
        <div class="post__body">
          <div class="post__meta"><b>${p.category}</b><span class="dot"></span><span>${p.read}</span></div>
          <h3>${p.title}</h3>
          <p>${p.deck}</p>
          <span class="read">Read the entry</span>
        </div>
      </a>`).join("");
    bindImageLoaders(grid);
    bindReveals(grid);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!D) return;
    hydrateHero();
    renderBento();
    renderCollectionSplit();
    renderLookbook();
    renderCollections();
    renderCraft();
    renderJournal();
  });
})();
