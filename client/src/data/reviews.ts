// Synthetic but realistic review data per product family.
// Each product gets 4-12 deterministic reviews based on its slug hash.

const FIRST_NAMES = [
  "Aanya", "Riya", "Priya", "Sara", "Diya", "Aarya", "Ananya", "Kavya",
  "Ishita", "Mira", "Sana", "Tara", "Zara", "Aisha", "Naina", "Rhea",
  "Pari", "Ira", "Mahi", "Kiara", "Anika", "Ahaana", "Inaya", "Tanya",
  "Meera", "Aditi", "Nivedita", "Shreya", "Trisha", "Vidya",
];
const LAST_INITIALS = ["M.", "S.", "K.", "G.", "R.", "P.", "B.", "T.", "A.", "C."];
const CITIES = [
  "Mumbai", "Bangalore", "Delhi", "Pune", "Chennai",
  "Hyderabad", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
  "Surat", "Indore", "Chandigarh", "Kochi", "Goa",
];

const TEMPLATES = [
  {
    rating: 5,
    titles: ["She lives in these.", "Won't take them off.", "Best fit ever.", "Beautifully made."],
    bodies: [
      "Soft from the first wear and the adjustable waistband is genuinely brilliant — I've already moved the button once and they fit perfectly again.",
      "My daughter is 7 and very particular. She refused everything except YWEE. The fabric breathes well in Indian summers and the cuts are flattering.",
      "Honestly worth every rupee. The cotton-lycra feels like proper denim but stretches like leggings. She wears them to school and to weddings.",
      "Quality is on par with brands I've bought from London and Paris, at half the price. Delivery was fast and the packaging was beautiful.",
      "We've washed these probably 30 times and the colour hasn't faded. The waistband button still slides smoothly. Can't recommend enough.",
    ],
  },
  {
    rating: 5,
    titles: ["Made for play.", "Real, lasting denim.", "Adjustable = lifesaver."],
    bodies: [
      "Three months, no fading, no fraying. My only regret is not buying the dark indigo at the same time.",
      "The 'mended for life' policy isn't just marketing — they actually replied to my email and offered to fix a small tear. Brand to support.",
      "She's been climbing trees in these. Still going strong. The cuts are slim but never restrictive.",
      "After trying Zara Kids, H&M, and Marks & Spencer, this is the first brand where the size 7-8 actually fit her properly.",
    ],
  },
  {
    rating: 4,
    titles: ["Great fit, slightly long.", "Lovely — runs slightly large.", "Beautiful with one quibble."],
    bodies: [
      "Fabric and finish are gorgeous. Inseam was a tad long for our 5-yr-old but a single roll-up sorted it. Will buy again.",
      "Color is lovely and the embellishment hasn't peeled. Slightly large in the waist, but that's exactly why the adjustable button exists.",
      "Lovely jeans — the only reason I'm giving 4 stars is I wish there were more washes. But the fit and quality are excellent.",
    ],
  },
  {
    rating: 5,
    titles: ["She picked it herself.", "Going back for more.", "10/10 from a tween critic."],
    bodies: [
      "My 13-year-old daughter is impossible to shop for. She asked for two more pairs the day after these arrived.",
      "Beautiful packaging, thoughtful sizing, and a genuinely premium product. Indian brand that finally rivals the European ones.",
      "Bought one pair, came back for three more across the family. The Bloom Atelier is showstopping.",
    ],
  },
  {
    rating: 4,
    titles: ["Solid everyday jean.", "Wash held up well.", "Worth it."],
    bodies: [
      "Not the most exciting wash but a reliable everyday piece. Soft, well-cut, and survived three sleepovers and a pool party.",
      "Free delivery to Pune in 3 days. Packaging was lovely. Daughter wore them straight out of the box.",
    ],
  },
];

function hash(str: string) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return Math.abs(h);
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  date: string;
  size: string;
  helpful: number;
}

const SIZES = ["3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs"];

export function getReviewsFor(slug: string, count = 6): Review[] {
  const seed = hash(slug);
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const k = (seed + i * 31) >>> 0;
    const tpl = TEMPLATES[k % TEMPLATES.length];
    const titleIdx = (k >> 3) % tpl.titles.length;
    const bodyIdx = (k >> 5) % tpl.bodies.length;
    const fn = FIRST_NAMES[(k >> 7) % FIRST_NAMES.length];
    const li = LAST_INITIALS[(k >> 11) % LAST_INITIALS.length];
    const city = CITIES[(k >> 13) % CITIES.length];
    const size = SIZES[(k >> 17) % SIZES.length];
    // Date: random day in the last ~120 days
    const daysAgo = (k >> 19) % 120 + 1;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    out.push({
      id: `${slug}-r${i}`,
      name: `${fn} ${li}`,
      city,
      rating: tpl.rating,
      title: tpl.titles[titleIdx],
      body: tpl.bodies[bodyIdx],
      verified: ((k >> 23) & 7) !== 0,   // ~87% verified
      date: d.toISOString().slice(0, 10),
      size,
      helpful: 4 + ((k >> 25) % 40),
    });
  }
  return out;
}

export function getRatingSummary(slug: string) {
  const reviews = getReviewsFor(slug, 8);
  const total = reviews.length;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / total;
  // Slight pseudo-randomness so different products feel different
  const seed = hash(slug);
  const totalCount = 47 + (seed % 380);   // 47-426 reviews
  return {
    avg: Math.round(avg * 10) / 10,
    count: totalCount,
  };
}

/** Stock model — assigns deterministic low-stock for some sizes */
export interface StockEntry {
  size: string;
  stock: number;          // 0 = OOS, 1-3 = low, 4+ = healthy
}

export function getStockFor(slug: string, sizes: string[]): StockEntry[] {
  const seed = hash(slug);
  return sizes.map((size, i) => {
    const k = (seed + i * 17 + size.length) >>> 0;
    const r = k % 100;
    let stock: number;
    if (r < 8) stock = 0;            // 8% OOS
    else if (r < 22) stock = 1 + (k % 3);   // 14% low
    else stock = 12 + (k % 30);
    return { size, stock };
  });
}
