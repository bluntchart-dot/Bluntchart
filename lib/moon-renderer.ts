import * as THREE from "three";

export interface MoonRenderOptions {
  phaseAngle: number;
  size: number;
  premium?: boolean;
  displacementScale?: number;
  bumpScale?: number;
  earthshineIntensity?: number;
  sunIntensity?: number;
  antialias?: boolean;
}

const RAW_DEFAULTS = {
  displacementScale: 0.015,
  bumpScale: 0.025,
  earthshineIntensity: 0.008,
  sunIntensity: 3.0,
  roughness: 1.0,
  toneMappingExposure: 1.0,
};

const PREMIUM_DEFAULTS = {
  displacementScale: 0.02,
  bumpScale: 0.10,
  earthshineIntensity: 0.12,
  sunIntensity: 4.56,
  roughness: 0.88,
  toneMappingExposure: 1.25,
};

export function createMoonScene(opts: MoonRenderOptions) {
  const defaults = opts.premium ? PREMIUM_DEFAULTS : RAW_DEFAULTS;
  const o = {
    displacementScale: opts.displacementScale ?? defaults.displacementScale,
    bumpScale: opts.bumpScale ?? defaults.bumpScale,
    earthshineIntensity:
      opts.earthshineIntensity ?? defaults.earthshineIntensity,
    sunIntensity: opts.sunIntensity ?? defaults.sunIntensity,
    antialias: opts.antialias ?? true,
    premium: opts.premium ?? false,
  };

  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    -1.05, 1.05, 1.05, -1.05, 0.1, 100
  );
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.SphereGeometry(1, 256, 256);
  const textureLoader = new THREE.TextureLoader();

  const colorMap = textureLoader.load("/moon-textures/color-2k.jpg");
  colorMap.colorSpace = THREE.SRGBColorSpace;

  const displacementMap = textureLoader.load(
    "/moon-textures/displacement-2k.png"
  );

  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
    bumpMap: displacementMap,
    bumpScale: o.bumpScale,
    displacementMap: displacementMap,
    displacementScale: o.displacementScale,
    roughness: defaults.roughness,
    metalness: 0.0,
  });

  const moon = new THREE.Mesh(geometry, material);
  scene.add(moon);

  const phiRad = (opts.phaseAngle * Math.PI) / 180;

  const sunLight = new THREE.DirectionalLight(0xfff5e8, o.sunIntensity);
  sunLight.position.set(
    Math.sin(phiRad) * 10,
    0.3,
    -Math.cos(phiRad) * 10
  );
  sunLight.lookAt(0, 0, 0);
  scene.add(sunLight);

  const earthshine = new THREE.AmbientLight(0x8899bb, o.earthshineIntensity);
  scene.add(earthshine);

  return {
    scene,
    camera,
    moon,
    sunLight,
    material,
    colorMap,
    displacementMap,
    premium: o.premium,
    setPhaseAngle(angle: number) {
      const rad = (angle * Math.PI) / 180;
      sunLight.position.set(Math.sin(rad) * 10, 0.3, -Math.cos(rad) * 10);
    },
  };
}

/* ------------------------------------------------------------------ */
/*  2D post-processing: contrast curve + unsharp mask + limb glow     */
/* ------------------------------------------------------------------ */

function applyContrastCurve(
  data: Uint8ClampedArray,
  preserveShadows?: boolean
) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    for (let c = 0; c < 3; c++) {
      let v = data[i + c] / 255;
      const orig = v;
      v = v * v * (3 - 2 * v);
      if (preserveShadows && orig < 0.20) {
        const t = orig / 0.20;
        v = orig * (1 - t) + v * t;
      }
      v = Math.pow(v, 0.94);
      data[i + c] = Math.min(255, Math.max(0, Math.round(v * 255)));
    }
  }
}

