"use client";

import "@/styles/fonts.css";
import RotatingText from "./rotatingText";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  return (
    <div
      id="hero-section"
      className="box-border w-full h-[100dvh] flex flex-col justify-center"
    >
      <div className="w-full flex flex-col justify-center gap-12 px-4 md:px-8 lg:px-12 mx-auto">
        <div>
          <p className="text-5xl md:text-7xl lg:text-9xl white-silver-animated-text">
            We are not an AI
          </p>
          <div className="h-16 md:h-20 lg:h-32 flex flex-row items-center">
            <RotatingText />
          </div>
          <p className="text-5xl md:text-7xl lg:text-9xl white-silver-animated-text1">
            Company
          </p>
        </div>

        <p
          ref={paragraphRef}
          className="text-2xl md:text-3xl lg:text-4xl tracking-normal white-silver-animated-text2"
        >
          We are all of the above.
        </p>
      </div>
    </div>
  );
};

export default Hero;
