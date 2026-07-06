"use client";

import type { ChartData } from "@/lib/types";

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;

const SIGN_GLYPHS: Record<string, string> = {
  Aries:"♈\uFE0E", Taurus:"♉\uFE0E", Gemini:"♊\uFE0E", Cancer:"♋\uFE0E",
  Leo:"♌\uFE0E", Virgo:"♍\uFE0E", Libra:"♎\uFE0E", Scorpio:"♏\uFE0E",
  Sagittarius:"♐\uFE0E", Capricorn:"♑\uFE0E", Aquarius:"♒\uFE0E", Pisces:"♓\uFE0E",
};

const ELEMENT_MAP: Record<string, string> = {
  Aries:"Fire", Leo:"Fire", Sagittarius:"Fire",
  Taurus:"Earth", Virgo:"Earth", Capricorn:"Earth",
  Gemini:"Air", Libra:"Air", Aquarius:"Air",
  Cancer:"Water", Scorpio:"Water", Pisces:"Water",
};

const ELEMENT_COLOR: Record<string, string> = {
  Fire:"#f0956a", Earth:"#7ec88a", Air:"#7ab4e0", Water:"#a48ae8",
};

function signIndex(sign: string): number {
  const i = SIGNS.indexOf(sign as typeof SIGNS[number]);
  return i === -1 ? 0 : i;
}
function signAt(i: number): string { return SIGNS[((i % 12) + 12) % 12]; }
function signColor(sign: string): string {
  return ELEMENT_COLOR[ELEMENT_MAP[sign] ?? ""] ?? "#e8e4f0";
}

function getTopCompatible(sunSign: string): string[] {
  const i = signIndex(sunSign);
  return [signAt(i + 4), signAt(i + 8), signAt(i + 2)];
}

function getMoneyLuck(chart: ChartData): number {
  const get = (n: string) => chart.planets.find((p) => p.name === n);
  const jupiter = get("Jupiter");
  const venus = get("Venus");
  const mercury = get("Mercury");
  let score = 62;
  if (jupiter) {
    if ([2, 8, 10].includes(jupiter.house)) score += 14;
    else if (jupiter.house === 11) score += 8;
    const el = ELEMENT_MAP[jupiter.sign];
    score += el === "Earth" ? 8 : el === "Water" ? 5 : el === "Fire" ? 4 : 2;
  }
  if (venus && [2, 8, 10].includes(venus.house)) score += 8;
  const earthCount = chart.planets.filter((p) => ELEMENT_MAP[p.sign] === "Earth").length;
  score += earthCount * 2;
  if (mercury?.retrograde) score -= 5;
  const hardJupSat = chart.aspects.find(
    (a) =>
      ((a.planet1 === "Jupiter" && a.planet2 === "Saturn") ||
       (a.planet1 === "Saturn" && a.planet2 === "Jupiter")) &&
      (a.type === "square" || a.type === "opposition")
  );
  if (hardJupSat) score -= 8;
  return Math.max(60, Math.min(98, Math.round(score)));
}

const INTENSE_SIGNS = ["Scorpio", "Aries", "Capricorn"];

function getDangerous(chart: ChartData): number {
  const get = (n: string) => chart.planets.find((p) => p.name === n);
  const mars = get("Mars");
  const sun = get("Sun");
  const moon = get("Moon");
  let score = 35;
  [sun, moon, mars].forEach((p) => { if (p && INTENSE_SIGNS.includes(p.sign)) score += 8; });
  if (INTENSE_SIGNS.includes(chart.ascendant.sign)) score += 8;
  const eighthCount = chart.planets.filter((p) => p.house === 8).length;
  score += eighthCount * 6;
  const marsPluto = chart.aspects.find(
    (a) =>
      (a.planet1 === "Mars" && a.planet2 === "Pluto") ||
      (a.planet1 === "Pluto" && a.planet2 === "Mars")
  );
  if (marsPluto) {
    score += marsPluto.type === "conjunction" ? 18
      : (marsPluto.type === "square" || marsPluto.type === "opposition") ? 14 : 6;
  }
  const hardCount = chart.aspects.filter(
    (a) =>
      (a.planet1 === "Mars" || a.planet2 === "Mars" ||
       a.planet1 === "Pluto" || a.planet2 === "Pluto") &&
      (a.type === "square" || a.type === "opposition")
  ).length;
  score += hardCount * 4;
  if (mars?.retrograde) score += 5;
  return Math.max(25, Math.min(92, Math.round(score)));
}

