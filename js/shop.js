/* ywee — shop page logic
   - filter chips by category
   - sort dropdown
   - render grid
   - URL sync (?cat=)
*/
(function () {
  const D = window.YWEE;
  const { fmtMoney, $, $$ } = window.YWEEUtil;
  const { bindImageLoaders, bindReveals, bindMagnetic } = window.YWEEHelpers;

  const CATS = ["All", "Outerwear", "Knitwear", "Tops", "Bottoms", "Dresses", "Accessories"];

  const params = new URLSearchParams(location.search);
  const state = {
    cat: params.get("cat") || "All",
    sort: "featured",
  };

  function counts() {
    const c = { All: D.products.length };
    for (const p of D.products) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }

  function renderFilters() {
    const root = $("#shop-filters");
    const c = counts();
    root.innerHTML = CATS.map((cat) => `
      <button class="chip ${cat === state.cat ? "active" : ""}" data-cat="${cat}">
        <span>${cat}</span>
        <span class="count">${(c[cat] || 0).toString().padStart(2,"0")}</span>
      </button>`).join("");
    root.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.cat = btn.dataset.cat;
        const url = new URL(location.href);
        if (state.cat === "All") url.searchParams.delete("cat");
        else url.searchParams.set("cat", state.cat);
        history.replaceState({}, "", url);
        renderFilters();
        renderGrid();
      });
    });
  }

  function compare(a, b) {
    if (state.sort === "price-asc") return a.price - b.price;
    if (state.sort === "price-desc") return b.price - a.price;
    if (state.sort === "name") return a.name.localeCompare(b.name);
    return 0;
  }

  function renderGrid() {
    const grid = $("#shop-grid");
    let items = D.products.slice();
    if (state.cat !== "All") items = items.filter((p) => p.category === state.cat);
    items.sort(compare);
    $("#shop-count").textContent = `Showing ${items.length} piece${items.length === 1 ? "" : "s"}${state.cat === "All" ? "" : ` in ${state.cat}`}`;
    if (!items.length) {
      grid.innerHTML = `<div class="span-12" style="grid-column: 1 / -1; text-align:center; padding: 80px 0; color: var(--ink-mute)">
        <h3 style="font-family:var(--serif);font-weight:380;font-size:32px;color:var(--ink);margin-bottom:12px">Nothing in this drawer yet.</h3>
        <p>The next drop lands Friday. Or browse all 30 pieces.</p>
        <a href="shop.html" class="btn btn--ghost" style="margin-top:18px"><span>All pieces</span><span class="arrow">↗</span></a>
      </div>`;
      return;
    }
    grid.innerHTML = items.map((p, i) => `
      <a href="product.html?id=${p.id}" class="card" data-reveal data-reveal-delay="${(i % 4) + 1}">
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
      </a>`).join("");
    bindImageLoaders(grid);
    bindReveals(grid);
    bindMagnetic(grid);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!D) return;
    renderFilters();
    renderGrid();
    $("#shop-sort").addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderGrid();
    });
  });
})();
