import { useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { JOURNAL } from "@/data/store";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    el.classList.add("reveal");
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

export default function Journal() {
  const [featured, ...rest] = JOURNAL;

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      {/* Header */}
      <div style={{ padding: "clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px) clamp(24px, 3vw, 40px)", borderBottom: "1px solid rgba(26,25,22,0.08)", maxWidth: "1440px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Journal</p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 72px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.0 }}>
          Notes from the studio.
        </h1>
      </div>

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px)" }}>
        {/* Featured article */}
        {featured && (
          <div ref={useReveal()} style={{ marginBottom: "clamp(48px, 7vw, 80px)" }}>
            <Link href={`/journal/${featured.slug}`}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(24px, 4vw, 48px)", alignItems: "center" }}>
                <div className="product-img-wrap" style={{ aspectRatio: "16/10", overflow: "hidden", background: "var(--paper-warm)" }}>
                  <img src={featured.cover} alt={featured.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </div>
                <div>
                  <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
                    Featured · {featured.category} · {featured.read}
                  </p>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.5vw, 52px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1, marginBottom: "16px" }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontSize: "15px", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "24px" }}>
                    {featured.deck}
                  </p>
                  <span style={{ fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink)", borderBottom: "1px solid var(--ink)", paddingBottom: "2px" }}>
                    Read Article →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(26,25,22,0.08)", marginBottom: "clamp(32px, 5vw, 64px)" }} />

        {/* Article grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "clamp(24px, 3vw, 40px)" }}>
          {rest.map((article, i) => (
            <ArticleCard key={article.slug} article={article} delay={i * 80} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ArticleCard({ article, delay }: { article: typeof JOURNAL[0]; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref}>
      <Link href={`/journal/${article.slug}`}>
        <div className="product-img-wrap" style={{ aspectRatio: "16/10", overflow: "hidden", background: "var(--paper-warm)", marginBottom: "16px" }}>
          <img loading="lazy" src={article.cover} alt={article.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>
          {article.category} · {article.read}
        </p>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em", color: "var(--ink)", lineHeight: 1.2, marginBottom: "8px" }}>
          {article.title}
        </h3>
        <p style={{ fontSize: "13.5px", color: "var(--ink-mute)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.deck}
        </p>
      </Link>
    </div>
  );
}

export function JournalArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = JOURNAL.find(a => a.slug === slug);

  if (!article) {
    return (
      <main style={{ minHeight: "60dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "24px", fontStyle: "italic", color: "var(--ink-mute)" }}>Article not found.</p>
        <Link href="/journal" style={{ fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", textDecoration: "underline" }}>
          Return to Journal
        </Link>
      </main>
    );
  }

  const others = JOURNAL.filter(a => a.slug !== slug).slice(0, 2);

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      {/* Hero image */}
      <div style={{ height: "60dvh", minHeight: "360px", overflow: "hidden", position: "relative" }}>
        <img loading="lazy" src={article.cover} alt={article.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,25,22,0.5) 0%, transparent 60%)" }} />
      </div>

      {/* Article content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "clamp(40px, 6vw, 72px) clamp(20px, 4vw, 48px)" }}>
        <Link href="/journal" style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "32px", transition: "color 0.22s" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-faint)")}
        >
          ← Journal
        </Link>

        <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>
          {article.category} · {article.read}
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.05, marginBottom: "16px" }}>
          {article.title}
        </h1>
        <p style={{ fontSize: "17px", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "40px", fontStyle: "italic" }}>
          {article.deck}
        </p>

        <div style={{ height: "1px", background: "rgba(26,25,22,0.10)", marginBottom: "40px" }} />

        <div style={{ fontSize: "16px", color: "var(--ink-soft)", lineHeight: 1.8 }}>
          {(article.body || article.deck).split("\n\n").map((para, i) => {
            if (para.startsWith("**") && para.endsWith("**")) {
              return (
                <h3 key={i} style={{ fontFamily: "var(--serif)", fontSize: "22px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", marginTop: "32px", marginBottom: "12px" }}>
                  {para.replace(/\*\*/g, "")}
                </h3>
              );
            }
            return (
              <p key={i} style={{ marginBottom: "24px" }}>{para}</p>
            );
          })}
        </div>
      </div>

      {/* More articles */}
      {others.length > 0 && (
        <section style={{ background: "var(--paper-warm)", padding: "clamp(40px, 6vw, 72px) clamp(20px, 4vw, 48px)", borderTop: "1px solid rgba(26,25,22,0.08)" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "24px" }}>More from the Journal</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "clamp(20px, 3vw, 36px)" }}>
              {others.map(a => (
                <Link key={a.slug} href={`/journal/${a.slug}`}>
                  <div className="product-img-wrap" style={{ aspectRatio: "16/10", overflow: "hidden", background: "var(--paper-deep)", marginBottom: "14px" }}>
                    <img src={a.cover} alt={a.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  </div>
                  <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "6px" }}>{a.category} · {a.read}</p>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: "18px", fontStyle: "italic", fontWeight: 300, color: "var(--ink)", lineHeight: 1.2 }}>{a.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
