"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { createMoonScene, postProcessPremium } from "@/lib/moon-renderer";
import { calculateCompatibility } from "@/lib/moon-phase";

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

const SAMPLE = {
  name1: "Olivia",
  date1: "1997-02-01",
  name2: "Ethan",
  date2: "1995-01-07",
};

const W = 2400;
const H = 3000;
const MOON_SMALL = 440;
const MOON_BIG = 960;
const BORDER_INSET = 38;

function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function drawStarField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  exclusions: { x: number; y: number; r: number }[]
) {
  const rand = createPRNG(seed);

  function blocked(x: number, y: number): boolean {
    for (const z of exclusions) {
      const dx = x - z.x;
      const dy = y - z.y;
      if (dx * dx + dy * dy < z.r * z.r) return true;
    }
    return false;
  }

  for (let i = 0; i < 400; i++) {
    const x = rand() * w;
    const y = rand() * h;
    if (blocked(x, y)) continue;

    const bright = rand() < 0.04;
    const sz = bright ? 1.5 + rand() * 1.5 : 0.4 + rand() * 1.0;
    const lum = bright ? 160 + rand() * 80 : 40 + rand() * 100;
    const a = bright ? 0.5 + rand() * 0.4 : 0.15 + rand() * 0.45;

    if (bright) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, sz * 4);
      g.addColorStop(0, `rgba(${lum},${lum + 8},${lum + 16},${a * 0.35})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - sz * 4, y - sz * 4, sz * 8, sz * 8);
    }

    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${lum},${lum + 5},${lum + 12},${a})`;
    ctx.fill();
  }
}

function drawMoonGlow(
  ctx: CanvasRenderingContext2D,
  moonCanvas: HTMLCanvasElement,
  cx: number,
  cy: number,
  displaySize: number,
  blurRadius: number,
  opacity: number
) {
  const sw = moonCanvas.width;
  const sh = moonCanvas.height;

  const mask = document.createElement("canvas");
  mask.width = sw;
  mask.height = sh;
  const mctx = mask.getContext("2d")!;
  mctx.drawImage(moonCanvas, 0, 0);

  const imgData = mctx.getImageData(0, 0, sw, sh);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
    if (lum > 20) {
      const t = Math.min(1, (lum - 20) / 160);
      d[i] = Math.round(240 * t);
      d[i + 1] = Math.round(212 * t);
      d[i + 2] = Math.round(148 * t);
      d[i + 3] = Math.round(255 * t * 0.7);
    } else {
      d[i + 3] = 0;
    }
  }
  mctx.putImageData(imgData, 0, 0);

  const spread = blurRadius * 1.0;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.filter = `blur(${blurRadius}px)`;
  ctx.drawImage(
    mask,
    cx - displaySize / 2 - spread,
    cy - displaySize / 2 - spread,
    displaySize + spread * 2,
    displaySize + spread * 2
  );
  ctx.restore();
}

function renderMoon(
  phaseAngle: number,
  renderSize: number,
  colorMap: THREE.Texture,
  displacementMap: THREE.Texture
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(renderSize, renderSize);
  renderer.setPixelRatio(2);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = createMoonScene({
    phaseAngle,
    size: renderSize,
    premium: true,
  });

  (scene.material as THREE.MeshStandardMaterial).map = colorMap;
  (scene.material as THREE.MeshStandardMaterial).bumpMap = displacementMap;
  (scene.material as THREE.MeshStandardMaterial).displacementMap =
    displacementMap;
  (scene.material as THREE.MeshStandardMaterial).needsUpdate = true;

  renderer.render(scene.scene, scene.camera);
  const processed = postProcessPremium(canvas);

  scene.material.dispose();
  renderer.dispose();

  return processed;
}

function renderCombinedMoon(
  angle1: number,
  angle2: number,
  renderSize: number,
  colorMap: THREE.Texture,
  displacementMap: THREE.Texture
): HTMLCanvasElement {
  const c1 = renderMoon(angle1, renderSize, colorMap, displacementMap);
  const c2 = renderMoon(angle2, renderSize, colorMap, displacementMap);

  const w = c1.width;
  const h = c1.height;
  const ctx1 = c1.getContext("2d")!;
  const ctx2 = c2.getContext("2d")!;
  const d1 = ctx1.getImageData(0, 0, w, h);
  const d2 = ctx2.getImageData(0, 0, w, h);

  const out = ctx1.createImageData(w, h);
  for (let i = 0; i < d1.data.length; i += 4) {
    const b1 = d1.data[i] + d1.data[i + 1] + d1.data[i + 2];
    const b2 = d2.data[i] + d2.data[i + 1] + d2.data[i + 2];
    if (b1 >= b2) {
      out.data[i] = d1.data[i];
      out.data[i + 1] = d1.data[i + 1];
      out.data[i + 2] = d1.data[i + 2];
    } else {
      out.data[i] = d2.data[i];
      out.data[i + 1] = d2.data[i + 1];
      out.data[i + 2] = d2.data[i + 2];
    }
    out.data[i + 3] = Math.max(d1.data[i + 3], d2.data[i + 3]);
  }

  const result = document.createElement("canvas");
  result.width = w;
  result.height = h;
  result.getContext("2d")!.putImageData(out, 0, 0);
  return result;
}

