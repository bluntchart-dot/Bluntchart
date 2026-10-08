import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared building blocks for the /astrology-data hub and its statistics reports.
 * One quiet visual system: DM Sans throughout (site body font), tabular numbers,
 * a single 720px reading column, one accent colour used only for links and bars.
 * Scoped class names (sx-*) so nothing leaks into the rest of the site.
 */

export type Source = { name: string; short: string; url: string };
export type Stat = { value: string; label: string; source: Source };

export const HUB_PATH = "/astrology-data";
export const SITE = "https://bluntchart.com";

const CSS = `
.sx{--tx:#e8e4f0;--mt:rgba(232,228,240,.62);--fa:rgba(232,228,240,.4);--ln:rgba(255,255,255,.09);--ac:#F0B84A;
  background:#09090f;color:var(--tx);font-family:var(--font-body),'DM Sans',system-ui,sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}
.sx *,.sx *::before,.sx *::after{box-sizing:border-box}
.sx a{color:var(--ac);text-decoration:underline;text-decoration-color:rgba(240,184,74,.35);text-underline-offset:3px}
.sx a:hover{text-decoration-color:var(--ac)}
.sx-w{max-width:720px;margin:0 auto;padding:0 20px}

.sx-nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(9,9,15,.94);border-bottom:1px solid var(--ln);backdrop-filter:blur(12px)}
.sx-nav-i{max-width:1080px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between}
.sx .sx-logo{display:flex;align-items:center;gap:10px;text-decoration:none;font-family:var(--font-display),Georgia,serif;font-weight:700;font-size:1.15rem;color:var(--tx)}
.sx-nav-l{display:flex;gap:22px;font-size:.85rem}
.sx .sx-nav-l a{color:var(--mt);text-decoration:none}
.sx .sx-nav-l a:hover{color:var(--tx)}

.sx-crumb{padding-top:92px;font-size:.8rem;color:var(--fa)}
.sx .sx-crumb a{color:var(--fa);text-decoration:none}
.sx .sx-crumb a:hover{color:var(--tx)}
.sx-crumb .sep{margin:0 8px}
.sx-crumb .cur{color:var(--mt)}

.sx-head{padding:20px 0 8px}
.sx-kicker{font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ac);margin:0 0 12px}
.sx h1{font-size:clamp(1.85rem,4.5vw,2.4rem);line-height:1.15;font-weight:600;letter-spacing:-.02em;margin:0 0 14px}
.sx-lede{font-size:1.06rem;color:var(--mt);margin:0 0 16px}
.sx-meta{font-size:.8rem;color:var(--fa);margin:0}

.sx-toc{margin:32px 0 8px;padding:16px 0;border-top:1px solid var(--ln);border-bottom:1px solid var(--ln)}
.sx-toc p{font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--fa);margin:0 0 8px}
.sx-toc ol{margin:0;padding-left:20px;columns:2;column-gap:28px;font-size:.88rem}
.sx-toc li{margin-bottom:4px;color:var(--fa)}
.sx .sx-toc a{color:var(--mt);text-decoration:none}
.sx .sx-toc a:hover{color:var(--tx)}

.sx-sec{padding-top:48px;scroll-margin-top:72px}
.sx h2{font-size:1.4rem;line-height:1.3;font-weight:600;letter-spacing:-.01em;margin:0 0 12px}
.sx h3{font-size:1.02rem;font-weight:600;margin:28px 0 8px}
.sx p{margin:0 0 16px}
.sx-p{color:rgba(232,228,240,.8)}
.sx-answer{border-left:2px solid var(--ac);padding:2px 0 2px 14px;margin:0 0 20px;font-size:1.02rem;color:var(--tx)}

.sx-stats{list-style:none;margin:8px 0 24px;padding:0;border-top:1px solid var(--ln)}
.sx-stats li{display:grid;grid-template-columns:132px 1fr;gap:4px 20px;padding:14px 0;border-bottom:1px solid var(--ln)}
.sx-v{font-size:1.3rem;font-weight:600;line-height:1.3;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.sx-l{font-size:.95rem;line-height:1.5}
.sx-s{display:block;font-size:.76rem;color:var(--fa);margin-top:4px}
.sx .sx-s a{color:var(--fa)}
.sx .sx-s a:hover{color:var(--tx)}

.sx-tw{overflow-x:auto;margin:8px 0 6px;-webkit-overflow-scrolling:touch}
.sx-t{width:100%;border-collapse:collapse;font-size:.9rem;font-variant-numeric:tabular-nums}
.sx-t th{font-size:.72rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--fa);text-align:left;padding:8px 10px 8px 0;border-bottom:1px solid var(--ln);white-space:nowrap}
.sx-t td{padding:9px 10px 9px 0;border-bottom:1px solid rgba(255,255,255,.05);color:rgba(232,228,240,.82);vertical-align:middle}
.sx-t td.b{color:var(--tx);font-weight:500}
.sx-t td.n{white-space:nowrap}
.sx-t tr.sep td{color:var(--fa);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;padding-top:18px}
.sx-bar{height:4px;border-radius:2px;background:rgba(240,184,74,.6);min-width:2px}
.sx-note{font-size:.78rem;color:var(--fa);margin:6px 0 24px}

.sx-pending{border:1px dashed var(--ln);border-radius:8px;padding:12px 16px;font-size:.86rem;color:var(--mt);margin:8px 0 24px}
.sx-pending strong{color:var(--tx);font-weight:600}

.sx-cta{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border:1px solid var(--ln);border-radius:10px;padding:18px 20px;margin:40px 0 0}
.sx-cta p{margin:0;font-size:.95rem;color:var(--mt);flex:1;min-width:220px}
.sx-cta p strong{color:var(--tx);font-weight:600}
.sx .sx-btn{display:inline-block;padding:9px 16px;border:1px solid var(--ac);border-radius:6px;color:var(--ac);font-size:.86rem;font-weight:600;text-decoration:none;white-space:nowrap}
.sx .sx-btn:hover{background:rgba(240,184,74,.08)}

.sx-cards{list-style:none;margin:8px 0 24px;padding:0;border-top:1px solid var(--ln)}
.sx-cards li{padding:16px 0;border-bottom:1px solid var(--ln)}
.sx-cards .t{font-weight:600;font-size:1.02rem}
.sx .sx-cards a.t{color:var(--tx);text-decoration:none}
.sx .sx-cards a.t:hover{color:var(--ac)}
.sx-cards .d{font-size:.9rem;color:var(--mt);margin-top:4px}
.sx-cards .m{font-size:.76rem;color:var(--fa);margin-top:6px}

.sx-faq details{border-bottom:1px solid var(--ln);padding:14px 0}
.sx-faq details:first-child{border-top:1px solid var(--ln)}
.sx-faq summary{cursor:pointer;font-weight:500;list-style:none;display:flex;justify-content:space-between;gap:16px}
.sx-faq summary::-webkit-details-marker{display:none}
.sx-faq summary::after{content:'+';color:var(--fa)}
.sx-faq details[open] summary::after{content:'–'}
.sx-faq details p{margin:10px 0 0;font-size:.92rem;color:var(--mt)}

.sx-src ol{padding-left:20px;margin:16px 0 0;font-size:.82rem;color:var(--mt)}
.sx-src li{margin-bottom:8px;word-break:break-word}
.sx-cite{font-size:.82rem;color:var(--mt);background:rgba(255,255,255,.03);border:1px solid var(--ln);border-radius:8px;padding:12px 14px;margin:16px 0 0}
.sx-cite code{font-family:ui-monospace,Consolas,monospace;font-size:.8rem;color:var(--tx)}

.sx-foot{font-size:.76rem;color:var(--fa);text-align:center;padding:48px 0 64px}

@media(max-width:640px){
  .sx-nav-l{display:none}
  .sx-toc ol{columns:1}
  .sx-stats li{grid-template-columns:1fr;gap:2px}
}
`;

