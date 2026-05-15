import { Link } from "wouter";
import { Meta } from "@/components/system/Meta";

export default function NotFound() {
  return (
    <main
      style={{
        background: "var(--paper)",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px, 8vw, 120px) clamp(20px, 4vw, 64px)",
      }}
    >
      <Meta title="Page not found" canonicalPath="/404" />
      <div style={{ maxWidth: "640px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
            marginBottom: "clamp(20px, 3vw, 32px)",
          }}
        >
          404 · Page not found
        </p>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(56px, 12vw, 200px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            color: "var(--ink)",
            marginBottom: "clamp(20px, 3vw, 32px)",
          }}
        >
          Lost in the<br />studio.
        </h1>
        <p
          style={{
            fontSize: "clamp(15px, 1.6vw, 18px)",
            color: "var(--ink-mute)",
            lineHeight: 1.7,
            marginBottom: "clamp(28px, 4vw, 40px)",
            maxWidth: "440px",
            marginInline: "auto",
          }}
        >
          The piece you were looking for isn't here. Perhaps it's still in the cutting room.
          Let's get you back to something more wearable.
        </p>
        <div style={{ display: "inline-flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">Home</Link>
          <Link href="/shop" className="btn btn-ghost">Shop the collection</Link>
        </div>
      </div>
    </main>
  );
}
