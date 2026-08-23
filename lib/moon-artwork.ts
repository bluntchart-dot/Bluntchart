/**
 * Moon Phase Artwork — shared rendering utilities.
 * Low-level functions used by all moon products (A1/A2/B1/B2).
 * Client-only (uses DOM Canvas + Three.js WebGL).
 */

import * as THREE from "three";
import { createMoonScene, postProcessPremium } from "@/lib/moon-renderer";

export const MASTER_W = 2400;
export const MASTER_H = 3000;
export const MOON_SMALL = 440;
const BORDER_INSET = 38;

export { BORDER_INSET };

export interface ComposeInput {
  name1: string;
  date1: string;
  name2: string;
  date2: string;
  serif: string;
  sans: string;
  contentLine: string;
}

export function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function hashString(str: string): number {
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

export function drawMoonGlow(
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
  displacementMap: THREE.Texture,
  opts?: { earthshineIntensity?: number }
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
    earthshineIntensity: opts?.earthshineIntensity,
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

export function fmtDate(d: string): string {
  return new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function scoreToPhaseAngle(score: number): number {
  const illum = Math.max(0, Math.min(100, score)) / 100;
  const cosA = Math.max(-1, Math.min(1, 1 - 2 * illum));
  return Math.acos(cosA) * (180 / Math.PI);
}

export function blendBirthMoons(
  phaseAngle1: number,
  phaseAngle2: number,
  renderSize: number,
  colorMap: THREE.Texture,
  displacementMap: THREE.Texture
): HTMLCanvasElement {
  const es = { earthshineIntensity: 0.01 };
  const c1 = renderMoon(phaseAngle1, renderSize, colorMap, displacementMap, es);
  const c2 = renderMoon(phaseAngle2, renderSize, colorMap, displacementMap, es);

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
