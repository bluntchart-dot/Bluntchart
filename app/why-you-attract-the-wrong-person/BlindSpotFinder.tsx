"use client";

import { useState } from "react";

const BLIND_SPOTS: Record<string, { icon: string; line: string; share: string }> = {
  Aries:       { icon: "♈", line: "You mistake the chase for the connection. Once someone's caught, you're already looking for the next adrenaline hit.", share: "I mistake the chase for the connection 💀" },
  Taurus:      { icon: "♉", line: "You stay way too long because leaving feels like failure. Your comfort zone has a lock on the inside.", share: "I stay too long because leaving feels like failure 💀" },
  Gemini:      { icon: "♊", line: "You talk your way out of feeling things. Witty banter is not intimacy, no matter how much you wish it were.", share: "I talk my way out of feeling things 💀" },
  Cancer:      { icon: "♋", line: "You mother your partners until they either leave or let you carry everything. Then you wonder why you're exhausted.", share: "I mother my partners and then wonder why I'm exhausted 💀" },
  Leo:         { icon: "♌", line: "You choose people who reflect your best self back to you — and call it love when it's actually an audience.", share: "I choose an audience and call it love 💀" },
  Virgo:       { icon: "♍", line: "You date projects. You fall for potential. You fix people who didn't ask to be fixed and then resent them for it.", share: "I date projects and resent them for not being finished 💀" },
  Libra:       { icon: "♎", line: "You bend until you break, start over, and bend again. Harmony without honesty is just slow suffocation.", share: "I bend until I break and then do it again 💀" },
  Scorpio:     { icon: "♏", line: "You confuse obsession with love. If it doesn't destroy you a little, you don't trust it. That's the problem.", share: "I confuse obsession with love 💀" },
  Sagittarius: { icon: "♐", line: "You bolt when it gets real. Freedom isn't a love language — it's your exit strategy disguised as a personality trait.", share: "Freedom is my exit strategy disguised as a personality trait 💀" },
  Capricorn:   { icon: "♑", line: "You choose partners like investments — good on paper, hollow in practice. Spreadsheets don't measure chemistry.", share: "I choose partners like investments 💀" },
  Aquarius:    { icon: "♒", line: "You keep everyone at a safe intellectual distance and wonder why no one truly knows you. That's not independence — it's hiding.", share: "I keep everyone at a safe distance and call it independence 💀" },
  Pisces:      { icon: "♓", line: "You fall in love with who someone could be, not who they are. Then feel betrayed when they turn out to be themselves.", share: "I fall in love with potential and feel betrayed by reality 💀" },
};

const SIGNS = Object.keys(BLIND_SPOTS);

export default function BlindSpotFinder() {
  const [selected, setSelected] = useState<string | null>(null);
  const data = selected ? BLIND_SPOTS[selected] : null;

  const handleShare = () => {
    if (!data) return;
    const text = `My Venus blind spot (${selected}): ${data.share}\n\nFind yours → bluntchart.com/why-you-attract-the-wrong-person`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
      }).catch(() => {});
    }
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)",
      borderRadius: 20, padding: "32px 28px", marginBottom: 48, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#d4537e,#f0b84a,transparent)" }} />

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "rgba(212,83,126,0.7)", marginBottom: 8 }}>
          ♀ Interactive tool
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem,2.5vw,1.5rem)", fontWeight: 800, color: "#e8e4f0", marginBottom: 6 }}>
          Tap your sign. Read your blind spot.
        </div>
        <p style={{ fontSize: ".85rem", color: "rgba(232,228,240,0.45)", maxWidth: 420, margin: "0 auto" }}>
          Use your Venus sign for accuracy. Don&apos;t know it? Use your Sun sign for now, then get your <a href="/free-birth-chart" style={{ color: "#F0B84A", textDecoration: "underline", textDecorationColor: "rgba(240,184,74,0.3)" }}>free chart</a>.
        </p>
      </div>

      {/* Sign grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8,
        maxWidth: 480, margin: "0 auto 24px",
      }}>
        {SIGNS.map(sign => {
          const isActive = selected === sign;
          return (
            <button key={sign} onClick={() => setSelected(sign)} style={{
              background: isActive ? "rgba(212,83,126,0.15)" : "rgba(255,255,255,0.03)",
              border: `0.5px solid ${isActive ? "rgba(212,83,126,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, padding: "12px 4px", cursor: "pointer",
              transition: "all .15s", textAlign: "center", fontFamily: "inherit",
            }}>
              <div style={{ fontSize: "1.3rem", lineHeight: 1, marginBottom: 4 }}>
                {BLIND_SPOTS[sign].icon}
              </div>
              <div style={{
                fontSize: ".62rem", fontWeight: 600, letterSpacing: ".04em",
                color: isActive ? "#d4537e" : "rgba(232,228,240,0.4)",
                textTransform: "uppercase" as const,
              }}>
                {sign.slice(0, 3)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result */}
      <div style={{
        minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center",
      }}>
        {!selected && (
          <p style={{ fontSize: ".88rem", color: "rgba(232,228,240,0.3)", fontStyle: "italic" }}>
            ↑ Pick a sign to see the blind spot
          </p>
        )}
        {selected && data && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#d4537e", marginBottom: 10 }}>
              Venus in {selected} — your blind spot
            </div>
            <p style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(1rem,2vw,1.15rem)",
              lineHeight: 1.65, color: "#f0ece8", maxWidth: 520, margin: "0 auto 18px",
              fontStyle: "italic",
            }}>
              &ldquo;{data.line}&rdquo;
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={handleShare} style={{
                background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "8px 16px", fontSize: ".78rem", fontWeight: 600,
                color: "rgba(232,228,240,0.6)", cursor: "pointer", fontFamily: "inherit",
                transition: "all .15s",
              }}>
                Share this 💀
              </button>
              <a href="/free-birth-chart" style={{
                background: "rgba(212,83,126,0.1)", border: "0.5px solid rgba(212,83,126,0.25)",
                borderRadius: 8, padding: "8px 16px", fontSize: ".78rem", fontWeight: 600,
                color: "#d4537e", textDecoration: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                Find your actual Venus sign →
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}