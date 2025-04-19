"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const logoWrapperRef = useRef<HTMLDivElement>(null);
    const welcomeTextRef = useRef<HTMLParagraphElement>(null);
    const [isAnimating, setIsAnimating] = useState(true);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const logoCover = preloaderRef.current?.querySelector<HTMLDivElement>(".logoCover");
            const shapes = svgRef.current?.querySelectorAll<SVGPathElement>(".logo-shape");
            const text = svgRef.current?.querySelector<SVGTextElement>(".logo-text");

            if (!shapes || !text || !logoCover) return;

            gsap.set(shapes, { opacity: 0, scale: 0.5, transformOrigin: "center" });
            gsap.set(text, { opacity: 0, x: -100 });

            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete: () => setIsAnimating(false),
            });

            tl.to(logoCover, {
                opacity: 0,
                duration: 0.2,
                delay: 0.5,
            });

            tl.to(shapes, {
                opacity: 1,
                scale: 1,
                stagger: 0.2,
                duration: 1.0,
            });

            tl.to(text, {
                opacity: 1,
                x: 130,
                duration: 1.2,
            }, "-=0.3");

            tl.to(welcomeTextRef.current, {
                opacity: 0,
                x: 20,
                duration: 0.5,
                delay: 0.5,
            });

            tl.to(logoWrapperRef.current, {
                scale: 0.36,
                top: -315,
                left: -647,
                duration: 1,
                ease: "power2.inOut",
              });

            tl.to(preloaderRef.current, {
                opacity: 0,
                duration: 0.6,
                delay: 1.0,
            });
        }, preloaderRef);

        return () => ctx.revert();
    }, []);


    if (!isAnimating) return null;

    return (
        <div
            ref={preloaderRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
        >
            <div className="absolute inset-0 bg-black w-screen h-screen z-10 logoCover"></div>
            <p className="text-white text-[42.4px] absolute top-10 left-10" ref={welcomeTextRef}>Welcome to</p>
            <div className="w-[300px] md:w-[400px] relative" ref={logoWrapperRef}>
                <Logo ref={svgRef} className="w-full h-auto" />
            </div>
        </div>
    );
};

export default Preloader;
