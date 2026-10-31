"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const LAYER = "object-cover object-bottom";

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { damping: 50 });

  const mountain3Y = useTransform(x, [0, 0.5], ["0%", "70%"]);
  const planetsX = useTransform(x, [0, 0.5], ["0%", "-20%"]);
  const mountain2Y = useTransform(x, [0, 0.5], ["0%", "30%"]);

  return (
    <div className="absolute inset-0 bg-black/40" aria-hidden="true">
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 -z-50">
          <Image
            src="/assets/sky.jpg"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className={LAYER}
          />
        </div>
        <motion.div
          className="absolute inset-0 -z-40 will-change-transform"
          style={{ y: mountain3Y }}
        >
          <Image
            src="/assets/mountain-3.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className={LAYER}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 -z-30 will-change-transform"
          style={{ x: planetsX }}
        >
          <Image
            src="/assets/planets.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className={LAYER}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 -z-20 will-change-transform"
          style={{ y: mountain2Y }}
        >
          <Image
            src="/assets/mountain-2.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className={LAYER}
          />
        </motion.div>
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/mountain-1.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className={LAYER}
          />
        </div>
      </div>
    </div>
  );
}
