"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { calculateCompatibility } from "@/lib/moon-phase";
import { getContentLine } from "@/lib/moon-content";
import {
  renderMoon,
  renderCombinedMoon,
  composeMaster,
  MOON_SMALL,
  MOON_BIG,
} from "@/lib/moon-artwork";
import {
  FORMATS,
  deriveFormat,
  buildFilename,
  buildPackageName,
  buildPrintPDF,
} from "@/lib/moon-export";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "block",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "block",
});

type Stage = "idle" | "rendering" | "done" | "saving" | "saved";

interface GeneratedFile {
  id: string;
  label: string;
  filename: string;
  dataURL: string;
  width: number;
  height: number;
}

function hashSeed(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function ExportPage() {
  const [name1, setName1] = useState("Olivia");
  const [date1, setDate1] = useState("1997-02-01");
  const [name2, setName2] = useState("Ethan");
  const [date2, setDate2] = useState("1995-01-07");
  const [stage, setStage] = useState<Stage>("idle");
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [info, setInfo] = useState("");
  const [saveResult, setSaveResult] = useState("");
  const rendering = useRef(false);

  async function generate() {
    if (rendering.current) return;
    rendering.current = true;
    setStage("rendering");
    setFiles([]);
    setSaveResult("");

    try {
      await document.fonts.ready;

      const compat = calculateCompatibility(date1, date2);
      const contentLine = getContentLine(
        compat.score,
        name1,
        date1,
        name2,
        date2
      );

      setInfo(
        `${name1} (${compat.person1.phaseName}) × ${name2} (${compat.person2.phaseName}) — ${compat.score}% — "${contentLine}"`
      );

      const serif = cormorant.style.fontFamily;
      const sans = dmSans.style.fontFamily;

      const loader = new THREE.TextureLoader();
      const [colorMap, displacementMap] = await Promise.all([
        new Promise<THREE.Texture>((res) => {
          const t = loader.load("/moon-textures/color-2k.jpg", () => res(t));
          t.colorSpace = THREE.SRGBColorSpace;
        }),
        new Promise<THREE.Texture>((res) => {
          const t = loader.load("/moon-textures/displacement-2k.png", () =>
            res(t)
          );
        }),
      ]);

      const m1 = renderMoon(
        compat.person1.phaseAngle,
        MOON_SMALL,
        colorMap,
        displacementMap
      );
      const m2 = renderMoon(
        compat.person2.phaseAngle,
        MOON_SMALL,
        colorMap,
        displacementMap
      );
      const combined = renderCombinedMoon(
        compat.person1.phaseAngle,
        compat.person2.phaseAngle,
        MOON_BIG,
        colorMap,
        displacementMap
      );

      const master = composeMaster(m1, m2, combined, compat, {
        name1,
        date1,
        name2,
        date2,
        serif,
        sans,
        contentLine,
      });

      colorMap.dispose();
      displacementMap.dispose();

      const seed = hashSeed(name1 + name2 + date1 + date2);
      const generated: GeneratedFile[] = [];

      for (const fmt of FORMATS) {
        const canvas = deriveFormat(master, fmt, seed);
        let dataURL: string;
        let filename: string;

        if (fmt.id === "print-pdf") {
          const jpegURL = master.toDataURL("image/jpeg", 0.95);
          const pdfBytes = buildPrintPDF(jpegURL);
          const b64 = btoa(
            Array.from(pdfBytes)
              .map((b) => String.fromCharCode(b))
              .join("")
          );
          dataURL = "data:application/pdf;base64," + b64;
          filename = buildFilename(fmt.id, name1, name2, "pdf");
        } else {
          dataURL = canvas.toDataURL("image/png");
          filename = buildFilename(fmt.id, name1, name2, "png");
        }

        generated.push({
          id: fmt.id,
          label: fmt.label,
          filename,
          dataURL,
          width: fmt.width,
          height: fmt.height,
        });
      }

      setFiles(generated);
      setStage("done");
    } catch (err) {
      console.error("Generation failed:", err);
      setInfo(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setStage("idle");
    } finally {
      rendering.current = false;
    }
  }

  async function saveToServer() {
    setStage("saving");
    try {
      const pkgName = buildPackageName(name1, name2);
      const payload = files.map((f) => ({ name: f.filename, dataURL: f.dataURL }));
      const res = await fetch("/api/internal/moon-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName: pkgName, files: payload }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setSaveResult(
        `Saved ${data.count} files to ${data.directory}`
      );
      setStage("saved");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveResult(`Save failed: ${err instanceof Error ? err.message : String(err)}`);
      setStage("done");
    }
  }

  return (
    <div
      className={`${cormorant.className} ${dmSans.className}`}
      style={s.page}
    >
      <div style={s.header}>
        <div style={s.eyebrow}>Moon Phase Card &middot; Export Tool</div>
        <h1 style={s.title}>Generate Artwork Package</h1>
      </div>

      <div style={s.form}>
        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Person 1 Name</label>
            <input
              style={s.input}
              value={name1}
              onChange={(e) => setName1(e.target.value)}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Birth Date</label>
            <input
              style={s.input}
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
            />
          </div>
        </div>
        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Person 2 Name</label>
            <input
              style={s.input}
              value={name2}
              onChange={(e) => setName2(e.target.value)}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Birth Date</label>
            <input
              style={s.input}
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={stage === "rendering" || !name1 || !name2 || !date1 || !date2}
          style={{
            ...s.btn,
            opacity: stage === "rendering" ? 0.5 : 1,
          }}
        >
          {stage === "rendering"
            ? "Rendering…"
            : "Generate All Formats"}
        </button>
      </div>

      {info && <p style={s.info}>{info}</p>}

      {files.length > 0 && (
        <>
          <div style={s.grid}>
            {files.map((f) => (
              <div key={f.id} style={s.card}>
                <div style={s.cardLabel}>{f.label}</div>
                <div style={s.previewWrap}>
                  {f.id === "print-pdf" ? (
                    <div style={s.pdfPlaceholder}>
                      PDF<br />{f.width}×{f.height}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.dataURL}
                      alt={f.label}
                      style={s.previewImg}
                    />
                  )}
                </div>
                <div style={s.cardMeta}>
                  {f.filename}
                  <br />
                  {f.width}×{f.height}
                </div>
              </div>
            ))}
          </div>

          <div style={s.actions}>
            <button
              onClick={saveToServer}
              disabled={stage === "saving"}
              style={s.btn}
            >
              {stage === "saving"
                ? "Saving…"
                : stage === "saved"
                ? "Saved ✓ — Save Again"
                : "Save Package to Server"}
            </button>
          </div>

          {saveResult && <p style={s.saveResult}>{saveResult}</p>}
        </>
      )}

      <div style={s.credit}>
        Lunar surface: NASA/GSFC/ASU (LROC) &middot; Elevation: NASA/GSFC/MIT
        (LOLA)
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0c12",
    color: "#d4d8e4",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "40px 20px 60px",
  },
  header: {
    maxWidth: 800,
    margin: "0 auto 24px",
    textAlign: "center",
  },
  eyebrow: {
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#c9a84c",
    marginBottom: 8,
  },
  title: {
    fontFamily: "Georgia, Cambria, serif",
    fontSize: 24,
    fontWeight: 400,
    marginBottom: 6,
  },
  form: {
    maxWidth: 600,
    margin: "0 auto 24px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  row: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
  },
  field: {
    flex: 1,
  },
  label: {
    display: "block",
    fontSize: 11,
    fontFamily: "Consolas, Menlo, monospace",
    letterSpacing: "0.08em",
    color: "#7a8099",
    marginBottom: 6,
    textTransform: "uppercase" as const,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    color: "#d4d8e4",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  btn: {
    display: "block",
    width: "100%",
    background: "rgba(201, 168, 76, 0.15)",
    color: "#c9a84c",
    border: "1px solid rgba(201, 168, 76, 0.3)",
    borderRadius: 4,
    padding: "12px 24px",
    fontSize: 13,
    fontFamily: "Consolas, Menlo, monospace",
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  info: {
    maxWidth: 800,
    margin: "0 auto 24px",
    textAlign: "center" as const,
    color: "#7a8099",
    fontSize: 13,
    fontFamily: "Consolas, Menlo, monospace",
  },
  grid: {
    maxWidth: 900,
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 16,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  cardLabel: {
    padding: "10px 12px 6px",
    fontSize: 12,
    fontFamily: "Consolas, Menlo, monospace",
    color: "#c9a84c",
    letterSpacing: "0.04em",
  },
  previewWrap: {
    padding: "0 12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 180,
  },
  previewImg: {
    maxWidth: "100%",
    maxHeight: 220,
    borderRadius: 3,
    objectFit: "contain" as const,
  },
  pdfPlaceholder: {
    width: "100%",
    height: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(201, 168, 76, 0.06)",
    borderRadius: 3,
    color: "#7a8099",
    fontSize: 13,
    fontFamily: "Consolas, Menlo, monospace",
    textAlign: "center" as const,
  },
  cardMeta: {
    padding: "8px 12px 10px",
    fontSize: 10,
    fontFamily: "Consolas, Menlo, monospace",
    color: "#515672",
    lineHeight: 1.5,
    wordBreak: "break-all" as const,
  },
  actions: {
    maxWidth: 600,
    margin: "0 auto 16px",
  },
  saveResult: {
    maxWidth: 600,
    margin: "0 auto",
    textAlign: "center" as const,
    color: "#6b9a6b",
    fontSize: 12,
    fontFamily: "Consolas, Menlo, monospace",
  },
  credit: {
    maxWidth: 600,
    margin: "40px auto 0",
    textAlign: "center" as const,
    fontSize: 10,
    color: "#515672",
    fontFamily: "Consolas, Menlo, monospace",
  },
};
