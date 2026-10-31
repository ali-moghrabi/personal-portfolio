"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const Hero3DModel = dynamic(() => import("./Hero3DModel"), {
  ssr: false,
  loading: () => null,
});

const saveData = () =>
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData === true;

const noSubscribe = () => () => {};

export default function HeroScene() {
  const skip = useSyncExternalStore(noSubscribe, saveData, () => true);
  return skip ? null : <Hero3DModel />;
}
