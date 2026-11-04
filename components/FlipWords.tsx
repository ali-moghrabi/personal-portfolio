"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export function FlipWords({
  words,
  duration = 3000,
  className,
  letterClassName,
}: {
  words: string[];
  duration?: number;
  className?: string;
  /** per letter, e.g. a background-clip gradient that must sit on the letters themselves */
  letterClassName?: string;
}) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const current = words[index % words.length];

  useEffect(() => {
    if (animating) return;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      setAnimating(true);
    }, duration);
    return () => clearTimeout(timer);
  }, [animating, duration, words.length]);

  return (
    <span className="relative inline-block">
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence onExitComplete={() => setAnimating(false)}>
        <motion.span
          aria-hidden="true"
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: "blur(8px)",
            scale: 2,
            position: "absolute",
          }}
          className={twMerge("relative z-10 inline-block text-left", className)}
        >
          {current.split("").map((letter, i) => (
            <motion.span
              key={letter + i}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className={twMerge("inline-block", letterClassName)}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
