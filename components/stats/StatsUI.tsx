import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared building blocks for the /astrology-data hub and its statistics reports.
 *
 * Layout: 1200px container, sticky contents sidebar on desktop, wide main column.
 * Type: DM Sans throughout (site body font); proportional figures on big numbers,
 * tabular figures only where numbers line up in columns.
 * Charts: single-series, zero-baseline bars. The highlighted bar uses the brand gold,
 * the rest a neutral gray (validated: both >= 3:1 on the card surface, CVD ΔE 24).
 * Values sit at bar tips in text colours, never in the bar colour.
 * Scoped class names (sx-*) so nothing leaks into the rest of the site.
 */

export type Source = { name: string; short: string; url: string };
export type Stat = { value: string; label: string; source: Source; icon?: IconName };

export const HUB_PATH = "/astrology-data";
export const SITE = "https://bluntchart.com";

// ─── ICONS ─────────────────────────────────────────────────────────────────────

const ICONS = {
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14.2c2.1.6 3.5 2.6 3.5 5.8" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>,
  star: <path d="M12 3l2.6 5.8 6.4.6-4.8 4.2 1.4 6.4-5.6-3.3-5.6 3.3 1.4-6.4L3 9.4l6.4-.6z" />,
  chart: <><path d="M3 20h18" /><path d="M6 20v-7M11 20V5M16 20v-10" /></>,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M11 18h2" /></>,
  coins: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
  flask: <><path d="M9 3h6" /><path d="M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" /><path d="M7.5 15h9" /></>,
  message: <path d="M4 5h16v11H9l-5 4z" />,
  book: <><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z" /><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  sunrise: <><path d="M3 19h18" /><path d="M7 19a5 5 0 0 1 10 0" /><path d="M12 4v7M9 7l3-3 3 3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  database: <><ellipse cx="12" cy="5.5" rx="8" ry="2.5" /><path d="M4 5.5v13c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-13" /><path d="M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14" /><path d="M12 17.5h.01" /></>,
  file: <><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" /></>,
  loop: <><path d="M4 12a8 8 0 0 1 14-5.3L20 9" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 0 1-14 5.3L4 15" /><path d="M4 20v-5h5" /></>,
  download: <path d="M12 4v11M7 10l5 5 5-5M4 20h16" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────────

const CSS = `
.sx{--bg:#08080e;--bg2:#0c0c14;--card:#111119;--card2:#16161f;--tx:#f0ecf7;--mt:rgba(240,236,247,.62);--fa:rgba(240,236,247,.38);
  --ln:rgba(255,255,255,.07);--ln2:rgba(255,255,255,.12);--ac:#E8B341;--ac2:#d4a235;--acs:rgba(232,179,65,.10);--acs2:rgba(232,179,65,.06);
  --bar:#5e5a72;--barhl:linear-gradient(90deg,#E8B341,#f0c45e);--glow:rgba(232,179,65,.08);
  background:var(--bg);color:var(--tx);font-family:var(--font-body),'DM Sans',system-ui,sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}
.sx *,.sx *::before,.sx *::after{box-sizing:border-box}
.sx a{color:var(--ac);text-decoration:underline;text-decoration-color:rgba(232,179,65,.30);text-underline-offset:3px;transition:text-decoration-color .15s}
.sx a:hover{text-decoration-color:var(--ac)}
.sx p{margin:0 0 14px}

/* nav */
.sx-nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(8,8,14,.88);border-bottom:1px solid var(--ln);backdrop-filter:blur(16px) saturate(1.4)}
.sx-nav-i{max-width:1240px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between}
.sx .sx-logo{display:flex;align-items:center;gap:10px;text-decoration:none;font-family:var(--font-display),Georgia,serif;font-weight:700;font-size:1.15rem;color:var(--tx)}
.sx-nav-l{display:flex;gap:24px;font-size:.88rem}
.sx .sx-nav-l a{color:var(--mt);text-decoration:none;transition:color .15s}
.sx .sx-nav-l a:hover{color:var(--tx)}
.sx .sx-nav-l a.on{color:var(--tx)}

/* page frame */
.sx-frame{max-width:1240px;margin:0 auto;padding:0 24px}
.sx-hero{padding:110px 0 44px;border-bottom:1px solid var(--ln);margin-bottom:8px;position:relative;
  background:radial-gradient(700px 280px at 80% 10%,rgba(232,179,65,.08),transparent 70%),
             radial-gradient(400px 200px at 20% 80%,rgba(107,47,212,.05),transparent 60%)}
.sx-crumb{font-size:.82rem;color:var(--fa);margin-bottom:24px}
.sx .sx-crumb a{color:var(--fa);text-decoration:none;transition:color .15s}
.sx .sx-crumb a:hover{color:var(--tx)}
.sx-crumb .sep{margin:0 8px;opacity:.5}
.sx-crumb .cur{color:var(--mt)}
.sx-kicker{display:inline-flex;align-items:center;gap:8px;font-size:.74rem;font-weight:600;letter-spacing:.10em;text-transform:uppercase;color:var(--ac);margin:0 0 16px}
.sx h1{font-size:clamp(2.1rem,4.4vw,3.2rem);line-height:1.08;font-weight:700;letter-spacing:-.03em;margin:0 0 18px;max-width:900px;
  background:linear-gradient(180deg,var(--tx) 40%,rgba(240,236,247,.7));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sx-lede{font-size:1.14rem;color:var(--mt);max-width:780px;margin:0 0 24px;line-height:1.7}
.sx-meta{display:flex;flex-wrap:wrap;gap:8px}
.sx-pill{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;color:var(--mt);border:1px solid var(--ln);border-radius:999px;padding:5px 14px;background:rgba(255,255,255,.02);transition:border-color .15s}
.sx-pill:hover{border-color:var(--ln2)}
.sx-pill svg{color:var(--ac)}

.sx-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:56px;align-items:start}
.sx-aside{position:sticky;top:88px;padding-top:40px}
.sx-aside p{font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--fa);margin:0 0 12px}
.sx-aside ol{list-style:none;margin:0;padding:0;border-left:2px solid var(--ln)}
.sx-aside li a{display:block;padding:7px 0 7px 16px;margin-left:-2px;border-left:2px solid transparent;font-size:.86rem;line-height:1.35;color:var(--mt);text-decoration:none;transition:color .15s,border-color .15s}
.sx-aside li a:hover{color:var(--tx);border-left-color:var(--ac)}
.sx-main{min-width:0;padding-bottom:24px}

/* sections */
.sx-sec{padding-top:64px;scroll-margin-top:80px}
.sx-sh{display:flex;align-items:center;gap:16px;margin-bottom:18px}
.sx-ic{flex:none;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--acs),rgba(107,47,212,.08));color:var(--ac);border:1px solid rgba(232,179,65,.12)}
.sx h2{font-size:1.6rem;line-height:1.25;font-weight:700;letter-spacing:-.02em;margin:0}
.sx h3{font-size:1.02rem;font-weight:600;margin:0 0 6px}
.sx-answer{font-size:1.1rem;color:var(--tx);margin:0 0 24px;max-width:820px;line-height:1.65}
.sx-answer b{color:var(--ac);font-weight:600}
.sx-p{color:var(--mt);max-width:820px;line-height:1.7}
.sx-p strong{color:var(--tx);font-weight:600}

/* stat tiles */
.sx-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin:0 0 24px}
.sx-tile{background:var(--card);border:1px solid var(--ln);border-radius:16px;padding:22px 22px 18px;display:flex;flex-direction:column;gap:8px;
  transition:border-color .2s,box-shadow .2s,transform .2s}
.sx-tile:hover{border-color:var(--ln2);box-shadow:0 4px 24px rgba(0,0,0,.25);transform:translateY(-1px)}
.sx-tile .top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.sx-tile .v{font-size:2.2rem;font-weight:700;line-height:1.05;letter-spacing:-.03em;
  background:linear-gradient(135deg,var(--tx),rgba(240,236,247,.75));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sx-tile .top svg{color:var(--fa);flex:none;margin-top:4px;opacity:.7}
.sx-tile .l{font-size:.9rem;line-height:1.5;color:var(--mt);flex:1}
.sx-tile.hl{background:linear-gradient(160deg,rgba(232,179,65,.10),rgba(232,179,65,.02) 70%);border-color:rgba(232,179,65,.20)}
.sx-tile.hl .v{background:linear-gradient(135deg,#E8B341,#f0c45e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sx-tile.hl:hover{border-color:rgba(232,179,65,.35);box-shadow:0 4px 32px rgba(232,179,65,.08)}

/* source badge */
.sx-src-b{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;color:var(--fa);text-decoration:none!important;margin-top:4px;max-width:100%;transition:color .15s}
.sx-src-b:hover{color:var(--mt)!important}
.sx-mk{flex:none;display:inline-grid;place-items:center;min-width:22px;height:22px;padding:0 5px;border-radius:6px;background:var(--card2);border:1px solid var(--ln);color:var(--tx);font-size:.6rem;font-weight:700;letter-spacing:.02em}
.sx-mk img{border-radius:50%}
.sx-src-b span.t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* figure + charts */
.sx-fig{background:var(--card);border:1px solid var(--ln);border-radius:18px;padding:26px 26px 20px;margin:0 0 22px;
  transition:border-color .2s,box-shadow .2s}
.sx-fig:hover{border-color:var(--ln2);box-shadow:0 2px 20px rgba(0,0,0,.2)}
.sx-fig-h{margin-bottom:20px}
.sx-fig-h .s{font-size:.86rem;color:var(--fa);margin:0}
.sx-fig-f{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;border-top:1px solid var(--ln);margin-top:18px;padding-top:14px;font-size:.78rem;color:var(--fa)}
.sx-fig-f a{color:var(--mt)}

.sx-bars{display:grid;gap:10px}
.sx-br{display:grid;grid-template-columns:minmax(96px,170px) 1fr 64px;align-items:center;gap:12px;font-size:.9rem;position:relative}
.sx-br .lb{color:var(--mt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:color .15s}
.sx-br.on .lb{color:var(--tx);font-weight:500}
.sx .sx-br .lb a{color:inherit;text-decoration:none}
.sx-br .tr{height:28px;display:flex;align-items:center;border-radius:6px;background:rgba(255,255,255,.03)}
.sx-br .fl{height:22px;border-radius:4px 6px 6px 4px;background:var(--bar);min-width:4px;transition:filter .2s}
.sx-br.on .fl{background:var(--barhl)}
.sx-br .vl{font-variant-numeric:tabular-nums;color:var(--mt);font-size:.88rem;text-align:right;font-weight:500}
.sx-br.on .vl{color:var(--tx);font-weight:700}
.sx-br:hover .lb{color:var(--tx)}
.sx-br:hover .fl{filter:brightness(1.2)}
.sx-br[data-tip]:hover::after{content:attr(data-tip);position:absolute;left:clamp(110px,30%,190px);top:-34px;background:var(--card2);border:1px solid var(--ln2);color:var(--tx);font-size:.76rem;padding:5px 10px;border-radius:8px;white-space:nowrap;pointer-events:none;z-index:2;box-shadow:0 4px 16px rgba(0,0,0,.4)}
.sx-axis{display:grid;grid-template-columns:minmax(96px,170px) 1fr 64px;gap:12px;margin-top:8px;font-size:.72rem;color:var(--fa);font-variant-numeric:tabular-nums}
.sx-axis .ax{display:flex;justify-content:space-between;border-top:1px solid var(--ln);padding-top:6px}

.sx-cols{display:flex;align-items:flex-end;gap:12px;height:240px;border-bottom:1px solid var(--ln);padding:0 8px}
.sx-col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;position:relative}
.sx-col .cv{font-size:.88rem;font-weight:700;margin-bottom:8px;color:var(--mt)}
.sx-col .cf{width:min(36px,75%);border-radius:6px 6px 0 0;background:var(--bar);transition:filter .2s}
.sx-col.on .cf{background:var(--barhl)}
.sx-col.on .cv{color:var(--tx)}
.sx-col:hover .cf{filter:brightness(1.2)}
.sx-col[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);background:var(--card2);border:1px solid var(--ln2);color:var(--tx);font-size:.76rem;padding:5px 10px;border-radius:8px;white-space:nowrap;z-index:2;box-shadow:0 4px 16px rgba(0,0,0,.4)}
.sx-col-x{display:flex;gap:12px;padding:10px 8px 0}
.sx-col-x div{flex:1;text-align:center;font-size:.8rem;color:var(--mt);line-height:1.35}
.sx-col-x small{display:block;color:var(--fa);font-size:.7rem;margin-top:2px}

/* tables */
.sx-tw{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:14px;border:1px solid var(--ln);background:var(--card)}
.sx-t{width:100%;border-collapse:collapse;font-size:.9rem}
.sx-t th{font-size:.72rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--fa);text-align:left;padding:12px 16px 12px 16px;border-bottom:1px solid var(--ln2);white-space:nowrap;background:var(--bg2)}
.sx-t td{padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--mt);vertical-align:middle}
.sx-t tbody tr{transition:background .15s}
.sx-t tbody tr:hover{background:rgba(255,255,255,.025)}
.sx-t tr:last-child td{border-bottom:none}
.sx-t td.b{color:var(--tx);font-weight:500}
.sx-t td.n{white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--tx);font-weight:500}
.sx-t tr.sep td{color:var(--fa);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;padding-top:20px}
.sx-heat td.h{text-align:center;font-variant-numeric:tabular-nums;color:var(--tx);border-radius:6px;border:2px solid var(--card);padding:8px 6px}

/* misc */
.sx-pending{display:flex;gap:14px;border:1px dashed rgba(255,255,255,.14);border-radius:14px;padding:16px 18px;font-size:.88rem;color:var(--mt);margin:0 0 22px;background:rgba(255,255,255,.015)}
.sx-pending svg{flex:none;color:var(--fa);margin-top:2px}
.sx-pending strong{color:var(--tx);font-weight:600}

.sx-cta{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;border-radius:18px;padding:28px 30px;margin:64px 0 0;
  background:linear-gradient(135deg,rgba(232,179,65,.08),rgba(107,47,212,.08));border:1px solid rgba(232,179,65,.18);
  box-shadow:0 4px 32px rgba(232,179,65,.04)}
.sx-cta p{margin:0;font-size:1rem;color:var(--mt);flex:1;min-width:240px}
.sx-cta p strong{display:block;color:var(--tx);font-weight:600;font-size:1.14rem;margin-bottom:4px}
.sx .sx-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:10px;background:linear-gradient(135deg,var(--ac),var(--ac2));color:#17120a;font-size:.9rem;font-weight:600;text-decoration:none;white-space:nowrap;box-shadow:0 2px 12px rgba(232,179,65,.2);transition:filter .15s,box-shadow .15s,transform .15s}
.sx .sx-btn:hover{filter:brightness(1.1);box-shadow:0 4px 20px rgba(232,179,65,.3);transform:translateY(-1px)}

.sx-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin:0 0 18px}
.sx .sx-card{display:flex;flex-direction:column;gap:8px;background:var(--card);border:1px solid var(--ln);border-radius:16px;padding:22px;text-decoration:none;color:var(--tx);transition:border-color .2s,transform .2s,box-shadow .2s}
.sx .sx-card:hover{border-color:rgba(232,179,65,.30);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.3),0 0 0 1px rgba(232,179,65,.08)}
.sx-card .ci{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,var(--acs),rgba(107,47,212,.06));color:var(--ac);margin-bottom:6px;border:1px solid rgba(232,179,65,.08)}
.sx-card .t{font-weight:600;font-size:1.02rem;line-height:1.35}
.sx-card .d{font-size:.88rem;color:var(--mt);line-height:1.55}
.sx-card .m{font-size:.76rem;color:var(--fa);margin-top:auto;padding-top:8px;display:flex;align-items:center;gap:6px}
.sx-card.soon{opacity:.45}

.sx-faq{background:var(--card);border:1px solid var(--ln);border-radius:18px;padding:4px 24px}
.sx-faq details{border-bottom:1px solid var(--ln);padding:18px 0}
.sx-faq details:last-child{border-bottom:none}
.sx-faq summary{cursor:pointer;font-weight:500;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;transition:color .15s}
.sx-faq summary:hover{color:var(--ac)}
.sx-faq summary::-webkit-details-marker{display:none}
.sx-faq summary::after{content:'+';color:var(--ac);font-size:1.3rem;line-height:1;opacity:.6;transition:opacity .15s,transform .2s}
.sx-faq summary:hover::after{opacity:1}
.sx-faq details[open] summary::after{content:'−';transform:rotate(180deg)}
.sx-faq details[open] summary{color:var(--ac)}
.sx-faq details p{margin:12px 0 4px;font-size:.93rem;color:var(--mt);max-width:820px;line-height:1.7}

.sx-srcs ol{padding-left:20px;margin:20px 0 0;font-size:.84rem;color:var(--mt);columns:2;column-gap:40px}
.sx-srcs li{margin-bottom:12px;word-break:break-word;break-inside:avoid;line-height:1.6}
.sx-cite{font-size:.84rem;color:var(--mt);background:var(--card);border:1px solid var(--ln);border-radius:14px;padding:16px 18px;margin:18px 0 0}
.sx-cite code{font-family:ui-monospace,Consolas,monospace;font-size:.8rem;color:var(--tx)}

.sx-foot{font-size:.78rem;color:var(--fa);text-align:center;padding:56px 0 64px;border-top:1px solid var(--ln);margin-top:64px}

@media(max-width:1024px){
  .sx-layout{grid-template-columns:1fr;gap:0}
  .sx-aside{position:static;padding-top:28px}
  .sx-aside ol{display:flex;flex-wrap:wrap;gap:6px;border-left:none}
  .sx-aside li a{border:1px solid var(--ln);border-radius:999px;padding:5px 12px;margin:0;font-size:.8rem}
  .sx-srcs ol{columns:1}
}
@media(max-width:640px){
  .sx-frame{padding:0 16px}
  .sx-nav-l{display:none}
  .sx-hero{padding-top:96px}
  .sx-fig{padding:20px 16px 16px;border-radius:14px}
  .sx-br,.sx-axis{grid-template-columns:88px 1fr 52px;gap:8px;font-size:.84rem}
  .sx-br .tr{height:24px}
  .sx-br .fl{height:18px}
  .sx-cols{gap:6px;height:200px}
  .sx-col .cv{font-size:.76rem}
  .sx-col .cf{width:min(28px,70%)}
  .sx-col-x{gap:6px}
  .sx-col-x div{font-size:.72rem}
  .sx-tile .v{font-size:1.8rem}
  .sx-tile{padding:18px 18px 16px;border-radius:14px}
  .sx-tw{border-radius:12px}
  .sx-cards{gap:12px}
  .sx .sx-card{padding:18px;border-radius:14px}
  .sx-faq{padding:4px 18px;border-radius:14px}
}
`;

// ─── LAYOUT ────────────────────────────────────────────────────────────────────

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
            <Link href="/in-depth-birth-chart">Full reading</Link>
          </div>
        </div>
      </nav>
      <div className="sx-frame">{children}</div>
    </div>
  );
}

