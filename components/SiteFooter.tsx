import Image from "next/image";
import Link from "next/link";

/**
 * Single source of truth for the site footer.
 * Any change made here is reflected on every page.
 *
 * Scoped class names (bcf-*) + literal color values so the footer
 * renders identically regardless of the host page's CSS vars.
 */
export default function SiteFooter() {
  return (
    <footer className="bcf">
      <style>{`
        .bcf {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 48px 0 30px;
          position: relative;
          z-index: 1;
          background: #09090f;
          color: #e8e4f0;
          font-family: var(--font-body), 'DM Sans', system-ui, sans-serif;
        }
        .bcf-c { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
        .bcf-grid {
          display: grid;
          grid-template-columns: minmax(200px, 1.4fr) repeat(5, minmax(0, 1fr));
          align-items: flex-start;
          gap: 28px;
          margin-bottom: 36px;
        }
        .bcf-brand { max-width: 240px; }
        .bcf-brand p {
          font-size: .82rem;
          color: rgba(232,228,240,0.55);
          line-height: 1.6;
          margin-top: 8px;
        }
        .bcf-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display), 'Playfair Display', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: .02em;
          color: #e8e4f0;
        }
        .bcf-logo-g {
          background: linear-gradient(135deg, #f0b84a, #d4537e, #6b2fd4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .bcf-social { display: flex; gap: 10px; margin-top: 14px; }
        .bcf-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: rgba(232,228,240,0.55);
          text-decoration: none;
          font-size: .82rem;
          font-weight: 700;
          transition: all .2s;
        }
        .bcf-social a:hover {
          border-color: rgba(107,47,212,0.4);
          color: #F0B84A;
          background: rgba(107,47,212,0.1);
        }
        .bcf-col h4 {
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(232,228,240,0.55);
          margin-bottom: 14px;
        }
        .bcf-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0;
          margin: 0;
        }
        .bcf-col a {
          font-size: .83rem;
          color: rgba(232,228,240,0.35);
          text-decoration: none;
          transition: color .2s;
        }
        .bcf-col a:hover { color: #e8e4f0; }
        .bcf-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .bcf-disc {
          font-size: .73rem;
          color: rgba(232,228,240,0.25);
          max-width: 520px;
          line-height: 1.55;
          margin: 0;
        }
        .bcf-copy {
          font-size: .73rem;
          color: rgba(232,228,240,0.2);
          margin: 0;
        }
        @media (max-width: 1100px) {
          .bcf-grid { grid-template-columns: minmax(200px, 1.2fr) repeat(3, minmax(0, 1fr)); }
          .bcf-grid > .bcf-col:nth-child(5),
          .bcf-grid > .bcf-col:nth-child(6) { grid-column: span 2; }
        }
        @media (max-width: 768px) {
          .bcf-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .bcf-grid > .bcf-brand { grid-column: 1 / -1; max-width: 100%; }
          .bcf-grid > .bcf-col:nth-child(5),
          .bcf-grid > .bcf-col:nth-child(6) { grid-column: auto; }
          .bcf-bottom { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .bcf-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="bcf-c">
        <div className="bcf-grid">
          <div className="bcf-brand">
            <Link href="/" className="bcf-logo">
              <Image
                src="/mascot.png"
                alt="BluntChart mascot"
                width={34}
                height={34}
                style={{ borderRadius: "50%" }}
              />
              <span className="bcf-logo-g">BluntChart</span>
            </Link>
            <p>Brutally honest birth chart readings. Real astrology, zero filter, no subscription.</p>
            <div className="bcf-social">
              <a href="https://www.tiktok.com/@bluntchart" target="_blank" rel="noopener noreferrer" aria-label="TikTok">Tk</a>
              <a href="https://www.instagram.com/bluntchart/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">In</a>
              <a href="https://www.youtube.com/@BluntChart" target="_blank" rel="noopener noreferrer" aria-label="YouTube">Yt</a>
            </div>
          </div>

          <div className="bcf-col">
            <h4>Readings</h4>
            <ul>
              <li><Link href="/#try-it">Birth Chart · $15</Link></li>
              <li><Link href="/#waitlist">Compatibility · Coming Soon</Link></li>
              <li><Link href="/#waitlist">Year Ahead · Coming Soon</Link></li>
              <li><Link href="/#waitlist">Gift a Reading · Coming Soon</Link></li>
            </ul>
          </div>

          <div className="bcf-col">
            <h4>Free Tools</h4>
            <ul>
              <li><Link href="/free-birth-chart">Free Birth Chart</Link></li>
              <li><Link href="/natal-chart">Natal Chart</Link></li>
              <li><Link href="/big-three-calculator">Big Three Calculator</Link></li>
              <li><Link href="/moon-sign-calculator">Moon Sign Calculator</Link></li>
              <li><Link href="/rising-sign-calculator">Rising Sign Calculator</Link></li>
              <li><Link href="/zodiac-signs">Zodiac Signs</Link></li>
            </ul>
          </div>

          <div className="bcf-col">
            <h4>Learn</h4>
            <ul>
              <li><a href="https://blog.bluntchart.com" rel="noopener">Astrology Blog</a></li>
              <li><Link href="/free-birth-chart-readings">How Birth Chart Readings Work</Link></li>
              <li><Link href="/is-mercury-retrograde">Is Mercury Retrograde?</Link></li>
              <li><Link href="/mercury-retrograde-2026">Mercury Retrograde 2026</Link></li>
              <li><Link href="/mercury-retrograde-in-cancer-2026">Mercury Retrograde in Cancer</Link></li>
              <li><Link href="/mercury-retrograde-in-scorpio-2026">Mercury Retrograde in Scorpio</Link></li>
              <li><Link href="/venus-retrograde-2026">Venus Retrograde 2026</Link></li>
              <li><Link href="/saturn-return-calculator">Saturn Return Calculator</Link></li>
              <li><Link href="/why-you-attract-the-wrong-person">Why You Attract the Wrong Person</Link></li>
              <li><Link href="/relationship-red-flags-birth-chart">Relationship Red Flags Test</Link></li>
              <li><Link href="/career-strength-birth-chart">Career Strength by Chart</Link></li>
              <li><Link href="/love-language-birth-chart">Love Language by Chart</Link></li>
              <li><Link href="/how-toxic-are-you-quiz">How Toxic Are You Quiz</Link></li>
            </ul>
          </div>

          <div className="bcf-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About BluntChart</Link></li>
              <li><Link href="/founder">Meet the Founder</Link></li>
            </ul>
          </div>

          <div className="bcf-col">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/refunds">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="bcf-bottom">
          <p className="bcf-disc">
            For entertainment purposes only. BluntChart readings are not a substitute for
            medical, psychological, financial, or legal advice. Do not make major life
            decisions based solely on astrological content.
          </p>
          <p className="bcf-copy">© 2026 BluntChart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
