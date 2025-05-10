"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/fonts.css";
import Step3 from "@/assets/images/animation/entrance.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide3 = () => {
    const slide3Ref = useRef(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const scrollContainer = document.querySelector("#page-wrapper");
        if (!scrollContainer || !titleRef.current || !textRef.current) return;

        const title = titleRef.current;
        const text = textRef.current;

        gsap.set([title, text], { opacity: 0, x: 100 });

        ScrollTrigger.create({
            trigger: slide3Ref.current,
            start: "top center",
            end: "bottom center",
            scroller: scrollContainer,
            onEnter: () => {
                gsap.fromTo(
                    [title, text],
                    { opacity: 0, x: 100 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.4,
                        delay: 0.06,
                        ease: "none",
                    }
                );
            },

            onLeave: () => {
                gsap.to([title, text], {
                    opacity: 0,
                    x: 100,
                    duration: 0.2,
                    delay: 0.03,
                    ease: "none",
                });
            },

            onEnterBack: () => {
                gsap.fromTo(
                    [title, text],
                    { opacity: 0, x: 100 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.4,
                        delay: 0.06,
                        ease: "none",
                    }
                );
            },

            onLeaveBack: () => {
                gsap.to([title, text], {
                    opacity: 0,
                    x: 100,
                    duration: 0.2,
                    delay: 0.03,
                    ease: "none",
                });
            },
        });
    }, []);

    return (
        <div
            id="slide3"
            ref={slide3Ref}
            className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center text-white"
        >
            <div className="w-full flex justify-center opacity-0">
                <Step3 className="w-[35vw] h-[50vh] lg:w-[35vw] lg:h-[28vw]" />
            </div>

            {/* Fixed overlay for animated text */}
            <div className="fixed w-11/12 lg:w-full bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-center pointer-events-none z-50">
                <p
                    ref={titleRef}
                    id="snappy-33-title"
                    className="text-6xl lg:text-8xl font-light opacity-0"
                >
                    Educate
                </p>
                <p
                    ref={textRef}
                    id="snappy-33-text"
                    className="text-lg lg:text-xl text-[#A0A4A1] max-w-[700px] opacity-0"
                >
                    Our experts equip your team with tools and strategic know-how
                    <br />
                    this second line is just for testing a two lines text as requested in design
                </p>
            </div>
        </div>
    );
};

export default Slide3;
