// ywee — Girls' Stretch Denim · Static Data Store
// Real product data sourced from YWEE brand catalogue (Amazon India, May 2026)

export interface Product {
  id: number;
  sku: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  color: string;
  colorHex: string;
  alt: string;
  img: string;
  imgPortrait: string;
  imgLandscape: string;
  sizes: string[];
  description: string;
  details: string[];
  story: string;
  pattern?: string;
  ageRange?: string;
}

export interface LookbookImage {
  id: number;
  color: string;
  alt: string;
  src: string;
  srcPortrait: string;
  srcLandscape: string;
  width: number;
  height: number;
}

export interface JournalArticle {
  slug: string;
  title: string;
  deck: string;
  category: string;
  read: string;
  img: string;
  alt: string;
  body?: string;
}

export interface Collection {
  name: string;
  tagline: string;
  count: number;
  season: string;
  img: string;
  color: string;
}

// ─── Real YWEE Products ────────────────────────────────────────────────────
// 11 distinct colour × pattern combinations from 96 SKUs
// All images hosted on Manus storage (uploaded from Amazon CDN originals)

export const PRODUCTS: Product[] = [
  {
    id: 1,
    sku: "YW-LB-SOLID",
    slug: "classic-light-blue-jeans",
    name: "Classic Light Blue Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Light Blue",
    colorHex: "#A8C8E8",
    pattern: "Solid",
    ageRange: "1–14 years",
    alt: "YWEE girls' classic light blue stretch denim jeans with adjustable waistband.",
    img: "/images/B0FL16ZFCH_0_d6e7b3ae.jpg",
    imgPortrait: "/images/B0FL16ZFCH_0_d6e7b3ae.jpg",
    imgLandscape: "/images/B0FL16ZFCH_0_d6e7b3ae.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Our bestselling classic in a fresh light blue wash. Crafted in premium Cotton-Lycra blend for all-day stretch and comfort. The signature adjustable waistband grows with her — no compromise on fit, ever.",
    details: [
      "Premium Cotton-Lycra blend — soft, stretchy, skin-friendly",
      "Signature adjustable waistband for a perfect fit year after year",
      "Mid-rise slim fit with 5-pocket construction",
      "Button closure with zip fly",
      "Machine wash cold, tumble dry low",
      "Made in India by Generations Clothing LLP",
      "Free delivery across India · Under ₹1,500",
    ],
    story: "From the sandbox to the stage — the Classic Light Blue is the jean she reaches for first. Clean, versatile, and built to keep up with her energy from morning to bedtime.",
  },
  {
    id: 2,
    sku: "YW-DB-SOLID",
    slug: "classic-dark-blue-jeans",
    name: "Classic Dark Blue Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Dark Blue",
    colorHex: "#2A4A7A",
    pattern: "Solid",
    ageRange: "1–14 years",
    alt: "YWEE girls' classic dark blue stretch denim jeans with adjustable waistband.",
    img: "/images/B0FL1686TQ_0_549c4679.jpg",
    imgPortrait: "/images/B0FL1686TQ_0_549c4679.jpg",
    imgLandscape: "/images/B0FL1686TQ_0_549c4679.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "The deep dark blue that goes with everything. Rich indigo wash in our premium Cotton-Lycra blend. Adjustable waistband, slim mid-rise fit, and the stretch she needs to own every moment.",
    details: [
      "Premium Cotton-Lycra blend — soft, stretchy, skin-friendly",
      "Signature adjustable waistband for a perfect fit year after year",
      "Mid-rise slim fit with 5-pocket construction",
      "Button closure with zip fly",
      "Machine wash cold, tumble dry low",
      "Made in India by Generations Clothing LLP",
      "Free delivery across India · Under ₹1,500",
    ],
    story: "Dark, bold, and completely unstoppable. The Classic Dark Blue is her go-to for school, parties, and everything in between.",
  },
  {
    id: 3,
    sku: "YW-DB-SOLID-2",
    slug: "dark-blue-solid-jeans",
    name: "Dark Blue Solid Jeans",
    category: "Jeans",
    price: 1399,
    currency: "INR",
    color: "Dark Blue",
    colorHex: "#1E3A6A",
    pattern: "Solid",
    ageRange: "1–14 years",
    alt: "YWEE girls' dark blue solid stretch denim jeans.",
    img: "/images/B0FL142X65_0_3f11930b.jpg",
    imgPortrait: "/images/B0FL142X65_0_3f11930b.jpg",
    imgLandscape: "/images/B0FL142X65_0_3f11930b.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "A clean, solid dark blue in our everyday stretch denim. No fuss, all comfort. The adjustable waistband means it fits perfectly today — and still fits perfectly next year.",
    details: [
      "Premium Cotton-Lycra blend — soft, stretchy, skin-friendly",
      "Signature adjustable waistband",
      "Mid-rise slim fit",
      "Machine wash cold",
      "Made in India · Free delivery",
    ],
    story: "Simple, considered, and built to last. The everyday dark blue she'll wear on repeat.",
  },
  {
    id: 4,
    sku: "YW-LB-SOLID-2",
    slug: "light-blue-solid-jeans",
    name: "Light Blue Solid Jeans",
    category: "Jeans",
    price: 1399,
    currency: "INR",
    color: "Light Blue",
    colorHex: "#B8D4EC",
    pattern: "Solid",
    ageRange: "1–14 years",
    alt: "YWEE girls' light blue solid stretch denim jeans.",
    img: "/images/B0FL2TGBKD_0_1c40bf54.jpg",
    imgPortrait: "/images/B0FL2TGBKD_0_1c40bf54.jpg",
    imgLandscape: "/images/B0FL2TGBKD_0_1c40bf54.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Soft, breezy light blue in premium Cotton-Lycra. The solid that pairs with everything in her wardrobe. Adjustable waistband, all-day stretch, made in India.",
    details: [
      "Premium Cotton-Lycra blend",
      "Adjustable waistband",
      "Mid-rise slim fit",
      "Machine wash cold",
      "Made in India · Free delivery",
    ],
    story: "Light, bright, and effortlessly cool. Her favourite light blue, always.",
  },
  {
    id: 5,
    sku: "YW-BK-SOLID",
    slug: "black-solid-jeans",
    name: "Black Solid Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Black",
    colorHex: "#1A1A1A",
    pattern: "Solid",
    ageRange: "1–14 years",
    alt: "YWEE girls' black solid high-rise stretch denim jeans.",
    img: "/images/B0FL2X7BKK_0_f0a46cd4.jpg",
    imgPortrait: "/images/B0FL2X7BKK_0_f0a46cd4.jpg",
    imgLandscape: "/images/B0FL2X7BKK_0_f0a46cd4.jpg",
    sizes: ["3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Bold black in our premium stretch denim. High-rise fit with a clean solid finish — perfect for school, parties, and every occasion she owns. Adjustable waistband, Cotton-Lycra comfort.",
    details: [
      "Premium Cotton-Lycra blend",
      "High-rise fit with adjustable waistband",
      "Slim fit, 5-pocket construction",
      "Machine wash cold",
      "Made in India · Free delivery",
    ],
    story: "Black is always the answer. Bold, fierce, and totally her.",
  },
  {
    id: 6,
    sku: "YW-BK-PRINT",
    slug: "black-cartoon-print-jeans",
    name: "Black Cartoon Print Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Black",
    colorHex: "#1A1A1A",
    pattern: "Cartoon",
    ageRange: "3–14 years",
    alt: "YWEE girls' black stretch denim jeans with playful cartoon and letter print.",
    img: "/images/B0FL2XB7Q5_0_c40a9cb3.jpg",
    imgPortrait: "/images/B0FL2XB7Q5_1_a85db41b.jpg",
    imgLandscape: "/images/B0FL2XB7Q5_2_16c09505.jpg",
    sizes: ["3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Black denim meets bold personality. Playful cartoon and letter prints on our premium Cotton-Lycra stretch fabric. High-rise fit, adjustable waistband, and the attitude to match.",
    details: [
      "Premium Cotton-Lycra blend",
      "Playful cartoon + letter print",
      "High-rise fit with adjustable waistband",
      "Button closure",
      "Machine wash cold, inside out to preserve print",
      "Made in India · Free delivery",
    ],
    story: "Because every outfit deserves a story. The Black Cartoon Print is for the girl who wears her personality.",
  },
  {
    id: 7,
    sku: "YW-DB-CARTOON",
    slug: "dark-blue-cartoon-print-jeans",
    name: "Dark Blue Cartoon Print Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Dark Blue",
    colorHex: "#2A4A7A",
    pattern: "Cartoon",
    ageRange: "1–14 years",
    alt: "YWEE girls' dark blue stretch denim jeans with cartoon heart print.",
    img: "/images/B0FKXWTSMZ_0_8df6310e.jpg",
    imgPortrait: "/images/B0FKXWTSMZ_0_8df6310e.jpg",
    imgLandscape: "/images/B0FKXWTSMZ_0_8df6310e.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Dark blue denim with a playful cartoon heart print — because cool and cute aren't mutually exclusive. Premium Cotton-Lycra stretch, adjustable waistband, and a fit that moves with her.",
    details: [
      "Premium Cotton-Lycra blend",
      "Playful cartoon heart print",
      "Mid-rise slim fit with adjustable waistband",
      "Machine wash cold, inside out",
      "Made in India · Free delivery",
    ],
    story: "Soft on the skin. Fierce in fit. The cartoon print that makes every outfit pop.",
  },
  {
    id: 8,
    sku: "YW-LB-CARTOON",
    slug: "light-blue-cartoon-print-jeans",
    name: "Light Blue Cartoon Print Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Light Blue",
    colorHex: "#A8C8E8",
    pattern: "Cartoon",
    ageRange: "1–14 years",
    alt: "YWEE girls' light blue stretch denim jeans with cartoon print.",
    img: "/images/B0FL16F1NK_0_b30f8615.jpg",
    imgPortrait: "/images/B0FL16F1NK_0_b30f8615.jpg",
    imgLandscape: "/images/B0FL16F1NK_0_b30f8615.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Light blue stretch denim with a fun cartoon print. Soft Cotton-Lycra, adjustable waistband, and all the playful energy she brings to every day.",
    details: [
      "Premium Cotton-Lycra blend",
      "Cartoon print design",
      "Mid-rise slim fit with adjustable waistband",
      "Machine wash cold, inside out",
      "Made in India · Free delivery",
    ],
    story: "From toddler sass to tween class — the light blue cartoon print grows with her personality.",
  },
  {
    id: 9,
    sku: "YW-DB-FLORAL",
    slug: "dark-blue-floral-print-jeans",
    name: "Dark Blue Floral Print Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Dark Blue",
    colorHex: "#2A4A7A",
    pattern: "Floral",
    ageRange: "1–14 years",
    alt: "YWEE girls' dark blue stretch denim jeans with floral print.",
    img: "/images/B0FL2XM93X_0_5e9b0321.jpg",
    imgPortrait: "/images/B0FL2XM93X_1_84b65396.jpg",
    imgLandscape: "/images/B0FL2XM93X_2_247106dc.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Dark blue denim with a delicate floral print — the perfect blend of bold and beautiful. Premium Cotton-Lycra stretch, adjustable waistband, and a design that stands out in every crowd.",
    details: [
      "Premium Cotton-Lycra blend",
      "Delicate floral print",
      "Mid-rise slim fit with adjustable waistband",
      "Machine wash cold, inside out",
      "Made in India · Free delivery",
    ],
    story: "Bold denim, beautiful print. The floral that makes her feel like the main character.",
  },
  {
    id: 10,
    sku: "YW-DB-LETTER",
    slug: "dark-blue-letter-print-jeans",
    name: "Dark Blue Letter Print Jeans",
    category: "Jeans",
    price: 1499,
    currency: "INR",
    color: "Dark Blue",
    colorHex: "#2A4A7A",
    pattern: "Letter Print",
    ageRange: "1–14 years",
    alt: "YWEE girls' dark blue stretch denim jeans with letter print.",
    img: "/images/B0FKYL7KWP_0_9c3fc724.jpg",
    imgPortrait: "/images/B0FKYL7KWP_0_9c3fc724.jpg",
    imgLandscape: "/images/B0FKYL7KWP_0_9c3fc724.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "Dark blue stretch denim with a bold letter print. Statement style in premium Cotton-Lycra — because she has something to say. Adjustable waistband, mid-rise fit, made in India.",
    details: [
      "Premium Cotton-Lycra blend",
      "Bold letter print",
      "Mid-rise slim fit with adjustable waistband",
      "Machine wash cold, inside out",
      "Made in India · Free delivery",
    ],
    story: "She has something to say — and now her jeans do too.",
  },
  {
    id: 12,
    sku: "YW-BL-SHORTS",
    slug: "blue-denim-shorts",
    name: "Denim Shorts",
    category: "Shorts",
    price: 1499,
    currency: "INR",
    color: "Blue",
    colorHex: "#5B8DB8",
    pattern: "Solid",
    ageRange: "2–12 years",
    alt: "YWEE girls' blue denim shorts with side and back pockets.",
    img: "/images/B0FLDYQKVB_0_1fd8a582.jpg",
    imgPortrait: "/images/B0FLDYQKVB_0_1fd8a582.jpg",
    imgLandscape: "/images/B0FLDYQKVB_1_9087b6f2.jpg",
    sizes: ["2–3 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs"],
    description: "YWEE's first denim shorts — designed for India's summers. Mid-thigh length, side and back pockets, and the same Cotton-Lycra stretch that makes our jeans so comfortable. Perfect for beach days, park trips, and hot afternoons.",
    details: [
      "Premium Cotton-Lycra blend — breathable for India's heat",
      "Mid-thigh length — modest and comfortable",
      "Side & back pockets — fully functional",
      "Adjustable elastic waistband",
      "Machine wash cold",
      "Made in India · Free delivery",
    ],
    story: "Hot days, cool denim. The shorts that keep up with her all summer long.",
  },
  {
    id: 11,
    sku: "YW-BL-CLASSIC",
    slug: "blue-classic-jeans",
    name: "Blue Classic Jeans",
    category: "Jeans",
    price: 1399,
    currency: "INR",
    color: "Blue",
    colorHex: "#5B8DB8",
    pattern: "Solid",
    ageRange: "1–14 years",
    alt: "YWEE girls' blue classic stretch denim jeans with adjustable waistband.",
    img: "/images/B0FKH6XYS1_0_6767152a.jpg",
    imgPortrait: "/images/B0FKH6XYS1_0_6767152a.jpg",
    imgLandscape: "/images/B0FKH6XYS1_0_6767152a.jpg",
    sizes: ["1–2 Yrs", "3–4 Yrs", "5–6 Yrs", "7–8 Yrs", "9–10 Yrs", "11–12 Yrs", "13–14 Yrs"],
    description: "The original YWEE blue — a mid-wash classic that started it all. Premium Cotton-Lycra stretch, our signature adjustable waistband, and a fit that feels like it was made just for her.",
    details: [
      "Premium Cotton-Lycra blend — soft, stretchy, skin-friendly",
      "Signature adjustable waistband",
      "Mid-rise slim fit with 5-pocket construction",
      "Machine wash cold",
      "Made in India by Generations Clothing LLP",
      "Free delivery across India · Under ₹1,500",
    ],
    story: "The jean that started it all. Cool, confident, and totally unstoppable.",
  },
];

// ─── Collections ──────────────────────────────────────────────────────────

export const COLLECTIONS: Collection[] = [
  {
    name: "Classic Blues",
    tagline: "The everyday essentials — light blue and dark blue in clean solid washes. Built for every chapter of her story.",
    count: 41,
    season: "Always In",
    img: "/images/ywee-hero-indian-girl_14126918.jpg",
    color: "#2A4A7A",
  },
  {
    name: "Bold Prints",
    tagline: "Cartoon hearts, floral blooms, letter prints — denim with a personality as big as hers.",
    count: 34,
    season: "New Arrivals",
    img: "/images/ywee-journal-style-guide_fe19142c.jpg",
    color: "#7D6D5E",
  },
  {
    name: "Midnight Black",
    tagline: "High-rise black stretch denim. Solid and printed. For the girl who owns every room she walks into.",
    count: 8,
    season: "Spring 2026",
    img: "/images/ywee-lookbook-school_24960550.jpg",
    color: "#1A1A1A",
  },
  {
    name: "Summer Shorts",
    tagline: "Denim shorts for India's long summers. Breathable, comfortable, and endlessly stylish.",
    count: 4,
    season: "Summer 2026",
    img: "/images/ywee-prod-shorts-blue_4607084d.jpg",
    color: "#5B8DB8",
  },
];

// ─── Lookbook ─────────────────────────────────────────────────────────────
// Using product images as lookbook entries since we have real product photography

export const LOOKBOOK: LookbookImage[] = [
  {
    id: 1, color: "#A8C8E8",
    alt: "YWEE classic light blue stretch denim jeans — girls' kidswear.",
    src: "/images/B0FL16ZFCH_0_d6e7b3ae.jpg",
    srcPortrait: "/images/B0FL16ZFCH_0_d6e7b3ae.jpg",
    srcLandscape: "/images/B0FL16ZFCH_0_d6e7b3ae.jpg",
    width: 800, height: 800,
  },
  {
    id: 2, color: "#2A4A7A",
    alt: "YWEE dark blue cartoon print stretch denim jeans.",
    src: "/images/B0FKXWTSMZ_0_8df6310e.jpg",
    srcPortrait: "/images/B0FKXWTSMZ_0_8df6310e.jpg",
    srcLandscape: "/images/B0FKXWTSMZ_0_8df6310e.jpg",
    width: 800, height: 800,
  },
  {
    id: 3, color: "#1A1A1A",
    alt: "YWEE black cartoon print high-rise stretch denim jeans.",
    src: "/images/B0FL2XB7Q5_0_c40a9cb3.jpg",
    srcPortrait: "/images/B0FL2XB7Q5_1_a85db41b.jpg",
    srcLandscape: "/images/B0FL2XB7Q5_2_16c09505.jpg",
    width: 800, height: 1000,
  },
  {
    id: 4, color: "#2A4A7A",
    alt: "YWEE dark blue floral print stretch denim jeans.",
    src: "/images/B0FL2XM93X_0_5e9b0321.jpg",
    srcPortrait: "/images/B0FL2XM93X_1_84b65396.jpg",
    srcLandscape: "/images/B0FL2XM93X_2_247106dc.jpg",
    width: 800, height: 1000,
  },
  {
    id: 5, color: "#2A4A7A",
    alt: "YWEE dark blue letter print stretch denim jeans.",
    src: "/images/B0FKYL7KWP_0_9c3fc724.jpg",
    srcPortrait: "/images/B0FKYL7KWP_0_9c3fc724.jpg",
    srcLandscape: "/images/B0FKYL7KWP_0_9c3fc724.jpg",
    width: 800, height: 800,
  },
  {
    id: 6, color: "#A8C8E8",
    alt: "YWEE light blue cartoon print stretch denim jeans.",
    src: "/images/B0FL16F1NK_0_b30f8615.jpg",
    srcPortrait: "/images/B0FL16F1NK_0_b30f8615.jpg",
    srcLandscape: "/images/B0FL16F1NK_0_b30f8615.jpg",
    width: 800, height: 800,
  },
  {
    id: 7, color: "#2A4A7A",
    alt: "YWEE dark blue solid stretch denim jeans.",
    src: "/images/B0FL142X65_0_3f11930b.jpg",
    srcPortrait: "/images/B0FL142X65_0_3f11930b.jpg",
    srcLandscape: "/images/B0FL142X65_0_3f11930b.jpg",
    width: 800, height: 800,
  },
  {
    id: 8, color: "#B8D4EC",
    alt: "YWEE light blue solid stretch denim jeans.",
    src: "/images/B0FL2TGBKD_0_1c40bf54.jpg",
    srcPortrait: "/images/B0FL2TGBKD_0_1c40bf54.jpg",
    srcLandscape: "/images/B0FL2TGBKD_0_1c40bf54.jpg",
    width: 800, height: 800,
  },
  {
    id: 9, color: "#1A1A1A",
    alt: "YWEE black solid high-rise stretch denim jeans.",
    src: "/images/B0FL2X7BKK_0_f0a46cd4.jpg",
    srcPortrait: "/images/B0FL2X7BKK_0_f0a46cd4.jpg",
    srcLandscape: "/images/B0FL2X7BKK_0_f0a46cd4.jpg",
    width: 800, height: 800,
  },
  {
    id: 10, color: "#A8C8E8",
    alt: "Indian girl wearing YWEE light blue denim — hero campaign.",
    src: "/images/ywee-hero-indian-girl_14126918.jpg",
    srcPortrait: "/images/ywee-prod-lightblue-classic_68949166.jpg",
    srcLandscape: "/images/ywee-hero-indian-girl_14126918.jpg",
    width: 1200, height: 800,
  },
  {
    id: 11, color: "#2A4A7A",
    alt: "Two Indian girls wearing YWEE denim — best friends campaign.",
    src: "/images/ywee-hero-2-girls_58816b6d.jpg",
    srcPortrait: "/images/ywee-prod-darkblue-slim_c86f48af.jpg",
    srcLandscape: "/images/ywee-hero-2-girls_58816b6d.jpg",
    width: 1200, height: 800,
  },
  {
    id: 12, color: "#1A1A1A",
    alt: "YWEE school lookbook — Indian girls in dark blue denim.",
    src: "/images/ywee-lookbook-school_24960550.jpg",
    srcPortrait: "/images/ywee-prod-black-denim_45de4206.jpg",
    srcLandscape: "/images/ywee-lookbook-school_24960550.jpg",
    width: 1200, height: 800,
  },
  {
    id: 13, color: "#7D6D5E",
    alt: "YWEE collection hero — full range of girls' denim.",
    src: "/images/ywee-collection-hero_0b2ed6cf.jpg",
    srcPortrait: "/images/ywee-prod-lightblue-floral_1dbbcae4.jpg",
    srcLandscape: "/images/ywee-collection-hero_0b2ed6cf.jpg",
    width: 1200, height: 800,
  },
];

// ─── Journal ──────────────────────────────────────────────────────────────

export const JOURNAL: JournalArticle[] = [
  {
    slug: "denim-that-grows-with-her",
    title: "Denim That Grows With Her",
    deck: "Why we built the adjustable waistband — and how one small detail changes everything about kids' clothing.",
    category: "Brand Story",
    read: "4 min read",
    img: "/images/ywee-journal-back-to-school_8cad1efb.jpg",
    alt: "Indian girl wearing YWEE denim — back to school campaign.",
    body: `There is a problem that every parent knows: kids grow fast. A pair of jeans that fits perfectly in September is too small by December. The waistband digs in. The length is wrong. You buy new ones.\n\nWe built YWEE to solve this. Our signature adjustable waistband is a simple idea — an internal elastic with button positions that can be moved as she grows. It sounds small. In practice, it means a pair of YWEE jeans can fit a child for two years instead of six months.\n\nThis is not just about saving money (though it does). It is about reducing waste. It is about the confidence that comes from wearing something that fits properly. And it is about the freedom to focus on what matters — her adventures, her creativity, her energy — without worrying about whether her jeans are keeping up.\n\nWe make stretch denim for girls aged 1 to 14. Every pair is crafted in premium Cotton-Lycra that moves as freely as she does. Every pair has our adjustable waistband. Every pair is priced under ₹1,500 and delivered free across India.\n\nFrom the sandbox to the stage. From toddler sass to tween class. Denim that grows with her.`,
  },
  {
    slug: "cotton-lycra-why-it-matters",
    title: "Why Cotton-Lycra Changes Everything",
    deck: "The fabric story behind YWEE's signature stretch — and why we chose comfort over convention.",
    category: "Material",
    read: "5 min read",
    img: "/images/ywee-journal-denim-care_3f2a9b2d.jpg",
    alt: "YWEE denim fabric detail — Cotton-Lycra stretch.",
    body: `Traditional denim is stiff. It is designed for durability, not movement. For adults, this can be a feature — the structure of a raw denim jean is part of its appeal. For a child who is running, jumping, climbing, and sitting cross-legged on a classroom floor, stiff denim is a problem.\n\nCotton-Lycra changes this. The Lycra (elastane) content — typically 2–5% in our fabric — gives the denim a four-way stretch that moves with the body. The Cotton component keeps it breathable, soft against the skin, and durable through hundreds of washes.\n\nWe spent months testing fabrics before settling on our current blend. The criteria were simple: it had to feel soft from the first wear, it had to stretch without losing its shape, and it had to look like proper denim — not leggings pretending to be jeans.\n\nThe result is a fabric that parents trust and kids love. Soft on the skin. Fierce in fit. That is the YWEE promise.`,
  },
  {
    slug: "style-guide-ages-1-to-14",
    title: "YWEE Style Guide: Ages 1 to 14",
    deck: "How to style YWEE denim at every age — from toddler pull-ons to tween statement pieces.",
    category: "Style",
    read: "6 min read",
    img: "/images/ywee-journal-style-guide_fe19142c.jpg",
    alt: "Indian girls styled in YWEE denim — style guide editorial.",
    body: `YWEE makes denim for girls aged 1 to 14. That is a wide range — and the styling possibilities are just as wide.\n\n**Ages 1–4: The Toddler Years**\nFor our youngest customers, we recommend our pull-on styles with the adjustable waistband set to its most relaxed position. Pair with a bright t-shirt and soft-soled shoes. The Cotton-Lycra stretch makes nappy changes easy and playground adventures effortless.\n\n**Ages 5–8: The Explorer Years**\nThis is the age of cartoon prints and bold colours. Our Dark Blue Cartoon Print and Light Blue Cartoon Print are bestsellers in this age group. Pair with a graphic tee and colourful sneakers. The adjustable waistband means the same pair can last through a full school year.\n\n**Ages 9–12: The Style Years**\nAs she develops her own sense of style, our Floral Print and Letter Print styles give her something to express herself with. Pair with a plain white or black top to let the denim do the talking.\n\n**Ages 13–14: The Tween Years**\nOur Black Solid and Black Cartoon Print styles are popular with our oldest customers. High-rise fit, bold design, and the same Cotton-Lycra comfort she has grown up with. Pair with a crop top or oversized hoodie.\n\nAt every age, the YWEE adjustable waistband means the fit is always right. From toddler sass to tween class — she owns it in YWEE.`,
  },
];

// ─── Hero ─────────────────────────────────────────────────────────────────
// AI-generated golden hour hero — Indian girl in YWEE denim, cinematic
export const HERO_VIDEO = "";
export const HERO_POSTER = "/images/ywee-hero-golden-hour-v1_0546180c.jpg";

// ─── Lifestyle & Brand Images ────────────────────────────────────────────
// AI-generated with Indian child models — for homepage, lookbook, atelier
export const BRAND_IMAGES = {
  heroMain: "/images/ywee-hero-indian-girl_14126918.jpg",
  heroGroup: "/images/ywee-hero-2-girls_58816b6d.jpg",
  collectionHero: "/images/ywee-collection-hero_0b2ed6cf.jpg",
  lookbookHero: "/images/ywee-lookbook-hero_56f56321.jpg",
  atelierBrand: "/images/ywee-atelier-brand_a219e26f.jpg",
  atelierFabric: "/images/ywee-atelier-fabric_92303576.jpg",
  lookbookSchool: "/images/ywee-lookbook-school_24960550.jpg",
  journalCare: "/images/ywee-journal-denim-care_3f2a9b2d.jpg",
  journalStyle: "/images/ywee-journal-style-guide_fe19142c.jpg",
  journalSchool: "/images/ywee-journal-back-to-school_8cad1efb.jpg",
  prodLightblue: "/images/ywee-prod-lightblue-classic_68949166.jpg",
  prodDarkblue: "/images/ywee-prod-darkblue-slim_c86f48af.jpg",
  prodBlack: "/images/ywee-prod-black-denim_45de4206.jpg",
  prodShorts: "/images/ywee-prod-shorts-blue_4607084d.jpg",
  prodFloral: "/images/ywee-prod-lightblue-floral_1dbbcae4.jpg",
};

// ─── Categories ───────────────────────────────────────────────────────────
export const CATEGORIES = ["All", "Jeans", "Shorts"];
