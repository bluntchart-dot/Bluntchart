/**
 * B2 — Astrology Match
 * Two large individual birth Moons as heroes.
 * Astrology compatibility % shown as text only (does not control illumination).
 * Names + % + relationship line.
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

export const MOON_LARGE_B2 = 880;

export interface B2Input {
  name1: string;
  date1: string;
  name2: string;
  date2: string;
  serif: string;
  sans: string;
  contentLine: string;
  score: number;
  person1PhaseName: string;
  person2PhaseName: string;
}

export function composeB2(
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
  input: B2Input
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = MASTER_W;
  canvas.height = MASTER_H;
  const ctx = canvas.getContext("2d")!;

  const { name1, name2, date1, date2, serif, sans, contentLine, score,
          person1PhaseName, person2PhaseName } = input;
  const W = MASTER_W;
  const H = MASTER_H;

  const m1x = 680;
  const m2x = W - 680;
  const moonY = 1080;

  // Background
  const bg = ctx.createRadialGradient(
    W / 2, moonY, 80,
    W / 2, moonY, W * 0.9
  );
  bg.addColorStop(0, "#0a0d1a");
  bg.addColorStop(0.45, "#060910");
  bg.addColorStop(1, "#030508");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Stars
  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: m1x, y: moonY, r: MOON_LARGE_B2 / 2 + 50 },
    { x: m2x, y: moonY, r: MOON_LARGE_B2 / 2 + 50 },
    { x: W / 2, y: moonY + MOON_LARGE_B2 / 2 + 300, r: 400 },
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

  // Names above moons
  ctx.font = `600 82px ${serif}`;
  ctx.fillStyle = "#e8e3d8";
  ctx.letterSpacing = "5px";
  ctx.fillText(name1.toUpperCase(), m1x, 220);
  ctx.fillText(name2.toUpperCase(), m2x, 220);
  ctx.letterSpacing = "0px";

  // Dates
  ctx.font = `italic 300 26px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.50)";
  ctx.fillText(fmtDate(date1), m1x, 320);
  ctx.fillText(fmtDate(date2), m2x, 320);

  // Glow — both moons
  drawMoonGlow(ctx, moon1, m1x, moonY, MOON_LARGE_B2, 18, 0.45);
  drawMoonGlow(ctx, moon2, m2x, moonY, MOON_LARGE_B2, 18, 0.45);

  // Moons
  ctx.drawImage(moon1, m1x - MOON_LARGE_B2 / 2, moonY - MOON_LARGE_B2 / 2, MOON_LARGE_B2, MOON_LARGE_B2);
  ctx.drawImage(moon2, m2x - MOON_LARGE_B2 / 2, moonY - MOON_LARGE_B2 / 2, MOON_LARGE_B2, MOON_LARGE_B2);

  // Phase labels below moons
  const phaseY = moonY + MOON_LARGE_B2 / 2 + 40;
  ctx.font = `500 22px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.55)";
  ctx.letterSpacing = "3px";
  ctx.fillText(person1PhaseName, m1x, phaseY);
  ctx.fillText(person2PhaseName, m2x, phaseY);
  ctx.letterSpacing = "0px";

  // Score
  const scoreY = phaseY + 100;

  ctx.save();
  ctx.font = `700 240px ${serif}`;
  ctx.fillStyle = "rgba(195, 200, 215, 0.10)";
  ctx.filter = "blur(10px)";
  ctx.letterSpacing = "6px";
  ctx.fillText(score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 240px ${serif}`;
  ctx.fillStyle = "#c5c9d8";
  ctx.letterSpacing = "6px";
  ctx.fillText(score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";

  // "COMPATIBILITY" label
  const labelY = scoreY + 290;
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
