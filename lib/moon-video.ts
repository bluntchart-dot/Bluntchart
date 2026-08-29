/**
 * Hero Moon Video Generator
 * Encodes canvas frames into MP4/H.264 using WebCodecs + mp4-muxer.
 * Reusable across A2, B1, B2 products.
 *
 * Two-phase approach to avoid "codec reclaimed due to inactivity":
 *   Phase 1 — render all frames (slow, yields to UI)
 *   Phase 2 — encode all frames in a rapid burst (encoder never idles)
 */

import { Muxer, ArrayBufferTarget } from "mp4-muxer";

export interface VideoEncodeConfig {
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  bitrate?: number;
  renderFrame: (
    frameIndex: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => void | Promise<void>;
  onProgress?: (pct: number) => void;
}

export async function encodeVideo(config: VideoEncodeConfig): Promise<Blob> {
  const {
    width,
    height,
    fps,
    totalFrames,
    bitrate = 8_000_000,
    renderFrame,
    onProgress,
  } = config;

  const frameDurationUs = Math.round(1_000_000 / fps);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Phase 1: pre-render all frames as ImageBitmap (browser-managed memory)
  const rendered: ImageBitmap[] = [];
  for (let i = 0; i < totalFrames; i++) {
    await renderFrame(i, canvas, ctx);
    rendered.push(await createImageBitmap(canvas));
    onProgress?.((i + 1) / totalFrames * 0.85);
    if (i % 2 === 0) await new Promise((r) => setTimeout(r, 0));
  }

  // Phase 2: encode rapidly — encoder never idles
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: { codec: "avc", width, height },
    fastStart: "in-memory",
  });

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => {
      throw e;
    },
  });

  encoder.configure({
    codec: "avc1.640028",
    width,
    height,
    bitrate,
    framerate: fps,
  });

  for (let i = 0; i < totalFrames; i++) {
    const frame = new VideoFrame(rendered[i], {
      timestamp: i * frameDurationUs,
      duration: frameDurationUs,
    });
    encoder.encode(frame, { keyFrame: i % 30 === 0 });
    frame.close();
    rendered[i].close();
    onProgress?.(0.85 + ((i + 1) / totalFrames) * 0.15);
  }

  rendered.length = 0;

  await encoder.flush();
  encoder.close();
  muxer.finalize();

  canvas.width = 0;
  canvas.height = 0;

  return new Blob([target.buffer], { type: "video/mp4" });
}
