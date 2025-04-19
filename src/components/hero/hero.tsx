"use client";

import "@/styles/fonts.css";
import RotatingText from "./rotatingText";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const threshold = 200; // how much to scroll before snapping
    let accumulated = 0;
    let hasSnapped = false;
  
    const handleWheel = (e: WheelEvent) => {
      const el = heroRef.current;
      if (!el || hasSnapped) return;
  
      const rect = el.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom > window.innerHeight * 0.5;
  
      if (isInView && e.deltaY > 0) {
        e.preventDefault();
        e.stopPropagation();
  
        accumulated += e.deltaY;
  
        if (accumulated >= threshold) {
          hasSnapped = true;
          gsap.to(window, {
            scrollTo: "#center-section",
            duration: 1,
            ease: "power2.out",
          });
          // clean up listener after animation
          window.removeEventListener("wheel", handleWheel);
        }
      }
    };
  
    window.addEventListener("wheel", handleWheel, { passive: false });
  
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);
  

  return (
    <div
      className="w-full h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-10"
      ref={heroRef}
    >
      <div>
        <p className="text-9xl white-silver-animated-text">We are not an AI</p>
        <div className="h-32">
          <RotatingText />
        </div>
        <p className="text-9xl white-silver-animated-text">Company</p>
      </div>
      <p className="text-4xl mt-12 tracking-normal white-silver-animated-text">
        We are all of the above.
      </p>
    </div>
  );
};

export default Hero;
