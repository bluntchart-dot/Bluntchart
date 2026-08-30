/**
 * A1 — Soulmate Moon
 * Natural combination of two actual birth Moon phases.
 * Two supporting individual Moons + one large combined hero.
 * Milky way background. No percentage. Fixed secondary line.
 */

import type { CompatibilityResult } from "@/lib/moon-phase";
import { SECONDARY_LINE } from "@/lib/moon-content";
import {
  MASTER_W,
  MASTER_H,
  MOON_SMALL,
  type ComposeInput,
  hashString,
  drawBackground,
  drawBorder,
  drawGrainOverlay,
  drawMoonGlow,
  drawCoverImage,
  fmtDate,
  createPRNG,
} from "@/lib/moon-artwork";

export const MOON_HERO_A1 = 1400;

export function composeA1(
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
  heroMoon: HTMLCanvasElement,
  compat: CompatibilityResult,
  input: ComposeInput,
  bgImage?: HTMLImageElement
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
  const smallY = 520;
  const bigY = 1650;

  drawBackground(ctx, W, H, bigY - 80);

  if (bgImage) {
    drawCoverImage(ctx, bgImage, W, H, 0.25);
    // Darken edges with vignette so text remains legible
    const vig = ctx.createRadialGradient(W / 2, bigY - 80, W * 0.25, W / 2, bigY - 80, W * 0.85);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  // Constellation lines (decorative, behind the hero moon)
  const seed = hashString(name1 + name2 + date1 + date2);
  const rand = createPRNG(seed + 42);
  ctx.save();
  ctx.strokeStyle = "rgba(200, 200, 220, 0.06)";
  ctx.lineWidth = 1;
  const starPoints: [number, number][] = [];
  for (let i = 0; i < 8; i++) {
    starPoints.push([
      W * 0.15 + rand() * W * 0.7,
      bigY - MOON_HERO_A1 * 0.4 + rand() * MOON_HERO_A1 * 0.8,
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

  drawBorder(ctx, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Glow — individual moons
  drawMoonGlow(ctx, moon1, m1x, smallY, MOON_SMALL, 12, 0.35);
  drawMoonGlow(ctx, moon2, m2x, smallY, MOON_SMALL, 12, 0.35);

  // Individual moons
  ctx.shadowBlur = 0;
  ctx.drawImage(moon1, m1x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);
  ctx.drawImage(moon2, m2x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);
  ctx.shadowBlur = 20;

  // Names
  const nameY = smallY + MOON_SMALL / 2 + 44;
  ctx.font = `600 88px ${serif}`;
  ctx.fillStyle = "#e8e3d8";
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

  // Connector
  const connY = dateY + 60;
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
  drawMoonGlow(ctx, heroMoon, W / 2, bigY, MOON_HERO_A1, 22, 0.5);

  // Hero moon (natural combined)
  ctx.shadowBlur = 0;
  ctx.drawImage(heroMoon, W / 2 - MOON_HERO_A1 / 2, bigY - MOON_HERO_A1 / 2, MOON_HERO_A1, MOON_HERO_A1);
  ctx.shadowBlur = 20;

  // Content line — prominent, italic
  const contentY = bigY + MOON_HERO_A1 / 2 + 100;
  ctx.font = `italic 400 60px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.90)";
  ctx.fillText(`"${contentLine}"`, W / 2, contentY);

  // Fixed secondary line
  const secondaryY = contentY + 88;
  ctx.font = `italic 300 34px ${serif}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.50)";
  ctx.fillText(SECONDARY_LINE, W / 2, secondaryY);

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  // Clear shadow before grain
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  drawGrainOverlay(ctx, W, H, seed);

  return canvas;
}
