import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl">
        <About />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
