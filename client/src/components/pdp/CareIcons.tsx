const CARE = [
  { id: "wash", label: "30°C wash", svg: "M3 5h18l-2 14a2 2 0 01-2 2H7a2 2 0 01-2-2L3 5z M7 8c2 1 4 1 5-1 2 1 4 1 5 -1" },
  { id: "tumble", label: "Tumble dry low", svg: "M4 4h16v16H4z M12 8a4 4 0 100 8 4 4 0 000-8z M12 12.5h.01" },
  { id: "bleach", label: "No bleach", svg: "M4 4h16v16H4z M4 4l16 16" },
  { id: "iron", label: "Low iron", svg: "M4 14h16l-2-7H6L4 14z M4 14v3a1 1 0 001 1h14a1 1 0 001-1v-3" },
  { id: "dryclean", label: "No dry clean", svg: "M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z M9 9l6 6 M15 9l-6 6" },
];

export function CareIcons() {
  return (
    <div>
      <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
        Care
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "clamp(12px, 2vw, 22px)" }}>
        {CARE.map((c) => (
          <li key={c.id} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center", width: "70px" }}>
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--paper-warm)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={c.svg} />
              </svg>
            </span>
            <span style={{ fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", lineHeight: 1.3 }}>
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
