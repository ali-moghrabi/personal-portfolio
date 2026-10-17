"use client";

import { useProgress } from "@react-three/drei";

export default function Loader() {
  const { active, progress } = useProgress();
  const done = !active && progress === 100;

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none absolute inset-0 grid place-items-center text-xl font-normal transition-opacity duration-500 ${
        done ? "opacity-0" : "opacity-100"
      }`}
    >
      {!done && <span>{Math.round(progress)}% Loaded</span>}
    </div>
  );
}
