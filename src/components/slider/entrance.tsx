"use client";

import "@/styles/fonts.css";
import Step3 from "@/assets/images/animation/entrance.svg";
import Step32 from "@/assets/images/animation/step3.svg";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

gsap.registerPlugin(ScrollToPlugin);

const LABELS = [
    { title: "Introduction", index: 0 },
    { title: "Identify", index: 1 },
    { title: "Educate", index: 2 },
    { title: "Develop", index: 3 },
];

type EntranceProps = {
    scrollContainerRef: RefObject<HTMLDivElement | null>;
};

const Entrance = ({ scrollContainerRef }: EntranceProps) => {
    const [activeStep, setActiveStep] = useState(0);
    const entranceStepRef = useRef(0);
    const centerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];
    const touchStartY = useRef(0);
    const TOUCH_SWIPE_THRESHOLD = 30;

    const { rive: rive1, RiveComponent: LearnRive } = useRive({
        src: "/rive/animation1.riv",
        autoplay: false,
        layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    });

    const { rive: rive2, RiveComponent: BuildRive } = useRive({
        src: "/rive/animation2.riv",
        autoplay: false,
        layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    });

    const lastTransitionTime = useRef(0);
    const TRANSITION_COOLDOWN = 400;

    // Add these helper functions inside the Entrance component
    const handleExitToNextSection = () => {
        const el = document.querySelector("#page-wrapper");
        const wrapper = el instanceof HTMLElement ? el : null;
        if (wrapper) {
            wrapper.classList.add("snap-y");
            wrapper.classList.remove("overflow-hidden");
            wrapper.style.overflowY = "";
        }
        document.body.style.overflow = "";

        setTimeout(() => {
            if (scrollContainerRef.current) {
                gsap.to(scrollContainerRef.current, {
                    scrollTo: "#snappyStats",
                    duration: 0.4,
                    ease: "power2.out",
                    autoKill: false,
                });
            }
        }, 150);
    };

    const handleExitToPreviousSection = () => {
        const el = document.querySelector("#page-wrapper");
        const wrapper = el instanceof HTMLElement ? el : null;
        if (wrapper) {
            wrapper.classList.add("snap-y");
            wrapper.classList.remove("overflow-hidden");
            wrapper.style.overflowY = "";
        }
        document.body.style.overflow = "";

        setTimeout(() => {
            if (scrollContainerRef.current) {
                gsap.to(scrollContainerRef.current, {
                    scrollTo: "#snappyCenter",
                    duration: 0.4,
                    ease: "power2.out",
                    autoKill: false,
                });
            }
        }, 150);
    };

    const canTransition = useCallback(() => {
        return Date.now() - lastTransitionTime.current > TRANSITION_COOLDOWN;
    }, []);

    const transition = useCallback(
        (fromIndex: number, toIndex: number, direction: "forward" | "backward") => {
            if (!canTransition()) return;

            const fromRef = contentRefs[fromIndex]?.current;
            const toRef = contentRefs[toIndex]?.current;
            if (!fromRef || !toRef) return;

            lastTransitionTime.current = Date.now();

            if (toIndex === 2 && rive1) {
                rive1.reset();
                rive1.play();
            }
            if (toIndex === 3 && rive2) {
                rive2.reset();
                rive2.play();
            }

            gsap.to(fromRef, {
                opacity: 0,
                x: direction === "forward" ? -100 : 100,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    fromRef.style.display = "none";
                    toRef.style.display = "flex";
                    gsap.fromTo(
                        toRef,
                        { opacity: 0, x: direction === "forward" ? 100 : -100 },
                        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
                    );
                },
            });

            entranceStepRef.current = toIndex;
            setActiveStep(toIndex);
        },
        [rive1, rive2, canTransition]
    );

    const handleLabelClick = useCallback(
        (index: number) => {
            if (activeStep === index || !canTransition()) return;
            const direction = index > activeStep ? "forward" : "backward";
            transition(activeStep, index, direction);
        },
        [activeStep, canTransition, transition]
    );

    useEffect(() => {
        contentRefs.forEach((ref, i) => {
            if (ref.current) {
                ref.current.style.display = i === 0 ? "flex" : "none";
            }
        });
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            if (!canTransition()) return;

            const delta = e.deltaY;
            const step = entranceStepRef.current;

            if (delta > 20) {
                if (step < contentRefs.length - 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    transition(step, step + 1, "forward");
                } else {
                    // Last block: re-enable outer scroll before scrolling down
                    handleExitToNextSection(); // slight delay to ensure styles apply
                }
            } else if (delta < -20) {
                if (step > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    transition(step, step - 1, "backward");
                } else {
                    // First block: re-enable outer scroll before scrolling up
                    handleExitToPreviousSection();
                }
            }

        };

        const onTouchStart = (e: TouchEvent) => {
            const touch = e.touches?.[0];
            if (!touch) return;
            touchStartY.current = touch.clientY;
        };


        // Touch end handler
        const onTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches?.[0]?.clientY;
            if (!canTransition() || touchEndY === undefined) return;

            const deltaY = touchStartY.current - touchEndY;
            const step = entranceStepRef.current;

            if (deltaY < -TOUCH_SWIPE_THRESHOLD) {
                if (step > 0) {
                    transition(step, step - 1, "backward");
                } else {
                    handleExitToPreviousSection();
                }
            } else if (deltaY > TOUCH_SWIPE_THRESHOLD) {
                if (step < contentRefs.length - 1) {
                    transition(step, step + 1, "forward");
                } else {
                    handleExitToNextSection();
                }
            }
        };


        const onKeyDown = (e: KeyboardEvent) => {
            if (!canTransition()) return;

            const step = entranceStepRef.current;

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    if (step < contentRefs.length - 1) {
                        transition(step, step + 1, "forward");
                    } else {
                        handleExitToNextSection();
                    }
                    break;

                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    if (step > 0) {
                        transition(step, step - 1, "backward");
                    } else {
                        handleExitToPreviousSection();
                    }
                    break;
            }
        };

        container.addEventListener("wheel", onWheel, { passive: false });
        container.addEventListener('touchstart', onTouchStart, { passive: true });
        container.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('keydown', onKeyDown);

        return () => {
            container.removeEventListener("wheel", onWheel);
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [canTransition, transition]);


    useEffect(() => {
        const section = centerRef.current;
        const el = document.querySelector("#page-wrapper");
        const pageWrapper = el instanceof HTMLElement ? el : null;


        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                if (entry.isIntersecting) {
                    centerRef.current?.scrollIntoView({ behavior: "auto", inline: "start", block: "start" });
                    if (pageWrapper) {
                        pageWrapper.classList.remove("snap-y");
                        pageWrapper.classList.add("overflow-hidden");
                        pageWrapper.style.overflowY = "hidden";
                    }
                    document.body.style.overflow = "hidden";
                    
                } else {
                    if (pageWrapper) {
                        pageWrapper.classList.add("snap-y");
                        pageWrapper.classList.remove("overflow-hidden");
                        pageWrapper.style.overflowY = "";
                    }
                    document.body.style.overflow = "";
                }
            },
            { threshold: 0.8 }
        );

        if (section) observer.observe(section);

        return () => {
            if (section) observer.unobserve(section);
            if (pageWrapper) {
                pageWrapper.classList.add("snap-y");
                pageWrapper.classList.remove("overflow-hidden");
                pageWrapper.style.overflowY = "";
            }
            document.body.style.overflow = "";
        };
    }, []);

    const lastScrollTime = useRef(0); // Add this ref near your other refs

    // Modified useEffect
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const trapScrollBounce = () => {
            const now = Date.now();
            // Throttle to prevent layout thrashing
            if (now - lastScrollTime.current < 100) return;
            lastScrollTime.current = now;

            // Add buffer for mobile touch scroll
            if (container.scrollTop <= 1) {
                container.scrollTop = 1;
            } else if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
                container.scrollTop = container.scrollHeight - container.clientHeight - 1;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!container) return;

            // Add null check for touch
            const touch = e.touches?.[0];
            if (!touch) return; // ← This is the key check

            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;
            const deltaY = touch.clientY - touchStartY.current;

            // Prevent boundary overscroll
            if ((scrollTop <= 0 && deltaY > 0) ||
                (scrollTop + clientHeight >= scrollHeight && deltaY < 0)) {
                e.preventDefault();
            }
        };

        container.addEventListener("scroll", trapScrollBounce);
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("scroll", trapScrollBounce);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);


    return (
        <div
            id="entrance-section"
            ref={centerRef}
            className="w-full no-scrollbar overflow-x-hidden h-[100dvh] sticky top-0 flex flex-col justify-center items-center text-white z-10 overscroll-none"
        >
            <div className="absolute left-1/2 lg:left-2 lg:top-1/2 top-[5vh] -translate-x-1/2 lg:-translate-x-0 lg:-translate-y-1/2 -translate-y-1/2 flex flex-row lg:flex-col lg:items-start  items-center justify-center lg:gap-2 gap-6 z-10 px-4 md:px-8 lg:px-12 mx-auto">
                {LABELS.map((label, index) => (
                    <button
                        key={label.title}
                        onClick={() => handleLabelClick(index)}
                        className={`text-left ${index === 0 ? "hidden" : ""} cursor-pointer lg:transition-all lg:duration-300 ${activeStep === index
                            ? "text-white lg:text-xl opacity-100"
                            : "text-gray-400 text-lg opacity-50 hover:opacity-80"
                            }`}
                        style={{
                            fontFamily: "DM-Mono-Light, monospace",
                        }}
                    >
                        {label.title}
                    </button>
                ))}
            </div>

            <div
                ref={scrollRef}
                className="w-full [@supports(-webkit-touch-callout:none)]:[-webkit-overflow-scrolling:auto] h-full overflow-y-scroll no-scrollbar px-4 md:px-8 lg:px-12 mx-auto overflow-x-hidden flex flex-col items-center justify-center relative touch-pan-y overscroll-none"
            >
                {/* Content 1 */}
                <div ref={contentRefs[0]} className="w-full flex-col items-start justify-start gap-12 px-4">
                    <p
                        className="text-3xl md:text-5xl text-left leading-tight whitespace-pre-wrap"
                    >
                        <span className="white-silver-animated-text">We </span>
                        <span className="white-silver-animated-text1">spend </span>
                        <span className="white-silver-animated-text2">our </span>
                        <span className="white-silver-animated-text2">days </span>
                        <br className="block lg:hidden" />
                        <span className="white-silver-animated-text1">guiding </span>
                        <br className="hidden lg:block" />
                        <span className="white-silver-animated-text">companies </span>
                        <span className="white-silver-animated-text1">through </span>
                        <br className="block lg:hidden" />
                        <span className="white-silver-animated-text2">these </span>
                        <br className="hidden lg:block" />
                        <span className="green-text">three </span>
                        <span className="white-silver-animated-text">core </span>
                        <span className="white-silver-animated-text1">stages</span>
                    </p>
                    <div className="w-full flex justify-end">
                        <Step3 className="w-[35vw] h-[25vw]" />
                    </div>
                </div>

                {/* Content 2 */}
                <div ref={contentRefs[1]} className="w-full flex-col items-center justify-center gap-8">
                    <Step32 className="w-[30vw] h-[20vw]" />
                    <p className="text-6xl font-light">Identify</p>
                    <p className="text-xl text-center max-w-[700px] text-[#A0A4A1]">
                        We analyze your business operations, identify high-impact AI opportunities...
                    </p>
                </div>

                {/* Content 3 */}
                <div ref={contentRefs[2]} className="w-full flex-col items-center justify-center gap-8">
                    <div className="w-full flex justify-center">
                        <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[300px]">
                            <LearnRive />
                        </div>
                    </div>
                    <p className="text-6xl font-light">Educate</p>
                    <p className="text-xl text-center max-w-[700px] text-[#A0A4A1]">
                        Our experts equip your team with tools and strategic know-how...
                    </p>
                </div>

                {/* Content 4 */}
                <div ref={contentRefs[3]} className="w-full flex-col items-center justify-center gap-8">
                    <div className="w-full flex justify-center">
                        <div className="w-[100vw] h-[250px] md:w-[80vw] md:h-[400px] lg:w-[500px] lg:h-[300px]">
                            <BuildRive />
                        </div>
                    </div>
                    <p className="text-6xl font-light">Develop</p>
                    <p className="text-xl text-center max-w-[700px] text-[#A0A4A1]">
                        We design and develop custom AI systems and automations...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Entrance;
