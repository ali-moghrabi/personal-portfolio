"use client";

import React, { useRef } from "react";
import Card from "@/components/Card";
import { Globe } from "@/components/Globe";
import CopyEmailButton from "@/components/CopyEmailButton";
import CodeWindow from "@/components/CodeWindow";
import { Frameworks } from "@/components/Frameworks";

const About: React.FC = () => {
  const grid2Container = useRef(null);

  return (
    <section id="about" className="c-space section-spacing">
      <p className="eyebrow">About</p>
      <h2 className="text-heading mt-3">About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-72 mt-12">
        <div className="flex items-end grid-default-color grid-1">
          <CodeWindow className="absolute top-[-8%] left-[30%] scale-[0.55] origin-top-left sm:top-[2%] sm:left-[40%] sm:scale-[0.62] md:top-[30%] md:left-[22%] md:scale-90 lg:left-[30%] lg:scale-100" />
          <div className="z-10">
            <p className="headtext">{`Hi, I'm Ali Moghrabi`}</p>
            <p className="subtext">
              Over the last 2 years, I developed my frontend and backend dev
              skills to deliver dynamic and responsive software and web
              applications.
            </p>
          </div>
          <div className="absolute inset-x-0 pointer-events-none -bottom-4 h-1/2 sm:h-1/3 bg-linear-to-t from-indigo-950 via-indigo-950/70 max-md:h-2/3" />
        </div>
        <div
          ref={grid2Container}
          className="grid-default-color grid-2 select-none"
          aria-label="Tech logos you can drag around"
        >
          <div className="flex items-center justify-center w-full h-full">
            <p className="flex items-end text-center text-5xl text-gray-500 uppercase">
              code is craft
            </p>
            <Card
              style={{
                rotate: "75deg",
                top: "30%",
                left: "20%",
              }}
              image="/assets/logos/css3.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-30deg",
                top: "60%",
                left: "45%",
              }}
              image="/assets/logos/mongo.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "90deg",
                bottom: "32%",
                left: "70%",
              }}
              image="/assets/logos/nest.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-45deg",
                top: "55%",
                left: "0%",
              }}
              image="/assets/logos/git.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "20deg",
                top: "10%",
                left: "38%",
              }}
              image="/assets/logos/express.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "30deg",
                top: "70%",
                left: "70%",
              }}
              image="/assets/logos/typescript.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-45deg",
                top: "70%",
                left: "25%",
              }}
              image="/assets/logos/react-query.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-45deg",
                top: "5%",
                left: "10%",
              }}
              image="/assets/logos/html5.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-45deg",
                top: "28%",
                left: "3%",
              }}
              image="/assets/logos/redux.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-50deg",
                top: "5%",
                right: "5%",
              }}
              image="/assets/logos/next.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-50deg",
                top: "50%",
                right: "5%",
              }}
              image="/assets/logos/javascript.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-50deg",
                top: "10%",
                right: "18%",
              }}
              image="/assets/logos/react.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-30deg",
                top: "10%",
                right: "38%",
              }}
              image="/assets/logos/tailwindcss.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-30deg",
                top: "4%",
                left: "24%",
              }}
              image="/assets/logos/stripe.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "-15deg",
                top: "35%",
                left: "44%",
              }}
              image="/assets/logos/node.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "45deg",
                top: "35%",
                left: "58%",
              }}
              image="/assets/logos/framer-motion.svg"
              containerRef={grid2Container}
            />
            <Card
              style={{
                rotate: "45deg",
                top: "55%",
                left: "12%",
              }}
              image="/assets/logos/threejs.svg"
              containerRef={grid2Container}
            />
          </div>
        </div>
        <div className="grid-black-color grid-3">
          <div className="z-10 w-1/2">
            <p className="headtext">Time Zone</p>
            <p className="subtext">{`I'm based in Lebanon, and open to remote work worldwide`}</p>
          </div>
          <figure className="absolute left-[30%] top-[10%]">
            <Globe />
          </figure>
        </div>
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              Do you want to start a project together?
            </p>
            <CopyEmailButton />
          </div>
        </div>
        <div className="grid-default-color grid-5">
          <div className="z-10 w-1/2">
            <p className="headtext">Tech Stack</p>
            <p className="subtext">
              I specialize in a variety of languages, frameworks and tools that
              allow me to build robust and scalable applications
            </p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full inset-s-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
