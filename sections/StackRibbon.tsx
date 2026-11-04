import Image from "next/image";
import LiquidGlass from "@/components/LiquidGlass";

const STACK = [
  { name: "Next.js", logo: "/assets/logos/next.svg" },
  { name: "React", logo: "/assets/logos/react.svg" },
  { name: "TypeScript", logo: "/assets/logos/typescript.svg" },
  { name: "NestJS", logo: "/assets/logos/nest.svg" },
  { name: "Node.js", logo: "/assets/logos/node.svg" },
  { name: "MongoDB", logo: "/assets/logos/mongo.svg" },
  { name: "Three.js", logo: "/assets/logos/threejs.svg" },
  { name: "Tailwind CSS", logo: "/assets/logos/tailwindcss.svg" },
  { name: "Framer Motion", logo: "/assets/logos/framer-motion.svg" },
  { name: "Stripe", logo: "/assets/logos/stripe.svg" },
];

const WORDS = ["Design", "Build", "Ship", "Scale", "Repeat"];

/** Two crossing ribbons: a glass band of the stack and a chrome band of what I do */
export default function StackRibbon() {
  return (
    <section
      id="stack"
      data-palette="stack"
      aria-label="My stack"
      className="relative overflow-x-clip py-20 md:py-28"
    >
      <div className="relative -rotate-3 scale-105">
        <div className="relative isolate py-4 [--gap:3rem]">
          <LiquidGlass radius={0} strength={40} blur={2} />
          <div className="mask-x flex gap-(--gap) overflow-hidden">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className="flex shrink-0 animate-marquee items-center gap-(--gap)"
              >
                {STACK.map((s) => (
                  <li
                    key={s.name}
                    className="flex items-center gap-3 text-lg font-medium whitespace-nowrap text-white/90 md:text-2xl"
                  >
                    <Image src={s.logo} alt="" width={30} height={30} className="size-7 md:size-8" />
                    {s.name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-6 rotate-2 scale-105 md:mt-8" aria-hidden="true">
        <div className="mask-x flex gap-(--gap) overflow-hidden [--gap:2.5rem]">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="flex shrink-0 animate-[marquee_38s_linear_infinite_reverse] items-center gap-(--gap) text-5xl font-black tracking-tight uppercase md:text-8xl"
            >
              {WORDS.map((w) => (
                <span key={w} className="flex items-center gap-(--gap)">
                  <span className="text-chrome">{w}</span>
                  <span className="size-3 rounded-full bg-linear-to-br from-lavender to-fuchsia md:size-4" />
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
