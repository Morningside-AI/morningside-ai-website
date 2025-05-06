"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { GoArrowUpRight } from "react-icons/go";
import PartnershipMarquee from "./partnersMarquee";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Partnership = () => {
  const centerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleContactClick = () => {
    window.location.href = "/contact"; // This forces a full page reload
  };

  return (
    <>
      <div
        id="partnership-section"
        ref={centerRef}
        className="box-border w-full h-screen min-h-screen snap-always snap-center flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] gap-8 px-4 md:px-8 lg:px-12 relative"
      >
        <div className="absolute top-0 left-0 w-full z-10 pt-8 flex flex-col items-center justify-center">
          <PartnershipMarquee />
        </div>

        <div className="relative w-full mt-8 ">
          <p
          ref={headingRef}
            className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap w-full "
          >
            <span className="white-silver-animated-text">
              <span className="">T</span>
              <span className="">h</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="white-silver-animated-text1">
              <span className="">b</span>
              <span className="">e</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="white-silver-animated-text2">
              <span className="">A</span>
              <span className="">I</span>
              <span className=""> </span>
            </span>
            <br className="block md:hidden" />
            <span className="white-silver-animated-text ">
              <span className="">s</span>
              <span className="">y</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className="">e</span>
              <span className="">m</span>
              <span className="">s</span>
              <span className=""> </span>
            </span>
            <br className="hidden lg:block" />
            <span className="white-silver-animated-text1">
              <span className="">a</span>
              <span className="">r</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="white-silver-animated-text2">
              <span className="">b</span>
              <span className="">u</span>
              <span className="">i</span>
              <span className="">l</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="green-text">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="green-text ">
              <span className="">b</span>
              <span className="">y</span>
              <span className=""> </span>
            </span>
            <span className="green-text ">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className="">.</span>
            </span>
          </p>
        </div>

        <div
          ref={buttonRef}
          className="w-full flex flex-row items-center justify-center"
        >
          <div onClick={handleContactClick} className="flex cursor-pointer items-center gap-1 px-4 py-2 lg:px-8 lg:py-4 border-2 border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
            <p className="text-3xl lg:text-5xl">Let&apos;s Partner Up</p>
            <GoArrowUpRight
              size={32}
              strokeWidth={1}
              className="mt-1 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Partnership;
