/**
 * A1 — Soulmate Moon
 * Natural combination of two actual birth Moon phases.
 * Two supporting individual Moons + one large combined hero.
 * No percentage. Fixed secondary line.
 */

import type { CompatibilityResult } from "@/lib/moon-phase";
import { SECONDARY_LINE } from "@/lib/moon-content";
import {
  MASTER_W,
  MASTER_H,
  MOON_SMALL,
  BORDER_INSET,
  type ComposeInput,
  hashString,
  drawStarField,
  drawMoonGlow,
  fmtDate,
} from "@/lib/moon-artwork";

export const MOON_HERO_A1 = 1200;

export function composeA1(
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
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

  const smallGap = 260;
  const m1x = W / 2 - smallGap / 2 - MOON_SMALL / 2;
  const m2x = W / 2 + smallGap / 2 + MOON_SMALL / 2;
  const smallY = 480;
  const bigY = 1440;

  // Background
  const bg = ctx.createRadialGradient(
    W / 2, bigY - 80, 80,
    W / 2, bigY - 80, W * 0.9
  );
  bg.addColorStop(0, "#0a0d1a");
  bg.addColorStop(0.45, "#060910");
  bg.addColorStop(1, "#030508");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Stars
  const seed = hashString(name1 + name2 + date1 + date2);
  drawStarField(ctx, W, H, seed, [
    { x: m1x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: m2x, y: smallY, r: MOON_SMALL / 2 + 40 },
    { x: W / 2, y: bigY, r: MOON_HERO_A1 / 2 + 60 },
    { x: W / 2, y: bigY + MOON_HERO_A1 / 2 + 200, r: 400 },
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

  // Glow — individual moons
  drawMoonGlow(ctx, moon1, m1x, smallY, MOON_SMALL, 12, 0.35);
  drawMoonGlow(ctx, moon2, m2x, smallY, MOON_SMALL, 12, 0.35);

  // Individual moons
  ctx.drawImage(moon1, m1x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);
  ctx.drawImage(moon2, m2x - MOON_SMALL / 2, smallY - MOON_SMALL / 2, MOON_SMALL, MOON_SMALL);

  // Names
  const nameY = smallY + MOON_SMALL / 2 + 44;
  ctx.font = `600 88px ${serif}`;
  ctx.fillStyle = "#e8e3d8";
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
  ctx.fillText(compat.person1.phaseName, m1x, phaseY);
  ctx.fillText(compat.person2.phaseName, m2x, phaseY);
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
  drawMoonGlow(ctx, heroMoon, W / 2, bigY, MOON_HERO_A1, 22, 0.5);

  // Hero moon (natural combined)
  ctx.drawImage(heroMoon, W / 2 - MOON_HERO_A1 / 2, bigY - MOON_HERO_A1 / 2, MOON_HERO_A1, MOON_HERO_A1);

  // Content line — prominent, italic
  const contentY = bigY + MOON_HERO_A1 / 2 + 100;
  ctx.font = `italic 400 60px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.90)";
  ctx.fillText(`“${contentLine}”`, W / 2, contentY);

  // Fixed secondary line
  const secondaryY = contentY + 88;
  ctx.font = `italic 300 34px ${serif}`;
  ctx.fillStyle = "rgba(218, 185, 90, 0.50)";
  ctx.fillText(SECONDARY_LINE, W / 2, secondaryY);

  // Brand
  ctx.font = `300 26px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.38)";
  ctx.fillText("bluntchart.com", W / 2, H - 110);

  return canvas;
}
