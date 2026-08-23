"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createMoonScene, postProcessPremium } from "@/lib/moon-renderer";

const TEST_SCORES = [0, 20, 50, 73, 82, 100];

function renderMoon(
  phaseAngle: number,
  renderSize: number,
  colorMap: THREE.Texture,
  displacementMap: THREE.Texture,
  opts?: { earthshineIntensity?: number }
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(renderSize, renderSize);
  renderer.setPixelRatio(2);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = createMoonScene({
    phaseAngle,
    size: renderSize,
    premium: true,
    earthshineIntensity: opts?.earthshineIntensity,
  });

  (scene.material as THREE.MeshStandardMaterial).map = colorMap;
  (scene.material as THREE.MeshStandardMaterial).bumpMap = displacementMap;
  (scene.material as THREE.MeshStandardMaterial).displacementMap = displacementMap;
  (scene.material as THREE.MeshStandardMaterial).needsUpdate = true;

  renderer.render(scene.scene, scene.camera);
  const processed = postProcessPremium(canvas);

  scene.material.dispose();
  renderer.dispose();

  return processed;
}

function addChampagneRim(canvas: HTMLCanvasElement, score: number) {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;

  const cx = w / 2;
  const cy = h / 2;
  const r = w / (2 * 1.05);

  const t = Math.max(0, (30 - score) / 30);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (d[idx + 3] === 0) continue;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normDist = dist / r;

      if (normDist > 0.90 && normDist <= 1.0) {
        const rimT = (normDist - 0.90) / 0.10;
        const rimStrength = rimT * rimT * t * 0.22;
        d[idx]     = Math.min(255, d[idx]     + Math.round(200 * rimStrength));
        d[idx + 1] = Math.min(255, d[idx + 1] + Math.round(170 * rimStrength));
        d[idx + 2] = Math.min(255, d[idx + 2] + Math.round(100 * rimStrength));
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function renderCombinedAtScore(
  score: number,
  renderSize: number,
  colorMap: THREE.Texture,
  displacementMap: THREE.Texture
): HTMLCanvasElement {
  const coverage = Math.max(0, Math.min(100, score)) / 100;
  const perSide = coverage / 2;
  const cosA = Math.max(-1, Math.min(1, 1 - 2 * perSide));
  const seamOverlap = score >= 90 ? ((score - 90) / 10) * 12 : 0;
  const syntheticAngle = Math.acos(cosA) * (180 / Math.PI) + seamOverlap;

  const esOpts = score < 25
    ? { earthshineIntensity: 0.002 + ((25 - score) / 25) * 0.06 }
    : undefined;

  const c1 = renderMoon(syntheticAngle, renderSize, colorMap, displacementMap, esOpts);
  const c2 = renderMoon(360 - syntheticAngle, renderSize, colorMap, displacementMap, esOpts);

  const w = c1.width;
  const h = c1.height;
  const ctx1 = c1.getContext("2d")!;
  const ctx2 = c2.getContext("2d")!;
  const d1 = ctx1.getImageData(0, 0, w, h);
  const d2 = ctx2.getImageData(0, 0, w, h);

  const out = ctx1.createImageData(w, h);
  for (let i = 0; i < d1.data.length; i += 4) {
    const b1 = d1.data[i] + d1.data[i + 1] + d1.data[i + 2];
    const b2 = d2.data[i] + d2.data[i + 1] + d2.data[i + 2];
    if (b1 >= b2) {
      out.data[i] = d1.data[i];
      out.data[i + 1] = d1.data[i + 1];
      out.data[i + 2] = d1.data[i + 2];
    } else {
      out.data[i] = d2.data[i];
      out.data[i + 1] = d2.data[i + 1];
      out.data[i + 2] = d2.data[i + 2];
    }
    out.data[i + 3] = Math.max(d1.data[i + 3], d2.data[i + 3]);
  }

  const result = document.createElement("canvas");
  result.width = w;
  result.height = h;
  result.getContext("2d")!.putImageData(out, 0, 0);

  if (score < 30) {
    addChampagneRim(result, score);
  }

  return result;
}

export default function HeroTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Loading textures…");

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let loadedCount = 0;
    let colorMap: THREE.Texture;
    let displacementMap: THREE.Texture;

    function onLoaded() {
      loadedCount++;
      if (loadedCount < 2) return;

      setStatus("Rendering hero moons…");

      setTimeout(() => {
        const container = containerRef.current!;
        container.innerHTML = "";

        for (const score of TEST_SCORES) {
          setStatus(`Rendering ${score}%…`);
          const combined = renderCombinedAtScore(score, 400, colorMap, displacementMap);

          const wrapper = document.createElement("div");
          wrapper.style.cssText =
            "display:flex;flex-direction:column;align-items:center;gap:12px;";

          const bg = document.createElement("div");
          bg.style.cssText =
            "width:400px;height:400px;background:#050810;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;";

          const img = document.createElement("canvas");
          img.width = combined.width;
          img.height = combined.height;
          img.style.cssText = "width:360px;height:360px;";
          img.getContext("2d")!.drawImage(combined, 0, 0);
          bg.appendChild(img);

          const label = document.createElement("div");
          label.style.cssText = "color:#c5c9d8;font-size:24px;font-weight:700;";
          label.textContent = `${score}%`;

          wrapper.appendChild(bg);
          wrapper.appendChild(label);
          container.appendChild(wrapper);
        }

        colorMap.dispose();
        displacementMap.dispose();
        setStatus("Done");
      }, 100);
    }

    colorMap = loader.load("/moon-textures/color-2k.jpg", () => onLoaded());
    displacementMap = loader.load("/moon-textures/displacement-2k.png", () => onLoaded());
  }, []);

  return (
    <div style={{ background: "#0a0d1a", minHeight: "100vh", padding: 40 }}>
      <h1 style={{ color: "#dab95a", fontSize: 28, marginBottom: 8 }}>
        Hero Moon — Score Test
      </h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>{status}</p>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "flex-start",
        }}
      />
    </div>
  );
}
