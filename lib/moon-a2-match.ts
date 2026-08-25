/**
 * A2 — Moon Match
 * One large hero Moon whose illumination = Moon Match %.
 * No individual Moons. Names + % + relationship line.
 */

import type { CompatibilityResult } from "@/lib/moon-phase";
import {
  MASTER_W,
  MASTER_H,
  type ComposeInput,
  hashString,
  drawBackground,
  drawStarField,
  drawBorder,
  drawGrainOverlay,
  drawMoonGlow,
  fmtDate,
} from "@/lib/moon-artwork";

export const MOON_HERO_A2 = 1650;

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
  const bigY = 1300;

  // Background
  drawBackground(ctx, W, H, bigY - 60);

  // Stars
  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: W / 2, y: bigY, r: MOON_HERO_A2 / 2 + 60 },
    { x: W / 2, y: 240, r: 300 },
    { x: W / 2, y: bigY + MOON_HERO_A2 / 2 + 200, r: 400 },
  ]);

  // Border
  drawBorder(ctx, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Names — larger, golden
  ctx.font = `600 100px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "6px";
  const nameStr = name1.toUpperCase() + "  &  " + name2.toUpperCase();
  ctx.fillText(nameStr, W / 2, 180);
  ctx.letterSpacing = "0px";

  // Dates — larger
  ctx.font = `italic 300 36px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.50)";
  ctx.fillText(fmtDate(date1) + "   ·   " + fmtDate(date2), W / 2, 300);

  // Glow — hero moon
  drawMoonGlow(ctx, heroMoon, W / 2, bigY, MOON_HERO_A2, 28, 0.5);

  // Hero moon
  ctx.drawImage(heroMoon, W / 2 - MOON_HERO_A2 / 2, bigY - MOON_HERO_A2 / 2, MOON_HERO_A2, MOON_HERO_A2);

  // Score — golden with glow
  const scoreY = bigY + MOON_HERO_A2 / 2 + 70;

  ctx.save();
  ctx.font = `700 320px ${serif}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.12)";
  ctx.filter = "blur(12px)";
  ctx.letterSpacing = "8px";
  ctx.fillText(compat.score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 320px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "8px";
  ctx.fillText(compat.score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";

  // Golden arc divider under percentage
  const arcY = scoreY + 380;
  ctx.save();
  ctx.strokeStyle = "rgba(212, 168, 83, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W / 2, arcY + 80, 120, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.restore();

  // Relationship line
  const contentY = arcY + 40;
  ctx.font = `italic 400 58px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.88)";
  ctx.fillText(`"${contentLine}"`, W / 2, contentY);

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  // Grain overlay
  drawGrainOverlay(ctx, W, H, seed);

  return canvas;
}
