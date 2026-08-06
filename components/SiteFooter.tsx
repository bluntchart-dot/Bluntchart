import Image from "next/image";
import Link from "next/link";

/**
 * Single source of truth for the site footer.
 * Renders on every page via app/layout.tsx.
 *
 * Layout: brand column + 4 wider topical columns, each stacking 2 sections.
 * Wider columns = no link text wrapping onto multiple lines.
 * Scoped class names (bcf-*) + literal color values.
 */
export default function SiteFooter() {
  return (
    <footer className="bcf">
      <style>{`
        .bcf {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 52px 0 30px;
          position: relative;
          z-index: 1;
          background: #09090f;
          color: #e8e4f0;
          font-family: var(--font-body), 'DM Sans', system-ui, sans-serif;
        }
        .bcf-c { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
        .bcf-grid {
          display: grid;
          grid-template-columns: minmax(240px, 1.15fr) repeat(4, minmax(0, 1fr));
          align-items: flex-start;
          gap: 40px 32px;
          margin-bottom: 40px;
        }
        .bcf-brand { max-width: 280px; }
        .bcf-brand p {
          font-size: .86rem;
          color: rgba(232,228,240,0.55);
          line-height: 1.6;
          margin-top: 10px;
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
        .bcf-social { display: flex; gap: 10px; margin-top: 16px; }
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

        /* One column can hold multiple stacked sections */
        .bcf-col { display: flex; flex-direction: column; gap: 26px; min-width: 0; }
        .bcf-sec h4 {
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(232,228,240,0.55);
          margin-bottom: 14px;
        }
        .bcf-sec ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0;
          margin: 0;
        }
        .bcf-sec a {
          font-size: .85rem;
          color: rgba(232,228,240,0.55);
          text-decoration: none;
          transition: color .15s;
          line-height: 1.4;
          display: inline-block;
        }
        .bcf-sec a:hover { color: #e8e4f0; }
        .bcf-sec a.hl { color: #F0B84A; font-weight: 600; }
        .bcf-sec a.hl:hover { color: #ffcf70; }

        .bcf-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .bcf-disc {
          font-size: .73rem;
          color: rgba(232,228,240,0.28);
          max-width: 640px;
          line-height: 1.55;
          margin: 0;
        }
        .bcf-copy {
          font-size: .73rem;
          color: rgba(232,228,240,0.22);
          margin: 0;
        }

        /* Responsive collapse — never squeeze columns tight enough to wrap link text */
        @media (max-width: 1180px) {
          .bcf-grid {
            grid-template-columns: minmax(240px, 1fr) repeat(2, minmax(0, 1fr));
          }
          .bcf-grid > .bcf-col:nth-child(4) { grid-column: 2; }
          .bcf-grid > .bcf-col:nth-child(5) { grid-column: 3; }
        }
        @media (max-width: 768px) {
          .bcf-c { padding: 0 24px; }
          .bcf-grid { grid-template-columns: 1fr 1fr; gap: 32px 24px; }
          .bcf-grid > .bcf-brand { grid-column: 1 / -1; max-width: 100%; }
          .bcf-grid > .bcf-col:nth-child(4),
          .bcf-grid > .bcf-col:nth-child(5) { grid-column: auto; }
          .bcf-bottom { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .bcf-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="bcf-c">
        <div className="bcf-grid">

          {/* ─── COL 1 · Brand ─── */}
          <div className="bcf-brand">
            <Link href="/" className="bcf-logo">
              <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius: "50%" }} />
              <span className="bcf-logo-g">BluntChart</span>
            </Link>
            <p>Brutally honest birth chart readings. Real astrology, zero filter, no subscription.</p>
            <div className="bcf-social">
              <a href="https://www.tiktok.com/@bluntchart" target="_blank" rel="noopener noreferrer" aria-label="TikTok">Tk</a>
              <a href="https://www.instagram.com/bluntchart/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">In</a>
              <a href="https://www.youtube.com/@BluntChart" target="_blank" rel="noopener noreferrer" aria-label="YouTube">Yt</a>
            </div>
          </div>

          {/* ─── COL 2 · Product (Readings + Free Tools) ─── */}
          <div className="bcf-col">
            <div className="bcf-sec">
              <h4>Readings</h4>
              <ul>
                <li><Link href="/#try-it" className="hl">Birth Chart · $15</Link></li>
                <li><Link href="/in-depth-birth-chart" className="hl">In-Depth Reading · $24</Link></li>
                <li><Link href="/#waitlist">Compatibility · Soon</Link></li>
                <li><Link href="/#waitlist">Year Ahead · Soon</Link></li>
                <li><Link href="/#waitlist">Gift a Reading · Soon</Link></li>
              </ul>
            </div>
            <div className="bcf-sec">
              <h4>Free Tools</h4>
              <ul>
                <li><Link href="/free-birth-chart">Free Birth Chart</Link></li>
                <li><Link href="/natal-chart">Natal Chart</Link></li>
                <li><Link href="/big-three-calculator">Big Three</Link></li>
                <li><Link href="/moon-sign-calculator">Moon Sign</Link></li>
                <li><Link href="/rising-sign-calculator">Rising Sign</Link></li>
                <li><Link href="/zodiac-signs">Zodiac Signs</Link></li>
                <li><Link href="/moon-phase-soulmate-calculator">Moon Phase Match</Link></li>
                <li><Link href="/fight-card">The Fight Card</Link></li>
                <li><Link href="/future-love-letter">Love-letter</Link></li>
              </ul>
            </div>
          </div>

          {/* ─── COL 3 · Alternatives (+ Company) ─── */}
          <div className="bcf-col">
            <div className="bcf-sec">
              <h4>Alternatives</h4>
              <ul>
                <li><Link href="/astrology-app-alternatives" className="hl">All astrology apps</Link></li>
                <li><Link href="/co-star-alternative">Co-Star Alternative</Link></li>
                <li><Link href="/the-pattern-alternative">The Pattern Alternative</Link></li>
                <li><Link href="/chani-alternative">CHANI Alternative</Link></li>
                <li><Link href="/sanctuary-alternative">Sanctuary Alternative</Link></li>
                <li><Link href="/nebula-alternative">Nebula Alternative</Link></li>
              </ul>
            </div>
            <div className="bcf-sec">
              <h4>Company</h4>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/founder">Meet the Founder</Link></li>
              </ul>
            </div>
          </div>

          {/* ─── COL 4 · Patterns + Quizzes ─── */}
          <div className="bcf-col">
            <div className="bcf-sec">
              <h4>Patterns</h4>
              <ul>
                <li><Link href="/why-you-attract-the-wrong-person">Why I Attract the Wrong People</Link></li>
                <li><Link href="/why-do-i-push-people-away">Why I Push People Away</Link></li>
                <li><Link href="/why-do-i-self-sabotage">Why I Self-Sabotage</Link></li>
                <li><Link href="/why-am-i-so-hard-on-myself">Why I&apos;m So Hard on Myself</Link></li>
              </ul>
            </div>
            <div className="bcf-sec">
              <h4>Quizzes</h4>
              <ul>
                <li><Link href="/relationship-red-flags-birth-chart">Relationship Red Flags</Link></li>
                <li><Link href="/love-language-birth-chart">Love Language by Chart</Link></li>
                <li><Link href="/career-strength-birth-chart">Career Strength by Chart</Link></li>
                <li><Link href="/how-toxic-are-you-quiz">How Toxic Are You Quiz</Link></li>
              </ul>
            </div>
          </div>

          {/* ─── COL 5 · Retrograde tracker + Guides + Legal ─── */}
          <div className="bcf-col">
            <div className="bcf-sec">
              <h4>Retrograde Tracker</h4>
              <ul>
                <li><Link href="/is-mercury-retrograde">Is Mercury Retrograde?</Link></li>
                <li><Link href="/mercury-retrograde-2026">Mercury Retro 2026</Link></li>
                <li><Link href="/mercury-retrograde-in-cancer-2026">Mercury Retro in Cancer</Link></li>
                <li><Link href="/mercury-retrograde-in-scorpio-2026">Mercury Retro in Scorpio</Link></li>
                <li><Link href="/venus-retrograde-2026">Venus Retro 2026</Link></li>
              </ul>
            </div>
            <div className="bcf-sec">
              <h4>Guides</h4>
              <ul>
                <li><a href="https://blog.bluntchart.com" rel="noopener">Astrology Blog</a></li>
                <li><Link href="/free-birth-chart-readings">How Readings Work</Link></li>
                <li><Link href="/saturn-return-calculator">Saturn Return</Link></li>
              </ul>
            </div>
            <div className="bcf-sec">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/refunds">Refunds</Link></li>
              </ul>
            </div>
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
