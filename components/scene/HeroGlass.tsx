"use client";

import { useRef } from "react";
import type { Group, Mesh, Texture } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  useFBO,
} from "@react-three/drei";
import { easing } from "maath";

export default function HeroGlass({
  mobile,
  still,
}: {
  mobile: boolean;
  still: boolean;
}) {
  const anchor = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const glass = useRef<Group>(null);
  const behind = useFBO(mobile ? 256 : 640, mobile ? 256 : 640);
  const w = useThree((s) => s.viewport.width);
  const h = useThree((s) => s.viewport.height);

  const narrow = w / h < 1.5;
  const x = mobile ? 0 : w * (narrow ? 0.31 : 0.24);
  const y = mobile ? -h * 0.2 : 0.05;
  const size = mobile
    ? Math.min(w * 0.3, 1.05)
    : Math.min(h * 0.17, w * (narrow ? 0.085 : 0.1));

  useFrame((state, delta) => {
    if (glass.current) {
      glass.current.visible = false;
      state.gl.setRenderTarget(behind);
      state.gl.render(state.scene, state.camera);
      state.gl.setRenderTarget(null);
      glass.current.visible = true;
    }
    if (anchor.current)
      anchor.current.position.y = y + (window.scrollY / window.innerHeight) * h;
    if (still) return;
    if (tilt.current)
      easing.dampE(
        tilt.current.rotation,
        [-state.pointer.y * 0.25, state.pointer.x * 0.45, 0],
        0.5,
        delta,
      );
    const t = state.clock.elapsedTime;
    if (ring.current) {
      ring.current.rotation.x = 1.15 + Math.sin(t * 0.4) * 0.12;
      ring.current.rotation.y = 0.25 + Math.sin(t * 0.3) * 0.15;
      ring.current.rotation.z += delta * 0.25;
    }
    if (core.current) core.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={anchor} position={[x, y, 0]}>
      <group ref={tilt}>
        <mesh ref={core}>
          <sphereGeometry
            args={[size * 0.75, mobile ? 80 : 128, mobile ? 80 : 128]}
          />
          <MeshDistortMaterial
            distort={0.32}
            speed={still ? 0 : 1.6}
            color="#ffffff"
            metalness={1}
            roughness={0.06}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={1}
            iridescenceIOR={1.6}
            envMapIntensity={1.4}
          />
        </mesh>

        <group ref={glass}>
          <mesh ref={ring} rotation={[1.15, 0.25, 0.35]}>
            <torusGeometry
              args={[
                size * 1.3,
                size * 0.13,
                mobile ? 32 : 64,
                mobile ? 128 : 220,
              ]}
            />
            <MeshTransmissionMaterial
              buffer={behind.texture}
              resolution={32}
              samples={mobile ? 3 : 6}
              transmission={1}
              thickness={size * 0.35}
              roughness={0.03}
              ior={1.35}
              chromaticAberration={0.12}
              anisotropicBlur={0.1}
              distortion={0.3}
              distortionScale={0.4}
              temporalDistortion={still ? 0 : 0.1}
              clearcoat={1}
              attenuationDistance={2.5}
              attenuationColor="#efe9ff"
              color="#f6f3ff"
            />
          </mesh>

          <Float
            speed={still ? 0 : 1.4}
            rotationIntensity={0.6}
            floatIntensity={0.8}
          >
            <Droplet
              buffer={behind.texture}
              position={[-size * 1.75, -size * 1.0, size * 0.6]}
              r={size * 0.24}
            />
            <Droplet
              buffer={behind.texture}
              position={[size * 1.6, size * 1.15, size * 0.2]}
              r={size * 0.16}
            />
            {!mobile && (
              <Droplet
                buffer={behind.texture}
                position={[size * 0.5, -size * 1.6, -size * 0.4]}
                r={size * 0.1}
              />
            )}
          </Float>
        </group>
      </group>
    </group>
  );
}

function Droplet({
  position,
  r,
  buffer,
}: {
  position: [number, number, number];
  r: number;
  buffer: Texture;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[r, 40, 40]} />
      <MeshTransmissionMaterial
        buffer={buffer}
        resolution={32}
        samples={3}
        transmission={1}
        thickness={r * 1.6}
        roughness={0.02}
        ior={1.4}
        chromaticAberration={0.08}
        clearcoat={1}
        color="#ffffff"
        attenuationColor="#e8e2ff"
        attenuationDistance={1.5}
      />
    </mesh>
  );
}
