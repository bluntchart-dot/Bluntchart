/**
 * Moon Phase Artwork — shared composition module.
 * Implements the approved v6 design as reusable rendering functions.
 * Client-only (uses DOM Canvas + Three.js WebGL).
 */

import * as THREE from "three";
import { createMoonScene, postProcessPremium } from "@/lib/moon-renderer";
import type { CompatibilityResult } from "@/lib/moon-phase";

export const MASTER_W = 2400;
export const MASTER_H = 3000;
export const MOON_SMALL = 440;
export const MOON_BIG = 960;
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

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  centerY?: number
) {
  const cy = centerY ?? h * 0.5;
  const bg = ctx.createRadialGradient(w / 2, cy, 80, w / 2, cy, w * 0.9);
  bg.addColorStop(0, "#0a0d1a");
  bg.addColorStop(0.45, "#060910");
  bg.addColorStop(1, "#030508");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
}

export function drawStarField(
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

export function renderMoon(
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

export function renderCombinedMoon(
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

export interface ComposeInput {
  name1: string;
  date1: string;
  name2: string;
  date2: string;
  serif: string;
  sans: string;
  contentLine: string;
}

export function composeMaster(
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
  combinedMoon: HTMLCanvasElement,
  compat: CompatibilityResult,
  input: ComposeInput
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = MASTER_W;
  canvas.height = MASTER_H;
  const ctx = canvas.getContext("2d")!;

  const { name1, name2, date1, date2, serif, sans, contentLine } = input;
  const W = MASTER_W;
  const H = MASTER_H;

  const smallGap = 260;
  const m1x = W / 2 - smallGap / 2 - MOON_SMALL / 2;
  const m2x = W / 2 + smallGap / 2 + MOON_SMALL / 2;
  const smallY = 560;
  const bigY = 1550;

  // Background
  const bg = ctx.createRadialGradient(
    W / 2, bigY - 100, 80,
    W / 2, bigY - 100, W * 0.9
  );
  bg.addColorStop(0, "#0a0d1a");
  bg.addColorStop(0.45, "#060910");
  bg.addColorStop(1, "#030508");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Stars
  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: m1x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: m2x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: W / 2, y: bigY, r: MOON_BIG / 2 + 60 },
    { x: W / 2, y: bigY + MOON_BIG / 2 + 260, r: 400 },
  ]);

  // Border
  ctx.strokeStyle = "rgba(220, 190, 100, 0.42)";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    BORDER_INSET, BORDER_INSET,
    W - BORDER_INSET * 2, H - BORDER_INSET * 2
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Eyebrow
  ctx.font = `500 48px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.78)";
  ctx.letterSpacing = "18px";
  ctx.fillText("OUR MOONS", W / 2 + 9, 190);
  ctx.letterSpacing = "0px";

  // Glow — individual moons
  drawMoonGlow(ctx, moon1, m1x, smallY, MOON_SMALL, 12, 0.35);
  drawMoonGlow(ctx, moon2, m2x, smallY, MOON_SMALL, 12, 0.35);

  // Individual moons
  ctx.drawImage(moon1, m1x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);
  ctx.drawImage(moon2, m2x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);

  // Names
  const nameY = smallY + MOON_SMALL / 2 + 52;
  ctx.font = `600 96px ${serif}`;
  ctx.fillStyle = "#e8e3d8";
  ctx.letterSpacing = "6px";
  ctx.fillText(name1.toUpperCase(), m1x, nameY);
  ctx.fillText(name2.toUpperCase(), m2x, nameY);
  ctx.letterSpacing = "0px";

  // Dates
  const dateY = nameY + 86;
  ctx.font = `italic 300 30px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.55)";
  ctx.fillText(fmtDate(date1), m1x, dateY);
  ctx.fillText(fmtDate(date2), m2x, dateY);

  // Phase labels
  const phaseY = dateY + 42;
  ctx.font = `500 22px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.55)";
  ctx.letterSpacing = "3px";
  ctx.fillText(compat.person1.phaseName, m1x, phaseY);
  ctx.fillText(compat.person2.phaseName, m2x, phaseY);
  ctx.letterSpacing = "0px";

  // Connector
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

  // Glow — combined moon
  drawMoonGlow(ctx, combinedMoon, W / 2, bigY, MOON_BIG, 18, 0.45);

  // Combined moon
  ctx.drawImage(combinedMoon, W / 2 - MOON_BIG / 2, bigY - MOON_BIG / 2, MOON_BIG, MOON_BIG);

  // Score
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

  // "COMPATIBILITY"
  const compatY = scoreY + 290;
  ctx.font = `500 36px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.60)";
  ctx.letterSpacing = "16px";
  ctx.fillText("COMPATIBILITY", W / 2 + 8, compatY);
  ctx.letterSpacing = "0px";

  // Content line
  const contentY = compatY + 110;
  ctx.font = `italic 400 50px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.88)";
  ctx.fillText("“" + contentLine + "”", W / 2, contentY);

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  return canvas;
}
