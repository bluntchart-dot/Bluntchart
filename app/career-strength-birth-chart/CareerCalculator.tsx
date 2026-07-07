"use client";

import { useState } from "react";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

// Saturn: ~29.5 year cycle through zodiac, ~2.45 years per sign
const SATURN_TRANSITS: { start: Date; sign: number }[] = [
  { start: new Date(1988, 1, 14), sign: 9 },
  { start: new Date(1991, 1, 6), sign: 10 },
  { start: new Date(1993, 4, 21), sign: 11 },
  { start: new Date(1994, 0, 28), sign: 10 },
  { start: new Date(1994, 3, 7), sign: 11 },
  { start: new Date(1996, 3, 7), sign: 0 },
  { start: new Date(1998, 5, 9), sign: 1 },
  { start: new Date(2000, 7, 10), sign: 2 },
  { start: new Date(2001, 3, 20), sign: 1 },
  { start: new Date(2001, 9, 18), sign: 2 },
  { start: new Date(2003, 5, 4), sign: 3 },
  { start: new Date(2005, 6, 16), sign: 4 },
  { start: new Date(2007, 8, 2), sign: 5 },
  { start: new Date(2009, 9, 29), sign: 6 },
  { start: new Date(2010, 3, 7), sign: 5 },
  { start: new Date(2010, 6, 21), sign: 6 },
  { start: new Date(2012, 9, 5), sign: 7 },
  { start: new Date(2014, 11, 23), sign: 8 },
  { start: new Date(2015, 5, 15), sign: 7 },
  { start: new Date(2015, 8, 18), sign: 8 },
  { start: new Date(2017, 11, 20), sign: 9 },
  { start: new Date(2020, 2, 22), sign: 10 },
  { start: new Date(2020, 6, 1), sign: 9 },
  { start: new Date(2020, 11, 17), sign: 10 },
  { start: new Date(2023, 2, 7), sign: 11 },
  { start: new Date(2025, 4, 25), sign: 0 },
];

function getSaturnSign(year: number, month: number, day: number) {
  const target = new Date(year, month - 1, day);
  let sign = 8;
  for (const t of SATURN_TRANSITS) {
    if (target >= t.start) sign = t.sign;
    else break;
  }
  return sign;
}

function getSunSign(month: number, day: number) {
  const cutoffs: { end: [number, number]; sign: number }[] = [
    { end: [1, 19], sign: 9 }, { end: [2, 18], sign: 10 }, { end: [3, 20], sign: 11 },
    { end: [4, 19], sign: 0 }, { end: [5, 20], sign: 1 }, { end: [6, 20], sign: 2 },
    { end: [7, 22], sign: 3 }, { end: [8, 22], sign: 4 }, { end: [9, 22], sign: 5 },
    { end: [10, 22], sign: 6 }, { end: [11, 21], sign: 7 }, { end: [12, 21], sign: 8 },
    { end: [12, 31], sign: 9 },
  ];
  for (const c of cutoffs) {
    if (month < c.end[0] || (month === c.end[0] && day <= c.end[1])) return c.sign;
  }
  return 9;
}

function estimateMC(sunSign: number) {
  return (sunSign + 9) % 12;
}

const SATURN_PROFILES: Record<number, { archetype: string; tag: string; strengths: string[] }> = {
  0: { archetype: "The Pioneer", tag: "You build by going first.", strengths: ["Making decisions fast", "Starting things others won't", "Leading through decisive action", "Handling high pressure"] },
  1: { archetype: "The Builder", tag: "You build lasting resources and systems.", strengths: ["Long-term reliability", "Financial and physical mastery", "Patience with detail", "Making things beautiful and lasting"] },
  2: { archetype: "The Communicator", tag: "You build through what you know and say.", strengths: ["Writing, teaching, translating", "Making complex things clear", "Connecting ideas across fields", "Rapid learning"] },
  3: { archetype: "The Caretaker", tag: "You build spaces where people grow.", strengths: ["Emotional intelligence in work", "Managing teams and families", "Hospitality and care industries", "Legacy work"] },
  4: { archetype: "The Performer", tag: "You build reputation through visible expression.", strengths: ["Being on stage or camera", "Creative direction", "Public identity work", "Leading with warmth"] },
  5: { archetype: "The Craftsperson", tag: "You build mastery through precision.", strengths: ["Editing, refining, improving", "Health, wellness, systems work", "Solving detailed problems", "Making the machine run"] },
  6: { archetype: "The Diplomat", tag: "You build through balance and partnership.", strengths: ["Negotiation and mediation", "Design, law, and consulting", "Reading rooms", "Making things fair and beautiful"] },
  7: { archetype: "The Investigator", tag: "You build power by seeing what others miss.", strengths: ["Research and depth work", "Finance, psychology, transformation", "Handling crisis", "Getting to the real answer"] },
  8: { archetype: "The Teacher", tag: "You build meaning by expanding the frame.", strengths: ["Education and publishing", "Cross-cultural work", "Big-picture thinking", "Selling vision"] },
  9: { archetype: "The Institution", tag: "You build authority through structure.", strengths: ["Executive leadership", "Long-form strategy", "Institution-building", "Public authority roles"] },
  10: { archetype: "The Innovator", tag: "You build futures by breaking patterns.", strengths: ["Tech, science, systems change", "Groups and community", "Original thinking", "Working ahead of the curve"] },
  11: { archetype: "The Healer", tag: "You build meaning through empathy and craft.", strengths: ["Art, healing, spiritual work", "Behind-the-scenes influence", "Emotional labor as work", "Creating beauty"] },
};

