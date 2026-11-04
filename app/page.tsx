import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import Process from "@/sections/Process";
import Projects from "@/sections/Projects";
import StackRibbon from "@/sections/StackRibbon";
import Backdrop from "@/components/scene/Backdrop";

export default function Home() {
  return (
    <>
      <Backdrop />
      <Hero />
      <StackRibbon />
      <div className="mx-auto max-w-7xl">
        <About />
        <Process />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
