"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import StatsBox from "./statsBox";
import LogoMarkWhite from "@/assets/images/morningside-assets/Logomark-White.svg";
import "@/styles/fonts.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Stats = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<SVGSVGElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgContainerRef.current;
    if (svg) {
      const part1 = svg.querySelector(".logoMarkPart1");
      const part2 = svg.querySelector(".logoMarkPart2");
      const part3 = svg.querySelector(".logoMarkPart3");

      // Always start hidden
      gsap.set([part1, part2, part3], { opacity: 0.001 });

      const animateSVGIn = () => {
        gsap.timeline()
          .to(part3, { opacity: 0.03, duration: 0.1, ease: "power2.inOut" })
          .to(part2, { opacity: 0.03, duration: 0.15, ease: "power2.inOut" }, "+=0.1")
          .to(part1, { opacity: 0.03, duration: 0.2, ease: "power2.inOut" }, "+=0.1");
      };

      const animateSVGOut = () => {
        gsap.timeline()
        .to(part3, { opacity: 0.001, duration: 0.1, ease: "linear" })
        .to(part2, { opacity: 0.001, duration: 0.1, ease: "linear" }, "+=0.1")
        .to(part1, { opacity: 0.001, duration: 0.1, ease: "linear" }, "+=0.1");
      };

      // Set up ScrollTrigger
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: animateSVGIn,
        onEnterBack: animateSVGIn,
        onLeave: animateSVGOut,
        onLeaveBack: animateSVGOut,
      });
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Wrap letters in spans (same as before)
    const words = heading.querySelectorAll('.word');
    words.forEach(word => {
      const letters = word.textContent?.split('');
      if (letters) {
        word.innerHTML = '';
        letters.forEach(letter => {
          const span = document.createElement('span');
          span.classList.add('letter');
          span.textContent = letter;
          word.appendChild(span);
        });
      }
    });

    const letters = heading.querySelectorAll('.letter');
    gsap.set(letters, { clipPath: 'inset(0% 100% 0% 0%)' });

    // Create a timeline for the reveal animation
    const tl = gsap.timeline({
      defaults: { ease: 'linear' }
    });

    tl.to(letters, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.1,
      stagger: 0.04
    });

    // Create scroll trigger with scrub
    const trigger = ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 60%',
      end: 'bottom 90%',
      scrub: true,
      animation: tl,
      markers: false // Set to true to see trigger positions
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={statsRef}
      id="stats-section"
      className="w-full will-change-transform h-[100dvh] flex flex-col justify-center text-white leading-normal tracking-normal md:gap-32 gap-12 my-auto relative overflow-hidden touch-none"
    >

      <LogoMarkWhite ref={svgContainerRef} className="absolute -top-[50vh] -left-[50vw] lg:top-0 lg:left-0 h-[200vh] w-[200vw] lg:w-full lg:h-full z-[-1]" />
      <div className="relative w-full -translate-y-20 lg:-translate-y-14">
        <p
          className="text-4xl md:text-5xl text-center whitespace-pre-wrap absolute top-0 left-0 z-0"
        >
          <span className="lg:mr-1">
            <span className="gray-text">W</span>
            <span className="gray-text">e</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">d</span>
            <span className="gray-text">o</span>
            <span className="gray-text">n</span>
            <span className="gray-text">&apos;</span>
            <span className="gray-text">t</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">s</span>
            <span className="gray-text">e</span>
            <span className="gray-text">l</span>
            <span className="gray-text">l</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">A</span>
            <span className="gray-text">I</span>
            <span className="gray-text">.</span>
          </span>
          <br className="block lg:hidden" />
          <span className="">
            <span className="gray-text">W</span>
            <span className="gray-text">e</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">s</span>
            <span className="gray-text">e</span>
            <span className="gray-text">l</span>
            <span className="gray-text">l</span>
            <span className="gray-text">&nbsp;</span>
          </span>
          <span className="">
            <span className="gray-text">R</span>
            <span className="gray-text">e</span>
            <span className="gray-text">s</span>
            <span className="gray-text">u</span>
            <span className="gray-text">l</span>
            <span className="gray-text">t</span>
            <span className="gray-text">s</span>
            <span className="gray-text">.</span>
          </span>
        </p>
        <p
          className="text-4xl md:text-5xl text-center whitespace-pre-wrap absolute top-0 left-0 z-10"
          ref={headingRef}
        >
          <span className="text-white word lg:mr-1">
            <span className="letter">W</span>
            <span className="letter">e</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">d</span>
            <span className="letter">o</span>
            <span className="letter">n</span>
            <span className="letter">&apos;</span>
            <span className="letter">t</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">s</span>
            <span className="letter">e</span>
            <span className="letter">l</span>
            <span className="letter">l</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">A</span>
            <span className="letter">I</span>
            <span className="letter">.</span>
          </span>
          <br className="block lg:hidden" />
          <span className="text-white word">
            <span className="letter">W</span>
            <span className="letter">e</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">s</span>
            <span className="letter">e</span>
            <span className="letter">l</span>
            <span className="letter">l</span>
            <span className="letter">&nbsp;</span>
          </span>
          <span className="green-text word">
            <span className="letter">R</span>
            <span className="letter">e</span>
            <span className="letter">s</span>
            <span className="letter">u</span>
            <span className="letter">l</span>
            <span className="letter">t</span>
            <span className="letter">s</span>
            <span className="letter">.</span>
          </span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-start items-start gap-4">
        <StatsBox
          number={17}
          numberText="M+"
          text="Individuals Educated on AI via Our Platforms"
          link="https://www.youtube.com/@LiamOttley"
          linkText="Watch our content here"
        />
        <StatsBox
          number={435}
          numberText="+"
          text="AI Solutions Identified by Morningside AI"
          link=""
          linkText=""
        />
        <StatsBox
          number={55}
          numberText="+"
          text="Bespoke AI Solutions Developed"
          link=""
          linkText=""
        />
      </div>
    </div>
  );
};

export default Stats;
