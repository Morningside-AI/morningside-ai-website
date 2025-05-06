"use client";

import { useEffect, useRef } from "react";
import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import StatsBox from "./statsBox";
import LogoMarkWhite from "@/assets/images/morningside-assets/Logomark-White.svg";
import "@/styles/fonts.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function Stats({ scrollContainerRef }: {
  scrollContainerRef: RefObject<HTMLDivElement | null>
}) {
  const statsRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<SVGSVGElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgContainerRef.current;
    const scroller = scrollContainerRef.current;

    if (svg && scroller) {
      const part1 = svg.querySelector(".logoMarkPart1");
      const part2 = svg.querySelector(".logoMarkPart2");
      const part3 = svg.querySelector(".logoMarkPart3");

      gsap.set([part1, part2, part3], { opacity: 0.001 });

      const animateSVGIn = () => {
        gsap.timeline()
          .to(part3, { opacity: 0.03, duration: 0.2, ease: "power2.inOut" })
          .to(part2, { opacity: 0.03, duration: 0.3, ease: "power2.inOut" }, "+=0.2")
          .to(part1, { opacity: 0.03, duration: 0.4, ease: "power2.inOut" }, "+=0.35");
      };

      const animateSVGOut = () => {
        gsap.timeline()
          .to([part1, part2, part3], {
            opacity: 0.001,
            duration: 0.00001,
            ease: "power2.inOut",
          });
      };

      setTimeout(() => {
        ScrollTrigger.create({
          trigger: statsRef.current,
          scroller,
          start: "top center",
          end: "bottom center",
          onEnter: animateSVGIn,
          onEnterBack: animateSVGIn,
          onLeave: animateSVGOut,
          onLeaveBack: animateSVGOut,
        });

        ScrollTrigger.refresh();
      }, 50);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef]);
  ;




  return (
    <div
      ref={statsRef}
      id="stats-section"
      className="box-border gap-8 w-full h-screen min-h-screen snap-always snap-center flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
    >

      <LogoMarkWhite ref={svgContainerRef} className="absolute -top-[50vh] -left-[50vw] lg:top-0 lg:left-0 h-[200vh] w-[200vw] lg:w-full lg:h-full z-[-1]" />
      <div className="relative w-full px-4 md:px-8 lg:px-12 mx-auto flex flex-col justify-center">
        <p
          ref={headingRef}
          className="text-4xl md:text-5xl whitespace-pre-wrap"
        >
          <span className="lg:mr-1 white-silver-animated-text">
            <span className="">W</span>
            <span className="">e</span>
            <span className="">&nbsp;</span>
            <span className="">d</span>
            <span className="">o</span>
            <span className="">n</span>
            <span className="">&apos;</span>
            <span className="">t</span>
            <span className="">&nbsp;</span>
            <span className="">s</span>
            <span className="">e</span>
            <span className="">l</span>
            <span className="">l</span>
            <span className="">&nbsp;</span>
            <span className="">A</span>
            <span className="">I</span>
            <span className="">.</span>
          </span>
          <br className="block lg:hidden" />
          <span className="white-silver-animated-text1">
            <span className="">W</span>
            <span className="">e</span>
            <span className="">&nbsp;</span>
            <span className="">s</span>
            <span className="">e</span>
            <span className="">l</span>
            <span className="">l</span>
            <span className="">&nbsp;</span>
          </span>
          <span className="green-text">
            <span className="">R</span>
            <span className="">e</span>
            <span className="">s</span>
            <span className="">u</span>
            <span className="">l</span>
            <span className="">t</span>
            <span className="">s</span>
            <span className="">.</span>
          </span>
        </p>
      </div>

      <div className="flex w-full flex-col lg:flex-row justify-start items-start px-4 md:px-8 lg:px-12 mx-auto gap-4">
        <StatsBox
          number={17}
          numberText="M+"
          text="Individuals Educated on AI via Our Platforms"
          link="https://www.youtube.com/@LiamOttley"
          linkText="Watch our content here"
          scrollContainerRef={scrollContainerRef}
        />
        <StatsBox
          number={435}
          numberText="+"
          text="AI Solutions Identified by Morningside AI"
          link=""
          linkText=""
          scrollContainerRef={scrollContainerRef}
        />
        <StatsBox
          number={55}
          numberText="+"
          text="Bespoke AI Solutions Developed"
          link=""
          linkText=""
          scrollContainerRef={scrollContainerRef}
        />
      </div>
    </div>
  );
};

export default Stats;
