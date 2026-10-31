import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Particles } from "@/components/Particles";

export const metadata: Metadata = {
  title: "Page not found | Ali Moghrabi",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-5 pt-20 pb-16">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <Image
          src="/assets/sky.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-50"
        />
        <Image
          src="/assets/mountain-1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-b from-primary/40 via-primary/70 to-primary" />
      </div>
      <Particles
        className="absolute inset-0 -z-10"
        quantity={90}
        ease={30}
        color="#ffffff"
      />

      <div className="relative w-full max-w-2xl text-center">
        <p className="eyebrow justify-center">Error 404</p>

        <div
          className="mt-6 flex items-center justify-center gap-3 sm:gap-6"
          aria-hidden="true"
        >
          <span className="text-gradient text-[7.5rem] leading-none font-black tracking-tighter sm:text-[11rem]">
            4
          </span>
          <Planet />
          <span className="text-gradient text-[7.5rem] leading-none font-black tracking-tighter sm:text-[11rem]">
            4
          </span>
        </div>

        <h1 className="mt-8 text-3xl font-bold text-balance sm:text-4xl">
          Lost in space
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-neutral-400 sm:text-lg">
          The page you&apos;re looking for drifted out of orbit, or it never
          existed. Let&apos;s get you back on course.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
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
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>
          <Link href="/#projects" className="btn-ghost">
            See my work
          </Link>
          <Link href="/#contact" className="btn-ghost">
            Contact me
          </Link>
        </div>
      </div>
    </section>
  );
}

function Planet() {
  return (
    <span className="relative grid size-28 shrink-0 place-items-center sm:size-40">
      <span className="absolute inset-0 rounded-full bg-lavender/40 blur-2xl" />
      <span className="relative size-full overflow-hidden rounded-full bg-radial-[at_30%_25%] from-lavender via-royal to-midnight shadow-[inset_-12px_-14px_30px_rgba(3,4,18,0.75)]">
        <span className="absolute top-[30%] left-[-10%] h-[14%] w-[80%] -rotate-12 rounded-full bg-white/10" />
        <span className="absolute top-[55%] left-[20%] h-[9%] w-[70%] -rotate-12 rounded-full bg-fuchsia/25" />
        <span className="absolute top-[18%] left-[58%] size-[14%] rounded-full bg-midnight/30" />
      </span>
      <span className="pointer-events-none absolute h-[38%] w-[170%] rotate-[-18deg] rounded-[50%] border-2 border-sand/60 mask-[linear-gradient(to_bottom,transparent_45%,black_46%)]" />
      <span className="absolute size-3 animate-orbit rounded-full bg-sand shadow-[0_0_12px_rgba(214,153,92,0.8)] [--angle:0] [--radius:76] [animation-duration:9s] sm:size-4 sm:[--radius:106]" />
    </span>
  );
}
