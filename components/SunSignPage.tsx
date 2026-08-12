import Link from "next/link";
import Image from "next/image";
import sunSignData from "@/data/sun-sign-pages.json";

export type SunSignPageData = (typeof sunSignData.pages)[number];

export function getSignPage(slug: string): SunSignPageData | undefined {
  return sunSignData.pages.find((p) => p.slug === slug);
}

export function getAllSignSlugs() {
  return sunSignData.pages.map((p) => p.slug);
}

export function buildJsonLd(page: SunSignPageData) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.h1,
        description: page.meta.description,
        url: page.canonical,
        about: { "@type": "Thing", name: page.schema.article_about },
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        datePublished: "2026-08-05",
        dateModified: "2026-08-05",
        mainEntityOfPage: page.canonical,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.schema.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: page.internal_links.breadcrumb.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.label,
          item: `https://bluntchart.com${b.url}`,
        })),
      },
    ],
  };
}

export function buildMetadata(page: SunSignPageData) {
  return {
    title: page.meta.title,
    description: page.meta.description,
    openGraph: {
      title: page.meta.og_title,
      description: page.meta.og_description,
      url: page.canonical,
      siteName: "BluntChart",
      type: "article" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: page.meta.og_title,
      description: page.meta.og_description,
    },
    alternates: { canonical: page.canonical },
  };
}

