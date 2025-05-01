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
    { title: "Identify", index: 1 },
    { title: "Educate", index: 2 },
    { title: "Develop", index: 3 },
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
    const headingRef = useRef<HTMLDivElement>(null);
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

        if (toIndex === 2 && rive1) {
            setTimeout(() => {
                rive1.reset();
                rive1.play();
            }, 300);
        }
        if (toIndex === 3 && rive2) {
            setTimeout(() => {
                rive2.reset();
                rive2.play();
            }, 450);
        }

        gsap.to(fromRef, {
            opacity: 0,
            x: direction === "forward" ? -100 : 100,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                fromRef.style.display = "none";
                toRef.style.display = "flex";

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
                duration: 0.08,
                ease: "power2.out",
                overwrite: "auto",
                onComplete: () => {
                    enableScroll();
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 6);
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

            if (toIndex === 2 && rive1) {
                setTimeout(() => {
                    rive1.reset();
                    rive1.play();
                }, 250);
            }
            if (toIndex === 3 && rive2) {
                setTimeout(() => {
                    rive2.reset();
                    rive2.play();
                }, 250);
            }

            disableScroll();
            hasSnapped = true;
            accumulated = 0;

            gsap.to(fromRef, {
                opacity: 0,
                x: direction === "forward" ? -100 : 100,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    fromRef.style.display = "none";
                    toRef.style.display = "flex";

                    gsap.fromTo(
                        toRef,
                        { opacity: 0, x: direction === "forward" ? 150 : -150 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.4,
                            ease: "power2.out",
                            onComplete: () => {
                                hasSnapped = false;
                                setTimeout(() => enableScroll(), 500);
                            },
                        }
                    );
                },
            });

            entranceStep = toIndex;
            entranceStepRef.current = toIndex;
            setActiveStep(toIndex);
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


        const heading = headingRef.current;
        if (!heading) return;

        let animationIn: GSAPTimeline | null = null;
        let animationOut: GSAPTimeline | null = null;

        const animateIn = () => {
            if (animationOut) animationOut.kill();

            animationIn = gsap.timeline();

            animationIn.fromTo(
                headingRef.current,
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.5,
                    ease: "power4.out",
                }
            );

        };


        const animateOut = () => {
            if (animationIn) animationIn.kill();

            animationOut = gsap.timeline();

            animationOut.to(headingRef.current, {
                opacity: 0,
                y: 40,
                filter: "blur(6px)",
                duration: 0.5,
                ease: "power2.in",
            });

        };



        const trigger = ScrollTrigger.create({
            trigger: centerRef.current,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: animateIn,
            onEnterBack: animateIn,
            onLeave: animateOut,
            onLeaveBack: animateOut,
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
            className="w-full h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
        >
            {/* Labels Column */}
            <div className="absolute w-full lg:w-fit left-1/2 lg:left-2 lg:top-1/2 top-4 -translate-x-1/2 lg:-translate-x-0 lg:-translate-y-1/2 flex flex-row lg:flex-col lg:items-start  items-center justify-center lg:gap-2 gap-6 z-10">
                {LABELS.map((label, index) => (
                    <button
                        key={label.title}
                        onClick={() => handleLabelClick(index)}
                        className={`text-left ${index === 0 ? "hidden" : ""} cursor-pointer transition-all duration-300 ${activeStep === index
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
                <div className="relative w-full -translate-y-20 lg:-translate-y-14">
                    <p
                        ref={headingRef}
                        className="text-3xl md:text-5xl text-left leading-tight whitespace-pre-wrap absolute top-0 left-0 z-0"
                    >
                        <span className="">
                            <span className="white-silver-animated-text">W</span>
                            <span className="white-silver-animated-text">e</span>
                            <span className="gray-text">&nbsp;</span>
                            <span className="white-silver-animated-text1">s</span>
                            <span className="white-silver-animated-text1">p</span>
                            <span className="white-silver-animated-text1">e</span>
                            <span className="white-silver-animated-text1">n</span>
                            <span className="white-silver-animated-text1">d</span>
                            <span className="gray-text">&nbsp;</span>
                            <span className="white-silver-animated-text2">o</span>
                            <span className="white-silver-animated-text2">u</span>
                            <span className="white-silver-animated-text2">r</span>
                            <span className="gray-text">&nbsp;</span>
                            <span className="white-silver-animated-text">d</span>
                            <span className="white-silver-animated-text">a</span>
                            <span className="white-silver-animated-text">y</span>
                            <span className="white-silver-animated-text">s</span>
                            <span className="gray-text">&nbsp;</span>
                            <br className="block lg:hidden" />
                            <span className="white-silver-animated-text1">g</span>
                            <span className="white-silver-animated-text1">u</span>
                            <span className="white-silver-animated-text1">i</span>
                            <span className="white-silver-animated-text1">d</span>
                            <span className="white-silver-animated-text1">i</span>
                            <span className="white-silver-animated-text1">n</span>
                            <span className="white-silver-animated-text1">g</span>
                            <span className="white-silver-animated-text1">&nbsp;</span>
                            <br className="hidden lg:block" />
                            <span className="white-silver-animated-text2">c</span>
                            <span className="white-silver-animated-text2">o</span>
                            <span className="white-silver-animated-text2">m</span>
                            <span className="white-silver-animated-text2">p</span>
                            <span className="white-silver-animated-text2">a</span>
                            <span className="white-silver-animated-text2">n</span>
                            <span className="white-silver-animated-text2">i</span>
                            <span className="white-silver-animated-text2">e</span>
                            <span className="white-silver-animated-text2">s</span>
                            <span className="gray-text">&nbsp;</span>
                            <span className="white-silver-animated-text">t</span>
                            <span className="white-silver-animated-text">h</span>
                            <span className="white-silver-animated-text">r</span>
                            <span className="white-silver-animated-text">o</span>
                            <span className="white-silver-animated-text">u</span>
                            <span className="white-silver-animated-text">g</span>
                            <span className="white-silver-animated-text">h</span>
                            <span className="gray-text">&nbsp;</span>
                            <br className="block lg:hidden" />
                            <span className="white-silver-animated-text1">t</span>
                            <span className="white-silver-animated-text1">h</span>
                            <span className="white-silver-animated-text1">e</span>
                            <span className="white-silver-animated-text1">s</span>
                            <span className="white-silver-animated-text1">e</span>
                            <span className="gray-text">&nbsp;</span>
                            <br className="hidden lg:block" />
                            <span className="green-text">t</span>
                            <span className="green-text">h</span>
                            <span className="green-text">r</span>
                            <span className="green-text">e</span>
                            <span className="green-text">e</span>
                            <span className="gray-text">&nbsp;</span>
                            <span className="white-silver-animated-text2">c</span>
                            <span className="white-silver-animated-text2">o</span>
                            <span className="white-silver-animated-text2">r</span>
                            <span className="white-silver-animated-text2">e</span>
                            <span className="gray-text">&nbsp;</span>
                            <span className="white-silver-animated-text">s</span>
                            <span className="white-silver-animated-text">t</span>
                            <span className="white-silver-animated-text">a</span>
                            <span className="white-silver-animated-text">g</span>
                            <span className="white-silver-animated-text">e</span>
                            <span className="white-silver-animated-text">s</span>
                            <span className="white-silver-animated-text">&nbsp;</span>
                        </span>
                    </p>
                </div>
                <div className="w-full flex justify-center lg:justify-end">
                    <Step3 className="w-[60vw] h-[50vw] sm:w-[50vw] sm:h[40vh] md:w-[35vw] md:h-[25vh] lg:w-[35vw] lg:h-[25vw] mt-4 sm:mt-6 md:mt-8 lg:mt-2" />
                </div>
            </div>

            {/* Content 2 */}
            <div ref={contentRefs[1]} className="w-full flex-col items-center justify-center gap-8">
                <div className="w-full flex justify-center">
                    <Step32 className="w-[60vw] h-[50vw] sm:w-[50vw] sm:h[40vh] md:w-[30vw] md:h-[20vh] lg:w-[30vw] lg:h-[20vw]" />
                </div>
                <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
                    Identify
                </p>
                <p className="text-base md:text-xl lg:text-2xl font-light text-center max-w-[700px] text-[#A0A4A1]">
                    We analyze your business operations, identify high-impact Al opportunities and co-design the Al Transformation Strategy that best aligns with your business goals.
                </p>
            </div>

            {/* Content 3 */}
            <div ref={contentRefs[2]} className="w-full flex-col items-center justify-center gap-8">
                <div className="w-full flex justify-center">
                    <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[300px]">
                        <LearnRive />
                    </div>
                </div>
                <p className="lg:text-9xl md:text-8xl text-6xl landscape:text-7xl font-light text-center capitalize">Educate </p>
                <p className="text-base md:text-xl lg:text-2xl font-light text-center max-w-[700px] text-[#A0A4A1]">
                    Our experts equip your team with the tools, frameworks, and strategic know-how to adopt Al confidently across all organizational levels.
                </p>
            </div>

            {/* Content 4 */}
            <div ref={contentRefs[3]} className="w-full flex-col items-center justify-center gap-8">
                <div className="w-full flex justify-center">
                    <div className="w-[100vw] h-[250px] md:w-[80vw] md:h-[400px] lg:w-[500px] lg:h-[300px]">
                        <BuildRive />
                    </div>
                </div>
                <p className="lg:text-9xl md:text-8xl text-6xl landscape:text-7xl font-light text-center capitalize">Develop</p>
                <p className="text-base md:text-xl lg:text-2xl font-light text-center lg:w-9/12 w-11/12 text-[#A0A4A1]">
                    We design and develop custom AI systems, automations, and state-of-the-art solutions that are proven to move the needle inside your business, thanks to our extensive experience and network of AI Automation Agencies building such solutions.
                </p>
            </div>
        </div>
    );
};

export default Entrance;
