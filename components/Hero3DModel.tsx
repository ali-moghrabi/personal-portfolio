"use client";

import { Suspense, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { easing } from "maath";
import { Astronaut } from "./Astronaut";
import Loader from "./Loader";

const MOBILE_QUERY = "(max-width: 853px)";

function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(MOBILE_QUERY);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

export default function Hero3DModel() {
  const isMobile = useIsMobile();

  return (
    <figure className="absolute inset-0 w-screen h-svh" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1, 3] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Float>
            <Astronaut
              scale={isMobile ? 0.2 : 0.265}
              position={isMobile ? [0, -1.5, 0] : [1.3, -1, 0]}
            />
          </Float>
          <Rig />
        </Suspense>
      </Canvas>
      <Loader />
    </figure>
  );
}

function Rig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x / 10, 1 + state.pointer.y / 10, 3],
      0.5,
      delta,
    );
  });
  return null;
}
