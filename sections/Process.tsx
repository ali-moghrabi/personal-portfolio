"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

const STEPS = [
  {
    title: "Discover",
    text: "We talk through your goals, your users and what success looks like. I come back with a clear scope, timeline and price.",
    tags: ["Goals", "Scope", "Estimate"],
  },
  {
    title: "Design",
    text: "Wireframes, then a polished interface you can click through, so you see the product before a line of code is written.",
    tags: ["UX flows", "UI design", "Prototype"],
  },
  {
    title: "Build",
    text: "Type-safe front and back end, tested and secure, with progress you can try every week on a live preview link.",
    tags: ["Next.js", "NestJS", "Weekly previews"],
  },
  {
    title: "Launch & grow",
    text: "Deployment, domains, analytics and SEO, then support after launch: new features, performance and monitoring.",
    tags: ["Deploy", "SEO", "Support"],
  },
];

/** How I work: four glass panels on a line that fills as you scroll */
export default function Process() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 75%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section
      id="process"
      data-palette="process"
      aria-labelledby="process-title"
      className="c-space section-spacing"
    >
      <p className="eyebrow">Process</p>
      <h2 id="process-title" className="text-heading mt-3">
        From idea to launch
      </h2>
      <p className="subtext mt-3 max-w-2xl">
        A simple way of working that keeps you in the loop at every step.
      </p>

      <ol ref={list} className="relative mt-14 grid gap-5 lg:grid-cols-4">
        {/* the progress line (left on phones, across on wide screens) */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[1.6rem] w-px bg-white/10 lg:top-[1.6rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: fill }}
          className="absolute top-0 bottom-0 left-[1.6rem] w-px origin-top bg-linear-to-b from-lavender via-fuchsia to-orange lg:hidden"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleX: fill }}
          className="absolute top-[1.6rem] right-0 left-0 hidden h-px origin-left bg-linear-to-r from-lavender via-fuchsia to-orange lg:block"
        />

        {STEPS.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-16 lg:pt-16 lg:pl-0"
          >
            <span className="absolute top-0 left-0 grid size-13 place-items-center rounded-full border border-white/20 bg-primary/60 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_30px_-6px_rgba(122,87,219,0.8)] backdrop-blur-md">
              0{i + 1}
            </span>
            <div className="glass-card group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25">
              <h3 className="text-chrome text-2xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-neutral-300">
                {step.text}
              </p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {step.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
