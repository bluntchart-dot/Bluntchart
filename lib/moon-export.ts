/**
 * Moon Phase Card — export format definitions and derivative generation.
 * All formats derive from the approved v6 master (2400×3000).
 */

import { drawBackground, drawStarField } from "./moon-artwork";

export interface ExportFormat {
  id: string;
  label: string;
  width: number;
  height: number;
  ext: "png" | "pdf";
}

export const FORMATS: ExportFormat[] = [
  { id: "print-8x10", label: '8×10" Print (300 DPI)', width: 2400, height: 3000, ext: "png" },
  { id: "print-pdf", label: "Print-Ready PDF", width: 2400, height: 3000, ext: "pdf" },
  { id: "wallpaper", label: "Phone Wallpaper", width: 1290, height: 2796, ext: "png" },
  { id: "story", label: "Instagram Story", width: 1080, height: 1920, ext: "png" },
  { id: "square", label: "Square Social", width: 1080, height: 1080, ext: "png" },
];

export function buildFilename(
  formatId: string,
  name1: string,
  name2: string,
  ext: string
): string {
  const slug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
  return `moon-phase-${slug(name1)}-${slug(name2)}-${formatId}.${ext}`;
}

export function buildPackageName(name1: string, name2: string): string {
  const slug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
  return `moon-phase-${slug(name1)}-${slug(name2)}`;
}

/**
 * Derive a phone wallpaper or IG story from the master canvas.
 * Scales master to fit width, centers vertically on a dark background
 * with matching stars in the extended zones.
 */
function deriveTall(
  master: HTMLCanvasElement,
  targetW: number,
  targetH: number,
  seed: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;

  const srcW = master.width;
  const srcH = master.height;
  const scale = targetW / srcW;
  const scaledH = srcH * scale;
  const offsetY = Math.round((targetH - scaledH) / 2);

  drawBackground(ctx, targetW, targetH, targetH * 0.45);
  drawStarField(ctx, targetW, targetH, seed + 7, [
    { x: targetW / 2, y: targetH / 2, r: targetW * 0.35 },
  ]);

  ctx.drawImage(master, 0, offsetY, targetW, scaledH);

  return canvas;
}

/**
 * Derive a square crop from the master.
 * Centers on the combined moon + score area (y=300..2700).
 */
function deriveSquare(
  master: HTMLCanvasElement,
  targetSize: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d")!;

  const srcW = master.width;
  const srcH = master.height;
  const cropSize = Math.min(srcW, srcH);
  const cropX = Math.round((srcW - cropSize) / 2);
  const cropY = srcW >= srcH ? 0 : 300;

  ctx.drawImage(
    master,
    cropX, cropY, cropSize, cropSize,
    0, 0, targetSize, targetSize
  );

  return canvas;
}

export function deriveFormat(
  master: HTMLCanvasElement,
  format: ExportFormat,
  seed: number
): HTMLCanvasElement {
  switch (format.id) {
    case "print-8x10":
      return master;
    case "print-pdf":
      return master;
    case "wallpaper":
      return deriveTall(master, format.width, format.height, seed);
    case "story":
      return deriveTall(master, format.width, format.height, seed);
    case "square":
      return deriveSquare(master, format.width);
    default:
      return master;
  }
}

/**
 * Build a minimal single-page PDF embedding a JPEG image at 8×10" (300 DPI).
 * Returns the PDF as a Uint8Array.
 */
export function buildPrintPDF(jpegDataUrl: string, imgW = 2400, imgH = 3000): Uint8Array {
  const raw = atob(jpegDataUrl.split(",")[1]);
  const jpegBytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) jpegBytes[i] = raw.charCodeAt(i);

  const pageW = Math.round((imgW / Math.max(imgW, imgH)) * 720);
  const pageH = Math.round((imgH / Math.max(imgW, imgH)) * 720);

  const objects: string[] = [];
  const offsets: number[] = [];
  let body = "%PDF-1.4\n%\xff\xff\xff\xff\n";

  function addObj(content: string, stream?: Uint8Array): number {
    const n = objects.length + 1;
    offsets.push(body.length + (stream ? 0 : 0));
    if (stream) {
      const header = `${n} 0 obj\n${content.replace("__LEN__", String(stream.length))}\nstream\n`;
      const footer = "\nendstream\nendobj\n";
      objects.push(header + "STREAM" + footer);
      offsets[offsets.length - 1] = -1;
      return n;
    }
    const s = `${n} 0 obj\n${content}\nendobj\n`;
    body += s;
    objects.push(s);
    return n;
  }

  addObj("<</Type /Catalog /Pages 2 0 R>>");
  addObj("<</Type /Pages /Kids [3 0 R] /Count 1>>");
  addObj(
    `<</Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents 4 0 R /Resources <</XObject <</Img 5 0 R>>>>>>`
  );

  const contentStream = `q ${pageW} 0 0 ${pageH} 0 0 cm /Img Do Q`;
  const contentBytes = new TextEncoder().encode(contentStream);
  const contentObj = `4 0 obj\n<</Length ${contentBytes.length}>>\nstream\n`;
  const contentEnd = "\nendstream\nendobj\n";

  const imgObj = `5 0 obj\n<</Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length}>>\nstream\n`;
  const imgEnd = "\nendstream\nendobj\n";

  const headerBytes = new TextEncoder().encode(body);
  const contentObjBytes = new TextEncoder().encode(contentObj);
  const contentEndBytes = new TextEncoder().encode(contentEnd);
  const imgObjBytes = new TextEncoder().encode(imgObj);
  const imgEndBytes = new TextEncoder().encode(imgEnd);

  const realOffsets = [
    ...offsets.slice(0, 3),
    headerBytes.length,
    0,
  ];
  realOffsets[4] =
    headerBytes.length +
    contentObjBytes.length +
    contentBytes.length +
    contentEndBytes.length;

  const xrefStart =
    realOffsets[4] +
    imgObjBytes.length +
    jpegBytes.length +
    imgEndBytes.length;

  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 0; i < 5; i++) {
    const off = i < 3 ? offsets[i] : realOffsets[i];
    xref += String(off).padStart(10, "0") + " 00000 n \n";
  }
  xref += `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF\n`;
  const xrefBytes = new TextEncoder().encode(xref);

  const total =
    headerBytes.length +
    contentObjBytes.length +
    contentBytes.length +
    contentEndBytes.length +
    imgObjBytes.length +
    jpegBytes.length +
    imgEndBytes.length +
    xrefBytes.length;

  const pdf = new Uint8Array(total);
  let pos = 0;
  function write(arr: Uint8Array) {
    pdf.set(arr, pos);
    pos += arr.length;
  }
  write(headerBytes);
  write(contentObjBytes);
  write(contentBytes);
  write(contentEndBytes);
  write(imgObjBytes);
  write(jpegBytes);
  write(imgEndBytes);
  write(xrefBytes);

  return pdf;
}
