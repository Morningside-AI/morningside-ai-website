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

  useEffect(() => {

    if (paragraphRef.current) {
      const para = paragraphRef.current;
      gsap.set(para, { opacity: 0, y: 80 });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top center",
        end: "bottom top",
        onEnter: () => {
          gsap.to(para, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          });
        },
        onEnterBack: () => {
          gsap.to(para, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          });
        },
        onLeave: () => {
          gsap.to(para, {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(para, {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: "power2.inOut",
          });
        },
      });

      // Run animation manually if already in view on load
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        gsap.to(para, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
        });
      }
    }

  }, []);

  return (
    <div
      id="hero-section"
      ref={heroRef}
      className="w-full h-[100dvh] flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-10 will-change-transform"
    >
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
        className="text-2xl md:text-3xl lg:text-4xl mt-12 tracking-normal white-silver-animated-text2"
      >
        We are all of the above.
      </p>
    </div>
  );
};

export default Hero;
