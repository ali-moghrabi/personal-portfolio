"use client";

import { useEffect, useRef } from "react";
import type { AnimationClip, Bone, Group, Material, SkinnedMesh } from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useMotionValue, useSpring } from "motion/react";

const MODEL = "/models/astronaut.glb";

const MESHES = [
  "Cube001_0",
  "Cube005_0",
  "Cube002_0",
  "Plane_0",
  "Cube008_0",
  "Cube004_0",
  "Cube003_0",
  "Cube_0",
  "Cube009_0",
  "Cube011_0",
] as const;
type MeshName = (typeof MESHES)[number];

type AstronautGLTF = {
  nodes: Record<MeshName, SkinnedMesh> & { metarig_rootJoint: Bone };
  materials: { "AstronautFallingTexture.png": Material };
  animations: AnimationClip[];
};

export function Astronaut(props: ThreeElements["group"]) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(
    MODEL,
  ) as unknown as AstronautGLTF;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const first = animations[0];
    if (first) actions[first.name]?.play();
  }, [actions, animations]);

  const yPosition = useMotionValue(5);
  const ySpring = useSpring(yPosition, { damping: 30 });

  useEffect(() => {
    ySpring.set(-1);
  }, [ySpring]);

  useFrame(() => {
    if (group.current) group.current.position.y = ySpring.get();
  });

  return (
    <group
      {...props}
      ref={group}
      dispose={null}
      rotation={[-Math.PI / 2, -0.2, 2.2]}
      scale={props.scale ?? 0.3}
      position={props.position}
    >
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model">
          <group name="Root">
            <group name="metarig">
              <primitive object={nodes.metarig_rootJoint} />
              {MESHES.map((name) => (
                <skinnedMesh
                  key={name}
                  name={name}
                  geometry={nodes[name].geometry}
                  material={materials["AstronautFallingTexture.png"]}
                  skeleton={nodes[name].skeleton}
                />
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
