# ywee — Considered Clothing · TODO

## Phase 3: Schema, Styles, Data
- [x] Database schema: users, orders tables with full fields
- [x] Shared data/types file with product, journal, lookbook, collections data
- [x] Global CSS with Editorial Luxury design tokens (parchment palette, Fraunces/Geist)
- [x] Google Fonts integration (Fraunces + Geist)

## Phase 4: Core Layout & Navigation
- [x] Announcement bar (scrolling ticker)
- [x] Top navigation (Shop, Lookbook, Atelier, Journal + Account + Bag)
- [x] Footer with brand links and newsletter signup
- [x] App.tsx routing for all pages
- [x] BagContext (cart state management)
- [x] BagDrawer (slide-out with item management, quantity controls, order summary)

## Phase 5: Core Commerce Pages
- [x] Homepage: hero video, featured collections, editorial sections, newsletter
- [x] Shop page: product grid, filtering by category, product count
- [x] Product detail page: image gallery, size selector, add-to-bag, description, details, story

## Phase 6: Bag & Checkout
- [x] Bag drawer (slide-out): item list, quantity controls, order summary, free shipping threshold
- [x] Checkout page: shipping form, payment form, order confirmation

## Phase 7: Brand Editorial Pages
- [x] Lookbook page: editorial image grid, collection storytelling, shop-the-look
- [x] Journal page: article listing grid with featured article
- [x] Journal article detail page with full body text and related articles
- [x] About/Atelier page: brand story, values, studio locations, mending CTA

## Phase 8: Account
- [x] Account page: auth state (sign-in prompt), order history, wishlist, profile management

## Phase 9: Supporting Pages
- [x] Care page
- [x] Mending page
- [x] Shipping page (with international zones table)
- [x] Sizing page (with size guide table)
- [x] Stockists page
- [x] Press page
- [x] Privacy page
- [x] Terms page
- [x] Cookies page (with preference toggles)
- [x] Contact page (with form)

## Phase 10: Backend tRPC
- [x] Orders router: create (protected), list (protected)
- [x] Newsletter router: subscribe (public)
- [x] Auth router: me, logout

## Phase 11: Polish & Tests
- [x] Vitest unit tests for all routers (8 tests, all passing)
- [x] TypeScript: 0 errors
- [x] Checkpoint save

## Phase 12: UI/UX Upgrade (Complete)
- [x] Horizontal category scroll rail with drag-to-scroll on Shop
- [x] Quick-view modal: slide-up panel with size selector + add-to-bag
- [x] Grid / List view toggle on Shop
- [x] Price range filter panel with animated reveal
- [x] Bottom marquee band on Shop
- [x] Snitch-style mobile bottom nav (SnitchNav) with active indicators + bag badge
- [x] Magnetic cursor with ring + label on desktop
- [x] Search overlay in Nav with keyboard dismiss
- [x] Hover mega-menu dropdown in Nav
- [x] Frosted glass Nav on scroll
- [x] BagDrawer: free-shipping progress bar
- [x] BagDrawer: "You may also like" upsell rail
- [x] BagDrawer: trust signals footer
- [x] BagDrawer: last-added item highlight animation
- [x] Scroll reveal animations on product cards
- [x] Product card hover: zoom + quick-view button reveal
- [x] Color dot indicator on product cards
- [x] Homepage rebuilt: scroll-jacked hero, marquee bands, horizontal rails, video sections
- [x] All tests passing (8/8)
- [x] Zero TypeScript errors

## Bug Fixes
- [x] Fix responsiveness broken across mobile/tablet/desktop breakpoints

## Phase 13: Content Adaptation — Real YWEE Brand
- [x] Rewrote store.ts with 15 real YWEE products (Cotton-Lycra denim, ages 1–14, INR pricing)
- [x] Updated product collections: Classic Blues, Bold Prints, Midnight Black, Jogger Jeans
- [x] Updated journal articles with YWEE-relevant content (denim care, sizing, style guides)
- [x] Updated homepage hero copy: "She Owns Every Day"
- [x] Updated marquee bands: Girls' Stretch Denim, Ages 1–14, Free Delivery India
- [x] Updated video section copy: "Built for her energy"
- [x] Updated Nav announcement bar with YWEE brand messages
- [x] Updated Atelier page: brand story, values, studios (Surat/Mumbai/Pan-India)
- [x] Updated Care page: Cotton-Lycra wash instructions, adjustable waistband care
- [x] Updated Mending → Returns page: 30-day returns, exchanges, defective items
- [x] Updated Shipping page: India-specific delivery zones, COD, free delivery
- [x] Updated Sizing page: girls' age/height size guide (1Y–14Y)
- [x] Updated Stockists page: Indian retail partners (FirstCry, Myntra, Amazon, Flipkart)
- [x] Updated Footer: Girls' Stretch Denim, India est. 2024, correct shop categories
- [x] 8/8 tests passing, 0 TypeScript errors

