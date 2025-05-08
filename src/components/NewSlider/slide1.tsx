"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/fonts.css";
import Step3 from "@/assets/images/animation/entrance.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide1 = () => {
  const centerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="center-section"
      ref={centerRef}
      className="box-border gap-8 w-full h-[100dvh] min-h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
    >
      <div className="w-full flex-col items-center justify-center gap-12 px-4 md:px-8 lg:px-12 mx-auto">
        <p
          className="text-3xl md:text-5xl w-full text-center leading-tight whitespace-pre-wrap"
        >
          <span className="white-silver-animated-text">We </span>
          <span className="white-silver-animated-text1">spend </span>
          <span className="white-silver-animated-text2">our </span>
          <span className="white-silver-animated-text2">days </span>
          <span className="white-silver-animated-text1">doing </span>
          <br />
          <span className="white-silver-animated-text2">these </span>
          <span className="green-text">three </span>
          <span className="white-silver-animated-text1">things</span>
        </p>
        <div className="w-full opacity-0 flex justify-center">
          <Step3 className="w-[50vw] h-[50vw] lg:w-[35vw] lg:h-[20vw]" />
        </div>
      </div>
    </div>
  );
};

export default Slide1;