export default function FunFactBoxes({ chart }: { chart: ChartData }) {
  const sunSign = chart.planets.find((p) => p.name === "Sun")?.sign ?? "Aries";
  const compatible = getTopCompatible(sunSign);
  const moneyPct = getMoneyLuck(chart);
  const dangerPct = getDangerous(chart);

  /* ── CHANGED: headline now uses display font, larger and more presence ── */
  const Headline = ({ text, color }: { text: string; color: string }) => (
    <div style={{
      fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
      fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
      fontWeight: 700,
      color,
      letterSpacing: "-0.01em",
      lineHeight: 1.2,
      marginBottom: 16,
    }}>
      {text}
    </div>
  );

  const Subtext = ({ text, color }: { text: string; color: string }) => (
    <p style={{
      fontSize: 12, color, lineHeight: 1.6,
      marginTop: "auto", paddingTop: 14,
    }}>
      {text}
    </p>
  );

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 14,
      width: "100%",
    }}>

      {/* Box 1 — Most Compatible With */}
      <div style={{
        borderRadius: 18,
        border: "0.5px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        padding: "22px 20px",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ fontSize: 22, marginBottom: 10 }}>❤️</div>
        <Headline text="Most Compatible With" color="#e8e4f0" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {compatible.map((sign) => (
            <div key={sign} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: 10,
              border: `0.5px solid ${signColor(sign)}40`,
              background: `${signColor(sign)}12`,
            }}>
              <span style={{
                fontSize: 14, color: signColor(sign),
                fontFamily: "Georgia, serif", lineHeight: 1,
              }}>
                {SIGN_GLYPHS[sign]}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: signColor(sign) }}>
                {sign}
              </span>
            </div>
          ))}
        </div>
        <Subtext
          text="Signs most likely to match your natural energy."
          color="rgba(255,255,255,0.3)"
        />
      </div>

      {/* Box 2 — Money Instinct */}
      <div style={{
        borderRadius: 18,
        border: "0.5px solid rgba(240,184,74,0.22)",
        background: "rgba(240,184,74,0.05)",
        padding: "22px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 22, marginBottom: 10 }}>💰</div>
        <Headline text="Money Instinct" color="#f0b84a" />
        <div style={{
          fontSize: "clamp(3rem, 6vw, 4rem)",
          fontWeight: 800,
          color: "#f0b84a",
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}>
          {moneyPct}%
        </div>
        <Subtext
          text="Your chart's natural ability to build wealth and spot opportunities."
          color="rgba(240,184,74,0.5)"
        />
      </div>

      {/* Box 3 — Dangerous */}
      <div style={{
        borderRadius: 18,
        border: "0.5px solid rgba(240,100,120,0.22)",
        background: "rgba(240,100,120,0.05)",
        padding: "22px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 22, marginBottom: 10 }}>⚡</div>
        <Headline text="Dangerous" color="#f06478" />
        <div style={{
          fontSize: "clamp(3rem, 6vw, 4rem)",
          fontWeight: 800,
          color: "#f06478",
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}>
          {dangerPct}%
        </div>
        <Subtext
          text="Your ability to intimidate, influence, and leave a lasting impression."
          color="rgba(240,100,120,0.5)"
        />
      </div>

    </div>
  );
}