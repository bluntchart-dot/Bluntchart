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
  loadImage,
  MOON_SMALL,
  MASTER_W,
  MASTER_H,
} from "@/lib/moon-artwork";
import { createMoonScene, postProcessPremium } from "@/lib/moon-renderer";
import { encodeVideo } from "@/lib/moon-video";
import { composeA1, MOON_HERO_A1 } from "@/lib/moon-a1-soulmate";
import { composeA2, MOON_HERO_A2 } from "@/lib/moon-a2-match";
import { composeB1, MOON_HERO_B1 } from "@/lib/moon-b1-compat";
import { composeB2, MOON_B2, B2_W, B2_H } from "@/lib/moon-b2-astromatch";

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
    id: "a1-ross-rachel",
    product: "a1",
    name1: "Ross",
    date1: "1991-12-13",
    name2: "Rachel",
    date2: "1990-03-20",
    description: "82% — mirrored crescents facing each other, gap centered on hero moon",
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
  const [videoStatus, setVideoStatus] = useState<"idle" | "encoding" | "done" | "error">("idle");
  const [videoPct, setVideoPct] = useState(0);
  const [videoInfo, setVideoInfo] = useState<string | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
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
          displacementMap,
          { earthshineIntensity: 0 }
        );
        const milkyway = await loadImage("/Milkyway.png");
        master = composeA1(m1, m2, hero, compat, composeInput, milkyway);
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
        const natalImg = await loadImage("/half natal.png");
        master = composeB1(m1, m2, hero, {
          ...composeInput,
          score: mockScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
        }, natalImg);
      } else {
        const mockScore = tc.mockScore!;
        const sl = { shadowLift: true };
        const m1 = renderMoon(compat.person1.phaseAngle, MOON_B2, colorMap, displacementMap, sl);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_B2, colorMap, displacementMap, sl);
        const landscape = await loadImage("/Landspace.png");
        master = composeB2(m1, m2, {
          ...composeInput,
          score: mockScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
        }, landscape);
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

  async function generateMP4() {
    if (rendering.current || !selectedCase || selectedCase.product === "a1") return;
    rendering.current = true;
    setVideoStatus("encoding");
    setVideoPct(0);
    setVideoInfo(null);
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

      const FPS = 15;
      const TOTAL = 399;
      const RENDER_SIZE = 1024;

      const webglCanvas = document.createElement("canvas");
      const threeRenderer = new THREE.WebGLRenderer({
        canvas: webglCanvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      threeRenderer.setSize(RENDER_SIZE, RENDER_SIZE);
      threeRenderer.setPixelRatio(1);
      threeRenderer.setClearColor(0x000000, 0);
      threeRenderer.outputColorSpace = THREE.SRGBColorSpace;
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;

      const scenesToDispose: ReturnType<typeof createMoonScene>[] = [];
      let blob: Blob;
      let outW: number;
      let outH: number;

      if (tc.product === "a2") {
        outW = 1080; outH = 1350;
        const heroAngle = scoreToPhaseAngle(computedScore);
        const esOpts = computedScore < 25
          ? { earthshineIntensity: 0.12 + ((25 - computedScore) / 25) * 0.04, shadowLift: true }
          : { shadowLift: true };
        const earthshine = esOpts.earthshineIntensity ?? (esOpts.shadowLift ? 0.42 : undefined);
        const illum = (1 - Math.cos((heroAngle * Math.PI) / 180)) / 2;
        threeRenderer.toneMappingExposure = 1.25 * (illum > 0.85 ? 0.95 : 1);

        const moonScene = createMoonScene({
          phaseAngle: heroAngle, size: RENDER_SIZE, premium: true, earthshineIntensity: earthshine,
        });
        const mat = moonScene.material as THREE.MeshStandardMaterial;
        mat.map = colorMap; mat.bumpMap = displacementMap; mat.displacementMap = displacementMap;
        mat.needsUpdate = true;
        scenesToDispose.push(moonScene);

        const input = {
          name1: tc.name1, date1: tc.date1, name2: tc.name2, date2: tc.date2,
          serif, sans, contentLine, skipGrain: true,
        };

        blob = await encodeVideo({
          width: outW, height: outH, fps: FPS, totalFrames: TOTAL, bitrate: 4_000_000,
          onProgress: (pct) => setVideoPct(pct),
          renderFrame: (fi, _c, ctx) => {
            moonScene.moon.rotation.y = (fi / TOTAL) * Math.PI * 2;
            threeRenderer.render(moonScene.scene, moonScene.camera);
            const mc = postProcessPremium(webglCanvas, esOpts);
            const full = composeA2(mc, compat, input);
            ctx.drawImage(full, 0, 0, MASTER_W, MASTER_H, 0, 0, outW, outH);
            mc.width = 0; mc.height = 0; full.width = 0; full.height = 0;
          },
        });

      } else if (tc.product === "b1") {
        outW = 1080; outH = 1350;
        const heroAngle = scoreToPhaseAngle(computedScore);
        const esOpts = computedScore < 25
          ? { earthshineIntensity: 0.12 + ((25 - computedScore) / 25) * 0.04, shadowLift: true }
          : { shadowLift: true };
        const earthshine = esOpts.earthshineIntensity ?? (esOpts.shadowLift ? 0.42 : undefined);
        const illum = (1 - Math.cos((heroAngle * Math.PI) / 180)) / 2;
        threeRenderer.toneMappingExposure = 1.25 * (illum > 0.85 ? 0.95 : 1);

        const moonScene = createMoonScene({
          phaseAngle: heroAngle, size: RENDER_SIZE, premium: true, earthshineIntensity: earthshine,
        });
        const mat = moonScene.material as THREE.MeshStandardMaterial;
        mat.map = colorMap; mat.bumpMap = displacementMap; mat.displacementMap = displacementMap;
        mat.needsUpdate = true;
        scenesToDispose.push(moonScene);

        const m1 = renderMoon(compat.person1.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const natalImg = await loadImage("/half natal.png");

        const b1Input = {
          name1: tc.name1, date1: tc.date1, name2: tc.name2, date2: tc.date2,
          serif, sans, contentLine,
          score: computedScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
          skipGrain: true,
        };

        blob = await encodeVideo({
          width: outW, height: outH, fps: FPS, totalFrames: TOTAL, bitrate: 4_000_000,
          onProgress: (pct) => setVideoPct(pct),
          renderFrame: (fi, _c, ctx) => {
            moonScene.moon.rotation.y = (fi / TOTAL) * Math.PI * 2;
            threeRenderer.render(moonScene.scene, moonScene.camera);
            const mc = postProcessPremium(webglCanvas, esOpts);
            const full = composeB1(m1, m2, mc, b1Input, natalImg);
            ctx.drawImage(full, 0, 0, MASTER_W, MASTER_H, 0, 0, outW, outH);
            mc.width = 0; mc.height = 0; full.width = 0; full.height = 0;
          },
        });
        m1.width = 0; m1.height = 0;
        m2.width = 0; m2.height = 0;

      } else {
        // B2 — landscape, both moons rotate very slowly
        outW = 1350; outH = 1080;
        const angle1 = compat.person1.phaseAngle;
        const angle2 = compat.person2.phaseAngle;
        const slOpts = { shadowLift: true };

        const scene1 = createMoonScene({
          phaseAngle: angle1, size: RENDER_SIZE, premium: true, earthshineIntensity: 0.42,
        });
        const mat1 = scene1.material as THREE.MeshStandardMaterial;
        mat1.map = colorMap; mat1.bumpMap = displacementMap; mat1.displacementMap = displacementMap;
        mat1.needsUpdate = true;
        scenesToDispose.push(scene1);

        const scene2 = createMoonScene({
          phaseAngle: angle2, size: RENDER_SIZE, premium: true, earthshineIntensity: 0.42,
        });
        const mat2 = scene2.material as THREE.MeshStandardMaterial;
        mat2.map = colorMap; mat2.bumpMap = displacementMap; mat2.displacementMap = displacementMap;
        mat2.needsUpdate = true;
        scenesToDispose.push(scene2);

        const landscape = await loadImage("/Landspace.png");

        const b2Input = {
          name1: tc.name1, date1: tc.date1, name2: tc.name2, date2: tc.date2,
          serif, sans, contentLine,
          score: computedScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
          skipGrain: true,
        };

        blob = await encodeVideo({
          width: outW, height: outH, fps: FPS, totalFrames: TOTAL, bitrate: 4_000_000,
          onProgress: (pct) => setVideoPct(pct),
          renderFrame: (fi, _c, ctx) => {
            const rot = (fi / TOTAL) * Math.PI * 2;

            scene1.moon.rotation.y = rot;
            const il1 = (1 - Math.cos((angle1 * Math.PI) / 180)) / 2;
            threeRenderer.toneMappingExposure = 1.25 * (il1 > 0.85 ? 0.95 : 1);
            threeRenderer.render(scene1.scene, scene1.camera);
            const mc1 = postProcessPremium(webglCanvas, slOpts);

            scene2.moon.rotation.y = rot;
            const il2 = (1 - Math.cos((angle2 * Math.PI) / 180)) / 2;
            threeRenderer.toneMappingExposure = 1.25 * (il2 > 0.85 ? 0.95 : 1);
            threeRenderer.render(scene2.scene, scene2.camera);
            const mc2 = postProcessPremium(webglCanvas, slOpts);

            const full = composeB2(mc1, mc2, b2Input, landscape);
            ctx.drawImage(full, 0, 0, B2_W, B2_H, 0, 0, outW, outH);
            mc1.width = 0; mc1.height = 0;
            mc2.width = 0; mc2.height = 0;
            full.width = 0; full.height = 0;
          },
        });
      }

      for (const s of scenesToDispose) {
        s.colorMap.dispose();
        s.displacementMap.dispose();
        s.material.dispose();
      }
      threeRenderer.dispose();
      colorMap.dispose();
      displacementMap.dispose();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tc.id}-story.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (videoURL) URL.revokeObjectURL(videoURL);
      setVideoURL(url);

      const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
      const info = `${outW}×${outH} | ${FPS}fps | ${(TOTAL / FPS).toFixed(1)}s | ${sizeMB}MB | H.264 High`;
      console.log(`[MP4] ${tc.id}: ${info} (${blob.size} bytes)`);
      setVideoInfo(info);
      setVideoStatus("done");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : String(e));
      setVideoStatus("error");
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
                          setVideoStatus("idle");
                          setVideoInfo(null);
                          setVideoPct(0);
                          if (videoURL) { URL.revokeObjectURL(videoURL); setVideoURL(null); }
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

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={generate}
                disabled={!selected || rendering.current}
                style={{
                  flex: 1,
                  background:
                    selected && !rendering.current
                      ? "linear-gradient(135deg,#6b2fd4,#d4537e)"
                      : "rgba(255,255,255,0.06)",
                  color:
                    selected && !rendering.current
                      ? "#fff"
                      : "#4a4560",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 20px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor:
                    selected && !rendering.current
                      ? "pointer"
                      : "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                {status === "rendering" ? "Rendering…" : "Generate"}
              </button>
              {selectedCase && selectedCase.product !== "a1" && (
                <button
                  onClick={generateMP4}
                  disabled={!selected || rendering.current}
                  style={{
                    flex: 1,
                    background:
                      selected && !rendering.current
                        ? "linear-gradient(135deg,#2f8cd4,#53d4a0)"
                        : "rgba(255,255,255,0.06)",
                    color:
                      selected && !rendering.current
                        ? "#fff"
                        : "#4a4560",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 20px",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor:
                      selected && !rendering.current
                        ? "pointer"
                        : "not-allowed",
                    fontFamily: "inherit",
                  }}
                >
                  {videoStatus === "encoding"
                    ? `MP4 ${Math.round(videoPct * 100)}%`
                    : "MP4 Story"}
                </button>
              )}
            </div>
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

            {videoStatus === "encoding" && status !== "rendering" && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48 }}>&#127909;</div>
                <div style={{ fontSize: 16, marginTop: 12, color: "#e8e4f0" }}>
                  Encoding MP4… {Math.round(videoPct * 100)}%
                </div>
                <div style={{ fontSize: 12, color: "#4a4560", marginTop: 4 }}>
                  3D moon rotation · {90} frames · WebCodecs H.264
                </div>
                <div style={{ maxWidth: 200, margin: "16px auto 0", background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(90deg,#2f8cd4,#53d4a0)", width: `${videoPct * 100}%`, height: "100%", transition: "width 0.2s" }} />
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

                {videoStatus === "encoding" && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: "#53d4a0", marginBottom: 4 }}>
                      Encoding MP4… {Math.round(videoPct * 100)}%
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ background: "linear-gradient(90deg,#2f8cd4,#53d4a0)", width: `${videoPct * 100}%`, height: "100%", transition: "width 0.2s" }} />
                    </div>
                  </div>
                )}

                {videoInfo && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 10,
                      color: "#53d4a0",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                  >
                    MP4: {videoInfo}
                  </div>
                )}
              </div>
            )}

            {videoInfo && status !== "done" && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 10,
                  color: "#53d4a0",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  textAlign: "center",
                }}
              >
                MP4: {videoInfo}
              </div>
            )}

            {videoURL && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <video
                  src={videoURL}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    maxWidth: 270,
                    borderRadius: 12,
                    border: "0.5px solid rgba(255,255,255,0.1)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
