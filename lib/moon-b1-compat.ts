/**
 * B1 — Astrology Compatibility
 * One large hero Moon whose illumination = astrology compatibility %.
 * Same visual treatment as A2 but score comes from astrology engine.
 * Names + % + relationship line.
 */

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

export const MOON_HERO_B1 = 1400;

export interface B1Input {
  name1: string;
  date1: string;
  name2: string;
  date2: string;
  serif: string;
  sans: string;
  contentLine: string;
  score: number;
}

export function composeB1(
  heroMoon: HTMLCanvasElement,
  input: B1Input
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = MASTER_W;
  canvas.height = MASTER_H;
  const ctx = canvas.getContext("2d")!;

  const { name1, name2, date1, date2, serif, sans, contentLine, score } = input;
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
    { x: W / 2, y: bigY, r: MOON_HERO_B1 / 2 + 60 },
    { x: W / 2, y: 240, r: 300 },
    { x: W / 2, y: bigY + MOON_HERO_B1 / 2 + 200, r: 400 },
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
  ctx.fillText(name1.toUpperCase() + "  &  " + name2.toUpperCase(), W / 2, 200);
  ctx.letterSpacing = "0px";

  // Dates
  ctx.font = `italic 300 28px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.50)";
  ctx.fillText(fmtDate(date1) + "   ·   " + fmtDate(date2), W / 2, 300);

  // Glow — hero moon
  drawMoonGlow(ctx, heroMoon, W / 2, bigY, MOON_HERO_B1, 24, 0.5);

  // Hero moon
  ctx.drawImage(heroMoon, W / 2 - MOON_HERO_B1 / 2, bigY - MOON_HERO_B1 / 2, MOON_HERO_B1, MOON_HERO_B1);

  // Score
  const scoreY = bigY + MOON_HERO_B1 / 2 + 70;

  ctx.save();
  ctx.font = `700 280px ${serif}`;
  ctx.fillStyle = "rgba(195, 200, 215, 0.10)";
  ctx.filter = "blur(10px)";
  ctx.letterSpacing = "8px";
  ctx.fillText(score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 280px ${serif}`;
  ctx.fillStyle = "#c5c9d8";
  ctx.letterSpacing = "8px";
  ctx.fillText(score + "%", W / 2 + 4, scoreY);
  ctx.letterSpacing = "0px";

  // "COMPATIBILITY" label
  const labelY = scoreY + 330;
  ctx.font = `500 32px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.55)";
  ctx.letterSpacing = "14px";
  ctx.fillText("COMPATIBILITY", W / 2 + 7, labelY);
  ctx.letterSpacing = "0px";

  // Relationship line
  const contentY = labelY + 90;
  ctx.font = `italic 400 54px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.88)";
  ctx.fillText(`“${contentLine}”`, W / 2, contentY);

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  return canvas;
}
