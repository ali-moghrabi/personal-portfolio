import HeroText from "@/components/HeroText";
import HeroStatus from "@/components/HeroStatus";
import LiquidChrome from "@/components/LiquidChrome";

export default function Hero() {
  return (
    <section
      id="home"
      data-palette="hero"
      className="relative flex min-h-svh flex-col select-none"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 c-space">
        <HeroText />
      </div>

      <div className="mx-auto w-full max-w-7xl c-space">
        <HeroStatus />
        {/* the name in liquid chrome, edge to edge (the h1 carries it for screen readers) */}
        <LiquidChrome
          text="ALI MOGHRABI"
          align="center"
          weight={800}
          className="mt-4 mb-2 h-[17vw] max-h-52 w-full sm:mt-6"
        />
      </div>
    </section>
  );
}
