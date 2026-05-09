/* ywee — about page */
(function () {
  const D = window.YWEE;
  const { bindImageLoaders, bindReveals } = window.YWEEHelpers;

  function hydrateImages() {
    const hero = document.getElementById("ab-hero-img");
    const mid  = document.getElementById("ab-mid-img");
    if (hero) {
      hero.src = D.about[0]?.src_landscape || D.about[0]?.src;
      hero.addEventListener("load", () => hero.style.opacity = 1);
    }
    if (mid) {
      mid.src = D.craft[0]?.src_landscape || D.craft[0]?.src;
      mid.addEventListener("load", () => mid.style.opacity = 1);
    }
  }

  function renderPeople() {
    const root = document.getElementById("ab-people");
    if (!root) return;
    const people = [
      { n: "Inês Veloso",       r: "Co-founder · Cloth & cuts",
        bio: "Inês started ywee after eight years in textile R&D. She visits all four mills every season.",
        img: D.about[1]?.src_portrait || D.about[1]?.src },
      { n: "Tomás Marques",     r: "Co-founder · Atelier",
        bio: "Tomás trained as a tailor in Porto. He oversees pattern-grading and the four atelier partnerships.",
        img: D.craft[0]?.src_portrait || D.craft[0]?.src },
      { n: "Mariana Sousa",     r: "Head of finishing",
        bio: "Mariana finishes every Verre Coat by hand. Four years with the house and counting.",
        img: D.craft[1]?.src_portrait || D.craft[1]?.src },
    ];
    root.innerHTML = people.map((p, i) => `
      <article class="ab__person" data-reveal data-reveal-delay="${i + 1}">
        <div class="pic"><img data-src="${p.img}" alt="${p.n}"></div>
        <h4>${p.n}</h4>
        <small>${p.r}</small>
        <p>${p.bio}</p>
      </article>`).join("");
    bindImageLoaders(root);
    bindReveals(root);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!D) return;
    hydrateImages();
    renderPeople();
  });
})();
