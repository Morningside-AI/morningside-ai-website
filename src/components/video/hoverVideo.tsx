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

    return (
        <div
            id="center-section"
            ref={centerRef}
            className="box-border gap-8 w-full h-[100vh] max-h-[100vh] snap-always snap-center flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
        >
            <div className="w-full h-10/12 lg:h-11/12 flex flex-col items-start justify-between gap-12 pb-6 lg:pb-0 px-4 md:px-8 lg:px-12 mx-auto">
                <p
                    ref={headingRef}
                    className="text-3xl md:text-4xl lg:text-5xl whitespace-pre-wrap w-full "
                >
                    Meet Our Founders
                </p>

                <button className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black whitespace-nowrap">
                    Into Morningside
                    <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 transition-all duration-300" />
                </button>
            </div>
        </div>
    );
};

export default HoverVideo;