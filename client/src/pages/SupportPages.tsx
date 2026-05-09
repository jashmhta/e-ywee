import { useState } from "react";
import { Link } from "wouter";

// ─── Shared layout ────────────────────────────────────────────────────────────
function InfoPage({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 48px)" }}>
        <Link href="/" style={{ fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-faint)", display: "inline-block", marginBottom: "32px", transition: "color 0.22s" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-faint)")}
        >
          ← ywee
        </Link>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.0, marginBottom: subtitle ? "12px" : "40px" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "16px", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "40px", maxWidth: "560px" }}>
            {subtitle}
          </p>
        )}
        <div style={{ height: "1px", background: "rgba(26,25,22,0.08)", marginBottom: "40px" }} />
        {children}
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: "12px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.75, marginBottom: "12px" }}>
      {children}
    </p>
  );
}

// ─── Care ─────────────────────────────────────────────────────────────────────
export function Care() {
  return (
    <InfoPage title="Care." subtitle="How to look after your YWEE denim so it stays great wash after wash.">
      <Section title="Machine washing">
        <Body>Machine wash your YWEE jeans inside-out on a gentle cycle at 30°C. This preserves the colour and protects the Cotton-Lycra blend. Use a mild detergent — avoid bleach or fabric softener.</Body>
        <Body>Washing inside-out also reduces friction on the outer surface, keeping the denim looking newer for longer.</Body>
      </Section>
      <Section title="Drying">
        <Body>Air dry where possible. Lay flat or hang from the waistband. Avoid tumble drying on high heat as this can affect the stretch properties of the Lycra blend. If you do tumble dry, use a low heat setting.</Body>
      </Section>
      <Section title="Ironing">
        <Body>Iron inside-out on a medium heat. The Cotton-Lycra blend does not require heavy ironing — a light press is enough to smooth any creases.</Body>
      </Section>
      <Section title="Adjustable waistband">
        <Body>The internal adjustable elastic waistband requires no special care. It is fully machine washable and designed to retain its elasticity through hundreds of washes. Do not pull or stretch the waistband when wet.</Body>
      </Section>
      <Section title="Storage">
        <Body>Store clean and dry. Fold rather than hang to preserve the waistband shape. YWEE denim is designed to be worn, washed, and worn again — the more you wear it, the better it fits.</Body>
      </Section>
    </InfoPage>
  );
}