function fmtDate(d: string): string {
  return new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function compose(
  ctx: CanvasRenderingContext2D,
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
  combinedMoon: HTMLCanvasElement,
  compat: ReturnType<typeof calculateCompatibility>,
  name1: string,
  name2: string,
  date1: string,
  date2: string,
  serif: string,
  sans: string
) {
  // ── Layout ──
  const smallGap = 260;
  const m1x = W / 2 - smallGap / 2 - MOON_SMALL / 2;
  const m2x = W / 2 + smallGap / 2 + MOON_SMALL / 2;
  const smallY = 560;
  const bigY = 1550;

  // ── Background ──
  const bg = ctx.createRadialGradient(
    W / 2, bigY - 100, 80,
    W / 2, bigY - 100, W * 0.9
  );
  bg.addColorStop(0, "#0a0d1a");
  bg.addColorStop(0.45, "#060910");
  bg.addColorStop(1, "#030508");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Stars ──
  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: m1x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: m2x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: W / 2, y: bigY, r: MOON_BIG / 2 + 60 },
    { x: W / 2, y: bigY + MOON_BIG / 2 + 260, r: 400 },
  ]);

  // ── Border — thicker, brighter champagne ──
  ctx.strokeStyle = "rgba(220, 190, 100, 0.42)";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    BORDER_INSET,
    BORDER_INSET,
    W - BORDER_INSET * 2,
    H - BORDER_INSET * 2
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // ── Eyebrow ──
  ctx.font = `500 48px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.78)";
  ctx.letterSpacing = "18px";
  ctx.fillText("OUR MOONS", W / 2 + 9, 190);
  ctx.letterSpacing = "0px";

  // ── Glow — tight, close to moon edge ──
  drawMoonGlow(ctx, moon1, m1x, smallY, MOON_SMALL, 12, 0.35);
  drawMoonGlow(ctx, moon2, m2x, smallY, MOON_SMALL, 12, 0.35);

  // ── Individual moons ──
  ctx.drawImage(
    moon1,
    m1x - MOON_SMALL / 2,
    smallY - MOON_SMALL / 2,
    MOON_SMALL,
    MOON_SMALL
  );
  ctx.drawImage(
    moon2,
    m2x - MOON_SMALL / 2,
    smallY - MOON_SMALL / 2,
    MOON_SMALL,
    MOON_SMALL
  );

  // ── Names ──
  const nameY = smallY + MOON_SMALL / 2 + 52;
  ctx.font = `600 96px ${serif}`;
  ctx.fillStyle = "#e8e3d8";
  ctx.letterSpacing = "6px";
  ctx.fillText(name1.toUpperCase(), m1x, nameY);
  ctx.fillText(name2.toUpperCase(), m2x, nameY);
  ctx.letterSpacing = "0px";

  // ── Dates — smaller, title case, italic sans ──
  const dateY = nameY + 86;
  ctx.font = `italic 300 30px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.55)";
  ctx.fillText(fmtDate(date1), m1x, dateY);
  ctx.fillText(fmtDate(date2), m2x, dateY);

  // ── Phase labels — smaller, title case ──
  const phaseY = dateY + 42;
  ctx.font = `500 22px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.55)";
  ctx.letterSpacing = "3px";
  ctx.fillText(compat.person1.phaseName, m1x, phaseY);
  ctx.fillText(compat.person2.phaseName, m2x, phaseY);
  ctx.letterSpacing = "0px";

  // ── Connector ──
  const connY = phaseY + 54;
  ctx.strokeStyle = "rgba(218, 185, 90, 0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 80, connY);
  ctx.lineTo(W / 2 - 11, connY);
  ctx.moveTo(W / 2 + 11, connY);
  ctx.lineTo(W / 2 + 80, connY);
  ctx.stroke();

  ctx.fillStyle = "rgba(218, 185, 90, 0.35)";
  ctx.save();
  ctx.translate(W / 2, connY);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-5.5, -5.5, 11, 11);
  ctx.restore();

  // ── Glow — combined moon, tight treatment ──
  drawMoonGlow(ctx, combinedMoon, W / 2, bigY, MOON_BIG, 18, 0.45);

  // ── Combined moon (hero) ──
  ctx.drawImage(
    combinedMoon,
    W / 2 - MOON_BIG / 2,
    bigY - MOON_BIG / 2,
    MOON_BIG,
    MOON_BIG
  );

  // ── Score — deliberate reveal with breathing room ──
  const scoreY = bigY + MOON_BIG / 2 + 110;

  ctx.save();
  ctx.font = `700 240px ${serif}`;
  ctx.fillStyle = "rgba(195, 200, 215, 0.12)";
  ctx.filter = "blur(10px)";
  ctx.letterSpacing = "6px";
  ctx.fillText(compat.score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 240px ${serif}`;
  ctx.fillStyle = "#c5c9d8";
  ctx.letterSpacing = "6px";
  ctx.fillText(compat.score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";

  // ── "COMPATIBILITY" — generous gap after score ──
  const compatY = scoreY + 290;
  ctx.font = `500 36px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.60)";
  ctx.letterSpacing = "16px";
  ctx.fillText("COMPATIBILITY", W / 2 + 8, compatY);
  ctx.letterSpacing = "0px";

  // ── Content line — breathing room ──
  const contentY = compatY + 110;
  ctx.font = `italic 400 50px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.88)";
  ctx.fillText("“Different rhythms. Same pull.”", W / 2, contentY);

  // ── Brand signature ──
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);
}

