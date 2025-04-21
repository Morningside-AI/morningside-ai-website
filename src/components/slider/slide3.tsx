"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

type Slide3Props = {
    isActive: boolean;
};

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide3 = ({ isActive }: Slide3Props) => {
    const centerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLParagraphElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const { rive, RiveComponent: BuildRive } = useRive({
        src: "/rive/animation2.riv",
        autoplay: false, // Control autoplay with state
        layout: new Layout({
          fit: Fit.Cover,
          alignment: Alignment.Center,
        }),
    });

    useEffect(() => {
        if (isActive && rive) {
          setTimeout(() => {
            rive.play();
          }, 300);
        } else if (!isActive && rive) {
          rive.reset();
        }
      }, [isActive, rive]);
    

    return (
        <div
            id="third-slide-section"
            ref={centerRef}
            className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
        >
            <div className="w-full flex flex-col items-center justify-center gap-8">
                <div ref={boxRef} className="relative w-full flex flex-row items-center justify-center gap-8">
                    <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[400px]">
                        <BuildRive />
                    </div>
                </div>

                <div ref={textRef} className="text-content flex flex-col gap-6 items-center justify-center">
                    <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize" ref={headingRef}>
                        Build Solutions
                    </p>
                    <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]" ref={subTextRef}>
                        We design and develop custom AI systems, automations, and state-of-the-art solutions tailored to your business goals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Slide3;
