"use client";

import { useState } from "react";

// ─── SATURN SIGN DATA ──────────────────────────────────────────────────────────
// Simplified but accurate date ranges for Saturn in each sign.
// Saturn takes ~29.5 years to orbit. These cover births from 1930–2026.

interface SaturnPeriod {
  sign: string;
  symbol: string;
  element: string;
  start: string; // yyyy-mm-dd
  end: string;
  returnStart: string; // approximate 1st return window start
  returnEnd: string;
  return2Start: string;
  return2End: string;
}

const SATURN_PERIODS: SaturnPeriod[] = [
  // ── 1930s–1960s (2nd/3rd returns active now) ──
  { sign:"Capricorn",symbol:"♑",element:"Earth",start:"1929-11-30",end:"1932-02-23",returnStart:"1959-01-01",returnEnd:"1962-01-01",return2Start:"1988-02-14",return2End:"1991-02-06" },
  { sign:"Aquarius",symbol:"♒",element:"Air",start:"1932-02-24",end:"1935-02-14",returnStart:"1962-01-01",returnEnd:"1964-03-01",return2Start:"1991-02-06",return2End:"1993-05-21" },
  { sign:"Pisces",symbol:"♓",element:"Water",start:"1935-02-15",end:"1937-04-25",returnStart:"1964-03-24",returnEnd:"1967-03-03",return2Start:"1993-05-21",return2End:"1996-04-07" },
  { sign:"Aries",symbol:"♈",element:"Fire",start:"1937-04-26",end:"1940-03-20",returnStart:"1967-03-04",returnEnd:"1969-04-29",return2Start:"1996-04-07",return2End:"1998-06-09" },
  { sign:"Taurus",symbol:"♉",element:"Earth",start:"1940-03-21",end:"1942-05-08",returnStart:"1969-04-30",returnEnd:"1971-06-18",return2Start:"1998-06-09",return2End:"2001-04-20" },
  { sign:"Gemini",symbol:"♊",element:"Air",start:"1942-05-09",end:"1944-06-20",returnStart:"1971-06-19",returnEnd:"1973-08-01",return2Start:"2001-04-21",return2End:"2003-06-04" },
  { sign:"Cancer",symbol:"♋",element:"Water",start:"1944-06-21",end:"1946-08-02",returnStart:"1973-08-02",returnEnd:"1976-01-14",return2Start:"2003-06-05",return2End:"2005-07-16" },
  { sign:"Leo",symbol:"♌",element:"Fire",start:"1946-08-03",end:"1948-09-19",returnStart:"1976-01-15",returnEnd:"1978-01-05",return2Start:"2005-07-17",return2End:"2007-09-02" },
  { sign:"Virgo",symbol:"♍",element:"Earth",start:"1948-09-20",end:"1951-04-02",returnStart:"1978-01-06",returnEnd:"1980-09-21",return2Start:"2007-09-03",return2End:"2009-10-29" },
  { sign:"Libra",symbol:"♎",element:"Air",start:"1951-04-03",end:"1953-10-22",returnStart:"1980-09-22",returnEnd:"1983-05-06",return2Start:"2009-10-30",return2End:"2012-10-05" },
  { sign:"Scorpio",symbol:"♏",element:"Water",start:"1953-10-23",end:"1956-01-12",returnStart:"1983-05-07",returnEnd:"1985-11-17",return2Start:"2012-10-06",return2End:"2014-12-23" },
  { sign:"Sagittarius",symbol:"♐",element:"Fire",start:"1956-01-13",end:"1959-01-05",returnStart:"1985-11-18",returnEnd:"1988-02-13",return2Start:"2014-12-24",return2End:"2017-12-19" },
  // ── 1960s–1990s (1st or 2nd returns) ──
  { sign:"Capricorn",symbol:"♑",element:"Earth",start:"1959-01-06",end:"1962-01-03",returnStart:"1988-02-14",returnEnd:"1991-02-06",return2Start:"2017-12-20",return2End:"2020-12-17" },
  { sign:"Aquarius",symbol:"♒",element:"Air",start:"1962-01-04",end:"1964-03-23",returnStart:"1991-02-07",returnEnd:"1993-05-20",return2Start:"2020-03-22",return2End:"2023-03-07" },
  { sign:"Pisces",symbol:"♓",element:"Water",start:"1964-03-24",end:"1967-03-03",returnStart:"1993-05-21",returnEnd:"1996-04-06",return2Start:"2023-03-08",return2End:"2025-05-24" },
  { sign:"Aries",symbol:"♈",element:"Fire",start:"1967-03-04",end:"1969-04-29",returnStart:"1996-04-07",returnEnd:"1998-06-08",return2Start:"2025-05-25",return2End:"2028-04-12" },
  { sign:"Taurus",symbol:"♉",element:"Earth",start:"1969-04-30",end:"1971-06-18",returnStart:"1998-06-09",returnEnd:"2001-04-20",return2Start:"2028-04-13",return2End:"2030-05-31" },
  { sign:"Gemini",symbol:"♊",element:"Air",start:"1971-06-19",end:"1973-08-01",returnStart:"2001-04-21",returnEnd:"2003-06-03",return2Start:"2030-06-01",return2End:"2032-07-13" },
  { sign:"Cancer",symbol:"♋",element:"Water",start:"1973-08-02",end:"1976-01-14",returnStart:"2003-06-04",returnEnd:"2005-07-15",return2Start:"2032-07-14",return2End:"2034-08-27" },
  { sign:"Leo",symbol:"♌",element:"Fire",start:"1976-01-15",end:"1978-01-05",returnStart:"2005-07-16",returnEnd:"2007-09-01",return2Start:"2034-08-28",return2End:"2036-10-15" },
  { sign:"Virgo",symbol:"♍",element:"Earth",start:"1978-01-06",end:"1980-09-21",returnStart:"2007-09-02",returnEnd:"2009-10-28",return2Start:"2036-10-16",return2End:"2039-04-12" },
  { sign:"Libra",symbol:"♎",element:"Air",start:"1980-09-22",end:"1983-05-06",returnStart:"2009-10-29",returnEnd:"2012-10-04",return2Start:"2039-04-13",return2End:"2041-11-11" },
  { sign:"Scorpio",symbol:"♏",element:"Water",start:"1983-05-07",end:"1985-11-17",returnStart:"2012-10-05",returnEnd:"2014-12-22",return2Start:"2041-11-12",return2End:"2044-01-22" },
  { sign:"Sagittarius",symbol:"♐",element:"Fire",start:"1985-11-18",end:"1988-02-13",returnStart:"2014-12-23",returnEnd:"2017-12-18",return2Start:"2044-01-23",return2End:"2047-02-12" },
  // ── 1988–2026 (approaching or in 1st return) ──
  { sign:"Capricorn",symbol:"♑",element:"Earth",start:"1988-02-14",end:"1991-02-06",returnStart:"2017-12-20",returnEnd:"2020-12-17",return2Start:"2047-02-13",return2End:"2050-01-22" },
  { sign:"Aquarius",symbol:"♒",element:"Air",start:"1991-02-07",end:"1993-05-20",returnStart:"2020-03-22",returnEnd:"2023-03-07",return2Start:"2050-01-23",return2End:"2052-04-12" },
  { sign:"Pisces",symbol:"♓",element:"Water",start:"1993-05-21",end:"1996-04-06",returnStart:"2023-03-08",returnEnd:"2026-02-13",return2Start:"2052-04-13",return2End:"2055-05-23" },
  { sign:"Aries",symbol:"♈",element:"Fire",start:"1996-04-07",end:"1998-06-08",returnStart:"2025-05-25",returnEnd:"2028-04-12",return2Start:"2055-05-24",return2End:"2057-07-10" },
  { sign:"Taurus",symbol:"♉",element:"Earth",start:"1998-06-09",end:"2001-04-20",returnStart:"2028-04-13",returnEnd:"2030-05-31",return2Start:"2057-07-11",return2End:"2060-03-31" },
  { sign:"Gemini",symbol:"♊",element:"Air",start:"2001-04-21",end:"2003-06-03",returnStart:"2030-06-01",returnEnd:"2032-07-13",return2Start:"2060-04-01",return2End:"2062-06-01" },
  { sign:"Cancer",symbol:"♋",element:"Water",start:"2003-06-04",end:"2005-07-15",returnStart:"2032-07-14",returnEnd:"2034-08-27",return2Start:"2062-06-02",return2End:"2064-07-14" },
  { sign:"Leo",symbol:"♌",element:"Fire",start:"2005-07-16",end:"2007-09-01",returnStart:"2034-08-28",returnEnd:"2036-10-15",return2Start:"2064-07-15",return2End:"2066-09-01" },
  { sign:"Virgo",symbol:"♍",element:"Earth",start:"2007-09-02",end:"2009-10-28",returnStart:"2036-10-16",returnEnd:"2039-04-12",return2Start:"2066-09-02",return2End:"2068-10-28" },
  { sign:"Libra",symbol:"♎",element:"Air",start:"2009-10-29",end:"2012-10-04",returnStart:"2039-04-13",returnEnd:"2041-11-11",return2Start:"2068-10-29",return2End:"2071-10-04" },
  { sign:"Scorpio",symbol:"♏",element:"Water",start:"2012-10-05",end:"2014-12-22",returnStart:"2041-11-12",returnEnd:"2044-01-22",return2Start:"2071-10-05",return2End:"2073-12-22" },
  { sign:"Sagittarius",symbol:"♐",element:"Fire",start:"2014-12-23",end:"2017-12-19",returnStart:"2044-01-23",returnEnd:"2047-02-12",return2Start:"2073-12-23",return2End:"2076-12-19" },
  { sign:"Capricorn",symbol:"♑",element:"Earth",start:"2017-12-20",end:"2020-03-21",returnStart:"2047-02-13",returnEnd:"2050-01-22",return2Start:"2076-12-20",return2End:"2079-03-21" },
  { sign:"Aquarius",symbol:"♒",element:"Air",start:"2020-03-22",end:"2023-03-07",returnStart:"2050-01-23",returnEnd:"2052-04-12",return2Start:"2079-03-22",return2End:"2082-03-07" },
  { sign:"Pisces",symbol:"♓",element:"Water",start:"2023-03-08",end:"2025-05-24",returnStart:"2052-04-13",returnEnd:"2055-05-23",return2Start:"2082-03-08",return2End:"2084-05-24" },
  { sign:"Aries",symbol:"♈",element:"Fire",start:"2025-05-25",end:"2028-04-12",returnStart:"2055-05-24",returnEnd:"2057-07-10",return2Start:"2084-05-25",return2End:"2087-04-12" },
];

