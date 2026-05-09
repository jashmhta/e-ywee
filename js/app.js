/* ywee — shared app shell
   - pexels client
   - cart store + drawer
   - reveal motion (intersection observer)
   - split-letter title animations
   - magnetic CTA hover
*/

(function () {
  const D = window.YWEE;
  if (!D) { console.warn("YWEE data not found"); }
  const PEXELS_KEY = (D && D.pexels_key) || "";

  // ---------- utilities ----------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const fmtMoney = (n, cur = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
  const slugCat = (c) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // ---------- pexels client ----------
  const Pexels = {
    async search(query, perPage = 12, orientation = "portrait", page = 1) {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}&page=${page}`;
      try {
        const r = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
        if (!r.ok) throw new Error(r.status);
        return r.json();
      } catch (e) { console.warn("pexels search failed", e); return { photos: [] }; }
    }
  };
  window.Pexels = Pexels;

  // ---------- image loader (graceful fade-in) ----------
  function bindImageLoaders(scope = document) {
    $$("img[data-src]", scope).forEach((img) => {
      if (img._bound) return;
      img._bound = true;
      const real = img.dataset.src;
      const t = img.dataset.tiny;
      if (t && !img.style.backgroundImage) img.style.backgroundImage = `url("${t}")`;
      img.style.backgroundSize = "cover";
      img.style.backgroundPosition = "center";
      const onload = () => img.classList.add("loaded");
      const onerror = () => { img.classList.add("loaded"); img.style.opacity = "0.5"; };
      const tmp = new Image();
      tmp.onload = () => { img.src = real; img.addEventListener("load", onload); };
      tmp.onerror = onerror;
      tmp.src = real;
    });
  }
  window.bindImageLoaders = bindImageLoaders;

  // ---------- reveal observer ----------
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObs.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  function bindReveals(scope = document) {
    $$("[data-reveal]", scope).forEach((el) => revealObs.observe(el));
    // split-letter lines
    $$("[data-split]", scope).forEach((el) => {
      if (el._split) return;
      el._split = true;
      const text = el.textContent;
      el.textContent = "";
      const wrap = document.createElement("span");
      wrap.className = "split-line";
      const chars = Array.from(text);
      chars.forEach((c, i) => {
        const span = document.createElement("span");
        span.className = "split-letter";
        span.style.setProperty("--d", `${i * 22}ms`);
        span.textContent = c === " " ? "\u00A0" : c;
        wrap.appendChild(span);
      });
      el.appendChild(wrap);
      const obs = new IntersectionObserver((es) => {
        es.forEach((en) => { if (en.isIntersecting) { wrap.classList.add("in"); obs.disconnect(); } });
      }, { threshold: 0.4 });
      obs.observe(el);
    });
  }
  window.bindReveals = bindReveals;

  // ---------- magnetic cta ----------
  function bindMagnetic(scope = document) {
    $$("[data-magnet]", scope).forEach((el) => {
      if (el._mag) return;
      el._mag = true;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate3d(0,0,0)";
      });
    });
  }

  // ---------- cart store (localStorage) ----------
  const Cart = {
    key: "ywee.cart.v1",
    items: [],
    listeners: [],
    load() {
      try { this.items = JSON.parse(localStorage.getItem(this.key) || "[]"); }
      catch { this.items = []; }
    },
    save() { localStorage.setItem(this.key, JSON.stringify(this.items)); this.emit(); },
    add(prod, size, qty = 1) {
      const k = `${prod.id}::${size || "ONE"}`;
      const existing = this.items.find((i) => i.key === k);
      if (existing) existing.qty += qty;
      else this.items.push({
        key: k, id: prod.id, name: prod.name, category: prod.category,
        price: prod.price, currency: prod.currency, size, qty,
        img: prod.img_portrait || prod.img, slug: prod.slug,
      });
      this.save();
    },
    update(key, qty) {
      const it = this.items.find((i) => i.key === key);
      if (!it) return;
      it.qty = Math.max(1, qty);
      this.save();
    },
    remove(key) { this.items = this.items.filter((i) => i.key !== key); this.save(); },
    clear() { this.items = []; this.save(); },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },
    subtotal() { return this.items.reduce((s, i) => s + i.qty * i.price, 0); },
    on(fn) { this.listeners.push(fn); fn(this); },
    emit() { this.listeners.forEach((fn) => fn(this)); },
  };
  Cart.load();
  window.Cart = Cart;

  // ---------- nav: cart counter + drawer ----------
  function buildNavCounter() {
    const el = $("#cart-count");
    if (!el) return;
    const sync = () => {
      const c = Cart.count();
      el.textContent = c;
      el.parentElement?.setAttribute("aria-label", `Cart, ${c} item${c === 1 ? "" : "s"}`);
    };
    Cart.on(sync);
  }

  function buildDrawer() {
    let drawer = $(".cartdrawer");
    if (drawer) return; // already present
    drawer = document.createElement("aside");
    drawer.className = "cartdrawer";
    drawer.innerHTML = `
      <div class="cartdrawer__head">
        <h3>Your Bag</h3>
        <button class="cartdrawer__close" aria-label="Close cart">Close ↗</button>
      </div>
      <div class="cartdrawer__items"></div>
      <div class="cartdrawer__foot">
        <div class="cartdrawer__sub"><span>Subtotal</span><b id="cart-sub">$0</b></div>
        <small style="display:block;color:var(--ink-mute);margin-bottom:14px">Shipping calculated at checkout. Free worldwide over $250.</small>
        <a href="#" class="btn btn--lg cartdrawer__btn" id="cart-checkout">
          <span>Checkout</span>
          <span class="arrow">↗</span>
        </a>
      </div>`;
    document.body.appendChild(drawer);
    const overlay = document.createElement("div");
    overlay.className = "cartoverlay";
    document.body.appendChild(overlay);

    const itemsEl = $(".cartdrawer__items", drawer);
    const subEl = $("#cart-sub", drawer);
    const close = () => document.body.classList.remove("cart-open");
    overlay.addEventListener("click", close);
    $(".cartdrawer__close", drawer).addEventListener("click", close);

    function render() {
      if (Cart.items.length === 0) {
        itemsEl.innerHTML = `
          <div class="cartdrawer__empty">
            <h4>Your bag is empty</h4>
            <p>Discover the season's first cuts in the studio.</p>
            <a href="shop.html" class="btn btn--ghost" style="margin-top:18px">
              <span>Browse the shop</span><span class="arrow">↗</span>
            </a>
          </div>`;
      } else {
        itemsEl.innerHTML = Cart.items.map((it) => `
          <div class="cartdrawer__item" data-key="${it.key}">
            <img src="${it.img}" alt="${it.name}">
            <div>
              <h4>${it.name}</h4>
              <div class="meta">${it.category} · ${it.size || "One Size"}</div>
              <div class="row">
                <div class="cartdrawer__qty">
                  <button data-act="-" aria-label="Decrease">−</button>
                  <span>${it.qty}</span>
                  <button data-act="+" aria-label="Increase">+</button>
                </div>
                <div style="display:flex;align-items:center;gap:14px">
                  <span class="mono" style="font-size:13px">${fmtMoney(it.price * it.qty, it.currency)}</span>
                  <button class="cartdrawer__remove" data-act="x">Remove</button>
                </div>
              </div>
            </div>
          </div>`).join("");
      }
      subEl.textContent = fmtMoney(Cart.subtotal());
    }
    Cart.on(render);

    itemsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const wrap = e.target.closest(".cartdrawer__item");
      const key = wrap?.dataset.key; if (!key) return;
      const item = Cart.items.find((i) => i.key === key);
      if (!item) return;
      const act = btn.dataset.act;
      if (act === "+") Cart.update(key, item.qty + 1);
      if (act === "-") Cart.update(key, item.qty - 1);
      if (act === "x") Cart.remove(key);
    });

    $$("[data-cart-open]").forEach((el) => {
      el.addEventListener("click", (e) => { e.preventDefault(); document.body.classList.add("cart-open"); });
    });

    $("#cart-checkout").addEventListener("click", (e) => {
      e.preventDefault();
      if (!Cart.items.length) { showToast("Your bag is empty"); return; }
      window.location.href = "checkout.html";
    });
  }

  function buildNavToggle() {
    const tog = $(".nav__hamb");
    if (!tog) return;
    tog.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    $$(".nav__drawer a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));
  }

  // ---------- toast ----------
  let toastEl = null;
  function showToast(msg, ms = 2400) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("show"), ms);
  }
  window.showToast = showToast;

  // ---------- search modal ----------
  function buildSearch() {
    let modal = $(".search-modal");
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "search-modal";
    modal.innerHTML = `
      <div class="search-modal__backdrop"></div>
      <div class="search-modal__content">
        <div class="search-modal__head">
          <h3>Search the studio</h3>
          <button class="search-modal__close" aria-label="Close search">Close ↗</button>
        </div>
        <div class="search-modal__input-wrap">
          <input type="text" class="search-modal__input" placeholder="Search garments, categories, colours…" autocomplete="off">
        </div>
        <div class="search-modal__results"></div>
        <div class="search-modal__suggestions">
          <span class="eyebrow" style="margin-bottom:14px;display:block">Popular searches</span>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            <button class="chip" data-q="coat">Coats</button>
            <button class="chip" data-q="knitwear">Knitwear</button>
            <button class="chip" data-q="linen">Linen</button>
            <button class="chip" data-q="dress">Dresses</button>
            <button class="chip" data-q="wool">Wool</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const backdrop = $(".search-modal__backdrop", modal);
    const input = $(".search-modal__input", modal);
    const results = $(".search-modal__results", modal);
    const suggestions = $(".search-modal__suggestions", modal);
    const closeBtn = $(".search-modal__close", modal);

    const close = () => { modal.classList.remove("open"); input.value = ""; results.innerHTML = ""; suggestions.style.display = ""; };
    backdrop.addEventListener("click", close);
    closeBtn.addEventListener("click", close);

    function doSearch(q) {
      if (!q || !D) { results.innerHTML = ""; suggestions.style.display = ""; return; }
      const ql = q.toLowerCase();
      const matches = D.products.filter((p) =>
        p.name.toLowerCase().includes(ql) ||
        p.category.toLowerCase().includes(ql) ||
        p.color.toLowerCase().includes(ql) ||
        p.description.toLowerCase().includes(ql)
      ).slice(0, 8);
      suggestions.style.display = "none";
      if (!matches.length) {
        results.innerHTML = `<div style="padding:40px 0;text-align:center;color:var(--ink-mute)"><p>No pieces found for "${q}"</p></div>`;
        return;
      }
      results.innerHTML = matches.map((p) => `
        <a href="product.html?id=${p.id}" class="search-result">
          <img src="${p.img_tiny}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <span>${p.category} · ${p.color} · ${fmtMoney(p.price, p.currency)}</span>
          </div>
        </a>`).join("");
    }

    let debounce;
    input.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => doSearch(input.value.trim()), 200);
    });

    modal.querySelectorAll("[data-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        input.value = btn.dataset.q;
        doSearch(btn.dataset.q);
        input.focus();
      });
    });

    $$("[aria-label='Search']").forEach((el) => {
      el.addEventListener("click", (e) => { e.preventDefault(); modal.classList.add("open"); setTimeout(() => input.focus(), 100); });
    });
  }

  // ---------- common nav header / footer ----------
  // (HTML pages already include the nav markup; here we wire it up.)
  // mark JS ready as early as possible so first paint can keep reveal-hidden state
  document.documentElement.classList.add("js-ready");
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-ready");
    bindImageLoaders();
    bindReveals();
    bindMagnetic();
    buildNavCounter();
    buildNavToggle();
    buildDrawer();
    buildSearch();
  });

  window.YWEEUtil = { fmtMoney, slugCat, $, $$ };
  window.YWEEHelpers = { bindImageLoaders, bindReveals, bindMagnetic };
})();
