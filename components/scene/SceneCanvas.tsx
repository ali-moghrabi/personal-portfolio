"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import { easing } from "maath";
import GradientField from "./GradientField";
import HeroGlass from "./HeroGlass";

const media = (query: string) => ({
  subscribe: (onChange: () => void) => {
    const m = window.matchMedia(query);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  },
  get: () => window.matchMedia(query).matches,
});
const MOBILE = media("(max-width: 853px)");
const STILL = media("(prefers-reduced-motion: reduce)");

const heroInView = {
  subscribe: (onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  },
  get: () => window.scrollY < window.innerHeight * 1.15,
};

export default function SceneCanvas() {
  const mobile = useSyncExternalStore(
    MOBILE.subscribe,
    MOBILE.get,
    () => false,
  );
  const still = useSyncExternalStore(STILL.subscribe, STILL.get, () => false);
  const showGlass = useSyncExternalStore(
    heroInView.subscribe,
    heroInView.get,
    () => true,
  );

  const maxDpr = mobile ? 1.25 : 1.5;
  const [dpr, setDpr] = useState(maxDpr);

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={Math.min(dpr, maxDpr)}
      gl={{
        antialias: !mobile,
        powerPreference: "high-performance",
        alpha: false,
      }}
    >
      <color attach="background" args={["#030412"]} />
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(maxDpr)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      {!still && <FrameCap fps={60} />}
      <GradientField still={still} />
      {showGlass && (
        <Suspense fallback={null}>
          <HeroGlass mobile={mobile} still={still} />
        </Suspense>
      )}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#2a1d66"]} />
        <Lightformer
          form="rect"
          intensity={4}
          position={[0, 5, 1]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#8f6bff"
          position={[-5, 1, 2]}
          scale={[5, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ff4fa8"
          position={[5, -1, 2]}
          scale={[5, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#3fd6e6"
          position={[0, -5, 1]}
          scale={[10, 3, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2}
          position={[2, 1, 6]}
          scale={2}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#ca2f8c"
          position={[0, 0, -6]}
          scale={[12, 6, 1]}
        />
      </Environment>
      {!mobile && !still && <PointerParallax />}
      {still && <RedrawOnScroll />}
    </Canvas>
  );
}

function PointerParallax() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x * 0.25, state.pointer.y * 0.18, 6],
      0.6,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function FrameCap({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const gap = 1000 / fps - 2;
    let last = 0;
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < gap) return;
      last = now;
      invalidate();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);
  return null;
}

function RedrawOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const redraw = () => invalidate();
    window.addEventListener("scroll", redraw, { passive: true });
    return () => window.removeEventListener("scroll", redraw);
  }, [invalidate]);
  return null;
}
