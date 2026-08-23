"use client";

import { useEffect, useRef, useState } from "react";
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
import { composeB2, MOON_LARGE_B2 } from "@/lib/moon-b2-astromatch";

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
  // A1 — Soulmate Moon: different moon phases
  {
    id: "a1-olivia-ethan",
    product: "a1",
    name1: "Olivia",
    date1: "1995-06-15",
    name2: "Ethan",
    date2: "1993-11-22",
    description: "A1: different phases (waning gibbous vs waxing crescent)",
  },
  {
    id: "a1-maya-leo",
    product: "a1",
    name1: "Maya",
    date1: "1998-03-08",
    name2: "Leo",
    date2: "1997-07-20",
    description: "A1: mid-cycle phases",
  },
  {
    id: "a1-similar-phases",
    product: "a1",
    name1: "Sofia",
    date1: "2000-01-21",
    name2: "James",
    date2: "2000-01-22",
    description: "A1: near-identical phases (born 1 day apart)",
  },

  // A2 — Moon Match: varying scores
  {
    id: "a2-score-20",
    product: "a2",
    name1: "Aria",
    date1: "1990-12-05",
    name2: "Kai",
    date2: "1990-06-05",
    description: "A2: ~low score, thin crescent",
  },
  {
    id: "a2-score-50",
    product: "a2",
    name1: "Luna",
    date1: "1994-04-10",
    name2: "Nico",
    date2: "1994-10-10",
    description: "A2: ~mid score, half moon",
  },
  {
    id: "a2-score-73",
    product: "a2",
    name1: "Olivia",
    date1: "1995-06-15",
    name2: "Ethan",
    date2: "1993-11-22",
    description: "A2: Olivia+Ethan classic pair",
  },
  {
    id: "a2-score-high",
    product: "a2",
    name1: "Ivy",
    date1: "1996-09-14",
    name2: "Ash",
    date2: "1996-09-15",
    description: "A2: high score (born 1 day apart)",
  },

  // B1 — Astrology Compatibility: mock scores
  {
    id: "b1-score-30",
    product: "b1",
    name1: "Zara",
    date1: "1992-01-15",
    name2: "Finn",
    date2: "1991-08-22",
    mockScore: 30,
    description: "B1: 30% — thin crescent",
  },
  {
    id: "b1-score-50",
    product: "b1",
    name1: "Nora",
    date1: "1993-05-12",
    name2: "Cole",
    date2: "1994-02-28",
    mockScore: 50,
    description: "B1: 50% — half moon",
  },
  {
    id: "b1-score-78",
    product: "b1",
    name1: "Emma",
    date1: "1997-11-03",
    name2: "Ryan",
    date2: "1996-04-17",
    mockScore: 78,
    description: "B1: 78% — waxing gibbous",
  },
  {
    id: "b1-score-90",
    product: "b1",
    name1: "Lily",
    date1: "1999-07-21",
    name2: "Jake",
    date2: "1998-12-09",
    mockScore: 90,
    description: "B1: 90% — nearly full",
  },

  // B2 — Astrology Match: two large birth moons
  {
    id: "b2-pair-1",
    product: "b2",
    name1: "Chloe",
    date1: "1995-03-18",
    name2: "Marcus",
    date2: "1994-09-25",
    mockScore: 67,
    description: "B2: different phases, 67%",
  },
  {
    id: "b2-pair-2",
    product: "b2",
    name1: "Ava",
    date1: "1998-08-07",
    name2: "Noah",
    date2: "1997-02-14",
    mockScore: 45,
    description: "B2: contrasting phases, 45%",
  },
  {
    id: "b2-pair-3",
    product: "b2",
    name1: "Ruby",
    date1: "2001-12-25",
    name2: "Owen",
    date2: "2001-06-21",
    mockScore: 83,
    description: "B2: solstice births, 83%",
  },
];

interface TestResult {
  id: string;
  status: "pending" | "rendering" | "done" | "error";
  thumbURL?: string;
  error?: string;
  score?: number;
  savedPath?: string;
}

