import HeroText from "@/components/HeroText";
import HeroScene from "@/components/HeroScene";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen select-none overflow-hidden"
    >
      <div className="relative z-10 mx-auto flex max-w-7xl justify-center c-space md:justify-start">
        <HeroText />
      </div>
      <ParallaxBackground />
      <HeroScene />
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-white md:flex"
      >
        Scroll
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/30 pt-1.5">
          <span className="size-1 animate-scroll-dot rounded-full bg-white" />
        </span>
      </a>
    </section>
  );
}