export default function ArtworkPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const compat = calculateCompatibility(SAMPLE.date1, SAMPLE.date2);
    setInfo(
      `${SAMPLE.name1} (${compat.person1.phaseName}) × ${SAMPLE.name2} (${compat.person2.phaseName}) — ${compat.score}%`
    );

    const loader = new THREE.TextureLoader();
    let loadedCount = 0;
    let colorMap: THREE.Texture;
    let displacementMap: THREE.Texture;

    function onLoaded() {
      loadedCount++;
      if (loadedCount < 2) return;

      document.fonts.ready.then(() => {
        const serif = cormorant.style.fontFamily;
        const sans = dmSans.style.fontFamily;

        const m1 = renderMoon(
          compat.person1.phaseAngle,
          MOON_SMALL,
          colorMap,
          displacementMap
        );
        const m2 = renderMoon(
          compat.person2.phaseAngle,
          MOON_SMALL,
          colorMap,
          displacementMap
        );
        const combined = renderCombinedMoon(
          compat.person1.phaseAngle,
          compat.person2.phaseAngle,
          MOON_BIG,
          colorMap,
          displacementMap
        );

        const canvas = canvasRef.current!;
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d")!;

        compose(
          ctx,
          m1,
          m2,
          combined,
          compat,
          SAMPLE.name1,
          SAMPLE.name2,
          SAMPLE.date1,
          SAMPLE.date2,
          serif,
          sans
        );

        setLoading(false);
        colorMap.dispose();
        displacementMap.dispose();
      });
    }

    colorMap = loader.load("/moon-textures/color-2k.jpg", onLoaded);
    colorMap.colorSpace = THREE.SRGBColorSpace;
    displacementMap = loader.load(
      "/moon-textures/displacement-2k.png",
      onLoaded
    );
  }, []);

  const handleSave = async () => {
    const c = canvasRef.current;
    if (!c) return;
    const dataURL = c.toDataURL("image/png");
    await fetch("/api/internal/save-moon-png", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "artwork-v6", dataURL }),
    });
  };

  return (
    <div
      className={`${cormorant.className} ${dmSans.className}`}
      style={s.page}
    >
      <div style={s.header}>
        <div style={s.eyebrow}>Stage 3 &middot; v6</div>
        <h1 style={s.title}>Artwork Preview</h1>
        {info && <p style={s.subtitle}>{info}</p>}
      </div>

      <div style={s.canvasWrap}>
        {loading && <div style={s.loading}>Composing artwork&hellip;</div>}
        <canvas
          ref={canvasRef}
          style={{ ...s.canvas, opacity: loading ? 0 : 1 }}
        />
      </div>

      {!loading && (
        <div style={s.actions}>
          <button onClick={handleSave} style={s.btn}>
            Save PNG to Server
          </button>
        </div>
      )}

      <div style={s.credit}>
        Lunar surface: NASA/GSFC/ASU (LROC) &middot; Elevation: NASA/GSFC/MIT
        (LOLA)
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0c12",
    color: "#d4d8e4",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "40px 20px 60px",
  },
  header: {
    maxWidth: 600,
    margin: "0 auto 24px",
    textAlign: "center",
  },
  eyebrow: {
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#c9a84c",
    marginBottom: 8,
  },
  title: {
    fontFamily: "Georgia, Cambria, serif",
    fontSize: 24,
    fontWeight: 400,
    marginBottom: 6,
  },
  subtitle: { color: "#7a8099", fontSize: 13 },
  canvasWrap: {
    maxWidth: 600,
    margin: "0 auto",
    position: "relative" as const,
    aspectRatio: "4 / 5",
  },
  loading: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#7a8099",
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 13,
  },
  canvas: {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: 4,
    transition: "opacity 0.3s",
  },
  actions: {
    maxWidth: 600,
    margin: "16px auto 0",
    textAlign: "center" as const,
  },
  btn: {
    background: "rgba(201, 168, 76, 0.12)",
    color: "#c9a84c",
    border: "1px solid rgba(201, 168, 76, 0.25)",
    borderRadius: 4,
    padding: "10px 24px",
    fontSize: 13,
    fontFamily: "Consolas, Menlo, monospace",
    cursor: "pointer",
  },
  credit: {
    maxWidth: 600,
    margin: "24px auto 0",
    textAlign: "center" as const,
    fontSize: 10,
    color: "#515672",
    fontFamily: "Consolas, Menlo, monospace",
  },
};
