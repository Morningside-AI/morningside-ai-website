"use client";

import "@/styles/fonts.css";
import RotatingText from "./rotatingText";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../navbar/navbar";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  return (
    <div
      id="hero-section"
      className="box-border w-full snap-always snap-center h-[100dvh] flex flex-col items-center justify-center"
    >
      <Navbar />
      <div className="w-full flex flex-col items-center justify-center gap-12 px-4 md:px-8 lg:px-12 mx-auto">
        <div>
          <p className="text-5xl md:text-7xl lg:text-8xl white-silver-animated-text text-center">
            We are not an AI
          </p>
          <div className="h-16 md:h-20 lg:h-32 flex w-full flex-row items-center">
            <RotatingText />
          </div>
          <p className="text-5xl md:text-7xl lg:text-8xl w-full white-silver-animated-text1 text-center">
            Company
          </p>
        </div>

        <p
          ref={paragraphRef}
          className="text-2xl md:text-3xl lg:text-3xl tracking-normal white-silver-animated-text2"
        >
          We are all of the above.
        </p>
      </div>
    </div>
  );
};

export default Hero;
