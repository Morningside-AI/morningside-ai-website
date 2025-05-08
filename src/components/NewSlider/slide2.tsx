"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/fonts.css";
import Step3 from "@/assets/images/animation/entrance.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide2 = () => {
    const centerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            id="center-section"
            ref={centerRef}
            className="box-border gap-8 w-full h-[100dvh] min-h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
        >
            <div className="w-full flex-col items-center justify-center gap-12 px-4 md:px-8 lg:px-12 mx-auto">
                <div className="w-full opacity-0 flex justify-center">
                    <Step3 className="w-[35vw] h-[50vh] lg:w-[35vw] lg:h-[28vw]" />
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    <p className="text-6xl lg:text-8xl text-center font-light">Identify</p>
                    <p className="text-lg lg:text-xl text-center w-full text-[#A0A4A1]">
                        We analyze your business operations, identify high-impact AI opportunities
                        <br />
                        this second line is just for testing a two lines text as requested in design
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Slide2;