## Phase 14: MVP Asset Generation & Exhaustive Catalogue
- [x] Generate hero banner images with Indian child models (studio quality)
- [x] Generate lookbook editorial images with Indian child models
- [x] Generate product card lifestyle images (Indian child models, all 4 styles)
- [x] Generate journal/blog article images (brand story, care, style guides)
- [x] Generate brand video replacement (hero reel with Indian child models)
- [x] Upload all 15 AI images + hero video to webdev static storage
- [x] Upload all 11 real product images to webdev static storage
- [x] Rewrite store.ts with 12 exhaustive products, full names, INR pricing, real URLs
- [x] Add Denim Shorts product + Summer Shorts collection
- [x] Add BRAND_IMAGES export with all AI asset URLs
- [x] Replace hero video URL with AI-generated brand video
- [x] Replace all Pexels images in Atelier.tsx with real YWEE brand images
- [x] Replace Pexels fallback in Lookbook.tsx
- [x] Update Lookbook captions, piece names, hero copy, INR pricing to YWEE brand
- [x] CSS brace balance verified (266 opens = 266 closes)
- [x] 8/8 tests passing, 0 TypeScript errors

## Phase 15: Full Accuracy + Mobile Fix + Asset Optimization
- [x] Extract 100% real product data from ZIP (names, prices, descriptions, sizes, ASINs)
- [x] Rewrite store.ts with zero placeholders — real INR prices, real descriptions, real sizes
- [x] Fix all mobile responsiveness across every page
- [x] Optimize all images (compress, correct aspect ratios, lazy load)
- [x] Audit every page for currency/copy/image/link inconsistencies
- [x] 8/8 tests passing, 0 TypeScript errors

## Phase 16: Custom Loader
- [x] Build premium YWEE brand loader with asset-load tracking and progress bar
- [x] Cinematic dismiss animation (curtain wipe + logo fade)
- [x] Integrate into App.tsx — blocks render until fonts + critical images loaded

## Phase 17: Final Accuracy Fix Pass (Current Session)
- [x] store.ts: Season labels fixed — "Resort 26" → "Spring 2026", "Summer 26" → "Summer 2026"
- [x] SupportPages.tsx: Press items, Contact timezone, Privacy address, Terms governing law updated to India
- [x] Checkout.tsx: Default country changed to "IN" (India), shipping threshold fixed to ₹999, shipping fee ₹99
- [x] Nav.tsx: Announcement bar locations — "Lisbon · Milan · Barcelona" → "Surat · Mumbai · Delhi"
- [x] Home.tsx: All European city references replaced with Indian cities
- [x] Shop.tsx: "Resort 26" → "New Arrivals", dollar signs → INR
- [x] Lookbook.tsx: Season labels, captions, hero copy updated to YWEE brand
- [x] Product.tsx: Line 307 — "Free worldwide shipping on orders over $250" → "Free delivery across India on orders over ₹999"
- [x] ComponentShowcase.tsx: Confirmed not routed in App.tsx — template demo file, safely ignored
- [x] BagDrawer.tsx: Free-shipping threshold updated to ₹999, shipping fee ₹99, all prices in INR
- [x] Product.tsx: Related products price fixed to INR (₹)
- [x] Home.tsx: Quick-view modal price + marquee price + outfit builder total all fixed to INR
- [x] Shop.tsx: List-view price fixed to INR
- [x] Checkout.tsx: All order summary prices (line items, subtotal, shipping, total, CTA button) fixed to INR
- [x] SupportPages.tsx: Stockists subtitle changed from "worldwide" to "across India"
- [x] Full grep audit: zero dollar signs, zero European cities, zero old season labels in routed pages
- [x] TypeScript: 0 errors confirmed
- [x] Tests: 8/8 passing confirmed

## Phase 18: Hero Video + Mobile Nav + More Products + Brand Content
- [x] Search Pexels API (key provided) for best context-appropriate hero video (Indian girls/kids/denim/fashion)
- [x] Generated golden hour YWEE hero image (AI) — uploaded to /manus-storage/ywee-hero-golden-hour-v1_0546180c.jpg
- [x] ZIP audit: all 12 products already in catalogue; updated Blue Jeans + Denim Shorts with real product images
- [x] Mobile header: two frosted-glass pill buttons — left pill (ywee logo/branding), right pill (bag icon + hamburger)
- [x] Scroll-hide behavior: both desktop header and SnitchNav bottom nav hide on scroll-down, reappear on scroll-up/stop (800ms)
- [x] Brand content fixes: hero headline → "From the Sandbox to the Stage", ValuesStrip → real YWEE stats (96 styles, 1-14 yrs, ₹0 delivery), Atelier mending link → /support

## Phase 19: Loader Branding + Mobile Hero + Cursor Removal
- [x] Redesign YweeLoader with YWEE brand identity (wordmark, denim-blue palette, brand tagline)
- [x] Fix hero image not visible on mobile (min-height, object-fit, z-index)
- [x] Remove custom magnetic cursor entirely (MagneticCursor component + all data-cursor-* attrs)
- [x] Build full ZIP with project source + all webdev-static-assets
