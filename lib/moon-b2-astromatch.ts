/**
 * B2 — Astrology Match
 * Two big individual birth Moons in LANDSCAPE layout.
 * Landscape night sky background with mountain silhouettes.
 * Dark charcoal overlay on bottom third, text below moons.
 * Names in title case (signature font), percentage, content line.
 */

import {
  hashString,
  drawBorder,
  drawGrainOverlay,
  drawMoonGlow,
  drawCoverImage,
} from "@/lib/moon-artwork";

export const B2_W = 3000;
export const B2_H = 2400;
export const MOON_B2 = 1265;

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
  skipGrain?: boolean;
}

export function composeB2(
  moon1: HTMLCanvasElement,
  moon2: HTMLCanvasElement,
  input: B2Input,
  bgImage?: HTMLImageElement
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = B2_W;
  canvas.height = B2_H;
  const ctx = canvas.getContext("2d")!;

  const { name1, name2, serif, sans, contentLine, score } = input;
  const W = B2_W;
  const H = B2_H;

  const moonR = MOON_B2 / 2;
  const gap = 120;
  const m1x = W / 2 - moonR - gap / 2;
  const m2x = W / 2 + moonR + gap / 2;
  const moonY = 1040;

  // Layer 1: Landscape background
  if (bgImage) {
    drawCoverImage(ctx, bgImage, W, H, 1);
    // Darken the image slightly for contrast
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, W, H);
  } else {
    // Fallback dark sky
    const bg = ctx.createRadialGradient(W / 2, H * 0.3, 80, W / 2, H * 0.3, W * 0.9);
    bg.addColorStop(0, "#0a0d1a");
    bg.addColorStop(0.45, "#060910");
    bg.addColorStop(1, "#030508");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  // Layer 2: Black gradient shadow — bottom 1/3, transparent→opaque (darkened)
  const gradTop = Math.round(H * (2 / 3));
  const shadowGrad = ctx.createLinearGradient(0, gradTop, 0, H);
  shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  shadowGrad.addColorStop(0.35, "rgba(0, 0, 0, 0.55)");
  shadowGrad.addColorStop(0.65, "rgba(0, 0, 0, 0.85)");
  shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.97)");
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, gradTop, W, H - gradTop);

  // Layer 3: Moon glow + moons
  drawMoonGlow(ctx, moon1, m1x, moonY, MOON_B2, 24, 0.45);
  drawMoonGlow(ctx, moon2, m2x, moonY, MOON_B2, 24, 0.45);

  ctx.drawImage(moon1, m1x - moonR, moonY - moonR, MOON_B2, MOON_B2);
  ctx.drawImage(moon2, m2x - moonR, moonY - moonR, MOON_B2, MOON_B2);

  drawBorder(ctx, W, H);

  // Layer 4: Text — in the gradient shadow area
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Text shadow for visibility
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  const textStartY = Math.round(H * 0.72);

  // Names — title case, signature/italic serif, bluish silver — this is the highlight
  const displayName1 = name1.charAt(0).toUpperCase() + name1.slice(1).toLowerCase();
  const displayName2 = name2.charAt(0).toUpperCase() + name2.slice(1).toLowerCase();
  ctx.font = `italic 800 154px ${serif}`;
  ctx.fillStyle = "rgba(190, 205, 225, 0.97)";
  ctx.letterSpacing = "4px";
  ctx.fillText(`${displayName1}  &  ${displayName2}`, W / 2, textStartY);
  ctx.letterSpacing = "0px";

  // Score — gold, smaller than names (+15% gap: 140 → 161)
  const scoreY = textStartY + 185;

  ctx.save();
  ctx.font = `700 100px ${serif}`;
  ctx.fillStyle = "rgba(212, 168, 83, 0.10)";
  ctx.filter = "blur(8px)";
  ctx.shadowBlur = 0;
  ctx.letterSpacing = "4px";
  ctx.fillText(score + "%", W / 2 + 2, scoreY);
  ctx.letterSpacing = "0px";
  ctx.restore();

  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 3;
  ctx.font = `700 100px ${serif}`;
  ctx.fillStyle = "#d4a853";
  ctx.letterSpacing = "4px";
  ctx.fillText(score + "%", W / 2 + 2, scoreY);
  ctx.letterSpacing = "0px";

  // Content line
  const contentY = scoreY + 161;
  ctx.font = `italic 400 64px ${serif}`;
  ctx.fillStyle = "rgba(245, 243, 240, 0.82)";
  ctx.fillText(`"${contentLine}"`, W / 2, contentY);

  // Clear shadow before brand/grain
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  // Brand
  ctx.font = `300 22px ${sans}`;
  ctx.fillStyle = "rgba(140, 138, 155, 0.30)";
  ctx.fillText("bluntchart.com", W / 2, H - 50);

  const seed = hashString(name1 + name2 + input.date1 + input.date2);
  if (!input.skipGrain) drawGrainOverlay(ctx, W, H, seed);

  return canvas;
}