export function StatsPage({ children }: { children: ReactNode }) {
  return (
    <div className="sx">
      <style>{CSS}</style>
      <nav className="sx-nav">
        <div className="sx-nav-i">
          <Link className="sx-logo" href="/">
            <img src="/mascot.png" alt="BluntChart" width={30} height={30} style={{ borderRadius: "50%" }} />
            BluntChart
          </Link>
          <div className="sx-nav-l">
            <Link href={HUB_PATH}>Data hub</Link>
            <Link href="/free-birth-chart">Free chart</Link>
            <Link href="/#try-it">Full reading</Link>
          </div>
        </div>
      </nav>
      <main className="sx-w">{children}</main>
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="sx-crumb" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 && <span className="sep">/</span>}
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span className="cur">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  kicker,
  title,
  lede,
  updatedIso,
  updatedLabel,
  meta,
}: {
  kicker: string;
  title: string;
  lede: ReactNode;
  updatedIso: string;
  updatedLabel: string;
  meta?: string;
}) {
  return (
    <header className="sx-head">
      <p className="sx-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p className="sx-lede">{lede}</p>
      <p className="sx-meta">
        Last updated <time dateTime={updatedIso}>{updatedLabel}</time>
        {meta ? ` · ${meta}` : null}
      </p>
    </header>
  );
}

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="sx-toc" aria-label="Contents">
      <p>On this page</p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`}>{i.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Section({ id, title, answer, children }: { id?: string; title: string; answer?: ReactNode; children?: ReactNode }) {
  return (
    <section className="sx-sec" id={id}>
      <h2>{title}</h2>
      {answer ? <p className="sx-answer">{answer}</p> : null}
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="sx-p">{children}</p>;
}

export function Cite({ source }: { source: Source }) {
  const internal = source.url.startsWith("#") || source.url.startsWith(SITE);
  return (
    <a href={source.url} {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
      {source.short}
    </a>
  );
}

export function StatList({ stats }: { stats: Stat[] }) {
  return (
    <ul className="sx-stats">
      {stats.map((s) => (
        <li key={s.value + s.label}>
          <div className="sx-v">{s.value}</div>
          <div className="sx-l">
            {s.label}
            <span className="sx-s">
              Source: <Cite source={s.source} />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Table({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <>
      <div className="sx-tw">
        <table className="sx-t">{children}</table>
      </div>
      {note ? <p className="sx-note">{note}</p> : <div style={{ height: 18 }} />}
    </>
  );
}

export function Bar({ value, min, max }: { value: number; min: number; max: number }) {
  return <div className="sx-bar" style={{ width: `${Math.max(0, Math.min(1, (value - min) / (max - min))) * 100}%` }} />;
}

export function Pending({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="sx-pending">
      <strong>Data pending: {title}.</strong> {children}
    </div>
  );
}

export function Cta({ text, href, label }: { text: ReactNode; href: string; label: string }) {
  return (
    <div className="sx-cta">
      <p>{text}</p>
      <Link className="sx-btn" href={href}>
        {label}
      </Link>
    </div>
  );
}

export function LinkList({ items }: { items: { href: string; title: string; desc: string; meta?: string }[] }) {
  return (
    <ul className="sx-cards">
      {items.map((i) => (
        <li key={i.href}>
          <Link className="t" href={i.href}>
            {i.title}
          </Link>
          <div className="d">{i.desc}</div>
          {i.meta ? <div className="m">{i.meta}</div> : null}
        </li>
      ))}
    </ul>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="sx-faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function SourceList({ sources, citeAs, children }: { sources: Source[]; citeAs: string; children?: ReactNode }) {
  return (
    <section className="sx-sec sx-src" id="sources">
      <h2>Methodology and sources</h2>
      {children}
      <div className="sx-cite">
        <strong>How to cite:</strong> <code>{citeAs}</code>
      </div>
      <ol>
        {sources.map((s) => (
          <li key={s.name}>
            {s.name}{" "}
            {s.url.startsWith("#") ? null : (
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.url}
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function PageFoot({ updatedIso, updatedLabel, inHub = true }: { updatedIso: string; updatedLabel: string; inHub?: boolean }) {
  return (
    <p className="sx-foot">
      <time dateTime={updatedIso}>Last updated {updatedLabel}</time>
      {inHub ? <> · Part of the <Link href={HUB_PATH}>BluntChart astrology data hub</Link></> : null}. Astrology content is for
      entertainment.
    </p>
  );
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function articleJsonLd(opts: { headline: string; description: string; url: string; iso: string; published?: string; citations: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    author: { "@type": "Organization", name: "BluntChart", url: SITE },
    publisher: { "@type": "Organization", name: "BluntChart", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/mascot.png` } },
    datePublished: `${opts.published ?? opts.iso}T00:00:00+00:00`,
    dateModified: `${opts.iso}T00:00:00+00:00`,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    isPartOf: { "@type": "CollectionPage", "@id": `${SITE}${HUB_PATH}` },
    citation: opts.citations,
  };
}