// ─── INTERPRETATIONS ───────────────────────────────────────────────────────────

const SATURN_READINGS: Record<string, { blurb: string; lesson: string; crisis: string }> = {
  Aries: {
    blurb: "Saturn in Aries tests whether you can lead yourself before you try to lead anyone else. Your return asks: are you brave, or just reckless?",
    lesson: "You're here to learn the difference between courage and impulsivity. Saturn wants you to build discipline around your fire — not extinguish it, but contain it so it becomes useful instead of destructive. Every time you acted without thinking and it blew up? That's Saturn's lesson plan.",
    crisis: "Identity crisis. Who you thought you were stops working. The version of yourself you built to survive your twenties is not the version that gets you through your thirties. Career pivots, relationship shake-ups, and a fundamental confrontation with your own anger and impatience.",
  },
  Taurus: {
    blurb: "Saturn in Taurus tests your relationship with security — money, comfort, and the things you cling to because letting go feels like dying.",
    lesson: "You're here to learn that real security comes from within, not from your bank account, your possessions, or the partner who makes you feel safe. Saturn strips away the external safety nets to show you what you're actually made of. The financial reckoning is just the surface — underneath, it's about self-worth.",
    crisis: "Financial restructuring. Values crumble and rebuild. A job that paid well but killed you inside becomes unbearable. A relationship built on comfort rather than love reveals its cracks. You're forced to ask: what am I actually worth, and does my life reflect that?",
  },
  Gemini: {
    blurb: "Saturn in Gemini tests whether you can commit to one idea, one path, one truth — or whether you'll keep hedging forever.",
    lesson: "You're here to learn depth over breadth. Saturn wants you to stop being clever and start being wise. Every half-finished project, every conversation you deflected with a joke, every truth you talked your way around — that's what your return confronts. Words have weight now.",
    crisis: "Communication breakdown. The stories you tell yourself about yourself stop working. A sibling or close friend forces an honest conversation. A career built on adaptability reveals that flexibility without foundation is just instability.",
  },
  Cancer: {
    blurb: "Saturn in Cancer tests your emotional foundations — family, home, and the childhood wounds you've been carrying since before you had words for them.",
    lesson: "You're here to learn that protection and control are not the same thing. Saturn wants you to build emotional security that doesn't depend on everyone else staying exactly where you put them. The family patterns that run your life — the caretaking, the guilt, the inability to set boundaries — those are Saturn's curriculum.",
    crisis: "Family reckoning. A parent relationship reaches a breaking point. Your living situation becomes untenable. Childhood wounds that you thought you'd dealt with (you hadn't) demand real attention. The question isn't whether you're a good person. It's whether you've been so busy taking care of everyone else that you forgot to build a life of your own.",
  },
  Leo: {
    blurb: "Saturn in Leo tests whether your confidence is earned or performed — and whether you know the difference.",
    lesson: "You're here to learn that real authority comes from substance, not applause. Saturn wants you to strip away the performance and find out what's underneath. Are you actually good at what you do, or are you good at seeming good? The attention you crave — do you deserve it?",
    crisis: "Creative or romantic crisis. The thing you poured yourself into stops reflecting back what you need. A relationship where you were the star reveals that the other person has been shrinking. Ego meets reality, and reality wins. The rebuilding creates something more honest than anything you had before.",
  },
  Virgo: {
    blurb: "Saturn in Virgo tests whether your perfectionism is a virtue or a prison — and whether your obsession with being useful has become a way to avoid being seen.",
    lesson: "You're here to learn that imperfection is not failure. Saturn wants you to build systems that serve your life instead of systems that replace it. Every time you worked yourself into the ground, every time you fixed everyone else instead of yourself, every time you chose productive over happy — that's the pattern your return breaks.",
    crisis: "Health wake-up call (often the body enforcing the rest you refused to take). Work burnout or a job that no longer fits. A relationship where you were the fixer forces you to receive help. The anxiety was never about the details — it was about the fear that if you stopped being useful, you'd stop being loved.",
  },
  Libra: {
    blurb: "Saturn in Libra tests whether your relationships are partnerships or performances — and whether you've lost yourself inside someone else's life.",
    lesson: "You're here to learn that harmony without honesty is just conflict avoidance. Saturn wants you to build relationships that can survive truth, not just pleasantness. Every time you said yes when you meant no, every fight you avoided, every time you chose peace over integrity — that's what your return demands you confront.",
    crisis: "Relationship reckoning. A partnership (romantic or business) either transforms or ends. The people-pleasing stops working. You discover that the version of yourself you've been presenting to keep everyone comfortable isn't the version of yourself that actually wants to be alive. Choosing yourself feels selfish. Saturn says: it's required.",
  },
  Scorpio: {
    blurb: "Saturn in Scorpio tests your relationship with power, control, and the things you'd rather no one ever knew about you.",
    lesson: "You're here to learn that vulnerability is not weakness. Saturn wants you to stop using intensity as a shield and control as a substitute for trust. The secrets you carry — about yourself, about others — have been running your life. Your return is when they either transform you or consume you.",
    crisis: "Power dynamics implode. A financial entanglement (debt, shared assets, inheritance) forces brutal honesty. A relationship where you were either controlling or being controlled reaches a breaking point. The thing you were most afraid of someone discovering? It comes to light. And you survive it.",
  },
  Sagittarius: {
    blurb: "Saturn in Sagittarius tests whether your freedom is authentic or just a sophisticated form of running away.",
    lesson: "You're here to learn that commitment is not a cage. Saturn wants you to stop collecting experiences and start building meaning. Every time you left when it got hard, every belief system you adopted and discarded, every relationship you kept at arm's length because closeness felt like suffocation — that's the pattern your return confronts.",
    crisis: "Belief crisis. The worldview that organised your life cracks. A career or lifestyle built on freedom reveals its loneliness. Travel stops being escape and starts being avoidance. The question isn't what you believe. It's whether you're willing to live inside something long enough for it to matter.",
  },
  Capricorn: {
    blurb: "Saturn in Capricorn tests whether you built your life on ambition or on meaning — and whether those turned out to be the same thing.",
    lesson: "You're here to learn that achievement without purpose is just exhaustion. Saturn is at home in Capricorn, so your return is especially powerful. Every rung you climbed, every sacrifice you made for the future — was the destination worth the climb? Your return doesn't ask you to stop achieving. It asks you to achieve for the right reasons.",
    crisis: "Career crisis — but not the kind where you lose your job. The kind where you get everything you wanted and realise it wasn't what you needed. Authority figures (parents, bosses, mentors) fall off their pedestals. The structure you built your entire identity around needs renovation. Not demolition — renovation.",
  },
  Aquarius: {
    blurb: "Saturn in Aquarius tests whether your independence is strength or isolation — and whether your ideals survive contact with reality.",
    lesson: "You're here to learn that belonging doesn't require conformity, but it does require showing up. Saturn wants you to stop hovering above your own life and actually land in it. The emotional detachment you call rationality, the communities you observe from the edges, the friendships you keep intellectual to avoid vulnerability — those are Saturn's targets.",
    crisis: "Community and identity reckoning. The group you identified with no longer fits — or you realise you were never fully in it. A friendship reveals its limitations. Your vision for the future collides with the present's demands. The loneliness you've been intellectualising becomes something you have to feel.",
  },
  Pisces: {
    blurb: "Saturn in Pisces tests whether your sensitivity is a gift or a hiding place — and whether your compassion for others has become a way to avoid yourself.",
    lesson: "You're here to learn boundaries — not the kind that keep people out, but the kind that keep you intact. Saturn wants you to stop dissolving into everyone else's pain and build a container for your own. Every time you gave too much, every time you escaped into fantasy, substances, or sleep to avoid reality, every time you sacrificed yourself and called it love — that's Saturn's lesson.",
    crisis: "Spiritual or psychological reckoning. The coping mechanisms that kept you alive in your twenties stop working. Addiction, avoidance, or chronic self-sacrifice reaches a breaking point. The boundary you never set costs you something you can't get back. But the boundaries you build afterward change your life.",
  },
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function toDate(s: string) { return new Date(s + "T00:00:00"); }
function fmtYear(s: string) { return s.slice(0, 4); }
function fmtRange(s: string, e: string) {
  const sd = toDate(s); const ed = toDate(e);
  return `${sd.toLocaleDateString("en-US",{month:"short",year:"numeric"})} – ${ed.toLocaleDateString("en-US",{month:"short",year:"numeric"})}`;
}

function findSaturnSign(birthDate: string): SaturnPeriod | null {
  const bd = toDate(birthDate);
  for (const p of SATURN_PERIODS) {
    if (bd >= toDate(p.start) && bd <= toDate(p.end)) return p;
  }
  return null;
}

function getReturnStatus(period: SaturnPeriod): "before" | "during" | "after" {
  const now = new Date();
  const r1s = toDate(period.returnStart);
  const r1e = toDate(period.returnEnd);
  if (now < r1s) return "before";
  if (now >= r1s && now <= r1e) return "during";
  return "after";
}

function getAge(birthDate: string): number {
  const bd = toDate(birthDate);
  const now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  const m = now.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
  return age;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function SaturnCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<SaturnPeriod | null>(null);
  const [err, setErr] = useState("");

  const calculate = () => {
    if (!dob) { setErr("Enter your date of birth."); return; }
    const found = findSaturnSign(dob);
    if (!found) { setErr("Birth date out of range. Try a date between 1929 and 2028."); return; }
    setErr("");
    setResult(found);
  };

  const reading = result ? SATURN_READINGS[result.sign] : null;
  const status = result ? getReturnStatus(result) : null;
  const age = dob ? getAge(dob) : 0;

  return (
    <div>
      {/* ── INPUT ── */}
      {!result && (
        <div style={{ maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <div style={{
            background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)",
            borderRadius:18, padding:36,
          }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:8, color:"#e8e4f0" }}>
              When is your Saturn Return?
            </div>
            <p style={{ fontSize:13, color:"rgba(232,228,240,0.5)", lineHeight:1.6, marginBottom:28 }}>
              Enter your date of birth. We&apos;ll find your Saturn sign and tell you when your return hits — and what it actually tests.
            </p>
            {err && (
              <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>{err}</div>
            )}
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#6b6585", letterSpacing:"1.2px", textTransform:"uppercase" as const, marginBottom:6, textAlign:"left" }}>Date of birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
              style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"13px 14px", fontSize:14, color:"#e8e4f0", fontFamily:"inherit", outline:"none", marginBottom:20 }}
            />
            <button onClick={calculate} style={{
              width:"100%", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff",
              border:"none", borderRadius:12, padding:"16px 20px", fontSize:15, fontWeight:600,
              fontFamily:"inherit", cursor:"pointer", letterSpacing:"0.2px",
            }}>
              Find my Saturn Return ♄
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {result && reading && (
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          {/* Saturn sign reveal */}
          <div style={{
            textAlign:"center", marginBottom:40,
            background:"linear-gradient(165deg,rgba(107,47,212,0.06),rgba(212,83,126,0.04))",
            border:"1px solid rgba(107,47,212,0.2)", borderRadius:22, padding:"48px 36px",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#6b2fd4,#d4537e,transparent)" }} />
            <div style={{ fontSize:".72rem", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.4)", marginBottom:12 }}>Your Saturn sign</div>
            <div style={{ fontSize:"3.5rem", lineHeight:1, marginBottom:8, opacity:.5 }}>{result.symbol}</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2rem,5vw,2.8rem)", fontWeight:900, color:"#e8e4f0", marginBottom:6 }}>
              Saturn in {result.sign}
            </div>
            <div style={{ fontSize:".88rem", color:"rgba(232,228,240,0.5)" }}>{result.element} sign · You&apos;re {age} years old</div>

            {/* Status badge */}
            <div style={{ marginTop:20 }}>
              {status === "during" && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:100, background:"rgba(212,83,126,0.12)", border:"0.5px solid rgba(212,83,126,0.3)", fontSize:".82rem", fontWeight:700, color:"#d4537e" }}>
                  ● You are in your Saturn Return right now
                </div>
              )}
              {status === "before" && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:100, background:"rgba(240,184,74,0.08)", border:"0.5px solid rgba(240,184,74,0.2)", fontSize:".82rem", fontWeight:600, color:"#F0B84A" }}>
                  Your Saturn Return is approaching
                </div>
              )}
              {status === "after" && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", borderRadius:100, background:"rgba(93,202,165,0.08)", border:"0.5px solid rgba(93,202,165,0.2)", fontSize:".82rem", fontWeight:600, color:"#5dcaa5" }}>
                  ✓ You&apos;ve completed your 1st Saturn Return
                </div>
              )}
            </div>
          </div>

          {/* Return dates */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:36 }}>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:20 }}>
              <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.35)", marginBottom:6 }}>1st Saturn Return (age ~27–30)</div>
              <div style={{ fontSize:"1rem", fontWeight:600, color: status === "during" ? "#d4537e" : "#e8e4f0" }}>{fmtRange(result.returnStart, result.returnEnd)}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:20 }}>
              <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.35)", marginBottom:6 }}>2nd Saturn Return (age ~56–60)</div>
              <div style={{ fontSize:"1rem", fontWeight:600, color:"#e8e4f0" }}>{fmtRange(result.return2Start, result.return2End)}</div>
            </div>
          </div>

          {/* Brutally honest reading */}
          <div style={{ marginBottom:36 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.3rem,3vw,1.7rem)", fontWeight:800, marginBottom:18, color:"#e8e4f0", lineHeight:1.2 }}>
              What Saturn in {result.sign} is actually testing
            </div>
            <div style={{
              background:"rgba(107,47,212,0.06)", border:"0.5px solid rgba(107,47,212,0.2)",
              borderRadius:16, padding:"22px 24px", fontSize:".95rem", lineHeight:1.75,
              color:"rgba(220,214,235,0.88)", fontStyle:"italic", marginBottom:22,
            }}>
              {reading.blurb}
            </div>
            <div style={{ fontSize:".95rem", color:"rgba(232,228,240,0.72)", lineHeight:1.78, marginBottom:20 }}>
              <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" as const, color:"#6b2fd4", marginBottom:10 }}>The lesson</div>
              {reading.lesson}
            </div>
            <div style={{ fontSize:".95rem", color:"rgba(232,228,240,0.72)", lineHeight:1.78 }}>
              <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" as const, color:"#d4537e", marginBottom:10 }}>The crisis it triggers</div>
              {reading.crisis}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background:"linear-gradient(165deg,rgba(107,47,212,0.06),rgba(212,83,126,0.04))",
            border:"1px solid rgba(107,47,212,0.2)", borderRadius:20, padding:"40px 32px", textAlign:"center", marginBottom:36,
          }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.3rem,3vw,1.6rem)", fontWeight:800, marginBottom:12, color:"#e8e4f0" }}>
              This is the summary. <span style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Your chart tells the full story.</span>
            </div>
            <p style={{ fontSize:".95rem", color:"rgba(232,228,240,0.55)", maxWidth:480, margin:"0 auto 24px", lineHeight:1.7 }}>
              Saturn&apos;s sign is one data point. Which house it&apos;s in, what it aspects, and how it interacts with your Sun, Moon, and Rising — that&apos;s what determines how your return actually plays out. A BluntChart reading maps all of it.
            </p>
            <a href="/#try-it" style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"14px 30px",
              background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff",
              fontFamily:"inherit", fontSize:".88rem", fontWeight:700, letterSpacing:".04em",
              textTransform:"uppercase" as const, textDecoration:"none", borderRadius:10,
            }}>
              Get My Free Preview ✨
            </a>
            <div style={{ fontSize:".78rem", color:"rgba(232,228,240,.35)", marginTop:12 }}>
              Two free insights. $15 one-time for the full reading.
            </div>
          </div>

          {/* Reset */}
          <button onClick={() => { setResult(null); setDob(""); }}
            style={{ width:"100%", background:"transparent", border:"none", padding:"18px", fontSize:13, color:"#4a4560", cursor:"pointer", fontFamily:"inherit" }}>
            ← Calculate a different birth date
          </button>
        </div>
      )}
    </div>
  );
}