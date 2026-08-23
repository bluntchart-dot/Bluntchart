/**
 * A2 — Moon Match
 * One large hero Moon whose illumination = Moon Match %.
 * No individual Moons. Names + % + relationship line.
 */

import type { CompatibilityResult } from "@/lib/moon-phase";
import {
  MASTER_W,
  MASTER_H,
  BORDER_INSET,
  type ComposeInput,
  hashString,
  drawStarField,
  drawMoonGlow,
  fmtDate,
} from "@/lib/moon-artwork";

export const MOON_HERO_A2 = 1400;

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
  const bg = ctx.createRadialGradient(
    W / 2, bigY - 60, 80,
    W / 2, bigY - 60, W * 0.9
  );
  bg.addColorStop(0, "#0a0d1a");
  bg.addColorStop(0.45, "#060910");
  bg.addColorStop(1, "#030508");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Stars
  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: W / 2, y: bigY, r: MOON_HERO_A2 / 2 + 60 },
    { x: W / 2, y: 240, r: 300 },
    { x: W / 2, y: bigY + MOON_HERO_A2 / 2 + 200, r: 400 },
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

  // Names
  ctx.font = `600 80px ${serif}`;
  ctx.fillStyle = "#e8e3d8";
  ctx.letterSpacing = "5px";
  const nameStr = name1.toUpperCase() + "  &  " + name2.toUpperCase();
  ctx.fillText(nameStr, W / 2, 200);
  ctx.letterSpacing = "0px";

  // Dates
  ctx.font = `italic 300 28px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.50)";
  ctx.fillText(fmtDate(date1) + "   ·   " + fmtDate(date2), W / 2, 300);

  // Glow — hero moon
  drawMoonGlow(ctx, heroMoon, W / 2, bigY, MOON_HERO_A2, 24, 0.5);

  // Hero moon
  ctx.drawImage(heroMoon, W / 2 - MOON_HERO_A2 / 2, bigY - MOON_HERO_A2 / 2, MOON_HERO_A2, MOON_HERO_A2);

  // Score
  const scoreY = bigY + MOON_HERO_A2 / 2 + 70;

  ctx.save();
  ctx.font = `700 280px ${serif}`;
  ctx.fillStyle = "rgba(195, 200, 215, 0.10)";
  ctx.filter = "blur(10px)";
  ctx.letterSpacing = "8px";
  ctx.fillText(compat.score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 280px ${serif}`;
  ctx.fillStyle = "#c5c9d8";
  ctx.letterSpacing = "8px";
  ctx.fillText(compat.score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";

  // Relationship line
  const contentY = scoreY + 340;
  ctx.font = `italic 400 58px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.88)";
  ctx.fillText(`“${contentLine}”`, W / 2, contentY);

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  return canvas;
}