function applyUnsharpMask(
  imageData: ImageData,
  amount: number,
  radius: number
) {
  const w = imageData.width;
  const h = imageData.height;
  const src = new Uint8ClampedArray(imageData.data);

  const kernel = Math.ceil(radius * 2) * 2 + 1;
  const half = Math.floor(kernel / 2);
  const sigma = radius;
  const weights: number[] = [];
  let wSum = 0;
  for (let i = 0; i < kernel; i++) {
    const x = i - half;
    const g = Math.exp(-(x * x) / (2 * sigma * sigma));
    weights.push(g);
    wSum += g;
  }
  for (let i = 0; i < kernel; i++) weights[i] /= wSum;

  const tmp = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let k = 0; k < kernel; k++) {
          const sx = Math.min(w - 1, Math.max(0, x + k - half));
          sum += src[(y * w + sx) * 4 + c] * weights[k];
        }
        tmp[(y * w + x) * 4 + c] = sum;
      }
    }
  }

  const blurred = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let k = 0; k < kernel; k++) {
          const sy = Math.min(h - 1, Math.max(0, y + k - half));
          sum += tmp[(sy * w + x) * 4 + c] * weights[k];
        }
        blurred[(y * w + x) * 4 + c] = sum;
      }
    }
  }

  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    for (let c = 0; c < 3; c++) {
      const diff = src[i + c] - blurred[i + c];
      data[i + c] = Math.min(
        255,
        Math.max(0, Math.round(src[i + c] + diff * amount))
      );
    }
  }
}

function applyLimbGlow(imageData: ImageData) {
  const w = imageData.width;
  const h = imageData.height;
  const data = imageData.data;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(cx, cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] === 0) continue;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const edgeDist = dist / r;

      if (edgeDist > 0.85 && edgeDist <= 1.0) {
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness > 80) {
          const t = (edgeDist - 0.85) / 0.15;
          const brightFactor = Math.min(1, (brightness - 80) / 120);
          const limbStrength = t * t * 0.15 * brightFactor;
          for (let c = 0; c < 3; c++) {
            data[idx + c] = Math.min(
              255,
              Math.round(data[idx + c] + (255 - data[idx + c]) * limbStrength)
            );
          }
        }
      }
    }
  }
}

export function postProcessPremium(
  canvas: HTMLCanvasElement,
  opts?: { shadowLift?: boolean }
) {
  const w = canvas.width;
  const h = canvas.height;

  const offscreen = document.createElement("canvas");
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext("2d")!;

  ctx.drawImage(canvas, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);

  applyContrastCurve(imageData.data, opts?.shadowLift);
  applyUnsharpMask(imageData, 0.5, 1.5);
  applyLimbGlow(imageData);

  ctx.putImageData(imageData, 0, 0);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext("2d")!;
  outCtx.drawImage(offscreen, 0, 0);
  return outCanvas;
}

/* ------------------------------------------------------------------ */
/*  High-level renderer                                               */
/* ------------------------------------------------------------------ */

export function createMoonRenderer(
  canvas: HTMLCanvasElement,
  size: number,
  opts?: Partial<MoonRenderOptions>
) {
  const premium = opts?.premium ?? false;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: opts?.antialias ?? true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(size, size);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = premium
    ? PREMIUM_DEFAULTS.toneMappingExposure
    : RAW_DEFAULTS.toneMappingExposure;

  const moonScene = createMoonScene({
    phaseAngle: opts?.phaseAngle ?? 180,
    size,
    premium,
    ...opts,
  });

  function render() {
    renderer.render(moonScene.scene, moonScene.camera);
  }

  function setPhaseAngle(angle: number) {
    moonScene.setPhaseAngle(angle);
    render();
  }

  function toDataURL(): string {
    render();
    if (premium) {
      const processed = postProcessPremium(canvas);
      return processed.toDataURL("image/png");
    }
    return canvas.toDataURL("image/png");
  }

  function dispose() {
    moonScene.material.dispose();
    moonScene.colorMap.dispose();
    moonScene.displacementMap.dispose();
    renderer.dispose();
  }

  return { render, setPhaseAngle, toDataURL, dispose, moonScene, renderer };
}
