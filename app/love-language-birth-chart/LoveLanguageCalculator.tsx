"use client";

import { useState } from "react";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const ELEMENTS = ["fire", "earth", "air", "water", "fire", "earth", "air", "water", "fire", "earth", "air", "water"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDayOfYear(month: number, day: number) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let doy = day;
  for (let i = 0; i < month - 1; i++) doy += days[i];
  return doy;
}

function estimateVenus(month: number, day: number) {
  const dayOfYear = getDayOfYear(month, day);
  return Math.floor((dayOfYear + 40) / 30) % 12;
}

function estimateMoon(year: number, month: number, day: number) {
  const ref = new Date(2000, 0, 1);
  const target = new Date(year, month - 1, day);
  const daysDiff = Math.floor((target.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
  return ((9 + Math.floor(daysDiff / 2.5)) % 12 + 12) % 12;
}

const VENUS_PROFILES: Record<number, { give: string; ways: string[] }> = {
  0: { give: "Bold, direct, in-your-face love", ways: ["Public gestures", "Chasing you first", "Bringing intensity", "Making you the mission"] },
  1: { give: "Steady, sensual, physical love", ways: ["Slow touch", "Nice things, no fuss", "Cooking for you", "Being consistently there"] },
  2: { give: "Playful, curious, verbal love", ways: ["Long conversations", "Voice notes at 2am", "Making you laugh", "Never boring"] },
  3: { give: "Nurturing, protective, safe love", ways: ["Feeding you", "Remembering everything", "Making home", "Emotional attunement"] },
  4: { give: "Big, warm, generous love", ways: ["Grand gestures", "Public affection", "Making you feel chosen", "Loyalty out loud"] },
  5: { give: "Practical, thoughtful, useful love", ways: ["Doing things for you", "Handling logistics", "Remembering small preferences", "Fixing what's broken"] },
  6: { give: "Romantic, aesthetic, refined love", ways: ["Beautiful settings", "Written words", "Balance and harmony", "Making everything nice"] },
  7: { give: "Deep, all-in, unfiltered love", ways: ["Total presence", "Wanting all of you", "Sharing secrets", "Intensity without apology"] },
  8: { give: "Adventurous, spacious, honest love", ways: ["Travel plans", "Big ideas", "Freedom given willingly", "Truthful even when hard"] },
  9: { give: "Loyal, committed, structural love", ways: ["Building a future", "Showing up", "Providing", "Time as the receipt"] },
  10: { give: "Cerebral, unconventional, freedom-based love", ways: ["Understanding you", "Space to be yourself", "Big ideas together", "Friendship as the foundation"] },
  11: { give: "Tender, dreamy, empathic love", ways: ["Feeling what you feel", "Poetic gestures", "Complete devotion", "Loving the soft parts"] },
};

const MOON_PROFILES: Record<number, { need: string; ways: string[] }> = {
  0: { need: "Directness and intensity", ways: ["No mixed signals", "Fight it out and move on", "Someone who initiates", "Passion, not politeness"] },
  1: { need: "Safety, touch, and consistency", ways: ["Physical presence", "Reliable routines", "Comfort over drama", "Slow, steady care"] },
  2: { need: "Communication and mental play", ways: ["Talking through everything", "Curiosity about you", "Verbal affection", "Space to change your mind"] },
  3: { need: "Emotional safety and being nurtured", ways: ["Being asked how you feel", "Home-cooked care", "Predictability", "Someone who stays"] },
  4: { need: "Being seen and appreciated", ways: ["Compliments that land", "Being chosen visibly", "Warmth and generosity", "Feeling like the main character"] },
  5: { need: "Order, small acts, being helped", ways: ["Details noticed", "Practical care", "Not being criticized", "Someone who shows up on time"] },
  6: { need: "Balance, fairness, harmony", ways: ["Being consulted", "Aesthetic care", "Calm conversations", "Feeling like a partner, not a project"] },
  7: { need: "Depth, honesty, all-or-nothing love", ways: ["Being asked the real questions", "Nothing surface", "Being trusted with everything", "Loyalty tested and passed"] },
  8: { need: "Freedom, adventure, honesty", ways: ["Room to breathe", "Someone who tells you the truth", "Big experiences", "Not being contained"] },
  9: { need: "Respect, competence, structure", ways: ["Being taken seriously", "Someone who follows through", "Emotional restraint", "Feeling built for the long term"] },
  10: { need: "Understanding and mental freedom", ways: ["Being understood, not fixed", "Space to be strange", "Intellectual match", "Friendship first"] },
  11: { need: "Tenderness, empathy, quiet closeness", ways: ["Someone who feels you without you explaining", "Softness", "Being loved on your worst day", "Gentleness"] },
};

const AVOID_TEXT: Record<number, string> = {
  0: "People who play games or take days to reply. Ambiguity feels like rejection to you.",
  1: "Instability, chaos, and 'we'll figure it out.' Your love needs a foundation.",
  2: "Emotional intensity delivered in long, unbroken monologues. Give it in words, then a break.",
  3: "Public confrontation, cold logic in emotional moments, or being asked to 'just chill.'",
  4: "Being dimmed, hidden, or treated like just another option. It reads as rejection immediately.",
  5: "Sloppiness with time, promises, and small commitments. It's not small to you.",
  6: "Extremes, drama, and forced choices. You need room to balance.",
  7: "Half-in energy. Being kept as an option, or being handed a curated version of someone.",
  8: "Anything that feels like a cage — jealousy, monitoring, or requiring constant check-ins.",
  9: "Wasted time, empty words, and people who can't commit or provide structure.",
  10: "Emotional overwhelm without space to think. You need distance to feel close.",
  11: "Harshness, criticism dressed as honesty, and being told your feelings are 'too much.'",
};

function getMatchVerdict(vEl: string, mEl: string) {
  if (vEl === mEl) return { title: "Aligned", tagline: "You love the way you want to be loved." };
  const compat: Record<string, boolean> = { "fire-air": true, "air-fire": true, "earth-water": true, "water-earth": true };
  if (compat[`${vEl}-${mEl}`]) return { title: "Complementary", tagline: "Different flavors that actually fit together." };
  return { title: "Split", tagline: "You give one way, need another — and that's the whole insight." };
}

export default function LoveLanguageCalculator() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{ vIdx: number; mIdx: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const calculate = () => {
    const m = parseInt(month), d = parseInt(day), y = parseInt(year);
    if (!m || !d || !y || d < 1 || d > 31 || y < 1900 || y > 2025) {
      showToast("Please fill in a valid date");
      return;
    }
    setResult({ vIdx: estimateVenus(m, d), mIdx: estimateMoon(y, m, d) });
  };

  const share = () => {
    if (!result) return;
    const match = getMatchVerdict(ELEMENTS[result.vIdx], ELEMENTS[result.mIdx]);
    const text = `My love language: Venus in ${SIGNS[result.vIdx]}, Moon in ${SIGNS[result.mIdx]}. Basically: ${match.tagline} — find yours: bluntchart.com/love-language-birth-chart`;
    if (navigator.share) {
      navigator.share({ title: "My Love Language", text, url: "https://bluntchart.com/love-language-birth-chart" }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    }
  };

  const vProfile = result ? VENUS_PROFILES[result.vIdx] : null;
  const mProfile = result ? MOON_PROFILES[result.mIdx] : null;
  const match = result ? getMatchVerdict(ELEMENTS[result.vIdx], ELEMENTS[result.mIdx]) : null;

  return (
    <div className="calc-shell">
      <div className="calc-body">
        {!result && (
          <div className="fade-in">
            <h2 className="calc-title">Enter your birth date</h2>
            <p className="calc-sub">Month, day, and year. Time is optional — helpful only for edge cases.</p>

            <div className="form-row">
              <label className="form-label">Birth date</label>
              <div className="date-row">
                <select className="form-input" value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => <option value={i + 1} key={m}>{m}</option>)}
                </select>
                <input className="form-input" type="number" min={1} max={31} placeholder="Day" inputMode="numeric" value={day} onChange={(e) => setDay(e.target.value)} />
                <input className="form-input" type="number" min={1900} max={2025} placeholder="Year" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
            </div>

            <button className="btn-primary" onClick={calculate}>Reveal my love language</button>
            <div className="note">Nothing is saved. This runs entirely in your browser.</div>
          </div>
        )}

        {result && vProfile && mProfile && match && (
          <div className="fade-in">
            <div className="result-hero">
              <div className="placement-card">
                <div className="placement-planet">Venus in</div>
                <div className="placement-symbol">{SYMBOLS[result.vIdx]}</div>
                <div className="placement-sign">{SIGNS[result.vIdx]}</div>
                <div className="placement-role">How you give love</div>
              </div>
              <div className="placement-card">
                <div className="placement-planet">Moon in</div>
                <div className="placement-symbol">{SYMBOLS[result.mIdx]}</div>
                <div className="placement-sign">{SIGNS[result.mIdx]}</div>
                <div className="placement-role">How you receive love</div>
              </div>
            </div>

            <div className="love-language">Your love language: <em>{match.title}</em></div>
            <div className="love-tagline">&quot;{match.tagline}&quot;</div>

            <div className="breakdown">
              <div className="breakdown-card">
                <div className="breakdown-label">How you love</div>
                <div className="breakdown-title">{vProfile.give}</div>
                <ul className="breakdown-list">
                  {vProfile.ways.map((w) => <li key={w}>{w}</li>)}
                </ul>
              </div>
              <div className="breakdown-card">
                <div className="breakdown-label">What you need</div>
                <div className="breakdown-title">{mProfile.need}</div>
                <ul className="breakdown-list">
                  {mProfile.ways.map((w) => <li key={w}>{w}</li>)}
                </ul>
              </div>
            </div>

            <div className="avoid-card">
              <div className="avoid-label">Deal breakers</div>
              <div className="avoid-text">{AVOID_TEXT[result.mIdx]}</div>
            </div>

            <div className="upsell">
              <div className="upsell-eyebrow">Want the full picture?</div>
              <h3>See your Venus + Moon in your actual chart</h3>
              <p>This gave you signs. Your full chart gives you houses, aspects, and how these placements interact — which is where the real answers are. Free, one minute, no signup.</p>
              <div className="upsell-features">
                <span>Exact Venus + Moon houses</span>
                <span>Aspects to Mars and Saturn</span>
                <span>Your full love profile</span>
              </div>
              <a href="/free-birth-chart" className="btn-ember">Get my free chart</a>
            </div>

            <div className="share-row">
              <button className="share-btn" onClick={share}>Share this</button>
              <button className="share-btn" onClick={() => setResult(null)}>Try another date</button>
            </div>
          </div>
        )}
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
