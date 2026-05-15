import { Link } from "wouter";

const LINKS = {
  Shop: [
    { label: "All pieces", path: "/shop" },
    { label: "Light Wash", path: "/shop/light-wash" },
    { label: "Dark Indigo", path: "/shop/dark-indigo" },
    { label: "Embellished", path: "/shop/embellished" },
    { label: "Onyx Black", path: "/shop/black" },
    { label: "Saved", path: "/wishlist" },
  ],
  Brand: [
    { label: "Atelier", path: "/atelier" },
    { label: "Lookbook", path: "/lookbook" },
    { label: "Journal", path: "/journal" },
    { label: "Stockists", path: "/stockists" },
    { label: "Press kit", path: "/press-kit" },
    { label: "ywee Insiders", path: "/loyalty" },
  ],
  Service: [
    { label: "Track an order", path: "/track" },
    { label: "Shipping", path: "/shipping" },
    { label: "Sizing", path: "/sizing" },
    { label: "Care", path: "/care" },
    { label: "Mending", path: "/mending" },
    { label: "Contact", path: "/contact" },
  ],
  Legal: [
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
    { label: "Cookies", path: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 48px) clamp(24px, 4vw, 40px)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        {/* Top: Brand + Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "clamp(32px, 4vw, 48px)",
            paddingBottom: "clamp(40px, 6vw, 64px)",
            borderBottom: "1px solid rgba(244,239,230,0.12)",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "28px",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "-0.02em",
                color: "var(--paper)",
                display: "block",
                marginBottom: "16px",
              }}
            >
              y<strong style={{ fontWeight: 600, fontStyle: "normal" }}>w</strong>ee
            </Link>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(244,239,230,0.45)",
                lineHeight: 1.6,
              }}
            >
              Girls' Stretch Denim
              <br />
              India, est. 2024
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(244,239,230,0.35)",
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                {section}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {items.map(({ label, path }) => (
                  <li key={`${section}-${label}`}>
                    <Link
                      href={path}
                      style={{
                        fontSize: "13px",
                        color: "rgba(244,239,230,0.6)",
                        letterSpacing: "0.02em",
                        transition: "color 0.22s",
                      }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--paper)")}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(244,239,230,0.6)")}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "11px", color: "rgba(244,239,230,0.3)", letterSpacing: "0.06em" }}>
            © {new Date().getFullYear()} ywee. All rights reserved.
          </p>
          <p style={{ fontSize: "11px", color: "rgba(244,239,230,0.3)", letterSpacing: "0.06em" }}>
            Made with care in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
