import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useBag } from "@/contexts/BagContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/contexts/CurrencyContext";
import { Heart } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";
import { FreeShippingBar } from "./FreeShippingBar";

const ANNOUNCEMENTS = [
  "Free delivery across India on every order",
  "Mended for life — guaranteed",
  "Adjustable waistband · grows with her",
  "Premium Cotton-Lycra stretch denim",
  "Girls' denim for ages 1–14 years",
  "Made in Surat · since 2024",
];

const NAV_LINKS = [
  { label: "Shop", path: "/shop", sub: ["Light Wash", "Dark Indigo", "Embellished", "Onyx Black", "Ages 1–4", "Ages 5–8", "Ages 9–14"] },
  { label: "Lookbook", path: "/lookbook", sub: ["Resort 26", "Light Wash", "Dark Indigo", "Onyx"] },
  { label: "Atelier", path: "/atelier", sub: ["Our Story", "Our Fabric", "Made in India", "Mended for Life"] },
  { label: "Journal", path: "/journal", sub: ["Brand Story", "Material", "Style Guide", "Care Tips"] },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openBag, totalItems } = useBag();
  const { count: wishCount } = useWishlist();
  const { currency, setCurrency } = useCurrency();
  const [location] = useLocation();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      setScrolled(y > 8);
      if (y > 80) {
        if (delta > 4) setNavVisible(false);
        else if (delta < -4) setNavVisible(true);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = y;
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setNavVisible(true), 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(scrollTimer.current); };
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); setCurrencyOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (path: string) => location === path || location.startsWith(path + "/");
  const onNavEnter = (label: string) => { clearTimeout(hoverTimer.current); setActiveHover(label); };
  const onNavLeave = () => { hoverTimer.current = setTimeout(() => setActiveHover(null), 180); };

  return (
    <>
      {/* ── Announcement bar ─────────────────────────────────── */}
      <div style={{ background: "var(--ink)", color: "var(--paper)", height: "36px", overflow: "hidden", display: "flex", alignItems: "center", position: "relative", zIndex: 50 }}>
        <div className="announce-track" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 28px", opacity: 0.85 }}>{item}</span>
              <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--paper)", opacity: 0.35, flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── Desktop header (sticky, scroll-hide) ─────────────── */}
      <header className="desktop-header" style={{
        position: "sticky", top: 0, zIndex: 40,
        background: scrolled ? "rgba(244,239,230,0.96)" : "var(--paper)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid rgba(26,25,22,0.08)",
        display: "grid", gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "0 clamp(20px, 4vw, 48px)",
        height: "60px",
        transition: "background 0.4s, box-shadow 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: scrolled ? "0 1px 20px rgba(26,25,22,0.07)" : "none",
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
      }}>
        {/* Left nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 2.4vw, 32px)" }}>
          {NAV_LINKS.map(({ label, path, sub }) => (
            <div key={path} style={{ position: "relative" }} onMouseEnter={() => onNavEnter(label)} onMouseLeave={onNavLeave}>
              <Link href={path} style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: isActive(path) ? "var(--ink)" : "var(--ink-mute)", transition: "color 0.22s", fontWeight: isActive(path) ? 500 : 400 }} className="nav-link desktop-nav-link">
                {label}
              </Link>
              <div style={{ position: "absolute", top: "calc(100% + 12px)", left: "-12px", background: "var(--paper-soft)", border: "1px solid rgba(26,25,22,0.08)", padding: "16px 0", minWidth: "160px", opacity: activeHover === label ? 1 : 0, transform: activeHover === label ? "translateY(0)" : "translateY(-6px)", pointerEvents: activeHover === label ? "auto" : "none", transition: "opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out)", boxShadow: "0 8px 32px rgba(26,25,22,0.08)", zIndex: 10 }}>
                {sub.map(s => (
                  <Link key={s} href={path} style={{ display: "block", padding: "8px 20px", fontSize: "12px", letterSpacing: "0.06em", color: "var(--ink-mute)", transition: "color 0.18s, background 0.18s", textDecoration: "none" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; (e.currentTarget as HTMLElement).style.background = "var(--paper-warm)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-mute)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>{s}</Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Brand wordmark */}
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: "22px", fontWeight: 300, letterSpacing: "-0.02em", textAlign: "center", color: "var(--ink)", fontStyle: "italic", userSelect: "none", textDecoration: "none", transition: "opacity 0.22s" }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.65")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
          y<strong style={{ fontWeight: 600, fontStyle: "normal" }}>w</strong>ee
        </Link>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "clamp(10px, 1.6vw, 20px)" }}>
          {/* Currency switcher */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCurrencyOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={currencyOpen}
              data-cursor="hover"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 6px" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}
            >
              {currency.flag} {currency.code}
            </button>
            {currencyOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "var(--paper-soft)",
                  border: "1px solid rgba(26,25,22,0.10)",
                  boxShadow: "0 12px 36px rgba(26,25,22,0.12)",
                  minWidth: "160px",
                  padding: "6px",
                  zIndex: 12,
                }}
              >
                {Object.entries(CURRENCIES).map(([code, c]) => (
                  <button
                    key={code}
                    role="menuitem"
                    onClick={() => { setCurrency(code as CurrencyCode); setCurrencyOpen(false); }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: code === currency.code ? "var(--paper-warm)" : "transparent",
                      border: "none",
                      padding: "8px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "var(--ink)",
                      fontFamily: "var(--sans)",
                      letterSpacing: "0.06em",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                    <span style={{ marginInlineStart: "auto", color: "var(--ink-faint)", fontSize: "11px" }}>{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            data-cursor="hover"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", display: "flex", alignItems: "center", transition: "color 0.22s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}
            aria-label="Search products"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          <Link href="/wishlist" data-cursor="hover" aria-label={`Saved (${wishCount})`}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--ink-mute)", textDecoration: "none", position: "relative" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}
          >
            <Heart size={16} strokeWidth={1.5} fill={wishCount > 0 ? "currentColor" : "none"} />
            {wishCount > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-10px", minWidth: "16px", height: "16px", borderRadius: "8px", background: "var(--ink)", color: "var(--paper)", fontSize: "9px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{wishCount > 9 ? "9+" : wishCount}</span>
            )}
          </Link>

          <Link href="/account" data-cursor="hover" className="desktop-nav-link" style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", transition: "color 0.22s", textDecoration: "none" }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}>Account</Link>
          <button onClick={openBag} data-cursor="hover" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", cursor: "pointer", background: "none", border: "none", transition: "color 0.22s", fontFamily: "var(--sans)" }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}>
            Bag
            {totalItems > 0 && <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "18px", height: "18px", borderRadius: "9px", background: "var(--ink)", color: "var(--paper)", fontSize: "10px", fontWeight: 600, letterSpacing: 0, padding: "0 4px" }}>{totalItems > 9 ? "9+" : totalItems}</span>}
          </button>
        </div>
      </header>

      {/* Free shipping progress bar — only renders when bag has items */}
      <FreeShippingBar />

      {/* ── Mobile floating glass pills ───────────────────────── */}
      <div className="mobile-pills" style={{ position: "fixed", top: "clamp(12px, 3vw, 20px)", left: 0, right: 0, zIndex: 55, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", pointerEvents: "none", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s", transform: navVisible ? "translateY(0)" : "translateY(-120%)", opacity: navVisible ? 1 : 0 }}>
        {/* Left pill — branding */}
        <Link href="/" style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", padding: "10px 18px", background: "rgba(244,239,230,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: "100px", border: "1px solid rgba(26,25,22,0.10)", boxShadow: "0 4px 20px rgba(26,25,22,0.12)", fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", textDecoration: "none", userSelect: "none" }}>
          y<strong style={{ fontWeight: 600, fontStyle: "normal" }}>w</strong>ee
        </Link>

        {/* Right pill — bag + hamburger */}
        <div style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", gap: "2px", padding: "8px 12px", background: "rgba(244,239,230,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: "100px", border: "1px solid rgba(26,25,22,0.10)", boxShadow: "0 4px 20px rgba(26,25,22,0.12)" }}>
          {/* Bag */}
          <button onClick={openBag} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px 8px", position: "relative" }} aria-label={`Bag${totalItems > 0 ? `, ${totalItems} items` : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {totalItems > 0 && <span style={{ position: "absolute", top: "0px", right: "2px", minWidth: "14px", height: "14px", borderRadius: "7px", background: "var(--ink)", color: "var(--paper)", fontSize: "8px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>{totalItems > 9 ? "9+" : totalItems}</span>}
          </button>
          {/* Divider */}
          <span style={{ width: "1px", height: "16px", background: "rgba(26,25,22,0.15)", flexShrink: 0 }} />
          {/* Hamburger */}
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px", padding: "4px 8px", width: "34px" }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: "block", height: "1.5px", background: "var(--ink)", borderRadius: "2px", transition: "all 0.45s cubic-bezier(0.32, 0.72, 0, 1)", transformOrigin: "center", transform: mobileOpen ? i === 0 ? "translateY(5.5px) rotate(45deg)" : i === 1 ? "scaleX(0)" : "translateY(-5.5px) rotate(-45deg)" : "none", opacity: mobileOpen && i === 1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </div>

      {/* ── Full search overlay (replaces old inline input) ── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Mobile nav overlay ───────────────────────────────── */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: "24px", lineHeight: 1 }}>×</button>
        <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", fontFamily: "var(--serif)", fontSize: "20px", fontStyle: "italic", color: "var(--ink-faint)" }}>
          y<strong style={{ fontWeight: 600, fontStyle: "normal" }}>w</strong>ee
        </div>
        {[
          { label: "Shop", path: "/shop" },
          { label: "Lookbook", path: "/lookbook" },
          { label: "Atelier", path: "/atelier" },
          { label: "Journal", path: "/journal" },
          { label: "Saved", path: "/wishlist" },
          { label: "Track", path: "/track" },
          { label: "Insiders", path: "/loyalty" },
          { label: "Account", path: "/account" },
        ].map(({ label, path }) => (
          <Link key={path} href={path} onClick={() => setMobileOpen(false)}>{label}</Link>
        ))}
        <button onClick={() => { setMobileOpen(false); openBag(); }} style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", background: "none", border: "none", cursor: "pointer", opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 330ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) 330ms" }} className={mobileOpen ? "mobile-nav-visible" : ""}>
          Bag {totalItems > 0 && `(${totalItems})`}
        </button>
        <div style={{ position: "absolute", bottom: "clamp(24px, 5vw, 48px)", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Surat · Mumbai · Delhi</p>
        </div>
      </div>

      <style>{`
        .desktop-header { display: grid; }
        .desktop-nav-link { display: none; }
        .mobile-pills { display: none; }
        @media (min-width: 768px) {
          .desktop-header { display: grid !important; }
          .desktop-nav-link { display: inline-flex; }
          .mobile-menu-btn { display: none; }
          .mobile-pills { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-header { display: none !important; }
          .mobile-pills { display: flex !important; }
          .desktop-nav-link { display: none !important; }
        }
        .nav-link { position: relative; text-decoration: none; }
        .nav-link::after { content: ""; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: var(--ink); transition: width 0.52s cubic-bezier(0.16, 1, 0.3, 1); }
        .nav-link:hover { color: var(--ink) !important; }
        .nav-link:hover::after { width: 100%; }
        .mobile-nav.open button.mobile-nav-visible { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </>
  );
}
