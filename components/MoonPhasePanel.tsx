"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { calculateCompatibility } from "@/lib/moon-phase";
import { getContentLine, getLineCount, getAllLines } from "@/lib/moon-content";
import {
  renderMoon,
  blendBirthMoons,
  scoreToPhaseAngle,
  MOON_SMALL,
} from "@/lib/moon-artwork";
import { composeA1, MOON_HERO_A1 } from "@/lib/moon-a1-soulmate";
import { composeA2, MOON_HERO_A2 } from "@/lib/moon-a2-match";
import { composeB1, MOON_HERO_B1 } from "@/lib/moon-b1-compat";
import { composeB2, MOON_B2 } from "@/lib/moon-b2-astromatch";
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

export type MoonProduct = "a1" | "a2" | "b1" | "b2";

const PRODUCT_INFO: Record<MoonProduct, { name: string; desc: string }> = {
  a1: { name: "Soulmate Moon", desc: "Combined birth Moons, no %" },
  a2: { name: "Moon Match", desc: "Single hero Moon, Moon Match %" },
  b1: { name: "Astrology Compatibility", desc: "Two individual + hero Moon, astrology %" },
  b2: { name: "Astrology Match", desc: "Two big Moons landscape, astrology % as text" },
};

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

const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "13px 14px",
  fontSize: 14,
  color: "#e8e4f0",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b6585",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  marginBottom: 6,
};

type Stage = "form" | "rendering" | "done" | "saving" | "saved";

interface Props {
  product: MoonProduct;
  onBack: () => void;
}

