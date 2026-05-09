/* ywee — product detail page logic
   - read ?id= from URL
   - render gallery (4 images: main + 3 from same category)
   - sizes selection
   - quantity
   - add to cart (with toast)
   - related products (same category)
*/
(function () {
  const D = window.YWEE;
  const { fmtMoney } = window.YWEEUtil;
  const { bindImageLoaders, bindReveals, bindMagnetic } = window.YWEEHelpers;

  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get("id") || "0", 10);
  const product = D.products.find((p) => p.id === id) || D.products[0];

  document.getElementById("page-title").textContent = `${product.name} · ywee`;

  // gallery: main + 3 alternate images (same category, prefer different angles)
  function pickGallery() {
    const gallery = [product];
    const sameCat = D.products.filter((p) => p.category === product.category && p.id !== product.id);
    for (const p of sameCat) {
      gallery.push(p);
      if (gallery.length >= 4) break;
    }
    while (gallery.length < 4) {
      const r = D.products[(D.products.indexOf(product) + gallery.length) % D.products.length];
      if (!gallery.includes(r)) gallery.push(r);
    }
    return gallery;
  }
  const gallery = pickGallery();

  const state = { selectedThumb: 0, size: null, qty: 1 };

  function render() {
    const root = document.getElementById("pd");
    root.innerHTML = `
      <div class="pd__gallery">
        <div class="pd__main" data-reveal>
          <img id="pd-main-img" data-src="${gallery[state.selectedThumb].img_portrait || gallery[state.selectedThumb].img}" alt="${product.alt || product.name}">
        </div>
        <div class="pd__thumbs">
          ${gallery.map((g, i) => `
            <button class="pd__thumb ${i === state.selectedThumb ? "active" : ""}" data-thumb="${i}" aria-label="View image ${i + 1}">
              <img data-src="${g.img_portrait || g.img}" alt="">
            </button>
          `).join("")}
        </div>
        <div class="pd__photo">
          Photographs by
          ${[...new Set(gallery.map((g) => g.photographer))].filter(Boolean).map((p) => `<a href="https://www.pexels.com/${p.toLowerCase().replace(/\s+/g,'-')}" target="_blank" rel="noreferrer">${p}</a>`).join(", ")}
          · sourced via Pexels
        </div>
      </div>

      <div class="pd__info">
        <div class="pd__breadcrumb">
          <a href="shop.html">Shop</a>
          <span class="sep">/</span>
          <a href="shop.html?cat=${encodeURIComponent(product.category)}">${product.category}</a>
          <span class="sep">/</span>
          <span class="muted">${product.name}</span>
        </div>
        <h1 class="pd__title" data-reveal>${product.name}</h1>
        <span class="pd__cat">${product.category} · Resort 26 · ${product.color}</span>
        <div class="pd__priceline">
          <span class="pd__price">${fmtMoney(product.price, product.currency)}</span>
          <span class="pd__sku">SKU ${product.sku}</span>
          <span class="tag" style="margin-left:auto"><span class="pulse"></span><span>In studio · ships Friday</span></span>
        </div>
        <p class="pd__desc">${product.description}</p>

        <div class="pd__group">
          <h4>Colour · ${product.color}</h4>
          <div style="display:flex; gap: 10px;">
            <button class="pd__sizebtn active" style="background:${product.color_hex}; color: var(--paper); border-color:${product.color_hex}">${product.color}</button>
            <button class="pd__sizebtn" disabled style="opacity:.6">Bone — restocks 14 May</button>
          </div>
        </div>

        <div class="pd__group">
          <h4>Size <a href="sizing.html" style="float:right;color:var(--ink-mute);font-size:12px;letter-spacing:0;text-transform:none;font-weight:400;text-decoration:underline;text-underline-offset:2px">Size guide ↗</a></h4>
          <div class="pd__sizes" id="pd-sizes">
            ${product.sizes.map((s) => `<button class="pd__sizebtn" data-size="${s}">${s}</button>`).join("")}
          </div>
          <p style="margin-top:12px;font-size:12.5px;color:var(--ink-mute)">Cut for an unhurried fit · See size guide for body measurements.</p>
        </div>

        <div class="pd__group" style="display:flex; align-items:center; gap:18px; padding-top:24px">
          <div class="pd__qty" id="pd-qty">
            <button data-act="-" aria-label="Decrease">−</button>
            <span id="pd-qty-val">1</span>
            <button data-act="+" aria-label="Increase">+</button>
          </div>
          <span style="font-size:12.5px; color: var(--ink-mute)">Free worldwide shipping over $250 · 30-day returns</span>
        </div>

        <div class="pd__buy">
          <button class="btn btn--lg" id="pd-add" data-magnet>
            <span>Add to bag — <span id="pd-total">${fmtMoney(product.price, product.currency)}</span></span>
            <span class="arrow">↗</span>
          </button>
          <button class="heart" aria-label="Save">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7.5-4.5-9.5-9.5C1 6.5 5 4 8 5c1.5.5 3 2 4 4 1-2 2.5-3.5 4-4 3-1 7 1.5 5.5 6.5C19.5 16.5 12 21 12 21z"/></svg>
          </button>
        </div>

        <div class="pd__details">
          <details open>
            <summary>Description</summary>
            <div>${product.description} ${product.story}</div>
          </details>
          <details>
            <summary>Materials &amp; care</summary>
            <ul>
              <li>${product.color === "Bone" ? "Undyed Italian wool, woven in Biella" : "Italian wool / cotton blend"}</li>
              <li>Natural horn buttons</li>
              <li>Inner facing: Bemberg cupro</li>
              <li>Dry clean or gentle hand wash · Air dry flat</li>
            </ul>
          </details>
          <details>
            <summary>Atelier &amp; provenance</summary>
            <div>Designed in our Lisbon studio. Cut in <em>Atelier Henriques</em>, Porto. Final hand-finishing by Mariana Sousa, who has been with the house for four seasons. Each piece carries a small workroom number on the inner spine.</div>
          </details>
          <details>
            <summary>Fit &amp; sizing</summary>
            <ul>
              <li>Cut for a relaxed fit · take your usual size</li>
              <li>Model is 178cm and wears size M</li>
              <li>Drop sleeve · room for layering</li>
              <li>Length is 78cm at centre back (size M)</li>
            </ul>
          </details>
          <details>
            <summary>Shipping &amp; returns</summary>
            <div>Ships from Lisbon Friday — within 48 hours of order in EU; 5–7 business days worldwide. Free over $250. Free returns within 30 days.</div>
          </details>
          <details>
            <summary>Mended for life</summary>
            <div>Every ywee garment is repaired, rewoven and re-finished for free, for as long as you wear it. Send it back any time — no questions asked.</div>
          </details>
        </div>
      </div>
    `;

    // wire interactions
    bindImageLoaders(root);
    bindReveals(root);
    bindMagnetic(root);

    root.querySelectorAll("[data-thumb]").forEach((t) => {
      t.addEventListener("click", () => {
        state.selectedThumb = +t.dataset.thumb;
        document.querySelectorAll(".pd__thumb").forEach((el) => el.classList.remove("active"));
        t.classList.add("active");
        const img = document.getElementById("pd-main-img");
        const next = gallery[state.selectedThumb].img_portrait || gallery[state.selectedThumb].img;
        img.classList.remove("loaded");
        img.dataset.src = next;
        img.src = "";
        bindImageLoaders(root);
      });
    });

    document.querySelectorAll("#pd-sizes button").forEach((b) => {
      b.addEventListener("click", () => {
        document.querySelectorAll("#pd-sizes button").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        state.size = b.dataset.size;
      });
    });

    document.getElementById("pd-qty").addEventListener("click", (e) => {
      const btn = e.target.closest("button"); if (!btn) return;
      if (btn.dataset.act === "+") state.qty++;
      if (btn.dataset.act === "-") state.qty = Math.max(1, state.qty - 1);
      document.getElementById("pd-qty-val").textContent = state.qty;
      document.getElementById("pd-total").textContent = fmtMoney(product.price * state.qty, product.currency);
    });

    document.getElementById("pd-add").addEventListener("click", () => {
      if (!state.size && product.sizes.length > 1) {
        window.showToast("Please select a size");
        return;
      }
      window.Cart.add(product, state.size, state.qty);
      document.body.classList.add("cart-open");
    });
  }

  function renderRelated() {
    const grid = document.getElementById("related-grid");
    const related = D.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    while (related.length < 4) {
      const next = D.products[(D.products.indexOf(product) + related.length + 1) % D.products.length];
      if (next && !related.includes(next) && next.id !== product.id) related.push(next);
    }
    grid.innerHTML = related.map((p, i) => `
      <a href="product.html?id=${p.id}" class="card" data-reveal data-reveal-delay="${(i % 3) + 1}">
        <div class="card__media">
          <span class="card__chip">${p.category}</span>
          <img data-src="${p.img_portrait}" data-tiny="${p.img_tiny}" alt="${p.alt || p.name}">
          <span class="card__quick">View piece ↗</span>
        </div>
        <div class="card__body">
          <div>
            <h3>${p.name}</h3>
            <span class="cat">${p.color} · ${p.sizes.length} sizes</span>
          </div>
          <span class="price">${fmtMoney(p.price, p.currency)}</span>
        </div>
      </a>`).join("");
    bindImageLoaders(grid);
    bindReveals(grid);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!D) return;
    render();
    renderRelated();
  });
})();