function validateDatasets(obj: Record<string, unknown>) {
  const datasets: Record<string, unknown>[] = [];
  if (obj["@type"] === "Dataset") datasets.push(obj);
  if (Array.isArray(obj.dataset)) datasets.push(...(obj.dataset as Record<string, unknown>[]));
  const errors: string[] = [];
  for (const ds of datasets) {
    const desc = ds.description;
    if (typeof desc === "string" && desc.length < 50)
      errors.push(`Dataset "${ds.name}" description is ${desc.length} chars (Google requires 50–5000)`);
    if (!ds.creator)
      errors.push(`Dataset "${ds.name}" is missing the "creator" field`);
  }
  if (errors.length) throw new Error(`[JsonLd] Structured data errors:\n${errors.join("\n")}`);
}

export function JsonLd({ data }: { data: object }) {
  if (process.env.NODE_ENV === "development") validateDatasets(data as Record<string, unknown>);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Hero({
  crumbs,
  kicker,
  kickerIcon = "chart",
  title,
  lede,
  updatedIso,
  updatedLabel,
  pills = [],
}: {
  crumbs: { label: string; href?: string }[];
  kicker: string;
  kickerIcon?: IconName;
  title: string;
  lede: ReactNode;
  updatedIso: string;
  updatedLabel: string;
  pills?: { icon: IconName; text: string }[];
}) {
  return (
    <header className="sx-hero">
      <nav className="sx-crumb" aria-label="Breadcrumb">
        {crumbs.map((it, i) => (
          <span key={it.label}>
            {i > 0 && <span className="sep">/</span>}
            {it.href ? <Link href={it.href}>{it.label}</Link> : <span className="cur">{it.label}</span>}
          </span>
        ))}
      </nav>
      <p className="sx-kicker"><Icon name={kickerIcon} size={16} />{kicker}</p>
      <h1>{title}</h1>
      <p className="sx-lede">{lede}</p>
      <div className="sx-meta">
        <span className="sx-pill"><Icon name="clock" size={14} />Updated <time dateTime={updatedIso}>{updatedLabel}</time></span>
        {pills.map((p) => (
          <span className="sx-pill" key={p.text}><Icon name={p.icon} size={14} />{p.text}</span>
        ))}
      </div>
    </header>
  );
}

/** Two-column body: sticky contents list + main column. */
export function Body({ toc, children }: { toc: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <div className="sx-layout">
      <aside className="sx-aside" aria-label="Contents">
        <p>On this page</p>
        <ol>
          {toc.map((i) => (
            <li key={i.id}><a href={`#${i.id}`}>{i.label}</a></li>
          ))}
        </ol>
      </aside>
      <main className="sx-main">{children}</main>
    </div>
  );
}

export function Section({ id, icon, title, answer, children }: { id?: string; icon?: IconName; title: string; answer?: ReactNode; children?: ReactNode }) {
  return (
    <section className="sx-sec" id={id}>
      <div className="sx-sh">
        {icon ? <span className="sx-ic"><Icon name={icon} /></span> : null}
        <h2>{title}</h2>
      </div>
      {answer ? <p className="sx-answer">{answer}</p> : null}
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="sx-p">{children}</p>;
}

// ─── SOURCES ───────────────────────────────────────────────────────────────────

const MARKS: [RegExp, string][] = [
  [/^Pew/, "PEW"], [/^Gallup/, "G"], [/^YouGov/, "YG"], [/^Ipsos/, "IP"], [/^NSF/, "NSF"], [/^CDC/, "CDC"],
  [/^SSA/, "SSA"], [/^US Census/, "USC"], [/^Market Research Future/, "MRF"], [/^The Business Research/, "TBRC"],
  [/^MarkNtel/, "MN"], [/^IBISWorld/, "IBIS"], [/^BW/, "BW"], [/^Apple/, "APP"], [/^TechCrunch/, "TC"],
  [/^Axios/, "AX"], [/^Statista/, "ST"], [/^RedditList/, "R"], [/^Wikimedia/, "W"], [/^Carlson/, "NAT"],
  [/^Dean/, "JCS"], [/^Wyman/, "JGP"], [/^astronomy/, "AE"],
];

function SourceMark({ source }: { source: Source }) {
  if (source.short.startsWith("BluntChart")) {
    return <span className="sx-mk" style={{ padding: 0, border: "none", background: "none" }}><img src="/mascot.png" alt="" width={22} height={22} /></span>;
  }
  const m = MARKS.find(([re]) => re.test(source.short));
  return <span className="sx-mk">{m ? m[1] : source.short.slice(0, 2).toUpperCase()}</span>;
}

function isInternal(url: string) {
  return url.startsWith("#") || url.startsWith(SITE) || url.startsWith("/");
}

/** Inline text citation. */
export function Cite({ source }: { source: Source }) {
  return (
    <a href={source.url} {...(isInternal(source.url) ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
      {source.short}
    </a>
  );
}

/** Source badge: publisher mark + name. */
export function SourceBadge({ source }: { source: Source }) {
  return (
    <a className="sx-src-b" href={source.url} title={source.name} {...(isInternal(source.url) ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
      <SourceMark source={source} />
      <span className="t">{source.short}</span>
    </a>
  );
}

// ─── STAT TILES ────────────────────────────────────────────────────────────────

export function StatTiles({ stats, highlightFirst = false }: { stats: Stat[]; highlightFirst?: boolean }) {
  return (
    <div className="sx-tiles">
      {stats.map((s, i) => (
        <div className={`sx-tile${highlightFirst && i === 0 ? " hl" : ""}`} key={s.value + s.label}>
          <div className="top">
            <div className="v">{s.value}</div>
            {s.icon ? <Icon name={s.icon} size={18} /> : null}
          </div>
          <div className="l">{s.label}</div>
          <SourceBadge source={s.source} />
        </div>
      ))}
    </div>
  );
}

// ─── FIGURES & CHARTS ──────────────────────────────────────────────────────────

export function Figure({ title, subtitle, sources, note, children }: { title: string; subtitle?: string; sources?: Source[]; note?: ReactNode; children: ReactNode }) {
  return (
    <figure className="sx-fig" style={{ marginInline: 0 }}>
      <div className="sx-fig-h">
        <h3>{title}</h3>
        {subtitle ? <p className="s">{subtitle}</p> : null}
      </div>
      {children}
      {sources?.length || note ? (
        <figcaption className="sx-fig-f">
          <span style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
            {sources?.map((s) => <SourceBadge key={s.url + s.short} source={s} />)}
          </span>
          {note ? <span>{note}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export type BarRow = { label: string; value: number; display?: string; href?: string; tip?: string };

const fmtPct = (v: number) => `${v % 1 === 0 ? v : v.toFixed(2)}%`;

/**
 * Horizontal bar chart, zero baseline. `highlight` = labels drawn in the accent;
 * by default the largest value is highlighted.
 */
export function BarChart({ rows, max, highlight, ticks, format = fmtPct, label }: {
  rows: BarRow[];
  max?: number;
  highlight?: string[];
  ticks?: number[];
  format?: (v: number) => string;
  label: string;
}) {
  const top = max ?? Math.max(...rows.map((r) => r.value));
  const on = new Set(highlight ?? [rows.reduce((a, b) => (b.value > a.value ? b : a)).label]);
  return (
    <div role="img" aria-label={label}>
      <div className="sx-bars">
        {rows.map((r) => (
          <div className={`sx-br${on.has(r.label) ? " on" : ""}`} key={r.label} data-tip={r.tip ?? `${r.label}: ${r.display ?? format(r.value)}`}>
            <div className="lb">{r.href ? <Link href={r.href}>{r.label}</Link> : r.label}</div>
            <div className="tr"><div className="fl" style={{ width: `${(r.value / top) * 100}%` }} /></div>
            <div className="vl">{r.display ?? format(r.value)}</div>
          </div>
        ))}
      </div>
      {ticks ? (
        <div className="sx-axis" aria-hidden="true">
          <span />
          <div className="ax">{ticks.map((t) => <span key={t}>{format(t)}</span>)}</div>
          <span />
        </div>
      ) : null}
    </div>
  );
}

/** Vertical column chart for change over time, zero baseline. */
export function ColumnChart({ cols, max, highlight, label }: {
  cols: { label: string; key?: string; sub?: string; value: number; display: string; tip?: string }[];
  max: number;
  highlight?: string[];
  label: string;
}) {
  const on = new Set(highlight ?? []);
  return (
    <div role="img" aria-label={label}>
      <div className="sx-cols">
        {cols.map((c) => (
          <div className={`sx-col${on.has(c.key ?? c.label) ? " on" : ""}`} key={c.key ?? c.label} data-tip={c.tip}>
            <span className="cv">{c.display}</span>
            <div className="cf" style={{ height: `${(c.value / max) * 82}%` }} />
          </div>
        ))}
      </div>
      <div className="sx-col-x" aria-hidden="true">
        {cols.map((c) => (
          <div key={c.key ?? c.label}>{c.label}{c.sub ? <small>{c.sub}</small> : null}</div>
        ))}
      </div>
    </div>
  );
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="sx-tw">
      <table className={`sx-t${className ? " " + className : ""}`}>{children}</table>
    </div>
  );
}

/** Background for a heatmap cell: gold at an opacity scaled between min and max. */
export function heat(value: number, min: number, max: number) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return { background: `rgba(224,169,62,${(0.06 + t * 0.5).toFixed(3)})` };
}

// ─── MISC ──────────────────────────────────────────────────────────────────────

export function Pending({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="sx-pending">
      <Icon name="clock" size={18} />
      <div><strong>Data pending: {title}.</strong> {children}</div>
    </div>
  );
}

export function Cta({ title, text, href, label }: { title: string; text: ReactNode; href: string; label: string }) {
  return (
    <div className="sx-cta">
      <p><strong>{title}</strong>{text}</p>
      <Link className="sx-btn" href={href}>{label}<Icon name="arrow" size={16} /></Link>
    </div>
  );
}

export function Cards({ items }: { items: { href?: string; icon: IconName; title: string; desc: string; meta?: string }[] }) {
  return (
    <div className="sx-cards">
      {items.map((i) => {
        const inner = (
          <>
            <span className="ci"><Icon name={i.icon} size={18} /></span>
            <span className="t">{i.title}</span>
            <span className="d">{i.desc}</span>
            {i.meta ? <span className="m">{i.meta}</span> : null}
          </>
        );
        if (!i.href) return <div className="sx-card soon" key={i.title}>{inner}</div>;
        return i.href.endsWith(".csv")
          ? <a className="sx-card" href={i.href} key={i.href} download>{inner}</a>
          : <Link className="sx-card" href={i.href} key={i.href}>{inner}</Link>;
      })}
    </div>
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
    <section className="sx-sec sx-srcs" id="sources">
      <div className="sx-sh">
        <span className="sx-ic"><Icon name="book" /></span>
        <h2>Methodology and sources</h2>
      </div>
      {children}
      <div className="sx-cite">
        <strong>How to cite:</strong> <code>{citeAs}</code>
      </div>
      <ol>
        {sources.map((s) => (
          <li key={s.name}>
            {s.name}{" "}
            {isInternal(s.url) ? null : (
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
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

// ─── JSON-LD HELPERS ───────────────────────────────────────────────────────────

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
