/* ywee — journal page */
(function () {
  const D = window.YWEE;
  const { bindImageLoaders, bindReveals } = window.YWEEHelpers;

  const ENTRIES = [
    { date: "5 May 2026",  cat: "Field Notes",   read: "9 min", title: "On Slow Cloth — why we still finish seams by hand", deck: "A week with the spinners of Biella, where worsted yarn is still made on looms older than the studio that orders them." },
    { date: "22 Mar 2026", cat: "Material",      read: "6 min", title: "The Weight of Wool",                                  deck: "What changes when a single garment is made from cloth that has rested for six months." },
    { date: "11 Feb 2026", cat: "Worn-In",       read: "4 min", title: "Worn Eight Years",                                    deck: "Three of our customers on the Verre coat, mended twice, repaired once, still in rotation." },
    { date: "18 Jan 2026", cat: "Atelier",       read: "7 min", title: "A morning at Atelier Henriques",                      deck: "A short notebook from a working day in our cutter's workroom in Porto." },
    { date: "12 Dec 2025", cat: "Mending",       read: "5 min", title: "What we learned from 1,100 mends",                    deck: "Four years into the program. The seams that fail. The seams that do not. The customers who keep showing us how cloth wants to be repaired." },
    { date: "8 Nov 2025",  cat: "People",        read: "3 min", title: "Mariana — head of finishing",                         deck: "A short, slightly anxious interview with the only person in the studio allowed to finish a Verre by hand." },
    { date: "21 Oct 2025", cat: "Material",      read: "8 min", title: "Indigo — the long fade",                              deck: "Why we shuttle-loom our denim in Okayama, and how the cloth is supposed to fail beautifully." },
    { date: "9 Sep 2025",  cat: "Field Notes",   read: "11 min",title: "Trafaria — the Resort 26 location notebook",          deck: "A short notebook from a windy March afternoon photographing twelve looks against the river." },
    { date: "14 Aug 2025", cat: "Worn-In",       read: "4 min", title: "Three customers, three winters",                      deck: "We ask Inês, Camille, and Yuto to send us photographs of three coats they bought from us, three winters ago." },
    { date: "30 Jun 2025", cat: "Atelier",       read: "5 min", title: "A new partnership in Igualada",                       deck: "We are spending the summer in a small leather workshop outside Barcelona. Three months of welt-stitching." },
    { date: "17 Apr 2025", cat: "Mending",       read: "3 min", title: "Send your garment back · how it works",               deck: "A short, illustrated guide to using the lifetime mending program." },
    { date: "2 Feb 2025",  cat: "People",        read: "6 min", title: "Tomás on patternmaking — the slow tools",             deck: "Tomás writes about why we still grade by hand, and why our grade book is twelve years old and full of pencil." },
  ];

  function hydrate() {
    // feature image
    const feat = document.getElementById("jr-feature-img");
    if (feat) {
      const img = D.journal[0]?.img || D.about[0]?.src_landscape;
      if (img) {
        feat.src = img;
        feat.addEventListener("load", () => feat.classList.add("loaded"));
      }
    }

    const root = document.getElementById("jr-items");
    if (!root) return;
    root.innerHTML = ENTRIES.slice(1).map((e, i) => `
      <a href="journal.html#entry-${i+1}" class="jr__item" data-reveal data-reveal-delay="${(i % 4) + 1}">
        <span class="when">${e.date}</span>
        <h4><span class="cat">${e.cat}</span>${e.title}</h4>
        <p>${e.deck} · <b style="color:var(--ink-mute);font-weight:400">${e.read} read ↗</b></p>
      </a>`).join("");
    bindReveals(root);
  }

  document.addEventListener("DOMContentLoaded", hydrate);
})();