const MC_ROLES: Record<number, string> = {
  0: "Founder, entrepreneur, first responder, leader of new things",
  1: "Builder, financier, artisan, chef, real estate, agriculture",
  2: "Writer, journalist, teacher, marketer, translator, podcaster",
  3: "Therapist, caregiver, hospitality, education, real estate, family businesses",
  4: "Performer, creative director, brand personality, public figure, entertainment",
  5: "Editor, analyst, health practitioner, engineer, operations",
  6: "Designer, lawyer, mediator, HR, luxury and lifestyle",
  7: "Researcher, therapist, investigator, finance, transformation coach, surgeon",
  8: "Professor, publisher, travel industry, philosopher, evangelist",
  9: "Executive, government, institutional leader, banker, public office",
  10: "Technologist, activist, futurist, nonprofit leader, community organizer",
  11: "Artist, healer, filmmaker, therapist, spiritual practitioner",
};

const DRAINERS: Record<number, string> = {
  0: "Bureaucracy, waiting on committees, and roles where you can't act on your instincts.",
  1: "Chaotic startups, no security, and being asked to abandon what you've built for something 'exciting.'",
  2: "Repetitive isolated work, no conversation, and roles that don't let you learn.",
  3: "Cold corporate environments, no emotional connection, and being told to leave feelings at the door.",
  4: "Invisible roles, no creative freedom, and being one of many indistinguishable workers.",
  5: "Big-picture roles with no concrete outcome, chaos, and being blamed for others' sloppiness.",
  6: "Confrontational or ugly environments, forced decisions, and being asked to work alone all day.",
  7: "Surface-level work, small talk, and roles that require constant fake positivity.",
  8: "Being confined to one desk, one topic, and one narrow definition of success.",
  9: "Flat organizations with no path up, casual chaos, and being taken lightly.",
  10: "Rigid hierarchies, tradition for tradition's sake, and being asked to conform.",
  11: "Harsh, hyper-competitive environments and being asked to prove your value in numbers alone.",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CareerCalculator() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{ sIdx: number; mcIdx: number } | null>(null);
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
    const saturnIdx = getSaturnSign(y, m, d);
    const sunIdx = getSunSign(m, d);
    const mcIdx = estimateMC(sunIdx);
    setResult({ sIdx: saturnIdx, mcIdx });
  };

  const share = () => {
    if (!result) return;
    const profile = SATURN_PROFILES[result.sIdx];
    const text = `My career archetype: ${profile.archetype}. "${profile.tag}" — find yours: bluntchart.com/career-strength-birth-chart`;
    if (navigator.share) {
      navigator.share({ title: "My Career Strength", text, url: "https://bluntchart.com/career-strength-birth-chart" }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    }
  };

  const profile = result ? SATURN_PROFILES[result.sIdx] : null;

  return (
    <div className="calc-shell">
      <div className="calc-body">
        {!result && (
          <div className="fade-in">
            <h2 className="calc-title">Enter your birth date</h2>
            <p className="calc-sub">Birth time is optional. Without it, we estimate your MC based on Saturn and Sun.</p>

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

            <button className="btn-primary" onClick={calculate}>Reveal my career strength</button>
            <div className="note">Nothing is saved. Runs entirely in your browser.</div>
          </div>
        )}

        {result && profile && (
          <div className="fade-in">
            <div className="archetype-hero">
              <div className="archetype-eyebrow">Your career archetype</div>
              <div className="archetype-name">{profile.archetype}</div>
              <div className="archetype-tag">&quot;{profile.tag}&quot;</div>
            </div>

            <div className="placements-row">
              <div className="placement-badge">
                <div className="placement-badge-symbol">♄</div>
                <div className="placement-badge-text">
                  <div className="p1">Saturn in</div>
                  <div className="p2">{SIGNS[result.sIdx]}</div>
                </div>
              </div>
              <div className="placement-badge">
                <div className="placement-badge-symbol">MC</div>
                <div className="placement-badge-text">
                  <div className="p1">Midheaven in (est.)</div>
                  <div className="p2">{SIGNS[result.mcIdx]}</div>
                </div>
              </div>
            </div>

            <div className="strength-grid">
              <div className="strength-card">
                <div className="strength-card-label">Your strengths</div>
                <div className="strength-card-title">Where you&apos;re built to master</div>
                <ul className="strength-card-list">
                  {profile.strengths.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div className="strength-card">
                <div className="strength-card-label">Environment</div>
                <div className="strength-card-title">Where you thrive</div>
                <ul className="strength-card-list">
                  <li>Roles with autonomy and depth</li>
                  <li>Teams that respect your process</li>
                  <li>Long timelines, real outcomes</li>
                  <li>Space to become an expert, not a generalist</li>
                </ul>
              </div>
            </div>

            <div className="roles-row">
              <div className="roles-label">Fit roles</div>
              <div className="roles-title">Careers that match your wiring</div>
              <div className="roles-text">{MC_ROLES[result.mcIdx]}</div>
            </div>

            <div className="drainer-card">
              <div className="drainer-label">What drains you</div>
              <div className="drainer-text">{DRAINERS[result.sIdx]}</div>
            </div>

            <div className="upsell">
              <div className="upsell-eyebrow">Want the precise version?</div>
              <h3>See your Saturn + MC in your actual chart</h3>
              <p>This gave you archetypes. Your full chart gives you Saturn&apos;s house, MC&apos;s exact degree, and the aspects that shape how these placements actually play out. Free, under a minute.</p>
              <div className="upsell-features">
                <span>Exact Saturn house</span>
                <span>Precise MC degree</span>
                <span>Career timing report</span>
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