// ─── Mending ──────────────────────────────────────────────────────────────────
export function Mending() {
  return (
    <InfoPage title="Returns." subtitle="30-day returns, no questions asked. We make it easy.">
      <Section title="Our returns policy">
        <Body>If you’re not happy with your YWEE purchase for any reason, you can return it within 30 days of delivery for a full refund. Items must be unworn and in their original condition.</Body>
      </Section>
      <Section title="How to return">
        <Body>1. Email us at returns@ywee.com with your order number and the reason for return.</Body>
        <Body>2. We’ll reply within 24 hours with return instructions and a return address.</Body>
        <Body>3. Pack the item securely and send it back to us. We recommend using a tracked service.</Body>
        <Body>4. Once we receive and inspect the return, we’ll process your refund within 3–5 business days.</Body>
      </Section>
      <Section title="Exchanges">
        <Body>Need a different size? We’ll exchange it. Email us at returns@ywee.com and we’ll arrange a swap. Exchanges are free — we’ll cover the shipping both ways.</Body>
      </Section>
      <Section title="Defective items">
        <Body>If your item arrives damaged or defective, please email us at hello@ywee.com with a photo within 7 days of delivery. We’ll replace it or refund you immediately, no return required.</Body>
      </Section>
      <div style={{ marginTop: "32px", padding: "24px", background: "var(--paper-warm)", border: "1px solid rgba(26,25,22,0.08)" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "18px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "8px" }}>
          Start a return
        </p>
        <p style={{ fontSize: "14px", color: "var(--ink-mute)", marginBottom: "16px" }}>
          Email us at <a href="mailto:returns@ywee.com" style={{ color: "var(--ink)", textDecoration: "underline" }}>returns@ywee.com</a> with your order number.
        </p>
      </div>
    </InfoPage>
  );
}

// ─── Shipping ─────────────────────────────────────────────────────────────────
const SHIPPING_ZONES = [
  { zone: "Metro Cities", standard: "2–3 business days", express: "Next day", cost: "Free on all orders", express_cost: "₹99" },
  { zone: "Tier 2 Cities", standard: "3–5 business days", express: "2–3 business days", cost: "Free on all orders", express_cost: "₹99" },
  { zone: "Rest of India", standard: "5–7 business days", express: "3–4 business days", cost: "Free on all orders", express_cost: "₹99" },
  { zone: "J&K / Remote Areas", standard: "7–10 business days", express: "5–6 business days", cost: "Free on all orders", express_cost: "₹149" },
];

export function Shipping() {
  return (
    <InfoPage title="Shipping." subtitle="Free delivery across all of India. Orders dispatched within 24 hours.">
      <Section title="Delivery times">
        <Body>All YWEE orders are dispatched within 24 hours of placement (Monday to Saturday). Orders placed before 2pm are typically dispatched the same day. You’ll receive a tracking link by SMS and email once your order ships.</Body>
      </Section>
      <div style={{ overflowX: "auto", marginBottom: "36px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(26,25,22,0.12)" }}>
              {["Zone", "Standard", "Express", "Standard Cost", "Express Cost"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIPPING_ZONES.map((row, i) => (
              <tr key={row.zone} style={{ borderBottom: "1px solid rgba(26,25,22,0.06)", background: i % 2 === 0 ? "transparent" : "var(--paper-warm)" }}>
                <td style={{ padding: "12px", fontWeight: 500, color: "var(--ink)" }}>{row.zone}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.standard}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.express}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.cost}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.express_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Section title="Returns">
        <Body>We accept returns within 30 days of delivery. Items must be unworn and in their original condition. Email returns@ywee.com with your order number to start a return. Refunds are processed within 3–5 business days of receiving the return.</Body>
      </Section>
      <Section title="Cash on Delivery">
        <Body>We offer Cash on Delivery (COD) across India. A small COD handling fee of ₹49 applies. COD orders are dispatched within 24 hours, same as prepaid orders.</Body>
      </Section>
    </InfoPage>
  );
}

// ─── Sizing ───────────────────────────────────────────────────────────────────
const SIZE_GUIDE = [
  { size: "1Y", age: "0–1 yr", height: "70–80 cm", waist: "44–46 cm", hip: "48–50 cm", inseam: "22–24 cm" },
  { size: "2Y", age: "1–2 yr", height: "80–90 cm", waist: "46–48 cm", hip: "50–53 cm", inseam: "25–28 cm" },
  { size: "3Y", age: "2–3 yr", height: "90–100 cm", waist: "48–50 cm", hip: "53–56 cm", inseam: "29–32 cm" },
  { size: "4Y", age: "3–4 yr", height: "100–108 cm", waist: "50–52 cm", hip: "56–59 cm", inseam: "33–36 cm" },
  { size: "5Y", age: "4–5 yr", height: "108–116 cm", waist: "52–54 cm", hip: "59–62 cm", inseam: "37–40 cm" },
  { size: "6Y", age: "5–6 yr", height: "116–122 cm", waist: "54–56 cm", hip: "62–65 cm", inseam: "41–44 cm" },
  { size: "7Y", age: "6–7 yr", height: "122–128 cm", waist: "56–58 cm", hip: "65–68 cm", inseam: "45–48 cm" },
  { size: "8Y", age: "7–8 yr", height: "128–134 cm", waist: "58–60 cm", hip: "68–71 cm", inseam: "49–52 cm" },
  { size: "10Y", age: "9–10 yr", height: "134–142 cm", waist: "60–63 cm", hip: "71–75 cm", inseam: "53–56 cm" },
  { size: "12Y", age: "11–12 yr", height: "142–150 cm", waist: "63–66 cm", hip: "75–79 cm", inseam: "57–60 cm" },
  { size: "14Y", age: "13–14 yr", height: "150–158 cm", waist: "66–70 cm", hip: "79–83 cm", inseam: "61–64 cm" },
];

export function Sizing() {
  return (
    <InfoPage title="Sizing." subtitle="YWEE jeans fit girls aged 1–14. All measurements in centimetres. Our adjustable waistband gives extra room to grow.">
      <Section title="How to measure">
        <Body><strong>Height:</strong> Stand straight against a wall without shoes. Measure from the floor to the top of the head.</Body>
        <Body><strong>Waist:</strong> Measure around the natural waist — the narrowest part of the torso, just above the belly button.</Body>
        <Body><strong>Hip:</strong> Measure around the fullest part of the hips.</Body>
        <Body><strong>Inseam:</strong> Measure from the crotch seam to the ankle bone on the inside of the leg.</Body>
      </Section>
      <div style={{ overflowX: "auto", marginBottom: "36px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(26,25,22,0.12)" }}>
              {["Size", "Age", "Height (cm)", "Waist (cm)", "Hip (cm)", "Inseam (cm)"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE.map((row, i) => (
              <tr key={row.size} style={{ borderBottom: "1px solid rgba(26,25,22,0.06)", background: i % 2 === 0 ? "transparent" : "var(--paper-warm)" }}>
                <td style={{ padding: "12px", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--mono)" }}>{row.size}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.age}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.height}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.waist}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.hip}</td>
                <td style={{ padding: "12px", color: "var(--ink-mute)" }}>{row.inseam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Section title="Fit notes">
        <Body>YWEE jeans are designed with a comfortable, active fit. If your child is between sizes, size up — the adjustable waistband will take up the extra room. Our jeans are designed to be worn with movement in mind: running, playing, climbing.</Body>
        <Body>If you have questions about a specific style, email us at hello@ywee.com and we’ll advise.</Body>
      </Section>
    </InfoPage>
  );
}

// ─── Stockists ────────────────────────────────────────────────────────────────
const STOCKISTS_DATA = [
  { city: "Mumbai", country: "Maharashtra", stores: [{ name: "FirstCry", address: "Available online & 100+ stores nationwide" }, { name: "Hopscotch", address: "Available online at hopscotch.in" }] },
  { city: "Delhi NCR", country: "Delhi", stores: [{ name: "Amazon India", address: "Available at amazon.in/ywee" }, { name: "Flipkart", address: "Available at flipkart.com/ywee" }] },
  { city: "Bangalore", country: "Karnataka", stores: [{ name: "Myntra", address: "Available at myntra.com/ywee" }] },
  { city: "Pan India", country: "India", stores: [{ name: "YWEE Official Store", address: "ywee.in — Free delivery everywhere" }] },
];

export function Stockists() {
  return (
    <InfoPage title="Stockists." subtitle="Find ywee at these carefully selected retailers across India.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "clamp(24px, 3vw, 36px)" }}>
        {STOCKISTS_DATA.map(({ city, country, stores }) => (
          <div key={city} style={{ padding: "20px", border: "1px solid rgba(26,25,22,0.08)", background: "var(--paper-warm)" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "4px" }}>{country}</p>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "16px" }}>{city}</h3>
            {stores.map(s => (
              <div key={s.name} style={{ marginBottom: "12px" }}>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)", marginBottom: "2px" }}>{s.name}</p>
                <p style={{ fontSize: "12px", color: "var(--ink-faint)" }}>{s.address}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "40px", padding: "24px", background: "var(--paper-warm)", border: "1px solid rgba(26,25,22,0.08)" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "18px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "8px" }}>
          Interested in stocking ywee?
        </p>
        <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>
          Email us at <a href="mailto:trade@ywee.com" style={{ color: "var(--ink)", textDecoration: "underline" }}>trade@ywee.com</a>
        </p>
      </div>
    </InfoPage>
  );
}

// ─── Press ────────────────────────────────────────────────────────────────────
const PRESS_ITEMS = [
  { pub: "Vogue India", date: "March 2025", title: "The Indian kidswear label redefining girls' denim", excerpt: "YWEE's Spring 2025 collection is a masterclass in functional style — denim that grows with the child and never loses its shape." },
  { pub: "The Hindu", date: "January 2025", title: "Surat's denim revolution for the next generation", excerpt: "Unlike many kidswear brands that compromise on quality, YWEE publishes its fabric composition for every garment — and backs it with a mending promise." },
  { pub: "Femina", date: "November 2024", title: "India's most thoughtful girls' denim brand", excerpt: "In a market flooded with fast fashion, a small Surat-based label is making some of India's most considered children's garments." },
  { pub: "Business of Fashion", date: "September 2024", title: "The case for buying better kidswear", excerpt: "YWEE's adjustable waistband and Cotton-Lycra blend are not gimmicks. They are commitments — and parents are noticing." },
];

export function Press() {
  return (
    <InfoPage title="Press." subtitle="Selected coverage of ywee in the press.">
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {PRESS_ITEMS.map((item, i) => (
          <div key={i} style={{ padding: "24px 0", borderBottom: "1px solid rgba(26,25,22,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{item.pub}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-faint)" }}>{item.date}</p>
            </div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(17px, 2vw, 22px)", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", lineHeight: 1.2, marginBottom: "8px" }}>
              "{item.title}"
            </h3>
            <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.65, fontStyle: "italic" }}>
              {item.excerpt}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "40px" }}>
        <p style={{ fontSize: "14px", color: "var(--ink-mute)", marginBottom: "8px" }}>
          Press enquiries: <a href="mailto:press@ywee.com" style={{ color: "var(--ink)", textDecoration: "underline" }}>press@ywee.com</a>
        </p>
        <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>
          High-resolution images and press materials are available on request.
        </p>
      </div>
    </InfoPage>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <InfoPage title="Contact." subtitle="We read every message. We reply to all of them.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(40px, 6vw, 64px)" }}>
        <div>
          {sent ? (
            <div style={{ padding: "32px", background: "var(--paper-warm)", border: "1px solid rgba(26,25,22,0.08)", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: "22px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "8px" }}>
                Thank you.
              </p>
              <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>
                We'll be in touch within 1–2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Subject", name: "subject", type: "text" },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>{f.label}</label>
                  <input
                    type={f.type} required
                    value={(form as any)[f.name]}
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }}
                    onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Message</label>
                <textarea
                  required rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none", resize: "vertical" }}
                  onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
                />
              </div>
              <button type="submit" style={{ padding: "14px", background: "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "var(--sans)" }}>
                Send Message
              </button>
            </form>
          )}
        </div>
        <div>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>General</p>
            <a href="mailto:hello@ywee.com" style={{ fontSize: "15px", color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid rgba(26,25,22,0.2)" }}>hello@ywee.com</a>
          </div>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Orders & Returns</p>
            <a href="mailto:orders@ywee.com" style={{ fontSize: "15px", color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid rgba(26,25,22,0.2)" }}>orders@ywee.com</a>
          </div>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Mending & Repairs</p>
            <a href="mailto:mending@ywee.com" style={{ fontSize: "15px", color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid rgba(26,25,22,0.2)" }}>mending@ywee.com</a>
          </div>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Response time</p>
            <p style={{ fontSize: "14px", color: "var(--ink-mute)", lineHeight: 1.65 }}>We aim to respond to all messages within 1–2 business days. We are based in Surat, India (IST, GMT+5:30).</p>
          </div>
        </div>
      </div>
    </InfoPage>
  );
}

// ─── Privacy ──────────────────────────────────────────────────────────────────
export function Privacy() {
  return (
    <InfoPage title="Privacy Policy." subtitle="Last updated: 1 January 2025.">
      <Section title="What we collect">
        <Body>When you place an order, we collect your name, email address, shipping address, and payment information. We do not store your full card number — payments are processed by Stripe.</Body>
        <Body>When you create an account, we store your name, email, and order history. We do not sell this data to third parties.</Body>
      </Section>
      <Section title="How we use your data">
        <Body>We use your data to fulfil orders, communicate about your purchases, and (with your consent) send occasional updates about new collections and studio notes. You can unsubscribe at any time.</Body>
      </Section>
      <Section title="Cookies">
        <Body>We use essential cookies to keep you logged in and remember your bag. We use analytics cookies (with your consent) to understand how people use the site. See our <Link href="/cookies" style={{ color: "var(--ink)", textDecoration: "underline" }}>Cookie Policy</Link> for details.</Body>
      </Section>
      <Section title="Your rights">
        <Body>You have the right to access, correct, or delete your personal data at any time. Email privacy@ywee.com and we'll respond within 30 days.</Body>
      </Section>
      <Section title="Contact">
        <Body>YWEE by Generations Clothing LLP, Surat, Gujarat 395003, India. privacy@ywee.in</Body>
      </Section>
    </InfoPage>
  );
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export function Terms() {
  return (
    <InfoPage title="Terms & Conditions." subtitle="Last updated: 1 January 2025.">
      <Section title="Orders">
        <Body>By placing an order, you confirm that you are at least 18 years old and that the information you provide is accurate. We reserve the right to cancel orders at our discretion.</Body>
      </Section>
      <Section title="Pricing">
        <Body>All prices are shown in the currency of your region and include applicable taxes. Prices are subject to change without notice. The price at the time of order is the price you pay.</Body>
      </Section>
      <Section title="Returns">
        <Body>We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging. See our <Link href="/shipping" style={{ color: "var(--ink)", textDecoration: "underline" }}>Shipping & Returns</Link> page for details.</Body>
      </Section>
      <Section title="Intellectual property">
        <Body>All content on this website — including images, text, and design — is the property of ywee and may not be reproduced without permission.</Body>
      </Section>
      <Section title="Governing law">
        <Body>These terms are governed by the laws of India. Any disputes will be resolved in the courts of Surat, Gujarat.</Body>
      </Section>
    </InfoPage>
  );
}

// ─── Cookies ──────────────────────────────────────────────────────────────────
export function Cookies() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({ essential: true, analytics: true, marketing: false });

  return (
    <InfoPage title="Cookie Policy." subtitle="We use cookies to make the site work and to understand how it's used.">
      <Section title="Essential cookies">
        <Body>These cookies are required for the site to function. They keep you logged in, remember your bag, and enable secure checkout. They cannot be disabled.</Body>
      </Section>
      <Section title="Analytics cookies">
        <Body>We use privacy-respecting analytics (no third-party tracking) to understand which pages are visited and how people navigate the site. This helps us improve the experience.</Body>
      </Section>
      <Section title="Marketing cookies">
        <Body>We do not use marketing or advertising cookies. We do not share your data with advertising networks.</Body>
      </Section>

      <div style={{ padding: "24px", background: "var(--paper-warm)", border: "1px solid rgba(26,25,22,0.08)", marginTop: "8px" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "18px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginBottom: "16px" }}>
          Your preferences
        </p>
        {[
          { key: "essential" as const, label: "Essential", desc: "Required for the site to work.", locked: true },
          { key: "analytics" as const, label: "Analytics", desc: "Help us improve the site.", locked: false },
          { key: "marketing" as const, label: "Marketing", desc: "We don't use these.", locked: false },
        ].map(({ key, label, desc, locked }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(26,25,22,0.06)", cursor: locked ? "default" : "pointer" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)", marginBottom: "2px" }}>{label}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-faint)" }}>{desc}</p>
            </div>
            <input
              type="checkbox"
              checked={prefs[key]}
              disabled={locked}
              onChange={e => setPrefs(p => ({ ...p, [key]: e.target.checked }))}
              style={{ width: "16px", height: "16px", accentColor: "var(--ink)", cursor: locked ? "default" : "pointer" }}
            />
          </label>
        ))}
        <button
          onClick={() => setSaved(true)}
          style={{ marginTop: "16px", padding: "12px 24px", background: saved ? "var(--sage)" : "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "var(--sans)", transition: "background 0.4s" }}
        >
          {saved ? "Saved ✓" : "Save Preferences"}
        </button>
      </div>
    </InfoPage>
  );
}
