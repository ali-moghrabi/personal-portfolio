"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import LiquidGlass from "./LiquidGlass";

const beirut = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Beirut",
  hour: "2-digit",
  minute: "2-digit",
});

// my local time, ticking once every 15 seconds
const clock = {
  subscribe: (onChange: () => void) => {
    const id = window.setInterval(onChange, 15_000);
    return () => window.clearInterval(id);
  },
  get: () => beirut.format(new Date()),
  server: () => "--:--",
};

export default function HeroStatus() {
  const time = useSyncExternalStore(clock.subscribe, clock.get, clock.server);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate flex h-12 items-center justify-between gap-4 rounded-full px-5 text-xs text-neutral-200 sm:text-sm"
    >
      <LiquidGlass radius={999} strength={30} />
      <p className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-mint shadow-[0_0_10px] shadow-mint" />
        <span>
          Beirut <span className="tabular-nums text-white">{time}</span>
        </span>
        <span className="hidden text-neutral-400 sm:inline">· remote worldwide</span>
      </p>
      <p className="hidden text-neutral-300 md:block">
        Next.js · NestJS · Three.js · MongoDB
      </p>
      <a
        href="#stack"
        className="flex items-center gap-2 text-neutral-300 transition-colors hover:text-white"
      >
        Scroll
        <span className="flex h-6 w-4 justify-center rounded-full border border-white/40 pt-1">
          <span className="size-1 animate-scroll-dot rounded-full bg-white" />
        </span>
      </a>
    </motion.div>
  );
}
