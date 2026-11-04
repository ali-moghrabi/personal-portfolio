"use client";

import { useEffect, useRef } from "react";
import { Color, Vector2, type ShaderMaterial } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PALETTES, type PaletteName } from "@/lib/palettes";
import { gradientFragment, gradientVertex } from "./gradientShader";

const uniforms = {
  uTime: { value: 0.6 },
  uDensity: { value: 0.75 },
  uStrength: { value: 1.9 },
  uDim: { value: 1 },
  uRes: { value: new Vector2(1, 1) },
  uC1: { value: new Color(PALETTES.hero.a) },
  uC2: { value: new Color(PALETTES.hero.b) },
  uC3: { value: new Color(PALETTES.hero.deep) },
};
const goal = { a: new Color(), b: new Color(), deep: new Color() };

function usePaletteTarget() {
  const target = useRef<PaletteName>("hero");
  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const name = (entry.target as HTMLElement).dataset.palette;
            if (name && name in PALETTES) target.current = name as PaletteName;
          }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document
      .querySelectorAll<HTMLElement>("[data-palette]")
      .forEach((el) => seen.observe(el));
    return () => seen.disconnect();
  }, []);
  return target;
}

export default function GradientField({ still }: { still: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const target = usePaletteTarget();
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  useFrame((_, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const step = Math.min(delta, 0.1);
    if (!still) u.uTime.value += step * 0.12;
    const p = PALETTES[target.current];
    const k = still ? 1 : 1 - Math.exp(-step * 1.6);
    u.uC1.value.lerp(goal.a.set(p.a), k);
    u.uC2.value.lerp(goal.b.set(p.b), k);
    u.uC3.value.lerp(goal.deep.set(p.deep), k);
    u.uDim.value += (p.dim - u.uDim.value) * k;
    u.uRes.value.set(size.width * dpr, size.height * dpr);
  });

  return (
    <mesh position={[0, 0, -4]} rotation={[-0.45, 0, 0.35]}>
      <planeGeometry args={[30, 20, 180, 120]} />
      <shaderMaterial
        ref={material}
        vertexShader={gradientVertex}
        fragmentShader={gradientFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
