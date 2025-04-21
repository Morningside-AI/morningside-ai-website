"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Step3 from "@/assets/images/animation/step3.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide1 = () => {
    const centerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLParagraphElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<SVGElement>(null);
    return (
        <div
            id="first-slide-section"
            ref={centerRef}
            className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
        >
            <div className="w-full flex flex-col items-center justify-center gap-8">
                <div ref={boxRef} className="w-full flex flex-row items-center justify-center">
                    <Step3 ref={step3Ref} className="w-[50vw] h-[40vw] lg:w-[20vw] lg:h-[20vw]" />
                </div>
                <div ref={textRef} className="text-content flex flex-col gap-6 items-center justify-center">
                    <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize" ref={headingRef}>
                        Gain Clarity
                    </p>
                    <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]" ref={subTextRef}>
                        We analyze your business operations, define high-impact AI Opportunities and co-design the AI Transformation Strategy that aligns with your goals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Slide1;