export default function MoonPhasePanel({ product, onBack }: Props) {
  const [name1, setName1] = useState("");
  const [dob1, setDob1] = useState("");
  const [name2, setName2] = useState("");
  const [dob2, setDob2] = useState("");
  const [mockScore, setMockScore] = useState(75);
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");
  const [saveResult, setSaveResult] = useState("");
  const [emailResult, setEmailResult] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const rendering = useRef(false);

  const needsMockScore = product === "b1" || product === "b2";
  const pInfo = PRODUCT_INFO[product];

  async function generate() {
    if (rendering.current) return;

    if (!name1.trim() || !dob1 || !name2.trim() || !dob2) {
      setErr("Please fill in both names and birth dates.");
      return;
    }
    setErr("");
    rendering.current = true;
    setStage("rendering");
    setFiles([]);
    setSaveResult("");

    try {
      await document.fonts.ready;

      const compat = calculateCompatibility(dob1, dob2);
      const score = needsMockScore ? mockScore : compat.score;
      const contentLine = getContentLine(
        score,
        name1.trim(),
        dob1,
        name2.trim(),
        dob2
      );

      setInfo(
        `${name1.trim()} × ${name2.trim()} — ${pInfo.name} — ${product === "a1" ? "combined" : score + "%"} — "${contentLine}"`
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

      const composeInput = {
        name1: name1.trim(),
        date1: dob1,
        name2: name2.trim(),
        date2: dob2,
        serif,
        sans,
        contentLine,
      };

      let master: HTMLCanvasElement;

      if (product === "a1") {
        const m1 = renderMoon(compat.person1.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const hero = blendBirthMoons(
          compat.person1.phaseAngle,
          compat.person2.phaseAngle,
          MOON_HERO_A1,
          colorMap,
          displacementMap
        );
        master = composeA1(m1, m2, hero, compat, composeInput);
      } else if (product === "a2") {
        const heroAngle = scoreToPhaseAngle(compat.score);
        const esOpts = compat.score < 25
          ? { earthshineIntensity: 0.12 + ((25 - compat.score) / 25) * 0.04, shadowLift: true }
          : { shadowLift: true };
        const hero = renderMoon(heroAngle, MOON_HERO_A2, colorMap, displacementMap, esOpts);
        master = composeA2(hero, compat, composeInput);
      } else if (product === "b1") {
        const m1 = renderMoon(compat.person1.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_SMALL, colorMap, displacementMap);
        const heroAngle = scoreToPhaseAngle(mockScore);
        const esOpts = mockScore < 25
          ? { earthshineIntensity: 0.12 + ((25 - mockScore) / 25) * 0.04, shadowLift: true }
          : { shadowLift: true };
        const hero = renderMoon(heroAngle, MOON_HERO_B1, colorMap, displacementMap, esOpts);
        master = composeB1(m1, m2, hero, {
          ...composeInput,
          score: mockScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
        });
      } else {
        const sl = { shadowLift: true };
        const m1 = renderMoon(compat.person1.phaseAngle, MOON_B2, colorMap, displacementMap, sl);
        const m2 = renderMoon(compat.person2.phaseAngle, MOON_B2, colorMap, displacementMap, sl);
        master = composeB2(m1, m2, {
          ...composeInput,
          score: mockScore,
          person1PhaseName: compat.person1.phaseName,
          person2PhaseName: compat.person2.phaseName,
        });
      }

      colorMap.dispose();
      displacementMap.dispose();

      const seed = hashSeed(name1.trim() + name2.trim() + dob1 + dob2);
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
          filename = buildFilename(fmt.id, name1.trim(), name2.trim(), "pdf");
        } else {
          dataURL = canvas.toDataURL("image/png");
          filename = buildFilename(fmt.id, name1.trim(), name2.trim(), "png");
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
    } catch (e) {
      console.error("Generation failed:", e);
      setErr(e instanceof Error ? e.message : "Generation failed.");
      setStage("form");
    } finally {
      rendering.current = false;
    }
  }

  async function saveToServer() {
    setStage("saving");
    try {
      const pkgName = buildPackageName(name1.trim(), name2.trim());
      let saved = 0;
      for (const f of files) {
        const res = await fetch("/api/internal/moon-export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packageName: pkgName,
            files: [{ name: f.filename, dataURL: f.dataURL }],
          }),
        });
        if (!res.ok) throw new Error(`Server returned ${res.status} for ${f.filename}`);
        saved++;
      }
      setSaveResult(`Saved ${saved} files to public/moon-textures/rendered/${pkgName}`);
      setStage("saved");
    } catch (e) {
      console.error("Save failed:", e);
      setSaveResult(
        `Save failed: ${e instanceof Error ? e.message : String(e)}`
      );
      setStage("done");
    }
  }

  async function sendDeliveryEmail() {
    if (!email.trim()) return;
    setEmailResult("Sending…");
    try {
      const token = btoa(JSON.stringify({
        n1: name1.trim(), d1: dob1,
        n2: name2.trim(), d2: dob2,
      }));
      const res = await fetch("/api/internal/moon-phase/send-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name1: name1.trim(),
          name2: name2.trim(),
          token,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server returned ${res.status}`);
      }
      setEmailResult("Delivery email sent successfully.");
    } catch (e) {
      setEmailResult(`Email failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  function resetForm() {
    setStage("form");
    setFiles([]);
    setInfo("");
    setErr("");
    setSaveResult("");
    setEmailResult("");
    setName1("");
    setDob1("");
    setName2("");
    setDob2("");
    setEmail("");
  }

  if (stage === "rendering") {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <span style={{ fontSize: 60, display: "block" }}>🌙</span>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            margin: "16px 0 8px",
            color: "#e8e4f0",
          }}
        >
          Rendering {pInfo.name}…
        </div>
        <div style={{ fontSize: 13, color: "#4a4560" }}>
          Three.js rendering + composition. This takes 5–15 seconds.
        </div>
      </div>
    );
  }

  if ((stage === "done" || stage === "saving" || stage === "saved") && files.length > 0) {
    return (
      <MoonPhaseResult
        product={product}
        files={files}
        info={info}
        stage={stage}
        saveResult={saveResult}
        emailResult={emailResult}
        email={email}
        onSave={saveToServer}
        onSendEmail={sendDeliveryEmail}
        onNew={resetForm}
        onBack={onBack}
        showLibrary={showLibrary}
        setShowLibrary={setShowLibrary}
      />
    );
  }

  return (
    <div
      className={`${cormorant.className} ${dmSans.className}`}
      style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}
    >
      {err && (
        <div
          style={{
            background: "rgba(212,83,126,0.08)",
            border: "0.5px solid rgba(212,83,126,0.3)",
            borderRadius: 10,
            padding: "11px 14px",
            fontSize: 13,
            color: "#f0a0b8",
            marginBottom: 14,
          }}
        >
          {err}
        </div>
      )}

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: 32,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            marginBottom: 4,
            color: "#e8e4f0",
          }}
        >
          {pInfo.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#6b6585",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {pInfo.desc}
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#c9a84c",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Person 1
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <label style={lbl}>Name</label>
            <input
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="e.g. Olivia"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Date of birth</label>
            <input
              type="date"
              value={dob1}
              onChange={(e) => setDob1(e.target.value)}
              style={inp}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#c9a84c",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Person 2
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: needsMockScore ? 20 : 24,
          }}
        >
          <div>
            <label style={lbl}>Name</label>
            <input
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="e.g. Ethan"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Date of birth</label>
            <input
              type="date"
              value={dob2}
              onChange={(e) => setDob2(e.target.value)}
              style={inp}
            />
          </div>
        </div>

        {needsMockScore && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#c9a84c",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Mock astrology score
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <input
                type="range"
                min={0}
                max={100}
                value={mockScore}
                onChange={(e) => setMockScore(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={mockScore}
                onChange={(e) => setMockScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                style={{ ...inp, width: 70, textAlign: "center" }}
              />
              <span style={{ fontSize: 14, color: "#6b6585" }}>%</span>
            </div>
            <small
              style={{
                fontSize: 11,
                color: "#3a3858",
                marginTop: 4,
                display: "block",
              }}
            >
              Placeholder until the astrology engine is implemented
            </small>
          </div>
        )}

        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#c9a84c",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Delivery
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Customer email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="customer@email.com"
            style={inp}
          />
          <small
            style={{
              fontSize: 11,
              color: "#3a3858",
              marginTop: 4,
              display: "block",
            }}
          >
            They&apos;ll receive a link to download all formats
          </small>
        </div>

        <button
          onClick={generate}
          disabled={!name1.trim() || !dob1 || !name2.trim() || !dob2}
          style={{
            width: "100%",
            background:
              name1.trim() && dob1 && name2.trim() && dob2
                ? "linear-gradient(135deg,#6b2fd4,#d4537e)"
                : "rgba(255,255,255,0.06)",
            color:
              name1.trim() && dob1 && name2.trim() && dob2
                ? "#fff"
                : "#4a4560",
            border: "none",
            borderRadius: 12,
            padding: "16px 20px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor:
              name1.trim() && dob1 && name2.trim() && dob2
                ? "pointer"
                : "not-allowed",
            letterSpacing: "0.2px",
          }}
        >
          Generate {pInfo.name}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#6b6585",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "4px 0",
          }}
        >
          ← Back to product selection
        </button>
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          style={{
            background: "none",
            border: "none",
            color: "#6b6585",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "4px 0",
          }}
        >
          {showLibrary ? "Hide" : "Review"} content library ({getLineCount()}{" "}
          lines)
        </button>
      </div>

      {showLibrary && <ContentLibraryViewer />}
    </div>
  );
}

