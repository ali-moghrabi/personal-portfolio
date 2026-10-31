"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithoutRef<"div"> & {
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  color?: string;
  vx?: number;
  vy?: number;
};

type Dot = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

const hexToRgb = (hex: string) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

export function Particles({
  className,
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = container.current;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!box || !el || !ctx) return;

    const rgb = hexToRgb(color);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let frame = 0;
    let visible = false;

    const newDot = (): Dot => ({
      x: Math.random() * w,
      y: Math.random() * h,
      tx: 0,
      ty: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: still ? 0.5 : 0,
      targetAlpha: Math.round((Math.random() * 0.6 + 0.1) * 10) / 10,
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    });

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x + d.tx, d.y + d.ty, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${d.alpha})`;
        ctx.fill();
      }
    };

    const resize = () => {
      w = box.offsetWidth;
      h = box.offsetHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      dots = Array.from({ length: quantity }, newDot);
      draw();
    };

    const step = () => {
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const edge = Math.min(
          d.x + d.tx - d.size,
          w - d.x - d.tx - d.size,
          d.y + d.ty - d.size,
          h - d.y - d.ty - d.size,
        );
        const fade = Math.max(0, edge / 20);
        d.alpha =
          fade > 1
            ? Math.min(d.targetAlpha, d.alpha + 0.02)
            : d.targetAlpha * fade;
        d.x += d.dx + vx;
        d.y += d.dy + vy;
        d.tx += (mouse.x / (staticity / d.magnetism) - d.tx) / ease;
        d.ty += (mouse.y / (staticity / d.magnetism) - d.ty) / ease;
        if (
          d.x < -d.size ||
          d.x > w + d.size ||
          d.y < -d.size ||
          d.y > h + d.size
        )
          dots[i] = newDot();
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const play = () => {
      if (!still && visible && !frame) frame = requestAnimationFrame(step);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      if (Math.abs(x) < w / 2 && Math.abs(y) < h / 2) {
        mouse.x = x;
        mouse.y = y;
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const sizes = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });

    resize();
    sizes.observe(box);
    seen.observe(box);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      pause();
      clearTimeout(resizeTimer);
      sizes.disconnect();
      seen.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [quantity, staticity, ease, size, color, vx, vy]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      className={twMerge("pointer-events-none", className)}
      {...props}
    >
      <canvas ref={canvas} className="size-full" />
    </div>
  );
}
