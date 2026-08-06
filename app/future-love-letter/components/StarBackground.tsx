"use client";

import { useRef, useEffect } from "react";

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
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
      canvas!.width = window.innerWidth;
      canvas!.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      initStars();
    }

    function initStars() {
      const count = Math.floor(
        (canvas!.width * canvas!.height) / 12000,
      );
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * Math.PI * 2,
        speed: prefersReduced ? 0 : Math.random() * 0.004 + 0.001,
      }));
    }

    function spawnShootingStar() {
      if (prefersReduced || shootingStars.length >= 2) return;
      shootingStars.push({
        x: Math.random() * canvas!.width * 0.7,
        y: Math.random() * canvas!.height * 0.25,
        len: 70 + Math.random() * 90,
        speed: 5 + Math.random() * 5,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
        alpha: 0,
        life: 0,
        maxLife: 55 + Math.random() * 35,
      });
    }

    let frame = 0;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const s of stars) {
        s.a += s.speed;
        const alpha = 0.25 + Math.abs(Math.sin(s.a)) * 0.75;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(240,233,220,${alpha * 0.45})`;
        ctx!.fill();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        const p = ss.life / ss.maxLife;
        ss.alpha =
          p < 0.1 ? p * 10 : p > 0.7 ? (1 - p) / 0.3 : 1;

        const grad = ctx!.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len,
        );
        grad.addColorStop(
          0,
          `rgba(191,151,90,${ss.alpha * 0.85})`,
        );
        grad.addColorStop(1, "rgba(191,151,90,0)");
        ctx!.beginPath();
        ctx!.moveTo(ss.x, ss.y);
        ctx!.lineTo(
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len,
        );
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      frame++;
      if (frame % 140 === 0 && Math.random() < 0.6)
        spawnShootingStar();
      animationId = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(document.body);
    draw();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
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
