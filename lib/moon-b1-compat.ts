/**
 * B1 — Astrology Compatibility
 * Two individual birth Moons + one large hero Moon.
 * Hero illumination = astrology compatibility %.
 * Names + % + relationship line.
 */

import {
  MASTER_W,
  MASTER_H,
  MOON_SMALL,
  type ComposeInput,
  hashString,
  drawBackground,
  drawStarField,
  drawBorder,
  drawGrainOverlay,
  drawMoonGlow,
  fmtDate,
  createPRNG,
} from "@/lib/moon-artwork";

export const MOON_HERO_B1 = 1200;

export interface B1Input {
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

export function composeB1(
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
  heroMoon: HTMLCanvasElement,
  input: B1Input
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = MASTER_W;
  canvas.height = MASTER_H;
  const ctx = canvas.getContext("2d")!;

  const { name1, name2, date1, date2, serif, sans, contentLine, score,
          person1PhaseName, person2PhaseName } = input;
  const W = MASTER_W;
  const H = MASTER_H;

  const smallGap = 260;
  const m1x = W / 2 - smallGap / 2 - MOON_SMALL / 2;
  const m2x = W / 2 + smallGap / 2 + MOON_SMALL / 2;
  const smallY = 480;
  const bigY = 1560;

  // Background
  drawBackground(ctx, W, H, bigY - 60);

  // Stars
  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: m1x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: m2x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: W / 2, y: bigY, r: MOON_HERO_B1 / 2 + 60 },
    { x: W / 2, y: bigY + MOON_HERO_B1 / 2 + 200, r: 400 },
  ]);

  // Constellation lines
  const rand = createPRNG(seed + 77);
  ctx.save();
  ctx.strokeStyle = "rgba(200, 200, 220, 0.06)";
  ctx.lineWidth = 1;
  const starPoints: [number, number][] = [];
  for (let i = 0; i < 8; i++) {
    starPoints.push([
      W * 0.15 + rand() * W * 0.7,
      bigY - MOON_HERO_B1 * 0.4 + rand() * MOON_HERO_B1 * 0.8,
    ]);
  }
  for (let i = 0; i < starPoints.length - 1; i++) {
    if (rand() > 0.45) continue;
    ctx.beginPath();
    ctx.moveTo(starPoints[i][0], starPoints[i][1]);
    ctx.lineTo(starPoints[i + 1][0], starPoints[i + 1][1]);
    ctx.stroke();
  }
  for (const [sx, sy] of starPoints) {
    ctx.beginPath();
    ctx.arc(sx, sy, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(200, 200, 220, 0.12)";
    ctx.fill();
  }
  ctx.restore();

  // Border
  drawBorder(ctx, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Glow — individual moons
  drawMoonGlow(ctx, moon1, m1x, smallY, MOON_SMALL, 12, 0.35);
  drawMoonGlow(ctx, moon2, m2x, smallY, MOON_SMALL, 12, 0.35);

  // Individual moons
  ctx.drawImage(moon1, m1x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);
  ctx.drawImage(moon2, m2x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);

  // Names
  const nameY = smallY + MOON_SMALL / 2 + 44;
  ctx.font = `600 88px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "5px";
  ctx.fillText(name1.toUpperCase(), m1x, nameY);
  ctx.fillText(name2.toUpperCase(), m2x, nameY);
  ctx.letterSpacing = "0px";

  // Dates
  const dateY = nameY + 78;
  ctx.font = `italic 300 28px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.55)";
  ctx.fillText(fmtDate(date1), m1x, dateY);
  ctx.fillText(fmtDate(date2), m2x, dateY);

  // Phase labels
  const phaseY = dateY + 38;
  ctx.font = `500 20px ${sans}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.55)";
  ctx.letterSpacing = "3px";
  ctx.fillText(person1PhaseName, m1x, phaseY);
  ctx.fillText(person2PhaseName, m2x, phaseY);
  ctx.letterSpacing = "0px";

  // Connector
  const connY = phaseY + 48;
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

  // Glow — hero moon
  drawMoonGlow(ctx, heroMoon, W / 2, bigY, MOON_HERO_B1, 20, 0.5);

  // Hero moon
  ctx.drawImage(heroMoon, W / 2 - MOON_HERO_B1 / 2, bigY - MOON_HERO_B1 / 2, MOON_HERO_B1, MOON_HERO_B1);

  // Score — golden
  const scoreY = bigY + MOON_HERO_B1 / 2 + 50;

  ctx.save();
  ctx.font = `700 200px ${serif}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.10)";
  ctx.filter = "blur(10px)";
  ctx.letterSpacing = "6px";
  ctx.fillText(score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.font = `700 200px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "6px";
  ctx.fillText(score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";

  // "COMPATIBILITY" label
  const labelY = scoreY + 240;
  ctx.font = `500 32px ${sans}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.60)";
  ctx.letterSpacing = "14px";
  ctx.fillText("COMPATIBILITY", W / 2 + 7, labelY);
  ctx.letterSpacing = "0px";

  // Relationship line
  const contentY = labelY + 90;
  ctx.font = `italic 400 54px ${serif}`;
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