function MoonPhaseResult({
  product,
  files,
  info,
  stage,
  saveResult,
  emailResult,
  email,
  onSave,
  onSendEmail,
  onNew,
  onBack,
  showLibrary,
  setShowLibrary,
}: {
  product: MoonProduct;
  files: GeneratedFile[];
  info: string;
  stage: Stage;
  saveResult: string;
  emailResult: string;
  email: string;
  onSave: () => void;
  onSendEmail: () => void;
  onNew: () => void;
  onBack: () => void;
  showLibrary: boolean;
  setShowLibrary: (v: boolean) => void;
}) {
  const masterFile = files.find((f) => f.id === "print-8x10");
  const pInfo = PRODUCT_INFO[product];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <div
        style={{
          background: "rgba(122,214,153,0.06)",
          border: "0.5px solid rgba(122,214,153,0.28)",
          borderRadius: 14,
          padding: "12px 16px",
          color: "#a7f0c1",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 20,
          letterSpacing: "0.02em",
        }}
      >
        {pInfo.name} generated — {files.length} formats ready.
      </div>

      {info && (
        <div
          style={{
            fontSize: 13,
            color: "#8b8599",
            textAlign: "center",
            marginBottom: 20,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {info}
        </div>
      )}

      {masterFile && masterFile.id !== "print-pdf" && (
        <div
          style={{
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={masterFile.dataURL}
            alt={`${pInfo.name} artwork`}
            style={{
              maxWidth: "100%",
              maxHeight: 500,
              borderRadius: 8,
              border: "0.5px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>
      )}

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            marginBottom: 16,
            color: "#e8e4f0",
          }}
        >
          Generated formats
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {files.map((f) => (
            <div
              key={f.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
                border: "0.5px solid rgba(255,255,255,0.06)",
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#c9a84c",
                  marginBottom: 6,
                }}
              >
                {f.label}
              </div>
              {f.id !== "print-pdf" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.dataURL}
                  alt={f.label}
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "contain",
                    borderRadius: 4,
                    marginBottom: 6,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(201, 168, 76, 0.06)",
                    borderRadius: 4,
                    marginBottom: 6,
                    color: "#6b6585",
                    fontSize: 12,
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  PDF — {f.width}×{f.height}
                </div>
              )}
              <div
                style={{
                  fontSize: 10,
                  color: "#515672",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                  wordBreak: "break-all",
                  lineHeight: 1.5,
                }}
              >
                {f.filename}
                <br />
                {f.width}×{f.height}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(product === "a2" || product === "b1") && (
        <div
          style={{
            background: "rgba(218, 185, 90, 0.06)",
            border: "0.5px solid rgba(218, 185, 90, 0.2)",
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 16,
            fontSize: 12,
            color: "#c9a84c",
          }}
        >
          Animated Story (MP4) — requires FFmpeg server-side encoding. Frame rendering is ready; MP4 export pending infrastructure setup.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <button
          onClick={onSave}
          disabled={stage === "saving"}
          style={{
            background:
              stage === "saved"
                ? "rgba(122,214,153,0.12)"
                : "linear-gradient(135deg,#6b2fd4,#d4537e)",
            color: stage === "saved" ? "#a7f0c1" : "#fff",
            border:
              stage === "saved"
                ? "0.5px solid rgba(122,214,153,0.3)"
                : "none",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: stage === "saving" ? "wait" : "pointer",
            fontFamily: "inherit",
            opacity: stage === "saving" ? 0.5 : 1,
          }}
        >
          {stage === "saving"
            ? "Saving…"
            : stage === "saved"
            ? "Saved — Save Again"
            : "Save Package to Server"}
        </button>
        <button
          onClick={onNew}
          style={{
            background: "transparent",
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "#e8e4f0",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Generate another
        </button>
      </div>

      {saveResult && (
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: saveResult.startsWith("Save failed")
              ? "#f0a0b8"
              : "#6b9a6b",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            marginBottom: 12,
          }}
        >
          {saveResult}
        </div>
      )}

      {email && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#c9a84c",
              letterSpacing: "1.5px",
              textTransform: "uppercase" as const,
              marginBottom: 10,
            }}
          >
            Email delivery
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#8b8599",
              marginBottom: 12,
            }}
          >
            Send download link to{" "}
            <span style={{ color: "#e8e4f0", fontWeight: 600 }}>{email}</span>
          </div>
          <button
            onClick={onSendEmail}
            disabled={emailResult === "Sending…"}
            style={{
              width: "100%",
              background: emailResult === "Delivery email sent successfully."
                ? "rgba(122,214,153,0.12)"
                : "rgba(201, 168, 76, 0.15)",
              color: emailResult === "Delivery email sent successfully."
                ? "#a7f0c1"
                : "#c9a84c",
              border: emailResult === "Delivery email sent successfully."
                ? "0.5px solid rgba(122,214,153,0.3)"
                : "0.5px solid rgba(201, 168, 76, 0.3)",
              borderRadius: 10,
              padding: "12px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: emailResult === "Sending…" ? "wait" : "pointer",
              fontFamily: "inherit",
              opacity: emailResult === "Sending…" ? 0.5 : 1,
            }}
          >
            {emailResult === "Sending…"
              ? "Sending…"
              : emailResult === "Delivery email sent successfully."
              ? "Sent — Send Again"
              : "Send delivery email"}
          </button>
          {emailResult && emailResult !== "Sending…" && (
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: emailResult.startsWith("Email failed")
                  ? "#f0a0b8"
                  : "#6b9a6b",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                marginTop: 8,
              }}
            >
              {emailResult}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#6b6585",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "4px 0",
          }}
        >
          ← Back to product selection
        </button>
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          style={{
            background: "none",
            border: "none",
            color: "#6b6585",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "4px 0",
          }}
        >
          {showLibrary ? "Hide" : "Review"} content library
        </button>
      </div>

      {showLibrary && <ContentLibraryViewer />}
    </div>
  );
}

