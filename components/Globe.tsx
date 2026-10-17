"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [33.8938, 35.5018], size: 0.12 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerStart = useRef<number | null>(null);

  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let width = canvas.offsetWidth;
    let phi = 0;
    let frame = 0;

    const globe = createGlobe(canvas, {
      ...config,
      width: width * 2,
      height: width * 2,
    });

    const tick = () => {
      if (pointerStart.current === null && !reduceMotion) phi += 0.005;
      globe.update({
        phi: phi + smoothRotation.get(),
        width: width * 2,
        height: width * 2,
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const observer = new ResizeObserver(() => {
      width = canvas.offsetWidth;
    });
    observer.observe(canvas);

    const fadeIn = setTimeout(() => (canvas.style.opacity = "1"), 0);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fadeIn);
      observer.disconnect();
      globe.destroy();
    };
  }, [smoothRotation, config]);

  const setDragging = (x: number | null) => {
    pointerStart.current = x;
    if (canvasRef.current)
      canvasRef.current.style.cursor = x !== null ? "grabbing" : "grab";
  };

  const drag = (clientX: number) => {
    if (pointerStart.current === null) return;
    rotation.set(
      rotation.get() + (clientX - pointerStart.current) / MOVEMENT_DAMPING,
    );
  };

  return (
    <div
      className={twMerge("mx-auto aspect-square w-full max-w-150", className)}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="A spinning globe with Beirut marked"
        className="size-120 cursor-grab opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        onPointerDown={(e) => setDragging(e.clientX)}
        onPointerUp={() => setDragging(null)}
        onPointerOut={() => setDragging(null)}
        onMouseMove={(e) => drag(e.clientX)}
        onTouchMove={(e) => e.touches[0] && drag(e.touches[0].clientX)}
      />
    </div>
  );
}
