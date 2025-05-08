"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Center = () => {
  const centerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  return (
    <div
      id="center-section"
      ref={centerRef}
      className="box-border gap-8 w-full h-[100dvh] min-h-[100dvh] snap-always snap-center flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
    >
      <p
        ref={headingRef}
        className="text-5xl md:text-6xl lg:text-7xl text-center h-fit whitespace-pre-wrap w-full "
      >
        <span className="white-silver-animated-text">We </span>
        <span className="white-silver-animated-text">put </span>
        <span className="white-silver-animated-text1">AI </span>
        <br className="block md:hidden" />
        <span className="white-silver-animated-text1">at </span>
        <span className="white-silver-animated-text2">the </span>
        <span className="white-silver-animated-text2">center </span>
        <br className="hidden lg:block" />
        <span className="white-silver-animated-text">of </span>
        <br className="block lg:hidden" />
        <span className="green-text">everything </span>
        <span className="white-silver-animated-text">we </span>
        <span className="white-silver-animated-text1">do.</span>
      </p>
      <p
        ref={subTextRef}
        className="text-xl lg:text-2xl text-center text-[#C0C0C0]"
      >
        One trusted partner to guide you through your entire AI journey.
      </p>
    </div>
  );
};

export default Center;