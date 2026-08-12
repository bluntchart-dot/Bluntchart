"use client";

import { useCallback, useRef } from "react";

export default function VibrantStarBackground() {
  const cleanupRef = useRef<(() => void) | null>(null);

  const canvasCallback = useCallback((canvas: HTMLCanvasElement | null) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (!canvas) return;
    const c = canvas;

    const ctx = c.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let alive = true;

    let stars: {
      x: number;
      y: number;
      r: number;
      a: number;
      speed: number;
    }[] = [];
    let shootingStars: {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      alpha: number;
      life: number;
      maxLife: number;
    }[] = [];

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      const count = Math.floor(
        (c.width * c.height) / 12000,
      );
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.004 + 0.001,
      }));
    }

    function spawnShootingStar() {
      if (shootingStars.length >= 2) return;
      shootingStars.push({
        x: Math.random() * c.width * 0.7,
        y: Math.random() * c.height * 0.25,
        len: 70 + Math.random() * 90,
        speed: 2 + Math.random() * 2.5,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
        alpha: 0,
        life: 0,
        maxLife: 80 + Math.random() * 50,
      });
    }

    let frame = 0;
    function draw() {
      if (!alive) return;
      ctx.clearRect(0, 0, c.width, c.height);

      for (const s of stars) {
        s.a += s.speed;
        const alpha = 0.25 + Math.abs(Math.sin(s.a)) * 0.75;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,233,220,${alpha * 0.8})`;
        ctx.fill();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        const p = ss.life / ss.maxLife;
        ss.alpha =
          p < 0.1 ? p * 10 : p > 0.7 ? (1 - p) / 0.3 : 1;

        const grad = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len,
        );
        grad.addColorStop(
          0,
          `rgba(240,200,120,${ss.alpha * 0.95})`,
        );
        grad.addColorStop(1, "rgba(191,151,90,0)");
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len,
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      frame++;
      if (frame % 60 === 0 && Math.random() < 0.8)
        spawnShootingStar();
      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    spawnShootingStar();
    draw();

    cleanupRef.current = () => {
      alive = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasCallback}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
