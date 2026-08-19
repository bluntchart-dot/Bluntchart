"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function DeliveryInner() {
  const params = useSearchParams();
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [names, setNames] = useState({ n1: "", n2: "" });
  const [info, setInfo] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const generating = useRef(false);

  useEffect(() => {
    if (generating.current) return;
    generating.current = true;

    const t = params.get("t");
    if (!t) {
      setErrMsg("Missing delivery token.");
      setStatus("error");
      return;
    }

    let parsed: { n1: string; d1: string; n2: string; d2: string };
    try {
      parsed = JSON.parse(atob(t));
    } catch {
      setErrMsg("Invalid delivery token.");
      setStatus("error");
      return;
    }

    const { n1, d1, n2, d2 } = parsed;
    if (!n1 || !d1 || !n2 || !d2) {
      setErrMsg("Incomplete delivery data.");
      setStatus("error");
      return;
    }

    setNames({ n1, n2 });
    generate(n1, d1, n2, d2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate(
    name1: string,
    date1: string,
    name2: string,
    date2: string
  ) {
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
        `${name1} & ${name2} — ${compat.score}% moon phase compatibility`
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
      setStatus("ready");
    } catch (e) {
      console.error("Delivery generation failed:", e);
      setErrMsg(e instanceof Error ? e.message : "Generation failed.");
      setStatus("error");
    }
  }

  function download(f: GeneratedFile) {
    const a = document.createElement("a");
    a.href = f.dataURL;
    a.download = f.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadAll() {
    for (const f of files) {
      setTimeout(() => download(f), 0);
    }
  }

  if (status === "error") {
    return (
      <div style={s.page}>
        <div style={s.center}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>:(</div>
          <div style={{ fontSize: 16, color: "#f0a0b8" }}>{errMsg}</div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div style={s.page}>
        <div style={s.center}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <div style={{ fontSize: 18, color: "#e8e4f0", marginBottom: 8 }}>
            Generating your Moon Phase Card…
          </div>
          <div style={{ fontSize: 13, color: "#4a4560" }}>
            Rendering moon artwork. This takes 5–15 seconds.
          </div>
        </div>
      </div>
    );
  }

  const masterFile = files.find((f) => f.id === "print-8x10");

  return (
    <div className={`${cormorant.className} ${dmSans.className}`} style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.eyebrow}>BluntChart</div>
          <h1 style={s.title}>Your Moon Phase Card</h1>
          {info && <p style={s.subtitle}>{info}</p>}
        </div>

        {masterFile && masterFile.id !== "print-pdf" && (
          <div style={{ textAlign: "center" as const, marginBottom: 32 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={masterFile.dataURL}
              alt={`${names.n1} & ${names.n2} Moon Phase Card`}
              style={{
                maxWidth: "100%",
                maxHeight: 520,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>
        )}

        <button onClick={downloadAll} style={s.downloadAllBtn}>
          Download all {files.length} formats
        </button>

        <div style={s.grid}>
          {files.map((f) => (
            <div key={f.id} style={s.card}>
              <div style={s.cardLabel}>{f.label}</div>
              {f.id !== "print-pdf" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.dataURL}
                  alt={f.label}
                  style={s.cardImg}
                />
              ) : (
                <div style={s.pdfPlaceholder}>
                  PDF — {f.width}×{f.height}
                </div>
              )}
              <div style={s.cardMeta}>
                {f.filename}
                <br />
                {f.width}×{f.height}
              </div>
              <button onClick={() => download(f)} style={s.downloadBtn}>
                Download
              </button>
            </div>
          ))}
        </div>

        <div style={s.credit}>
          Lunar surface: NASA/GSFC/ASU (LROC) · Elevation: NASA/GSFC/MIT
          (LOLA)
        </div>
      </div>
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense
      fallback={
        <div style={s.page}>
          <div style={s.center}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
            <div style={{ fontSize: 18, color: "#e8e4f0" }}>Loading…</div>
          </div>
        </div>
      }
    >
      <DeliveryInner />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#09090f",
    color: "#e8e4f0",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "40px 16px 60px",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center" as const,
  },
  container: {
    maxWidth: 800,
    margin: "0 auto",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 32,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "2.5px",
    textTransform: "uppercase" as const,
    color: "#d4537e",
    fontWeight: 700,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Georgia, Cambria, serif",
    fontSize: 28,
    fontWeight: 400,
    margin: "0 0 8px",
  },
  subtitle: {
    fontSize: 14,
    color: "#8b8599",
    margin: 0,
  },
  downloadAllBtn: {
    display: "block",
    width: "100%",
    maxWidth: 480,
    margin: "0 auto 32px",
    background: "linear-gradient(135deg,#6b2fd4,#d4537e)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "16px 24px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    padding: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#c9a84c",
    marginBottom: 8,
    letterSpacing: "0.04em",
  },
  cardImg: {
    width: "100%",
    height: 160,
    objectFit: "contain" as const,
    borderRadius: 4,
    marginBottom: 8,
  },
  pdfPlaceholder: {
    width: "100%",
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(201, 168, 76, 0.06)",
    borderRadius: 4,
    marginBottom: 8,
    color: "#6b6585",
    fontSize: 13,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  cardMeta: {
    fontSize: 10,
    color: "#515672",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    wordBreak: "break-all" as const,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  downloadBtn: {
    width: "100%",
    background: "rgba(201, 168, 76, 0.12)",
    color: "#c9a84c",
    border: "1px solid rgba(201, 168, 76, 0.25)",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  credit: {
    textAlign: "center" as const,
    fontSize: 10,
    color: "#515672",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    marginTop: 16,
  },
};
