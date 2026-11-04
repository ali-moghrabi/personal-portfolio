"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

const noSubscribe = () => () => {};
let supported: boolean | undefined;
const canRender = () => {
  if (supported === undefined) supported = probe();
  return supported;
};
const probe = () => {
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true;
  if (saveData) return false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
};

/**
 * Fixed behind the whole page: a CSS gradient straight away, then the WebGL scene
 * (ShaderGradient-style waves and the hero's liquid glass) once it has loaded.
 */
export default function Backdrop() {
  const webgl = useSyncExternalStore(noSubscribe, canRender, () => false);
  return (
    <div aria-hidden="true" className="backdrop">
      <div className="backdrop-fallback" />
      {webgl && (
        <div className="backdrop-scene">
          <SceneCanvas />
        </div>
      )}
    </div>
  );
}
