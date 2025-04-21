"use client";

import "@/styles/fonts.css";
import Step3 from "@/assets/images/animation/entrance.svg";
import Step32 from "@/assets/images/animation/step3.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

const LABELS = [
    { title: "Introduction", index: 0 },
    { title: "Clarify", index: 1 },
    { title: "Learn", index: 2 },
    { title: "Build", index: 3 },
];


gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Entrance = () => {
    const [rive1Ready, setRive1Ready] = useState(false);
    const [rive2Ready, setRive2Ready] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const entranceStepRef = useRef(0);

    const mtd = new MagicTrackpadDetector();
    const centerRef = useRef<HTMLDivElement>(null);
    const animTextRef = useRef<HTMLParagraphElement>(null);
    const contentRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];
    const touchStartY = useRef(0);

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

    const canTransition = useCallback(() => {
        return Date.now() - lastTransitionTime.current > TRANSITION_COOLDOWN;
    }, []);

    const transition = useCallback((
        fromIndex: number,
        toIndex: number,
        direction: "forward" | "backward"
    ) => {
        if (!canTransition()) return;

        lastTransitionTime.current = Date.now();
        const fromRef = contentRefs[fromIndex]?.current;
        const toRef = contentRefs[toIndex]?.current;
        if (!fromRef || !toRef) return;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        gsap.to(fromRef, {
            opacity: 0,
            x: direction === "forward" ? -100 : 100,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                fromRef.style.display = "none";
                toRef.style.display = "flex";

                if (rive1Ready && rive1) rive1.play();
                if (rive2Ready && rive2) rive2.play();

                gsap.fromTo(
                    toRef,
                    { opacity: 0, x: direction === "forward" ? 150 : -150 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => {
                            document.body.style.overflow = "";
                            document.documentElement.style.overflow = "";
                        },
                    }
                );
            },
        });

        // Update both state and ref
        setActiveStep(toIndex);
        entranceStepRef.current = toIndex;
    }, [rive1, rive2, rive1Ready, rive2Ready, canTransition]);

    const handleLabelClick = useCallback((index: number) => {
        if (activeStep === index || !canTransition()) return;
        const direction = index > activeStep ? "forward" : "backward";
        transition(activeStep, index, direction);
    }, [activeStep, canTransition, transition]);

    useEffect(() => {
        if (rive1) setRive1Ready(true);
        if (rive2) setRive2Ready(true);
    }, [rive1, rive2]);


    useEffect(() => {
        const threshold = 30;
        let accumulated = 0;
        let hasSnapped = false;
        let scrollLocked = false;
        let scrollCooldown = false;
        let entranceStep = 0;

        const preventDefault = (e: TouchEvent): void => e.preventDefault();

        const disableScroll = () => {
            if (!scrollLocked) {
                scrollLocked = true;
                document.body.style.overflow = "hidden";
                document.documentElement.style.overflow = "hidden";
                document.body.style.touchAction = "none";
                document.documentElement.style.touchAction = "none";
                window.addEventListener("touchmove", preventDefault, { passive: false });
            }
        };

        const enableScroll = () => {
            if (scrollLocked) {
                scrollLocked = false;
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";
                document.body.style.touchAction = "";
                document.documentElement.style.touchAction = "";
                window.removeEventListener("touchmove", preventDefault);
            }
        };

        const isInView = () => {
            const el = centerRef.current;
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top <= window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.25;
        };


        const scrollToSection = (targetId: string) => {
            if (scrollCooldown) return;
            scrollCooldown = true;
            hasSnapped = true;
            accumulated = 0;

            gsap.to(window, {
                scrollTo: targetId,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
                onComplete: () => {
                    enableScroll();
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 100);
                },
            });
        };

        const localTransition = (
            fromIndex: number,
            toIndex: number,
            direction: "forward" | "backward"
        ) => {
            if (!canTransition()) return;

            lastTransitionTime.current = Date.now();
            const fromRef = contentRefs[fromIndex]?.current;
            const toRef = contentRefs[toIndex]?.current;
            if (!fromRef || !toRef) return;

            disableScroll();
            hasSnapped = true;
            accumulated = 0;

            gsap.to(fromRef, {
                opacity: 0,
                x: direction === "forward" ? -100 : 100,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    fromRef.style.display = "none";
                    toRef.style.display = "flex";

                    if (rive1Ready && rive1) rive1.play();
                    if (rive2Ready && rive2) rive2.play();

                    gsap.fromTo(
                        toRef,
                        { opacity: 0, x: direction === "forward" ? 150 : -150 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            onComplete: () => {
                                hasSnapped = false;
                                setTimeout(() => enableScroll(), 300);
                            },
                        }
                    );
                },
            });

            // Update both the local entranceStep and the ref
            entranceStep = toIndex;
            entranceStepRef.current = toIndex;
            setActiveStep(toIndex); // This ensures button highlights stay in sync
        };

        const handleIntent = (delta: number) => {
            if (!isInView() || hasSnapped || !canTransition()) return;

            accumulated += delta;

            if (accumulated >= threshold) {
                if (entranceStepRef.current < contentRefs.length - 1) {
                    localTransition(entranceStepRef.current, entranceStepRef.current + 1, "forward");
                } else {
                    scrollToSection("#stats-section");
                }
            } else if (accumulated <= -threshold) {
                if (entranceStepRef.current > 0) {
                    localTransition(entranceStepRef.current, entranceStepRef.current - 1, "backward");
                } else {
                    scrollToSection("#center-section");
                }
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (mtd.inertial(e)) return;

            // Slower wheel sensitivity
            const deltaY = e.deltaY * 0.3; // Reduced multiplier
            handleIntent(deltaY);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isInView()) return;

            e.preventDefault();

            if (e.key === "ArrowDown" || e.key === "PageDown") {
                handleIntent(threshold + 5); // Scroll down
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
                handleIntent(-(threshold + 5)); // Scroll up
            }
        };

        const handleSpaceButton = (e: KeyboardEvent) => {
            if (e.key === " " && isInView()) {
                e.preventDefault();
                handleIntent(threshold + 5); // Scroll down
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (isInView() && e.touches && e.touches.length > 0) {
                const touch = e.touches[0];
                if (touch) {
                    touchStartY.current = touch.clientY;
                    disableScroll();
                }
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isInView() && e.touches && e.touches.length > 0 && touchStartY.current !== 0) {
                // Slower touch sensitivity with momentum reduction
                const touch = e.touches[0];
                if (touch) {
                    const deltaY = (touchStartY.current - touch.clientY) * 0.5;
                    handleIntent(deltaY);
                    touchStartY.current = touch.clientY;
                }
            }
        };

        const handleTouchEnd = () => {
            touchStartY.current = 0;
            // Don't enable scroll immediately - let the transition complete it
        };

        const headingEl = animTextRef.current;

        if (headingEl) {
            const words = headingEl.querySelectorAll("span");

            // Set initial state
            gsap.set(words, {
                opacity: 0,
                y: 100,
                rotateX: 100,
                transformOrigin: "bottom center"
            });

            ScrollTrigger.create({
                trigger: centerRef.current,
                start: "top center",
                end: "bottom top",
                toggleActions: "play none none reverse",
                onEnter: animateIn,
                onEnterBack: animateIn,
                onLeave: animateOut,
                onLeaveBack: animateOut
            });

            function animateIn() {
                const tl = gsap.timeline();
                tl.to(words, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    ease: "linear",
                    duration: 0.5,
                    stagger: {
                        each: 0.12,
                        from: "start"
                    }
                }).fromTo(
                    words,
                    {
                        rotateX: 100,
                        transformOrigin: "bottom center"
                    },
                    {
                        rotateX: 0,
                        duration: 0.5,
                        ease: "power4.out",
                        stagger: {
                            each: 0.12,
                            from: "start"
                        }
                    },
                    "<" // run in parallel with opacity/y
                );
            }

            function animateOut() {
                gsap.to(words, {
                    opacity: 0,
                    y: 60,
                    duration: 0.6,
                    ease: "power2.inOut"
                });
            }
        }

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keydown", handleSpaceButton);
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    hasSnapped = false;
                    accumulated = 0;
                }
            },
            { threshold: 0.5 }
        );
        if (centerRef.current) observer.observe(centerRef.current);

        contentRefs.forEach((ref, i) => {
            if (ref.current) {
                ref.current.style.display = i === 0 ? "flex" : "none";
            }
        });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keydown", handleSpaceButton);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
            observer.disconnect();
            enableScroll();
        };
    }, [rive1, rive2, rive1Ready, rive2Ready, canTransition, transition]);

    return (
        <div
            id="entrance-section"
            ref={centerRef}
            className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
        >
            {/* Labels Column */}
            <div className="absolute w-full md:w-fit left-1/2 md:left-2 md:top-1/2 top-4 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 flex flex-row md:flex-col md:items-start  items-center justify-center md:gap-2 gap-6 z-10">
                {LABELS.map((label, index) => (
                    <button
                        key={label.title}
                        onClick={() => handleLabelClick(index)}
                        className={`text-left ${index === 0 ? "hidden" : ""} transition-all duration-300 ${activeStep === index
                            ? "text-lg text-white md:text-2xl opacity-100"
                            : "text-lg text-gray-400 md:text-xl opacity-50 hover:opacity-70"
                            }`}
                        style={{
                            fontFamily: "DM-Mono-Light, monospace",
                        }}
                    >
                        {label.title}
                    </button>
                ))}
            </div>
            {/* Content 1 */}
            <div ref={contentRefs[0]} className="w-full flex-col items-start justify-start gap-24 lg:gap-8">
                <div>
                    <p
                        className="text-3xl md:text-5xl lg:text-6xl text-left whitespace-pre-wrap"
                        ref={animTextRef}
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
                        <span className="white-silver-animated-text1">three </span>
                        <span className="white-silver-animated-text">core </span>
                        <span className="white-silver-animated-text1">stages</span>
                    </p>
                </div>
                <div className="w-full flex justify-center lg:justify-end">
                    <Step3 className="w-[60vw] h-[50vw] lg:w-[35vw] lg:h-[25vw]" />
                </div>
            </div>

            {/* Content 2 */}
            <div ref={contentRefs[1]} className="w-full flex-col items-center justify-center gap-8">
                <div className="w-full flex justify-center">
                    <Step32 className="w-[50vw] h-[40vw] lg:w-[20vw] lg:h-[20vw]" />
                </div>
                <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
                    Gain Clarity
                </p>
                <p className="text-base font-light text-center max-w-[700px] text-[#A0A4A1]">
                    We analyze your business operations and co-design your AI strategy.
                </p>
            </div>

            {/* Content 3 */}
            <div ref={contentRefs[2]} className="w-full flex-col items-center justify-center gap-8">
                <div className="w-full flex justify-center">
                    <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[300px]">
                        <LearnRive />
                    </div>
                </div>
                <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">Learn AI</p>
                <p className="text-base font-light text-center max-w-[700px] text-[#A0A4A1]">
                    We equip your team with the tools and knowledge to lead AI adoption.
                </p>
            </div>

            {/* Content 4 */}
            <div ref={contentRefs[3]} className="w-full flex-col items-center justify-center gap-8">
                <div className="w-full flex justify-center">
                    <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[400px]">
                        <BuildRive />
                    </div>
                </div>
                <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">Build Solutions</p>
                <p className="text-base font-light text-center max-w-[700px] text-[#A0A4A1]">
                    We design and develop custom AI systems aligned with your goals.
                </p>
            </div>
        </div>
    );
};

export default Entrance;
