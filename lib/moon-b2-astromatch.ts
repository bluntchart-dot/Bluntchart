/**
 * B2 — Astrology Match
 * Two big individual birth Moons in LANDSCAPE layout.
 * Astrology compatibility % displayed as text (no hero moon).
 */

import {
  type ComposeInput,
  hashString,
  drawBackground,
  drawStarField,
  drawBorder,
  drawGrainOverlay,
  drawMoonGlow,
  fmtDate,
} from "@/lib/moon-artwork";

export const B2_W = 3000;
export const B2_H = 2400;
export const MOON_B2 = 920;

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
  canvas.width = B2_W;
  canvas.height = B2_H;
  const ctx = canvas.getContext("2d")!;

  const {
    name1,
    name2,
    date1,
    date2,
    serif,
    sans,
    contentLine,
    score,
    person1PhaseName,
    person2PhaseName,
  } = input;
  const W = B2_W;
  const H = B2_H;

  const m1x = W / 2 - MOON_B2 / 2 - 80;
  const m2x = W / 2 + MOON_B2 / 2 + 80;
  const moonY = 900;

  drawBackground(ctx, W, H, moonY);

  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: m1x, y: moonY, r: MOON_B2 / 2 + 50 },
    { x: m2x, y: moonY, r: MOON_B2 / 2 + 50 },
    { x: W / 2, y: moonY + MOON_B2 / 2 + 240, r: 400 },
  ]);

  ctx.save();
  ctx.strokeStyle = "rgba(212, 168, 83, 0.18)";
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.moveTo(m1x + MOON_B2 / 2 + 20, moonY);
  ctx.lineTo(m2x - MOON_B2 / 2 - 20, moonY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  drawBorder(ctx, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.font = `600 80px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "4px";
  ctx.fillText(name1.toUpperCase(), m1x, 200);
  ctx.fillText(name2.toUpperCase(), m2x, 200);
  ctx.letterSpacing = "0px";

  ctx.font = `italic 300 28px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.50)";
  ctx.fillText(fmtDate(date1), m1x, 300);
  ctx.fillText(fmtDate(date2), m2x, 300);

  drawMoonGlow(ctx, moon1, m1x, moonY, MOON_B2, 22, 0.45);
  drawMoonGlow(ctx, moon2, m2x, moonY, MOON_B2, 22, 0.45);

  ctx.drawImage(
    moon1,
    m1x - MOON_B2 / 2,
    moonY - MOON_B2 / 2,
    MOON_B2,
    MOON_B2
  );
  ctx.drawImage(
    moon2,
    m2x - MOON_B2 / 2,
    moonY - MOON_B2 / 2,
    MOON_B2,
    MOON_B2
  );

  const phaseY = moonY + MOON_B2 / 2 + 30;
  ctx.font = `500 22px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.55)";
  ctx.letterSpacing = "4px";
  ctx.fillText(person1PhaseName, m1x, phaseY);
  ctx.fillText(person2PhaseName, m2x, phaseY);
  ctx.letterSpacing = "0px";

  const scoreY = phaseY + 60;

  ctx.save();
  ctx.font = `700 180px ${serif}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.10)";
  ctx.filter = "blur(10px)";
  ctx.letterSpacing = "6px";
  ctx.fillText(score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 180px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "6px";
  ctx.fillText(score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";

  const labelY = scoreY + 220;
  ctx.font = `500 30px ${sans}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.60)";
  ctx.letterSpacing = "14px";
  ctx.fillText("COMPATIBILITY", W / 2 + 7, labelY);
  ctx.letterSpacing = "0px";

  const contentY = labelY + 80;
  ctx.font = `italic 400 50px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.88)";
  ctx.fillText(`"${contentLine}"`, W / 2, contentY);

  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 90);

  drawGrainOverlay(ctx, W, H, seed);

  return canvas;
}
