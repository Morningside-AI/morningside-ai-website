"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GoArrowUpRight } from "react-icons/go";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const HoverVideo = () => {
    const centerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const centerEl = centerRef.current;
        const masterWrapper = document.getElementById("masterAnimationWrapper");

        if (centerEl && masterWrapper) {
            ScrollTrigger.create({
                trigger: centerEl,
                start: "top center",
                end: "bottom center",
                scroller: "#page-wrapper",
                onEnter: () => {
                    gsap.killTweensOf(masterWrapper);
                    gsap.to(masterWrapper, { autoAlpha: 0, duration: 0.1, ease: "none" });
                },
                onEnterBack: () => {
                    gsap.killTweensOf(masterWrapper);
                    gsap.to(masterWrapper, { autoAlpha: 0, duration: 0.1, ease: "none" });
                },
            });
        }

        // ✅ If the section is already in view (after resize), hide wrapper
        const scroller = document.querySelector("#page-wrapper");
        if (scroller && centerEl) {
            const rect = centerEl.getBoundingClientRect();
            const containerRect = scroller.getBoundingClientRect();

            const isVisible =
                rect.top < containerRect.bottom && rect.bottom > containerRect.top;

            if (isVisible) {
                gsap.killTweensOf(masterWrapper);
                gsap.set(masterWrapper, { autoAlpha: 0 });
            }
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
          ScrollTrigger.refresh();
    
          // Defer visibility check to after layout adjustments
          requestAnimationFrame(() => {
            const centerEl = centerRef.current;
            const masterWrapper = document.getElementById("masterAnimationWrapper");
            const scroller = document.querySelector("#page-wrapper");
    
            if (scroller && centerEl && masterWrapper) {
              const rect = centerEl.getBoundingClientRect();
              const containerRect = scroller.getBoundingClientRect();
    
              const isVisible =
                rect.top < containerRect.bottom && rect.bottom > containerRect.top;
    
              if (isVisible) {
                gsap.killTweensOf(masterWrapper);
                gsap.set(masterWrapper, { autoAlpha: 0 });
              }
            }
          });
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);



    return (
        <div
            id="center-section"
            ref={centerRef}
            className="box-border gap-8 w-full h-[100dvh] min-h-[100dvh] snap-always snap-center flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
        >
            <div className="w-full h-11/12 flex flex-col items-start justify-between gap-12 px-4 md:px-8 lg:px-12 mx-auto">
                <p
                    ref={headingRef}
                    className="text-3xl md:text-4xl lg:text-5xl whitespace-pre-wrap w-full "
                >
                    Meet Our Founders
                </p>

                <div className="w-full h-fit flex flex-row items-end justify-end">
                    <button className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black whitespace-nowrap">
                        Into Morningside
                        <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 transition-all duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HoverVideo;