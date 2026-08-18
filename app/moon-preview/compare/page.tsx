"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { postProcessPremium } from "@/lib/moon-renderer";

const COMPARE_PHASES = [
  { angle: 180, name: "Full Moon" },
  { angle: 135, name: "Waxing Gibbous" },
  { angle: 90, name: "First Quarter" },
  { angle: 45, name: "Waxing Crescent" },
];

const RENDER_SIZE = 400;

const RAW = {
  bumpScale: 0.025,
  displacementScale: 0.015,
  earthshineIntensity: 0.008,
  sunIntensity: 3.0,
  roughness: 1.0,
  exposure: 1.0,
};

const PREMIUM = {
  bumpScale: 0.07,
  displacementScale: 0.02,
  earthshineIntensity: 0.002,
  sunIntensity: 4.8,
  roughness: 0.88,
  exposure: 1.25,
};

interface RenderedPair {
  raw: string;
  premium: string;
}

function renderPhase(
  angle: number,
  premium: boolean,
  colorMap: THREE.Texture,
  displacementMap: THREE.Texture
): string {
  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(RENDER_SIZE, RENDER_SIZE);
  renderer.setPixelRatio(2);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const d = premium ? PREMIUM : RAW;
  renderer.toneMappingExposure = d.exposure;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1.05, 1.05, 1.05, -1.05, 0.1, 100
  );
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.SphereGeometry(1, 256, 256);
  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
    bumpMap: displacementMap,
    bumpScale: d.bumpScale,
    displacementMap: displacementMap,
    displacementScale: d.displacementScale,
    roughness: d.roughness,
    metalness: 0.0,
  });

  const moon = new THREE.Mesh(geometry, material);
  scene.add(moon);

  const phiRad = (angle * Math.PI) / 180;
  const sunLight = new THREE.DirectionalLight(0xfff5e8, d.sunIntensity);
  sunLight.position.set(
    Math.sin(phiRad) * 10,
    0.3,
    -Math.cos(phiRad) * 10
  );
  sunLight.lookAt(0, 0, 0);
  scene.add(sunLight);

  const earthshine = new THREE.AmbientLight(0x8899bb, d.earthshineIntensity);
  scene.add(earthshine);

  renderer.render(scene, camera);

  let result: string;
  if (premium) {
    const processed = postProcessPremium(canvas);
    result = processed.toDataURL("image/png");
  } else {
    result = canvas.toDataURL("image/png");
  }

  material.dispose();
  geometry.dispose();
  renderer.dispose();

  return result;
}

