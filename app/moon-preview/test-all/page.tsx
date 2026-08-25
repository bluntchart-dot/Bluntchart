"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { calculateCompatibility } from "@/lib/moon-phase";
import { getContentLine } from "@/lib/moon-content";
import {
  renderMoon,
  blendBirthMoons,
  scoreToPhaseAngle,
  MOON_SMALL,
} from "@/lib/moon-artwork";
import { composeA1, MOON_HERO_A1 } from "@/lib/moon-a1-soulmate";
import { composeA2, MOON_HERO_A2 } from "@/lib/moon-a2-match";
import { composeB1, MOON_HERO_B1 } from "@/lib/moon-b1-compat";
import { composeB2, MOON_B2 } from "@/lib/moon-b2-astromatch";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "block",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "block",
});

interface TestCase {
  id: string;
  product: "a1" | "a2" | "b1" | "b2";
  name1: string;
  date1: string;
  name2: string;
  date2: string;
  mockScore?: number;
  description: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: "a1-olivia-ethan",
    product: "a1",
    name1: "Olivia",
    date1: "1995-06-15",
    name2: "Ethan",
    date2: "1993-11-22",
    description: "Different phases (waning gibbous vs waxing crescent)",
  },
  {
    id: "a1-maya-leo",
    product: "a1",
    name1: "Maya",
    date1: "1998-03-08",
    name2: "Leo",
    date2: "1997-07-20",
    description: "Mid-cycle phases",
  },
  {
    id: "a1-similar-phases",
    product: "a1",
    name1: "Sofia",
    date1: "2000-01-21",
    name2: "James",
    date2: "2000-01-22",
    description: "Near-identical phases (born 1 day apart)",
  },
  {
    id: "a2-score-20",
    product: "a2",
    name1: "Aria",
    date1: "1990-12-05",
    name2: "Kai",
    date2: "1990-06-05",
    description: "Low score, thin crescent",
  },
  {
    id: "a2-score-50",
    product: "a2",
    name1: "Luna",
    date1: "1994-04-10",
    name2: "Nico",
    date2: "1994-10-10",
    description: "Mid score, half moon",
  },
  {
    id: "a2-score-73",
    product: "a2",
    name1: "Olivia",
    date1: "1995-06-15",
    name2: "Ethan",
    date2: "1993-11-22",
    description: "Olivia + Ethan classic pair",
  },
  {
    id: "a2-score-high",
    product: "a2",
    name1: "Ivy",
    date1: "1996-09-14",
    name2: "Ash",
    date2: "1996-09-15",
    description: "High score (born 1 day apart)",
  },
  {
    id: "b1-score-30",
    product: "b1",
    name1: "Zara",
    date1: "1992-01-15",
    name2: "Finn",
    date2: "1991-08-22",
    mockScore: 30,
    description: "30% — thin crescent hero",
  },
  {
    id: "b1-score-50",
    product: "b1",
    name1: "Nora",
    date1: "1993-05-12",
    name2: "Cole",
    date2: "1994-02-28",
    mockScore: 50,
    description: "50% — half moon hero",
  },
  {
    id: "b1-score-78",
    product: "b1",
    name1: "Emma",
    date1: "1997-11-03",
    name2: "Ryan",
    date2: "1996-04-17",
    mockScore: 78,
    description: "78% — waxing gibbous hero",
  },
  {
    id: "b1-score-90",
    product: "b1",
    name1: "Lily",
    date1: "1999-07-21",
    name2: "Jake",
    date2: "1998-12-09",
    mockScore: 90,
    description: "90% — nearly full hero",
  },
  {
    id: "b2-pair-1",
    product: "b2",
    name1: "Chloe",
    date1: "1995-03-18",
    name2: "Marcus",
    date2: "1994-09-25",
    mockScore: 67,
    description: "Different phases, 67% hero",
  },
  {
    id: "b2-pair-2",
    product: "b2",
    name1: "Ava",
    date1: "1998-08-07",
    name2: "Noah",
    date2: "1997-02-14",
    mockScore: 45,
    description: "Contrasting phases, 45% hero",
  },
  {
    id: "b2-pair-3",
    product: "b2",
    name1: "Ruby",
    date1: "2001-12-25",
    name2: "Owen",
    date2: "2001-06-21",
    mockScore: 83,
    description: "Solstice births, 83% hero",
  },
];