export default function TestAllPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [running, setRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const started = useRef(false);

  useEffect(() => {
    const init: Record<string, TestResult> = {};
    TEST_CASES.forEach((tc) => {
      init[tc.id] = { id: tc.id, status: "pending" };
    });
    setResults(init);
  }, []);

  async function runAll() {
    if (started.current) return;
    started.current = true;
    setRunning(true);

    await document.fonts.ready;

    const serif = cormorant.style.fontFamily;
    const sans = dmSans.style.fontFamily;

    const loader = new THREE.TextureLoader();
    const [colorMap, displacementMap] = await Promise.all([
      new Promise<THREE.Texture>((res) => {
        const t = loader.load("/moon-textures/color-2k.jpg", () => res(t));
        t.colorSpace = THREE.SRGBColorSpace;
      }),
      new Promise<THREE.Texture>((res) => {
        const t = loader.load("/moon-textures/displacement-2k.png", () =>
          res(t)
        );
      }),
    ]);

    for (let i = 0; i < TEST_CASES.length; i++) {
      const tc = TEST_CASES[i];
      setCurrentIdx(i);
      setResults((prev) => ({
        ...prev,
        [tc.id]: { ...prev[tc.id], status: "rendering" },
      }));

      await new Promise((r) => setTimeout(r, 100));

      try {
        const compat = calculateCompatibility(tc.date1, tc.date2);
        const score = tc.mockScore ?? compat.score;
        const contentLine = getContentLine(
          score,
          tc.name1,
          tc.date1,
          tc.name2,
          tc.date2
        );

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
          const esOpts =
            compat.score < 25
              ? { earthshineIntensity: 0.008 + ((25 - compat.score) / 25) * 0.04 }
              : { earthshineIntensity: 0.008 };
          const hero = renderMoon(heroAngle, MOON_HERO_A2, colorMap, displacementMap, esOpts);
          master = composeA2(hero, compat, composeInput);
        } else if (tc.product === "b1") {
          const mockScore = tc.mockScore!;
          const heroAngle = scoreToPhaseAngle(mockScore);
          const esOpts =
            mockScore < 25
              ? { earthshineIntensity: 0.008 + ((25 - mockScore) / 25) * 0.04 }
              : { earthshineIntensity: 0.008 };
          const hero = renderMoon(heroAngle, MOON_HERO_B1, colorMap, displacementMap, esOpts);
          master = composeB1(hero, { ...composeInput, score: mockScore });
        } else {
          const es = { earthshineIntensity: 0.008 };
          const m1 = renderMoon(compat.person1.phaseAngle, MOON_LARGE_B2, colorMap, displacementMap, es);
          const m2 = renderMoon(compat.person2.phaseAngle, MOON_LARGE_B2, colorMap, displacementMap, es);
          master = composeB2(m1, m2, {
            ...composeInput,
            score: tc.mockScore!,
            person1PhaseName: compat.person1.phaseName,
            person2PhaseName: compat.person2.phaseName,
          });
        }

        const thumbCanvas = document.createElement("canvas");
        thumbCanvas.width = 480;
        thumbCanvas.height = 600;
        const tCtx = thumbCanvas.getContext("2d")!;
        tCtx.drawImage(master, 0, 0, 480, 600);
        const thumbURL = thumbCanvas.toDataURL("image/jpeg", 0.8);

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

        setResults((prev) => ({
          ...prev,
          [tc.id]: {
            ...prev[tc.id],
            status: "done",
            thumbURL,
            score,
            savedPath: saveData.directory + "/" + filename,
          },
        }));
      } catch (e) {
        setResults((prev) => ({
          ...prev,
          [tc.id]: {
            ...prev[tc.id],
            status: "error",
            error: e instanceof Error ? e.message : String(e),
          },
        }));
      }
    }

    colorMap.dispose();
    displacementMap.dispose();
    setRunning(false);
  }

  const doneCount = Object.values(results).filter(
    (r) => r.status === "done"
  ).length;
  const errCount = Object.values(results).filter(
    (r) => r.status === "error"
  ).length;

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
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            marginBottom: 8,
          }}
        >
          Moon Product Test Suite
        </h1>
        <p style={{ fontSize: 13, color: "#6b6585", marginBottom: 24 }}>
          {TEST_CASES.length} test cases across 4 products. Generates master PNGs
          and saves to server.
        </p>

        <div style={{ marginBottom: 32, display: "flex", gap: 16, alignItems: "center" }}>
          <button
            onClick={runAll}
            disabled={running}
            style={{
              background: running
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg,#6b2fd4,#d4537e)",
              color: running ? "#4a4560" : "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 600,
              cursor: running ? "wait" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {running
              ? `Rendering ${currentIdx + 1} / ${TEST_CASES.length}…`
              : doneCount > 0
              ? `Re-run all (${doneCount} done)`
              : "Run all tests"}
          </button>
          {doneCount > 0 && (
            <span style={{ fontSize: 13, color: "#6b9a6b" }}>
              {doneCount} passed
              {errCount > 0 && (
                <span style={{ color: "#f0a0b8" }}> · {errCount} failed</span>
              )}
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {TEST_CASES.map((tc) => {
            const r = results[tc.id];
            return (
              <div
                key={tc.id}
                style={{
                  background:
                    r?.status === "error"
                      ? "rgba(212,83,126,0.06)"
                      : r?.status === "done"
                      ? "rgba(122,214,153,0.04)"
                      : "rgba(255,255,255,0.03)",
                  border: `0.5px solid ${
                    r?.status === "error"
                      ? "rgba(212,83,126,0.3)"
                      : r?.status === "done"
                      ? "rgba(122,214,153,0.2)"
                      : "rgba(255,255,255,0.08)"
                  }`,
                  borderRadius: 14,
                  padding: 16,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#c9a84c",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {tc.product.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color:
                        r?.status === "done"
                          ? "#6b9a6b"
                          : r?.status === "error"
                          ? "#f0a0b8"
                          : r?.status === "rendering"
                          ? "#c9a84c"
                          : "#3a3858",
                    }}
                  >
                    {r?.status === "rendering"
                      ? "rendering…"
                      : r?.status === "done"
                      ? `done · ${r.score}%`
                      : r?.status === "error"
                      ? "error"
                      : "pending"}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#d4d0dc",
                    marginBottom: 4,
                  }}
                >
                  {tc.name1} × {tc.name2}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b6585",
                    marginBottom: r?.thumbURL ? 10 : 0,
                  }}
                >
                  {tc.description}
                </div>

                {r?.thumbURL && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.thumbURL}
                    alt={tc.description}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      border: "0.5px solid rgba(255,255,255,0.1)",
                    }}
                  />
                )}

                {r?.error && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#f0a0b8",
                      marginTop: 8,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      wordBreak: "break-all",
                    }}
                  >
                    {r.error}
                  </div>
                )}

                {r?.savedPath && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#3a3858",
                      marginTop: 6,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      wordBreak: "break-all",
                    }}
                  >
                    {r.savedPath}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