export default function ComparePage() {
  const [renders, setRenders] = useState<RenderedPair[]>([]);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loader = new THREE.TextureLoader();
    let loaded = 0;
    let colorMap: THREE.Texture;
    let displacementMap: THREE.Texture;

    function onLoaded() {
      loaded++;
      if (loaded < 2) return;

      const results: RenderedPair[] = [];
      for (const phase of COMPARE_PHASES) {
        const raw = renderPhase(phase.angle, false, colorMap, displacementMap);
        const premium = renderPhase(
          phase.angle,
          true,
          colorMap,
          displacementMap
        );
        results.push({ raw, premium });
      }

      setRenders(results);
      setLoading(false);

      colorMap.dispose();
      displacementMap.dispose();
    }

    colorMap = loader.load("/moon-textures/color-2k.jpg", onLoaded);
    colorMap.colorSpace = THREE.SRGBColorSpace;
    displacementMap = loader.load(
      "/moon-textures/displacement-2k.png",
      onLoaded
    );
  }, []);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.eyebrow}>Premium Treatment &middot; Before / After</div>
        <h1 style={s.title}>Moon Render Comparison</h1>
        <p style={s.subtitle}>
          Same NASA textures, same phase calculation. Left: raw renderer. Right:
          premium treatment.
        </p>
      </div>

      {loading && <div style={s.loading}>Rendering comparisons...</div>}

      <div style={s.grid}>
        {COMPARE_PHASES.map((phase, i) => (
          <div key={phase.angle} style={s.row}>
            <div style={s.label}>{phase.name}</div>
            <div style={s.pair}>
              <div style={s.cell}>
                <div style={s.cellLabel}>Raw</div>
                {renders[i] ? (
                  <img
                    src={renders[i].raw}
                    alt={`${phase.name} raw`}
                    style={s.img}
                  />
                ) : (
                  <div style={s.placeholder} />
                )}
              </div>
              <div style={s.cell}>
                <div style={s.cellLabel}>Premium</div>
                {renders[i] ? (
                  <img
                    src={renders[i].premium}
                    alt={`${phase.name} premium`}
                    style={s.img}
                  />
                ) : (
                  <div style={s.placeholder} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.changes}>
        <div style={s.changesTitle}>Treatment Details</div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Parameter</th>
              <th style={s.th}>Raw</th>
              <th style={s.th}>Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={s.td}>Sun intensity</td>
              <td style={s.tdVal}>3.0</td>
              <td style={s.tdVal}>4.8</td>
            </tr>
            <tr>
              <td style={s.td}>Bump scale (crater shadows)</td>
              <td style={s.tdVal}>0.025</td>
              <td style={s.tdVal}>0.07</td>
            </tr>
            <tr>
              <td style={s.td}>Displacement scale</td>
              <td style={s.tdVal}>0.015</td>
              <td style={s.tdVal}>0.02</td>
            </tr>
            <tr>
              <td style={s.td}>Roughness</td>
              <td style={s.tdVal}>1.0</td>
              <td style={s.tdVal}>0.88</td>
            </tr>
            <tr>
              <td style={s.td}>Earthshine</td>
              <td style={s.tdVal}>0.008</td>
              <td style={s.tdVal}>0.002</td>
            </tr>
            <tr>
              <td style={s.td}>Tone mapping exposure</td>
              <td style={s.tdVal}>1.0</td>
              <td style={s.tdVal}>1.25</td>
            </tr>
            <tr>
              <td style={s.td}>Post: contrast</td>
              <td style={s.tdVal}>&mdash;</td>
              <td style={s.tdVal}>Smoothstep S-curve</td>
            </tr>
            <tr>
              <td style={s.td}>Post: sharpen</td>
              <td style={s.tdVal}>&mdash;</td>
              <td style={s.tdVal}>Unsharp mask 0.5</td>
            </tr>
            <tr>
              <td style={s.td}>Post: limb glow</td>
              <td style={s.tdVal}>&mdash;</td>
              <td style={s.tdVal}>Lit-edge only (&gt;80 brightness)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={s.credit}>
        NASA textures unchanged. Phase calculation unchanged. No scene-level
        rim/fill lights &mdash; treatment is sun/bump tuning + 2D
        post-processing.
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
    maxWidth: 960,
    margin: "0 auto 32px",
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
    fontSize: 28,
    fontWeight: 400,
    marginBottom: 6,
  },
  subtitle: {
    color: "#7a8099",
    fontSize: 14,
    maxWidth: 500,
    margin: "0 auto",
  },
  loading: {
    textAlign: "center",
    color: "#7a8099",
    fontSize: 14,
    fontFamily: "Consolas, Menlo, monospace",
    padding: "60px 0",
  },
  grid: {
    maxWidth: 960,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column" as const,
    gap: 40,
  },
  row: {},
  label: {
    fontFamily: "Georgia, Cambria, serif",
    fontSize: 18,
    textAlign: "center" as const,
    marginBottom: 12,
  },
  pair: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    maxWidth: 700,
    margin: "0 auto",
  },
  cell: {
    textAlign: "center" as const,
  },
  cellLabel: {
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#515672",
    marginBottom: 8,
  },
  img: {
    width: "100%",
    maxWidth: 320,
    aspectRatio: "1",
    borderRadius: "50%",
    background: "#000",
    display: "block",
    margin: "0 auto",
  },
  placeholder: {
    width: "100%",
    maxWidth: 320,
    aspectRatio: "1",
    borderRadius: "50%",
    background: "#111420",
    margin: "0 auto",
  },
  changes: {
    maxWidth: 600,
    margin: "48px auto 0",
    padding: "24px",
    background: "#111420",
    borderRadius: 8,
    border: "1px solid #252a38",
  },
  changesTitle: {
    fontFamily: "Georgia, Cambria, serif",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    textAlign: "left" as const,
    fontSize: 10,
    fontFamily: "Consolas, Menlo, monospace",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#515672",
    padding: "6px 10px",
    borderBottom: "1px solid #252a38",
  },
  td: {
    padding: "5px 10px",
    borderBottom: "1px solid #1e2233",
    color: "#d4d8e4",
  },
  tdVal: {
    padding: "5px 10px",
    borderBottom: "1px solid #1e2233",
    color: "#7a8099",
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 12,
  },
  credit: {
    maxWidth: 600,
    margin: "32px auto 0",
    textAlign: "center" as const,
    fontSize: 12,
    color: "#515672",
    fontFamily: "Consolas, Menlo, monospace",
  },
};
