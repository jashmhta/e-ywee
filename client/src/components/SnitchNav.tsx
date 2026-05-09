import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useBag } from "@/contexts/BagContext";

// ── SVG icons (inline, no dependency) ────────────────────────────────────────
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "var(--ink)" : "var(--ink-faint)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const ShopIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "var(--ink)" : "var(--ink-faint)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const LookbookIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "var(--ink)" : "var(--ink-faint)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1"/>
    <rect x="13" y="3" width="8" height="8" rx="1"/>
    <rect x="3" y="13" width="8" height="8" rx="1"/>
    <rect x="13" y="13" width="8" height="8" rx="1"/>
  </svg>
);

const JournalIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "var(--ink)" : "var(--ink-faint)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
  </svg>
);

const BagIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "var(--ink)" : "var(--ink-faint)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/shop", label: "Shop", icon: ShopIcon },
  { href: "/lookbook", label: "Lookbook", icon: LookbookIcon },
  { href: "/journal", label: "Journal", icon: JournalIcon },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function SnitchNav() {
  const [location, navigate] = useLocation();
  const { totalItems, openBag } = useBag();
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
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

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="snitch-nav" role="navigation" aria-label="Mobile navigation"
      style={{ transform: navVisible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.href}
          className={`snitch-btn ${isActive(item.href) ? "active" : ""}`}
          onClick={() => navigate(item.href)}
          aria-label={item.label}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          <item.icon active={isActive(item.href)} />
          <span>{item.label}</span>
        </button>
      ))}

      {/* Bag button with badge */}
      <button
        className={`snitch-btn ${location === "/bag" ? "active" : ""}`}
        onClick={openBag}
        aria-label={`Bag${totalItems > 0 ? `, ${totalItems} items` : ""}`}
        style={{ position: "relative" }}
      >
        <div style={{ position: "relative" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={location === "/bag" ? "var(--ink)" : "var(--ink-faint)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {totalItems > 0 && (
            <span className="snitch-badge">{totalItems > 9 ? "9+" : totalItems}</span>
          )}
        </div>
        <span>Bag</span>
      </button>
    </nav>
  );
}
