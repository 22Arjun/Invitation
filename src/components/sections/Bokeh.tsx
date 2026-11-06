"use client";

import { useEffect, useRef } from "react";

type Light = { x: number; y: number; r: number; a: number; tw: number; vy: number; hue: string };

const HUES = ["255,200,120", "255,170,90", "255,225,170", "240,120,150"];

/** Drifting, twinkling fairy-light bokeh. Pauses itself when off-screen. */
export function Bokeh({ count = 46, className = "" }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    // Soft glows gain nothing from retina resolution; 1× keeps the canvas cheap to upload each frame.
    const dpr = 1;
    const lights: Light[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    for (let i = 0; i < count; i++) {
      lights.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2 + Math.random() ** 2 * 22,
        a: Math.random() * Math.PI * 2,
        tw: 0.008 + Math.random() * 0.02,
        vy: 0.08 + Math.random() * 0.25,
        hue: HUES[(Math.random() * HUES.length) | 0],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const l of lights) {
        l.a += l.tw;
        l.y -= reduce ? 0 : l.vy;
        if (l.y < -30) {
          l.y = h + 30;
          l.x = Math.random() * w;
        }
        const alpha = 0.25 + Math.sin(l.a) * 0.2;
        const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        g.addColorStop(0, `rgba(${l.hue},${alpha + 0.25})`);
        g.addColorStop(0.4, `rgba(${l.hue},${alpha * 0.6})`);
        g.addColorStop(1, `rgba(${l.hue},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
