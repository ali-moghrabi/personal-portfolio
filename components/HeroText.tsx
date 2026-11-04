"use client";

import { motion, type Variants } from "motion/react";
import { FlipWords } from "./FlipWords";
import LiquidGlass from "./LiquidGlass";

const WORDS = ["secure", "modern", "scalable", "fastest"];

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.15 + i * 0.12,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function HeroText() {
  return (
    <div className="relative z-10 mt-28 w-full pb-10 text-center md:mt-36 md:max-w-xl md:pb-14 md:text-left lg:max-w-2xl [@media(max-height:760px)]:mt-24">
      <motion.p
        custom={0}
        variants={item}
        initial="hidden"
        animate="visible"
        className="relative isolate inline-flex h-9 items-center gap-2.5 rounded-full px-4 text-xs font-medium tracking-[0.18em] text-white/90 uppercase"
      >
        <LiquidGlass radius={999} strength={24} />
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-mint" />
        </span>
        Available for new projects
      </motion.p>

      <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
        <motion.span
          custom={1}
          variants={item}
          initial="hidden"
          animate="visible"
          className="block"
        >
          <span className="sr-only">Ali Moghrabi, </span>
          Full-stack developer crafting
        </motion.span>
        <motion.span
          custom={2}
          variants={item}
          initial="hidden"
          animate="visible"
          className="block"
        >
          <FlipWords
            words={WORDS}
            className="font-black italic"
            letterClassName="text-chrome pr-[0.04em]"
          />{" "}
          <span className="text-white/70">web experiences.</span>
        </motion.span>
      </h1>

      <motion.p
        custom={3}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mx-auto mt-6 max-w-md text-pretty text-neutral-300 md:mx-0 md:text-lg"
      >
        I design and build products end to end, from the database to the last
        pixel, and ship them fast.
      </motion.p>

      <motion.div
        custom={4}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
      >
        <a href="#projects" className="btn-primary">
          See my work
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
        <a href="#contact" className="btn-ghost">
          <LiquidGlass radius={999} strength={28} />
          Let&apos;s talk
        </a>
      </motion.div>
    </div>
  );
}
