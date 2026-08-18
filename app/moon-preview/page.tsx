"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { createMoonScene } from "@/lib/moon-renderer";

const PHASES = [
  { angle: 0, name: "New Moon", illum: "0%" },
  { angle: 45, name: "Waxing Crescent", illum: "15%" },
  { angle: 90, name: "First Quarter", illum: "50%" },
  { angle: 135, name: "Waxing Gibbous", illum: "85%" },
  { angle: 180, name: "Full Moon", illum: "100%" },
  { angle: 225, name: "Waning Gibbous", illum: "85%" },
  { angle: 270, name: "Third Quarter", illum: "50%" },
  { angle: 315, name: "Waning Crescent", illum: "15%" },
];

const MOON_SIZE = 400;

export default function MoonPreviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<ReturnType<typeof createMoonScene> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPhase, setSelectedPhase] = useState(4);
  const [customAngle, setCustomAngle] = useState(180);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  const renderMoon = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current) return;
    rendererRef.current.render(sceneRef.current.scene, sceneRef.current.camera);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(MOON_SIZE, MOON_SIZE);
    renderer.setPixelRatio(2);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    const moonScene = createMoonScene({
      phaseAngle: 180,
      size: MOON_SIZE * 2,
    });
    sceneRef.current = moonScene;

    const loadingManager = THREE.DefaultLoadingManager;
    loadingManager.onLoad = () => {
      setTexturesLoaded(true);
      renderer.render(moonScene.scene, moonScene.camera);
    };

    const checkInterval = setInterval(() => {
      if (
        moonScene.colorMap.image &&
        moonScene.displacementMap.image
      ) {
        setTexturesLoaded(true);
        renderer.render(moonScene.scene, moonScene.camera);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      moonScene.material.dispose();
      moonScene.colorMap.dispose();
      moonScene.displacementMap.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !texturesLoaded) return;
    const angle = selectedPhase >= 0 ? PHASES[selectedPhase].angle : customAngle;
    sceneRef.current.setPhaseAngle(angle);
    renderMoon();
  }, [selectedPhase, customAngle, texturesLoaded, renderMoon]);

  const handlePhaseClick = (index: number) => {
    setSelectedPhase(index);
    setCustomAngle(PHASES[index].angle);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCustomAngle(val);
    setSelectedPhase(-1);
    if (sceneRef.current && texturesLoaded) {
      sceneRef.current.setPhaseAngle(val);
      renderMoon();
    }
  };

  const currentAngle =
    selectedPhase >= 0 ? PHASES[selectedPhase].angle : customAngle;
  const currentName =
    selectedPhase >= 0
      ? PHASES[selectedPhase].name
      : `Phase ${customAngle}°`;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.eyebrow}>Stage 2 Preview</div>
        <h1 style={styles.title}>NASA Moon Renderer</h1>
        <p style={styles.subtitle}>
          Three.js + NASA CGI Moon Kit LROC textures &middot; Continuous phase
          rendering
        </p>
      </div>

      <div style={styles.main}>
        <div style={styles.moonContainer}>
          <div
            ref={containerRef}
            style={styles.canvasWrap}
          />
          {!texturesLoaded && (
            <div style={styles.loading}>Loading NASA textures...</div>
          )}
        </div>

        <div style={styles.info}>
          <div style={styles.phaseName}>{currentName}</div>
          <div style={styles.phaseAngle}>{currentAngle}°</div>
        </div>

        <div style={styles.sliderSection}>
          <label style={styles.sliderLabel}>Phase Angle</label>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={currentAngle}
            onChange={handleSlider}
            style={styles.slider}
          />
          <div style={styles.sliderTicks}>
            <span>0° New</span>
            <span>90° Q1</span>
            <span>180° Full</span>
            <span>270° Q3</span>
            <span>360°</span>
          </div>
        </div>

        <div style={styles.phaseGrid}>
          {PHASES.map((phase, i) => (
            <button
              key={phase.angle}
              onClick={() => handlePhaseClick(i)}
              style={{
                ...styles.phaseBtn,
                ...(selectedPhase === i ? styles.phaseBtnActive : {}),
              }}
            >
              <div style={styles.phaseBtnAngle}>{phase.angle}°</div>
              <div style={styles.phaseBtnName}>{phase.name}</div>
              <div style={styles.phaseBtnIllum}>{phase.illum}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.credit}>
        Lunar surface texture: NASA/GSFC/Arizona State University (LROC) &middot;
        Elevation data: NASA/GSFC/MIT (LOLA) &middot;{" "}
        <a
          href="https://svs.gsfc.nasa.gov/4720"
          target="_blank"
          rel="noopener"
          style={styles.creditLink}
        >
          CGI Moon Kit
        </a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0c12",
    color: "#d4d8e4",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "40px 20px 60px",
  },
  header: {
    maxWidth: 800,
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
  },
  main: {
    maxWidth: 600,
    margin: "0 auto",
  },
  moonContainer: {
    position: "relative" as const,
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
  },
  canvasWrap: {
    width: MOON_SIZE,
    height: MOON_SIZE,
    borderRadius: "50%",
    overflow: "hidden",
  },
  loading: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#7a8099",
    fontSize: 14,
    fontFamily: "Consolas, Menlo, monospace",
  },
  info: {
    textAlign: "center" as const,
    marginBottom: 24,
  },
  phaseName: {
    fontFamily: "Georgia, Cambria, serif",
    fontSize: 22,
    marginBottom: 2,
  },
  phaseAngle: {
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 14,
    color: "#c9a84c",
  },
  sliderSection: {
    marginBottom: 24,
    padding: "0 8px",
  },
  sliderLabel: {
    display: "block",
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#515672",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 4,
    accentColor: "#c9a84c",
    cursor: "pointer",
  },
  sliderTicks: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 10,
    color: "#515672",
    marginTop: 4,
  },
  phaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    marginBottom: 32,
  },
  phaseBtn: {
    background: "#13161f",
    border: "1px solid #252a38",
    borderRadius: 6,
    padding: "10px 8px",
    cursor: "pointer",
    textAlign: "center" as const,
    color: "#d4d8e4",
    transition: "border-color 0.15s",
  },
  phaseBtnActive: {
    borderColor: "#c9a84c",
    background: "rgba(201, 168, 76, 0.08)",
  },
  phaseBtnAngle: {
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 12,
    color: "#c9a84c",
    marginBottom: 2,
  },
  phaseBtnName: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 2,
  },
  phaseBtnIllum: {
    fontFamily: "Consolas, Menlo, monospace",
    fontSize: 10,
    color: "#7a8099",
  },
  credit: {
    maxWidth: 600,
    margin: "0 auto",
    textAlign: "center" as const,
    fontSize: 11,
    color: "#515672",
    lineHeight: 1.5,
    fontFamily: "Consolas, Menlo, monospace",
  },
  creditLink: {
    color: "#7a8099",
    textDecoration: "underline",
  },
};
