"use client";

import { motion, type Variants } from "motion/react";
import { FlipWords } from "./FlipWords";

const WORDS = ["Secure", "Modern", "Scalable"];

const item: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.15 + i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function HeroText() {
  return (
    <div className="relative z-10 mt-24 text-center md:mt-36 md:text-left">
      <motion.p
        custom={0}
        variants={item}
        initial="hidden"
        animate="visible"
        className="eyebrow justify-center md:justify-start"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-mint" />
        </span>
        Available for new projects
      </motion.p>

      <h1 className="mt-5">
        <motion.span
          custom={1}
          variants={item}
          initial="hidden"
          animate="visible"
          className="block text-4xl font-medium"
        >
          Hi, I&apos;m Ali
        </motion.span>
        <motion.span
          custom={2}
          variants={item}
          initial="hidden"
          animate="visible"
          className="mt-3 block text-5xl font-black text-neutral-300 md:font-medium"
        >
          <span className="md:hidden">Building</span>
          <span className="hidden md:inline">
            A Developer <br /> Dedicated to Crafting
          </span>
        </motion.span>
        <motion.span
          custom={3}
          variants={item}
          initial="hidden"
          animate="visible"
          className="block"
        >
          <FlipWords
            words={WORDS}
            className="text-7xl font-bold text-white md:text-8xl md:font-black"
          />
        </motion.span>
        <motion.span
          custom={4}
          variants={item}
          initial="hidden"
          animate="visible"
          className="block text-4xl font-black text-neutral-300 md:font-medium"
        >
          <span className="md:hidden">Web Applications</span>
          <span className="hidden md:inline">Web Solutions</span>
        </motion.span>
      </h1>

      <motion.div
        custom={5}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
      >
        <a href="#projects" className="btn-primary">
          See my work
        </a>
        <a href="#contact" className="btn-ghost">
          Let&apos;s talk
        </a>
      </motion.div>
    </div>
  );
}
