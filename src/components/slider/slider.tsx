"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

import Step3 from "@/assets/images/animation/step3.svg"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const slides = ["entrance", "clarify", "learn", "build"];

const OneSlideFixedSlider = () => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);


    const { RiveComponent: LearnRive } = useRive({
        src: "/rive/animation1.riv",
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    const { RiveComponent: BuildRive } = useRive({
        src: "/rive/animation2.riv",
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });



    const [activeIndex, setActiveIndex] = useState(0);
    const isAnimating = useRef(false);
    const touchStartY = useRef(0);
    let scrollCooldown = false;

    useEffect(() => {
        const trigger = triggerRef.current;
        const slider = sliderRef.current;
        const labelBox = labelRef.current;
        const totalSlides = slides.length;

        if (!trigger || !slider || !labelBox) return;

        ScrollTrigger.create({
            id: "slider-scroll",
            trigger,
            start: "top top",
            end: `+=${(totalSlides - 1) * 100}vh`,
            pin: slider,
            scrub: 0.1,
            onUpdate: (self) => {
                const index = Math.round(self.progress * (totalSlides - 1));
                setActiveIndex((prev) => (prev !== index ? index : prev));
            },
            onEnter: () => {
                gsap.to(labelBox, { autoAlpha: 1 });
            },
            onEnterBack: () => {
                gsap.to(labelBox, { autoAlpha: 1 });
            },
            onLeave: () => {
                gsap.to(labelBox, { autoAlpha: 0 });
            },
            onLeaveBack: () => {
                gsap.to(labelBox, { autoAlpha: 0 });
            },
        });

        return () => {
            ScrollTrigger.getById("slider-scroll")?.kill();
        };
    }, []);

    useEffect(() => {
        const boxEl = boxRef.current;
        const textEl = textRef.current;

        if (!boxEl || !textEl) return;

        // Only animate on slides that visibly use boxRef
        const shouldAnimate = [1, 2, 3].includes(activeIndex);

        if (!shouldAnimate) return;

        gsap.fromTo(
            textEl,
            { opacity: 0, y: 40, rotateX: 80, transformOrigin: "bottom center" },
            { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: "power3.out" }
        );

    }, [activeIndex]);


    const disableScroll = () => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        document.documentElement.style.touchAction = "none";
        window.addEventListener("touchmove", preventDefault, { passive: false });
    };

    const enableScroll = () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.style.touchAction = "";
        document.documentElement.style.touchAction = "";
        window.removeEventListener("touchmove", preventDefault);
    };

    const preventDefault = (e: TouchEvent) => e.preventDefault();

    const handleScrollIntent = (direction: "up" | "down") => {
        if (isAnimating.current || scrollCooldown) return;
        scrollCooldown = true;
    
        isAnimating.current = true;
    
        const isFirst = activeIndex === 0;
        const isLast = activeIndex === slides.length - 1;
    
        if (direction === "up" && isFirst) {
            // Scroll to center section
            const centerSectionTop = document.querySelector("#center-section")?.getBoundingClientRect().top ?? 0;
            const targetY = window.scrollY + centerSectionTop;
    
            gsap.to(window, {
                scrollTo: { y: targetY, autoKill: false },
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    enableScroll();
                    isAnimating.current = false;
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 200);
                },
            });
    
            return;
        }
    
        if (direction === "down" && isLast) {
            // Scroll to stats section
            const statsSectionTop = document.querySelector("#stats-section")?.getBoundingClientRect().top ?? 0;
            const targetY = window.scrollY + statsSectionTop;
    
            gsap.to(window, {
                scrollTo: { y: targetY, autoKill: false },
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    enableScroll();
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 200);
                    isAnimating.current = false;
                },
            });
    
            return;
        }
    
        const nextIndex = activeIndex + (direction === "down" ? 1 : -1);
        const st = ScrollTrigger.getById("slider-scroll");
        if (!st) {
            isAnimating.current = false;
            return;
        }
    
        const progress = nextIndex / (slides.length - 1);
        gsap.to(window, {
            scrollTo: { y: st.start + (st.end - st.start) * progress, autoKill: false },
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                isAnimating.current = false;
            },
        });
    };
    

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const isInView = () => {
            const rect = slider.getBoundingClientRect();
            return rect.top <= 0 && rect.bottom > window.innerHeight * 0.5;
        };

        const handleKey = (e: KeyboardEvent) => {
            if (!isInView()) return;
            if (e.key === "ArrowDown" || e.key === "PageDown") {
                e.preventDefault();
                handleScrollIntent("down");
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
                e.preventDefault();
                handleScrollIntent("up");
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (!isInView()) return;
            e.preventDefault();
            handleScrollIntent(e.deltaY > 0 ? "down" : "up");
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (!isInView()) return;
            const touch = e.touches[0];
            if (touch) touchStartY.current = touch.clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isInView()) return;
            const touch = e.touches[0];
            if (!touch) return;
            const deltaY = touchStartY.current - touch.clientY;
            if (Math.abs(deltaY) > 10) {
                handleScrollIntent(deltaY > 0 ? "down" : "up");
            }
        };

        window.addEventListener("keydown", handleKey);
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [activeIndex]);

    useEffect(() => {
        const textEl = textRef.current;
        if (!textEl || !boxRef.current) return;

        gsap.fromTo(
            textEl,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
            }
        );

        gsap.fromTo(
            boxRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.6,
                delay: 0.4,
                ease: "linear",
            }
        );
    }, [activeIndex]);



    return (
        <div ref={triggerRef} id="slider-section" className="relative w-full h-[200vh]">
            <div
                ref={sliderRef}
                className="sticky top-0 w-full h-screen flex flex-col items-center justify-center text-white"
            >
                {/* Labels */}
                <div
                    ref={labelRef}
                    className={`z-20 space-y-4 opacity-0 pointer-events-none fixed top-10 left-1/2 -translate-y-1/2 md:space-y-4 md:top-1/2 md:left-10 md:-translate-y-1/2 flex flex-row  -translate-x-1/2 space-x-4 md:flex-col md:space-x-0 md:translate-x-0`}
                >
                    {slides.map((label, i) => (
                        <div
                            key={label}
                            className={`font-thin text-base md:text-lg lg:text-xl font-mono uppercase transition-opacity duration-300 ${i === 0 ? "hidden" : ""} ${activeIndex === i ? "opacity-100" : "opacity-40"}`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
                {/* Slide content */}
                {
                    activeIndex == 1 && (
                        <div className="w-full flex flex-col items-center justify-center gap-8">
                            <div ref={boxRef} className="w-full flex flex-row items-center justify-center" >
                                <Step3 className="w-[50vw] h-[40vw] lg:w-[20vw] lg:h-[20vw]" />
                            </div>
                            <div ref={textRef} className="text-content flex flex-col gap-6 items-center justify-center">
                                <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
                                    Gain Clarity
                                </p>
                                <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]">
                                    We analyze your business operations, define high-impact AI Opportunities and co-design the AI Transformation Strategy that aligns with your goals.
                                </p>
                            </div>
                        </div>
                    )
                }
                {activeIndex === 2 && (
                    <div className="w-full flex flex-col items-center justify-center gap-8">
                        <div
                            ref={boxRef}
                            className="relative w-full flex flex-row items-center justify-center gap-8"
                        >
                            <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[300px]">
                                <LearnRive />
                            </div>
                        </div>

                        <div
                            ref={textRef}
                            className="text-content flex flex-col gap-6 items-center justify-center"
                        >
                            <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
                                Learn AI
                            </p>
                            <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]">
                                Our experts equip your team with the tools, frameworks, and strategic
                                know-how to adopt AI confidently across all organizational levels.
                            </p>
                        </div>
                    </div>
                )}


                {
                    activeIndex == 3 && (
                        <div className="w-full flex flex-col items-center justify-center gap-8">
                            <div
                                ref={boxRef}
                                className="relative w-full flex flex-row items-center justify-center gap-8"
                            >
                                <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[400px]">
                                    <BuildRive />
                                </div>
                            </div>
                            <div ref={textRef} className="text-content flex flex-col gap-6 items-center justify-center">
                                <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
                                    Build Solutions
                                </p>
                                <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]">
                                    We design and develop custom AI systems, automations, and state-of-the-art solutions tailored to your business goals.
                                </p>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    );
};

export default OneSlideFixedSlider;
