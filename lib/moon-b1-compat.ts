/**
 * B1 — Astrology Compatibility
 * Two individual birth Moons + one large hero Moon.
 * Hero illumination = astrology compatibility %.
 * Simple starfield + half natal chart image at bottom.
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
  fmtLocation,
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
  person1Location?: string;
  person2Location?: string;
  skipGrain?: boolean;
}

function drawRandomStars(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  exclusions: { x: number; y: number; r: number }[]
) {
  const rand = createPRNG(seed + 888);

  function blocked(x: number, y: number): boolean {
    for (const z of exclusions) {
      const dx = x - z.x;
      const dy = y - z.y;
      if (dx * dx + dy * dy < z.r * z.r) return true;
    }
    return false;
  }

  for (let i = 0; i < 120; i++) {
    const x = 60 + rand() * (w - 120);
    const y = 60 + rand() * (h - 200);
    if (blocked(x, y)) continue;

    const sz = 0.4 + rand() * 1.2;
    const lum = 140 + rand() * 100;
    const a = 0.12 + rand() * 0.40;

    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${lum},${lum + 4},${lum + 10},${a})`;
    ctx.fill();
  }
}

export function composeB1(
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
  heroMoon: HTMLCanvasElement,
  input: B1Input,
  natalImg?: HTMLImageElement
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = MASTER_W;
  canvas.height = MASTER_H;
  const ctx = canvas.getContext("2d")!;

  const { name1, name2, date1, date2, serif, sans, contentLine, score,
          person1Location, person2Location } = input;
  const W = MASTER_W;
  const H = MASTER_H;

  const smallGap = 400;
  const m1x = W / 2 - smallGap / 2 - MOON_SMALL / 2;
  const m2x = W / 2 + smallGap / 2 + MOON_SMALL / 2;
  const smallY = 480;
  const bigY = 1560;

  drawBackground(ctx, W, H, bigY - 60);

  const seed = hashString(name1 + name2 + date1 + date2);
  const moonExclusions = [
    { x: m1x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: m2x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: W / 2, y: bigY, r: MOON_HERO_B1 / 2 + 60 },
    { x: W / 2, y: bigY + MOON_HERO_B1 / 2 + 200, r: 400 },
  ];

  drawStarField(ctx, W, H, seed, moonExclusions);
  drawRandomStars(ctx, W, H, seed, moonExclusions);

  // Half natal chart image from the bottom
  if (natalImg) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    const imgW = W * 0.85;
    const imgH = imgW * (natalImg.height / natalImg.width);
    const imgX = (W - imgW) / 2;
    const imgY = H - imgH + Math.round(imgH * 0.35);
    ctx.drawImage(natalImg, imgX, imgY, imgW, imgH);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

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
  const dateY = nameY + 110;
  ctx.font = `italic 300 36px ${sans}`;
  ctx.fillStyle = "rgba(200, 198, 192, 0.55)";
  ctx.fillText(fmtDate(date1), m1x, dateY);
  ctx.fillText(fmtDate(date2), m2x, dateY);

  // Location labels
  if (person1Location || person2Location) {
    const locY = dateY + 48;
    ctx.font = `500 22px ${sans}`;
    ctx.fillStyle = "rgba(218, 185, 90, 0.55)";
    ctx.letterSpacing = "3px";
    if (person1Location) ctx.fillText(fmtLocation(person1Location), m1x, locY);
    if (person2Location) ctx.fillText(fmtLocation(person2Location), m2x, locY);
    ctx.letterSpacing = "0px";
  }

  // Connector
  const connY = dateY + (person1Location || person2Location ? 90 : 60);
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

  // Text shadow for visibility over natal chart
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  // Score — golden (shifted 5% down)
  const scoreY = bigY + MOON_HERO_B1 / 2 + 50 + Math.round(H * 0.05);

  ctx.save();
  ctx.font = `700 200px ${serif}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.10)";
  ctx.filter = "blur(10px)";
  ctx.shadowBlur = 0;
  ctx.letterSpacing = "6px";
  ctx.fillText(score + "%", W / 2 + 3, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 3;
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

  // Clear shadow before brand/grain
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  if (!input.skipGrain) drawGrainOverlay(ctx, W, H, seed);

  return canvas;
}