export default function TestAllPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "rendering" | "done" | "error">("idle");
  const [thumbURL, setThumbURL] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const rendering = useRef(false);

  const selectedCase = TEST_CASES.find((tc) => tc.id === selected);

  async function generate() {
    if (rendering.current || !selectedCase) return;
    rendering.current = true;
    setStatus("rendering");
    setThumbURL(null);
    setSavedPath(null);
    setErrMsg(null);

    try {
      await document.fonts.ready;

      const serif = cormorant.style.fontFamily;
      const sans = dmSans.style.fontFamily;
      const tc = selectedCase;

      const loader = new THREE.TextureLoader();
      const [colorMap, displacementMap] = await Promise.all([
        new Promise<THREE.Texture>((res) => {
          const t = loader.load("/moon-textures/color-2k.jpg", () => res(t));
          t.colorSpace = THREE.SRGBColorSpace;
        }),
        new Promise<THREE.Texture>((res) => {
          const t = loader.load("/moon-textures/displacement-2k.png", () => res(t));
        }),
      ]);

      const compat = calculateCompatibility(tc.date1, tc.date2);
      const computedScore = tc.mockScore ?? compat.score;
      const contentLine = getContentLine(computedScore, tc.name1, tc.date1, tc.name2, tc.date2);

      const composeInput = {
        name1: tc.name1,
        date1: tc.date1,
        name2: tc.name2,
        date2: tc.date2,
        serif,
        sans,
        contentLine,
      };

      let master: HTMLCanvasElement;

      if (tc.product === "a1") {
        const m1 = renderMoon(compat.person1.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const hero = blendBirthMoons(
          compat.person1.phaseAngle,
          compat.person2.phaseAngle,
          MOON_HERO_A1,
          colorMap,
          displacementMap
        );
        master = composeA1(m1, m2, hero, compat, composeInput);
      } else if (tc.product === "a2") {
        const heroAngle = scoreToPhaseAngle(compat.score);
        const esOpts = compat.score < 25
          ? { earthshineIntensity: 0.12 + ((25 - compat.score) / 25) * 0.04, shadowLift: true }
          : { shadowLift: true };
        const hero = renderMoon(heroAngle, MOON_HERO_A2, colorMap, displacementMap, esOpts);
        master = composeA2(hero, compat, composeInput);
      } else if (tc.product === "b1") {
        const mockScore = tc.mockScore!;
        const m1 = renderMoon(compat.person1.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const heroAngle = scoreToPhaseAngle(mockScore);
        const esOpts = mockScore < 25
          ? { earthshineIntensity: 0.12 + ((25 - mockScore) / 25) * 0.04, shadowLift: true }
          : { shadowLift: true };
        const hero = renderMoon(heroAngle, MOON_HERO_B1, colorMap, displacementMap, esOpts);
        master = composeB1(m1, m2, hero, {
          ...composeInput,
          score: mockScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
        });
      } else {
        const mockScore = tc.mockScore!;
        const sl = { shadowLift: true };
        const m1 = renderMoon(compat.person1.phaseAngle, MOON_B2, colorMap, displacementMap, sl);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_B2, colorMap, displacementMap, sl);
        master = composeB2(m1, m2, {
          ...composeInput,
          score: mockScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
        });
      }

      colorMap.dispose();
      displacementMap.dispose();

      const thumbCanvas = document.createElement("canvas");
      const thumbScale = 600 / master.width;
      thumbCanvas.width = 600;
      thumbCanvas.height = Math.round(master.height * thumbScale);
      const tCtx = thumbCanvas.getContext("2d")!;
      tCtx.drawImage(master, 0, 0, thumbCanvas.width, thumbCanvas.height);
      setThumbURL(thumbCanvas.toDataURL("image/jpeg", 0.85));
      setScore(computedScore);

      const masterDataURL = master.toDataURL("image/png");
      const filename = `${tc.id}.png`;

      const saveRes = await fetch("/api/internal/moon-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: "test-all-products",
          files: [{ name: filename, dataURL: masterDataURL }],
        }),
      });

      const saveData = await saveRes.json();
      setSavedPath(saveData.directory + "/" + filename);
      setStatus("done");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : String(e));
      setStatus("error");
    } finally {
      rendering.current = false;
    }
  }

  const products = ["a1", "a2", "b1", "b2"] as const;
  const productLabels: Record<string, string> = {
    a1: "A1 — Soulmate Moon",
    a2: "A2 — Moon Match",
    b1: "B1 — Astrology Compatibility",
    b2: "B2 — Astrology Match",
  };

  return (
    <div
      className={`${cormorant.className} ${dmSans.className}`}
      style={{
        minHeight: "100vh",
        background: "#09090f",
        color: "#e8e4f0",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>
          Moon Product Test Suite
        </h1>
        <p style={{ fontSize: 12, color: "#6b6585", marginBottom: 28 }}>
          Select a test case, then click Generate. One at a time to avoid GPU overload.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {/* Left: test case selector */}
          <div>
            {products.map((prod) => {
              const cases = TEST_CASES.filter((tc) => tc.product === prod);
              return (
                <div key={prod} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#c9a84c",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {productLabels[prod]}
                  </div>
                  {cases.map((tc) => {
                    const isSelected = selected === tc.id;
                    return (
                      <button
                        key={tc.id}
                        onClick={() => {
                          setSelected(tc.id);
                          if (status !== "idle") {
                            setStatus("idle");
                            setThumbURL(null);
                            setSavedPath(null);
                            setErrMsg(null);
                          }
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          background: isSelected
                            ? "rgba(201, 168, 76, 0.10)"
                            : "rgba(255,255,255,0.02)",
                          border: isSelected
                            ? "1px solid rgba(201, 168, 76, 0.35)"
                            : "0.5px solid rgba(255,255,255,0.06)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          marginBottom: 6,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#e8e4f0" : "#a09ab0" }}>
                          {tc.name1} × {tc.name2}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b6585", marginTop: 2 }}>
                          {tc.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            <button
              onClick={generate}
              disabled={!selected || status === "rendering"}
              style={{
                width: "100%",
                marginTop: 8,
                background:
                  selected && status !== "rendering"
                    ? "linear-gradient(135deg,#6b2fd4,#d4537e)"
                    : "rgba(255,255,255,0.06)",
                color:
                  selected && status !== "rendering"
                    ? "#fff"
                    : "#4a4560",
                border: "none",
                borderRadius: 12,
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 600,
                cursor:
                  selected && status !== "rendering"
                    ? "pointer"
                    : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              {status === "rendering"
                ? "Rendering…"
                : "Generate"}
            </button>
          </div>

          {/* Right: result */}
          <div>
            {status === "rendering" && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48 }}>&#127769;</div>
                <div style={{ fontSize: 16, marginTop: 12, color: "#e8e4f0" }}>
                  Rendering {selectedCase?.product.toUpperCase()}…
                </div>
                <div style={{ fontSize: 12, color: "#4a4560", marginTop: 4 }}>
                  Three.js + composition. 5–15 seconds.
                </div>
              </div>
            )}

            {status === "idle" && selected && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#3a3858", fontSize: 13 }}>
                Click Generate to render this test case.
              </div>
            )}

            {status === "idle" && !selected && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#3a3858", fontSize: 13 }}>
                Select a test case from the list.
              </div>
            )}

            {(status === "done" || status === "error") && selectedCase && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#c9a84c", letterSpacing: "1.5px" }}>
                    {selectedCase.product.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: status === "done" ? "#6b9a6b" : "#f0a0b8",
                    }}
                  >
                    {status === "done" ? `done — ${score}%` : "error"}
                  </span>
                </div>

                <div style={{ fontSize: 16, fontWeight: 600, color: "#d4d0dc", marginBottom: 4 }}>
                  {selectedCase.name1} × {selectedCase.name2}
                </div>
                <div style={{ fontSize: 12, color: "#6b6585", marginBottom: 14 }}>
                  {selectedCase.description}
                </div>

                {thumbURL && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbURL}
                    alt={selectedCase.description}
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      marginBottom: 10,
                    }}
                  />
                )}

                {errMsg && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#f0a0b8",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      wordBreak: "break-all",
                      marginBottom: 10,
                    }}
                  >
                    {errMsg}
                  </div>
                )}

                {savedPath && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#3a3858",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      wordBreak: "break-all",
                    }}
                  >
                    Saved: {savedPath}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