function ContentLibraryViewer() {
  const lines = getContentLibrary();

  const ranges = [
    { label: "90–100%", range: [90, 100] as [number, number], theme: "exceptional chemistry" },
    { label: "80–89%", range: [80, 89] as [number, number], theme: "strong pull" },
    { label: "70–79%", range: [70, 79] as [number, number], theme: "strong complement" },
    { label: "60–69%", range: [60, 69] as [number, number], theme: "balanced tension" },
    { label: "50–59%", range: [50, 59] as [number, number], theme: "honest friction" },
    { label: "40–49%", range: [40, 49] as [number, number], theme: "drawn to the difference" },
    { label: "30–39%", range: [30, 39] as [number, number], theme: "against the odds" },
    { label: "20–29%", range: [20, 29] as [number, number], theme: "unlikely, but intriguing" },
    { label: "0–19%", range: [0, 19] as [number, number], theme: "very different" },
  ];

  return (
    <div
      style={{
        marginTop: 20,
        background: "rgba(255,255,255,0.02)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 24,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          color: "#e8e4f0",
          marginBottom: 4,
        }}
      >
        Content library
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#6b6585",
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        {lines.length} curated lines across 9 score ranges. Each line is
        deterministically selected by FNV-1a hash of
        name1+date1+name2+date2. To update: edit{" "}
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 11,
            color: "#8b8599",
          }}
        >
          lib/moon-content.ts
        </span>
      </div>

      {ranges.map(({ label, range, theme }) => {
        const bucket = lines.filter(
          (l) => l.range[0] === range[0] && l.range[1] === range[1]
        );
        return (
          <div key={label} style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#c9a84c",
                  letterSpacing: "0.1em",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: 11, color: "#4a4560", fontStyle: "italic" }}>
                {theme}
              </span>
              <span style={{ fontSize: 10, color: "#3a3858" }}>
                ({bucket.length} lines)
              </span>
            </div>
            {bucket.map((line, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  background:
                    i % 2 === 0
                      ? "rgba(255,255,255,0.02)"
                      : "transparent",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#d4d0dc",
                  lineHeight: 1.6,
                  display: "flex",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    color: "#3a3858",
                    fontSize: 10,
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    minWidth: 18,
                    textAlign: "right",
                    paddingTop: 2,
                  }}
                >
                  {i + 1}
                </span>
                <span>{line.text}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function getContentLibrary(): { text: string; range: [number, number] }[] {
  return getAllLines();
}