export default function SunSignPage({ page }: { page: SunSignPageData }) {
  const quickAnswer = page.sections.find((s) => s.id === "quick-answer");
  const quickFacts = page.sections.find((s) => s.id === "quick-facts");
  const brandTake = page.sections.find((s) => s.id === "brand-take");

  const bodySections = page.sections.filter(
    (s) => s.id !== "quick-answer" && s.id !== "quick-facts" && s.id !== "brand-take"
  );

  const readingTime = Math.ceil((page.approx_word_count || 1400) / 200);

  const tocSections = bodySections.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: s.heading,
    id: s.id,
  }));

  return (
    <>
      <style>{`
        .ss-wrap{max-width:760px;margin:0 auto;padding:0 24px}
        .ss-crumb{display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(232,228,240,0.3);margin-bottom:24px;flex-wrap:wrap}
        .ss-crumb a{color:rgba(232,228,240,0.3);text-decoration:none;transition:color .2s}
        .ss-crumb a:hover{color:rgba(232,228,240,0.6)}
        .ss-crumb .sep{opacity:.5}
        .ss-crumb .cur{color:rgba(232,228,240,0.55)}
        .ss-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
        .ss-chip{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:6px 14px;font-size:12px;color:rgba(232,228,240,0.45);font-weight:500}
        .ss-h1{font-family:var(--font-display);font-size:clamp(2rem,5vw,2.8rem);font-weight:900;line-height:1.12;margin:0 0 16px;letter-spacing:-0.01em;color:#e8e4f0}
        .ss-hook{font-family:var(--font-display);font-style:italic;font-size:clamp(1.1rem,2.5vw,1.3rem);line-height:1.55;color:rgba(240,184,74,0.85);margin:0 0 22px;max-width:600px}
        .ss-answer{font-size:16px;line-height:1.78;color:rgba(232,228,240,0.62);margin:0 0 32px;max-width:640px}
        .ss-facts{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:36px}
        .ss-fact-label{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:rgba(232,228,240,0.35);margin:0 0 4px;font-weight:600}
        .ss-fact-val{font-size:14px;color:#e8e4f0;margin:0;font-weight:600}
        .ss-toc-label{font-size:11px;color:rgba(232,228,240,0.35);margin:0 0 12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700}
        .ss-toc{display:grid;grid-template-columns:1fr 1fr;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin-bottom:40px;background:rgba(255,255,255,0.02)}
        .ss-toc a{display:flex;gap:12px;align-items:baseline;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-decoration:none;color:#e8e4f0;transition:background .15s;font-size:14px}
        .ss-toc a:hover{background:rgba(255,255,255,0.03)}
        .ss-toc a:nth-child(odd){border-right:1px solid rgba(255,255,255,0.06)}
        .ss-toc-num{font-family:var(--font-display);font-size:13px;font-weight:700;color:#F0B84A;min-width:22px}
        .ss-section{margin-bottom:36px}
        .ss-section h2{font-family:var(--font-display);font-size:clamp(1.2rem,2.5vw,1.4rem);font-weight:700;margin:0 0 14px;color:#e8e4f0;line-height:1.25}
        .ss-section p{font-size:15.5px;line-height:1.78;color:rgba(232,228,240,0.62);margin:0 0 12px}
        .ss-section h3{font-family:var(--font-display);font-size:16px;font-weight:700;margin:18px 0 8px;color:rgba(232,228,240,0.8)}
        .ss-callout{background:rgba(240,184,74,0.06);border-left:3px solid #F0B84A;border-radius:0 12px 12px 0;padding:18px 22px;margin:0 0 36px}
        .ss-callout p{font-family:var(--font-display);font-style:italic;font-size:16px;line-height:1.65;color:rgba(240,184,74,0.85);margin:0}
        .ss-faq{border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin-bottom:40px;background:rgba(255,255,255,0.02)}
        .ss-faq details{border-bottom:1px solid rgba(255,255,255,0.06)}
        .ss-faq details:last-child{border-bottom:none}
        .ss-faq summary{padding:18px 20px;font-size:15px;font-weight:600;color:#e8e4f0;cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between}
        .ss-faq summary::-webkit-details-marker{display:none}
        .ss-faq summary .plus{color:#6b2fd4;font-size:18px;font-weight:700;flex-shrink:0;margin-left:16px;transition:transform .2s}
        .ss-faq details[open] summary .plus{transform:rotate(45deg)}
        .ss-faq .faq-a{font-size:14px;line-height:1.78;color:rgba(232,228,240,0.55);margin:0;padding:0 20px 18px}
        .ss-cta{background:#0e0e1a;border:1px solid rgba(240,184,74,0.15);border-radius:18px;padding:32px;margin-bottom:40px}
        .ss-cta h3{font-family:var(--font-display);font-size:clamp(1.1rem,2.5vw,1.3rem);font-weight:700;margin:0 0 10px;color:#e8e4f0}
        .ss-cta p{font-size:15px;line-height:1.65;color:rgba(232,228,240,0.5);margin:0 0 22px;max-width:520px}
        .ss-cta-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
        .ss-btn-primary{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;font-size:14px;font-weight:700;padding:13px 22px;border-radius:10px;text-decoration:none;transition:opacity .2s}
        .ss-btn-primary:hover{opacity:.88}
        .ss-btn-secondary{display:inline-flex;align-items:center;border:1px solid rgba(255,255,255,0.15);color:#e8e4f0;font-size:14px;font-weight:600;padding:13px 22px;border-radius:10px;text-decoration:none;transition:border-color .2s}
        .ss-btn-secondary:hover{border-color:rgba(240,184,74,0.4)}
        .ss-trust{font-size:12px;color:rgba(232,228,240,0.35);margin-top:14px}
        .ss-related-label{font-size:11px;color:rgba(232,228,240,0.35);margin:0 0 12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700}
        .ss-related{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:48px}
        .ss-related a{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:8px 18px;font-size:13px;color:rgba(232,228,240,0.6);text-decoration:none;font-weight:500;transition:border-color .2s}
        .ss-related a:hover{border-color:rgba(240,184,74,0.3);color:#e8e4f0}
        .ss-hub-link{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#F0B84A;text-decoration:none;font-weight:600;margin-bottom:40px;transition:opacity .2s}
        .ss-hub-link:hover{opacity:.8}
        .ss-inline-link{color:#F0B84A;text-decoration:underline;text-decoration-color:rgba(240,184,74,0.3);text-underline-offset:3px}
        .ss-inline-link:hover{text-decoration-color:#F0B84A}
        @media(max-width:640px){
          .ss-facts{grid-template-columns:repeat(3,1fr)}
          .ss-toc{grid-template-columns:1fr}
          .ss-toc a:nth-child(odd){border-right:none}
          .ss-cta{padding:24px 20px}
        }
        @media(max-width:400px){
          .ss-facts{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(page)) }}
      />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 0", background: "rgba(9,9,15,0.92)", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span style={{ background: "linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BluntChart</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/zodiac-signs" style={{ fontSize: 13, color: "rgba(232,228,240,0.55)", textDecoration: "none", fontWeight: 500 }}>Zodiac Signs</Link>
            <Link href="/free-birth-chart" style={{ fontSize: 13, color: "rgba(232,228,240,0.55)", textDecoration: "none", fontWeight: 500 }}>Free Birth Chart</Link>
            <Link href="/#try-it" style={{ fontSize: 13, color: "#F0B84A", textDecoration: "none", fontWeight: 600, border: "1px solid rgba(240,184,74,0.18)", padding: "6px 15px", borderRadius: 4 }}>Get Reading $15</Link>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: 100, paddingBottom: 48 }}>
        <div className="ss-wrap">

          {/* Breadcrumb */}
          <div className="ss-crumb">
            {page.internal_links.breadcrumb.map((b, i) => (
              <span key={i}>
                {i > 0 && <span className="sep" style={{ margin: "0 2px" }}>/</span>}
                {i < page.internal_links.breadcrumb.length - 1 ? (
                  <Link href={b.url}>{b.label}</Link>
                ) : (
                  <span className="cur">{b.label}</span>
                )}
              </span>
            ))}
          </div>

          {/* Chips */}
          <div className="ss-chips">
            <span className="ss-chip">&#10022; Sun sign guide</span>
            <span className="ss-chip">&#9201; {readingTime} min read</span>
            <span className="ss-chip">&#128275; Free, no signup</span>
          </div>

          {/* H1 */}
          <h1 className="ss-h1">{page.h1}</h1>

          {/* Hook line (brand-take promoted to top) */}
          {brandTake && typeof brandTake.content === "string" && (
            <p className="ss-hook">&ldquo;{brandTake.content}&rdquo;</p>
          )}

          {/* Answer-first paragraph */}
          {quickAnswer && typeof quickAnswer.content === "string" && (
            <p className="ss-answer">{quickAnswer.content}</p>
          )}

          {/* Quick facts strip */}
          {quickFacts && typeof quickFacts.content === "object" && !Array.isArray(quickFacts.content) && (
            <div className="ss-facts">
              {Object.entries(quickFacts.content as unknown as Record<string, string>).map(([label, value]) => (
                <div key={label}>
                  <p className="ss-fact-label">{label}</p>
                  <p className="ss-fact-val">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* In this guide — numbered TOC */}
          <p className="ss-toc-label">In this guide</p>
          <div className="ss-toc">
            {tocSections.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                <span className="ss-toc-num">{t.num}</span>
                <span>{t.title}</span>
              </a>
            ))}
          </div>

          {/* Body sections */}
          {bodySections.map((section) => (
            <div key={section.id} id={section.id}>
              {section.type === "callout" && typeof section.content === "string" ? (
                <div className="ss-callout">
                  <p>&ldquo;{section.content}&rdquo;</p>
                </div>
              ) : section.type === "prose_pair" && typeof section.content === "object" && !Array.isArray(section.content) ? (
                <div className="ss-section">
                  <h2>{section.heading}</h2>
                  {"man" in section.content && (
                    <>
                      <h3>Sun in {page.sign} man</h3>
                      <p>{(section.content as unknown as { man: string; woman: string }).man}</p>
                      <h3>Sun in {page.sign} woman</h3>
                      <p>{(section.content as unknown as { man: string; woman: string }).woman}</p>
                    </>
                  )}
                </div>
              ) : typeof section.content === "string" ? (
                <div className="ss-section">
                  <h2>{section.heading}</h2>
                  {section.id === "compatibility" ? (
                    <p>
                      {section.content}{" "}
                      <Link href="/#waitlist" className="ss-inline-link">
                        Join the compatibility reading waitlist
                      </Link>.
                    </p>
                  ) : section.id === "sun-vs-rest" ? (
                    <p>
                      {section.content}{" "}
                      <Link href="/free-birth-chart" className="ss-inline-link">
                        Calculate your free birth chart
                      </Link>{" "}
                      or find your{" "}
                      <Link href="/big-three-calculator" className="ss-inline-link">
                        Big Three
                      </Link>.
                    </p>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              ) : null}
            </div>
          ))}

          {/* FAQ */}
          <p className="ss-toc-label">Common questions</p>
          <div className="ss-faq">
            {page.faq.map((f, i) => (
              <details key={i}>
                <summary>
                  <span>{f.q}</span>
                  <span className="plus">+</span>
                </summary>
                <p className="faq-a">{f.a}</p>
              </details>
            ))}
          </div>

          {/* CTA block */}
          <div className="ss-cta">
            <h3>{page.cta.heading}</h3>
            <p>{page.cta.body}</p>
            <div className="ss-cta-row">
              <Link href={page.cta.primary_cta.url} className="ss-btn-primary">
                {page.cta.primary_cta.label} &rarr;
              </Link>
              <Link href={page.cta.secondary_cta.url} className="ss-btn-secondary">
                {page.cta.secondary_cta.label}
              </Link>
            </div>
            <p className="ss-trust">&#128274; No account needed. No spam, ever.</p>
          </div>

          {/* Hub link */}
          <Link href="/zodiac-signs" className="ss-hub-link">
            &larr; All zodiac signs
          </Link>

          {/* Related signs */}
          <p className="ss-related-label">Related signs</p>
          <div className="ss-related">
            {page.internal_links.related_signs.map((rs) => (
              <Link key={rs.slug} href={rs.url}>
                Sun in {rs.name}
              </Link>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
