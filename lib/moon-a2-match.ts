/**
 * A2 — Moon Match
 * One large hero Moon whose illumination = Moon Match %.
 * No individual Moons. Names + % + relationship line.
 * Sparse stars + one shooting star.
 */

import type { CompatibilityResult } from "@/lib/moon-phase";
import {
  MASTER_W,
  MASTER_H,
  type ComposeInput,
  hashString,
  drawBackground,
  drawBorder,
  drawGrainOverlay,
  drawMoonGlow,
  fmtDate,
  createPRNG,
} from "@/lib/moon-artwork";

export const MOON_HERO_A2 = 1815;

function drawSparseStars(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  exclusions: { x: number; y: number; r: number }[]
) {
  const rand = createPRNG(seed + 200);

  function blocked(x: number, y: number): boolean {
    for (const z of exclusions) {
      const dx = x - z.x;
      const dy = y - z.y;
      if (dx * dx + dy * dy < z.r * z.r) return true;
    }
    return false;
  }

  for (let i = 0; i < 50; i++) {
    const x = rand() * w;
    const y = rand() * h;
    if (blocked(x, y)) continue;

    const sz = 0.5 + rand() * 1.2;
    const lum = 80 + rand() * 100;
    const a = 0.12 + rand() * 0.30;

    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${lum},${lum + 5},${lum + 12},${a})`;
    ctx.fill();
  }

  // 6 brighter accent stars
  for (let i = 0; i < 6; i++) {
    let x: number, y: number;
    do {
      x = rand() * w;
      y = rand() * h;
    } while (blocked(x, y));
    const sz = 1.5 + rand() * 1.5;
    const lum = 180 + rand() * 60;
    const a = 0.5 + rand() * 0.35;
    // Glow
    const g = ctx.createRadialGradient(x, y, 0, x, y, sz * 4);
    g.addColorStop(0, `rgba(${lum},${lum + 8},${lum + 16},${a * 0.3})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - sz * 4, y - sz * 4, sz * 8, sz * 8);
    // Core
    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${lum},${lum + 5},${lum + 12},${a})`;
    ctx.fill();
  }
}

function drawShootingStar(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number
) {
  const rand = createPRNG(seed + 333);
  // Place shooting star on the left or right side, away from the moon
  const side = rand() > 0.5 ? 1 : 0;
  const startX = side ? w * 0.7 + rand() * w * 0.2 : w * 0.05 + rand() * w * 0.2;
  const startY = h * 0.03 + rand() * h * 0.12;
  const angle = Math.PI * 0.15 + rand() * Math.PI * 0.1;
  const len = 180 + rand() * 120;

  const endX = startX + Math.cos(angle) * len;
  const endY = startY + Math.sin(angle) * len;

  const grad = ctx.createLinearGradient(startX, startY, endX, endY);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.0)");
  grad.addColorStop(0.3, "rgba(255, 252, 240, 0.55)");
  grad.addColorStop(1, "rgba(255, 252, 240, 0.0)");

  ctx.save();
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Bright head
  ctx.beginPath();
  ctx.arc(endX - Math.cos(angle) * 3, endY - Math.sin(angle) * 3, 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 252, 240, 0.5)";
  ctx.fill();
  ctx.restore();
}

export function composeA2(
  heroMoon: HTMLCanvasElement,
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
  const bigY = 1350;

  drawBackground(ctx, W, H, bigY - 60);

  const seed = hashString(name1 + name2 + date1 + date2);

  // Sparse stars + shooting star
  drawSparseStars(ctx, W, H, seed, [
    { x: W / 2, y: bigY, r: MOON_HERO_A2 / 2 + 60 },
    { x: W / 2, y: 240, r: 300 },
    { x: W / 2, y: bigY + MOON_HERO_A2 / 2 + 200, r: 400 },
  ]);
  drawShootingStar(ctx, W, H, seed);

  drawBorder(ctx, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Names — larger, golden
  ctx.font = `600 112px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "6px";
  const nameStr = name1.toUpperCase() + "  &  " + name2.toUpperCase();
  ctx.fillText(nameStr, W / 2, 170);
  ctx.letterSpacing = "0px";

  // Dates
  ctx.font = `italic 300 47px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.50)";
  ctx.fillText(fmtDate(date1) + "   ·   " + fmtDate(date2), W / 2, 300);

  // Glow — hero moon
  drawMoonGlow(ctx, heroMoon, W / 2, bigY, MOON_HERO_A2, 28, 0.5);

  // Hero moon
  ctx.drawImage(heroMoon, W / 2 - MOON_HERO_A2 / 2, bigY - MOON_HERO_A2 / 2, MOON_HERO_A2, MOON_HERO_A2);

  // Score — reduced size
  const scoreY = bigY + MOON_HERO_A2 / 2 + 60;

  ctx.save();
  ctx.font = `700 270px ${serif}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.12)";
  ctx.filter = "blur(12px)";
  ctx.letterSpacing = "8px";
  ctx.fillText(compat.score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 270px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "8px";
  ctx.fillText(compat.score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";

  // Golden arc divider under percentage
  const arcY = scoreY + 330;
  ctx.save();
  ctx.strokeStyle = "rgba(212, 168, 83, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W / 2, arcY + 80, 120, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.restore();

  // Relationship line — larger for emotional payoff
  const contentY = arcY + 40;
  ctx.font = `italic 400 74px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.90)";
  ctx.fillText(`"${contentLine}"`, W / 2, contentY);

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  if (!input.skipGrain) drawGrainOverlay(ctx, W, H, seed);

  return canvas;
}
