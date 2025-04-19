"use client";

import "@/styles/fonts.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import StatsBox from "./statsBox";

gsap.registerPlugin(ScrollToPlugin);

const Stats = () => {
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const threshold = 150;
        let accumulated = 0;
        let hasSnapped = false;
    
        const handleWheel = (e: WheelEvent) => {
          const el = statsRef.current;
          if (!el || hasSnapped) return;
    
          const rect = el.getBoundingClientRect();
          const isInView =
            rect.top <= window.innerHeight * 0.5 &&
            rect.bottom > window.innerHeight * 0.25;
    
          if (!isInView) return;
    
          e.preventDefault();
          e.stopPropagation();
    
          accumulated += e.deltaY;
    
          // Scroll down to next section
          if (accumulated >= threshold && e.deltaY > 0) {
            hasSnapped = true;
            gsap.to(window, {
              scrollTo: "#test-section",
              duration: 1,
              ease: "power2.out",
            });
            window.removeEventListener("wheel", handleWheel);
          }
    
          // Scroll up to previous section
          if (accumulated <= -threshold && e.deltaY < 0) {
            hasSnapped = true;
            gsap.to(window, {
              scrollTo: "#center-section",
              duration: 1,
              ease: "power2.out",
            });
            window.removeEventListener("wheel", handleWheel);
          }
        };
    
        window.addEventListener("wheel", handleWheel, { passive: false });
    
        return () => {
          window.removeEventListener("wheel", handleWheel);
        };
      }, []);

    return (
        <div ref={statsRef} id="stats-section" className="w-full h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] md:gap-32 gap-12 my-auto">
            <p className="white-silver-animated-text">
                <span className="md:text-5xl text-4xl">
                We don&apos;t sell AI.
                </span>
                <span className="md:text-5xl text-4xl">
                    &nbsp;We sell&nbsp;
                </span>
                <span style={{ fontFamily: "DM-Mono-Italic" }} className="md:text-5xl text-4xl">
                    Results.
                </span>
            </p>
            <div className="flex flex-row justify-start items-start gap-4">
                <StatsBox number={17} numberText="M+" text="Individuals Educated on AI via Our Platforms" link="https://www.youtube.com/@LiamOttley" linkText="Watch our content here" />
                <StatsBox number={435} numberText="+" text="AI Solutions Identified by MorningSide AI" link="" linkText="" />
                <StatsBox number={55} numberText="+" text="Bespoke AI Solutions Developed" link="" linkText="" />
            </div>
        </div>
    )
}

export default Stats;
