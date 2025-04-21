"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import Step3 from "@/assets/images/animation/entrance.svg";
import Step32 from "@/assets/images/animation/step3.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Entrance = () => {
    const mtd = new MagicTrackpadDetector();
    const centerRef = useRef<HTMLDivElement>(null);
    const content1Ref = useRef<HTMLDivElement>(null);
    const content2Ref = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    useEffect(() => {
        let entranceStep = 0;
        const threshold = 12;
        let accumulated = 0;
        let hasSnapped = false;
        let scrollLocked = false;
        let scrollCooldown = false;

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
            scrollLocked = false;
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.touchAction = "";
            document.documentElement.style.touchAction = "";
            window.removeEventListener("touchmove", preventDefault);
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
                duration: 0.3,
                ease: "linear",
                overwrite: "auto",
                onComplete: () => {
                    enableScroll();
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 100);
                },
            });
        };

        const handleIntent = (delta: number) => {
            if (!isInView() || hasSnapped) return;
            accumulated += delta;

            if (accumulated >= threshold) {
                disableScroll();

                if (entranceStep === 0) {
                    entranceStep = 1;
                    gsap.to(content1Ref.current, {
                        opacity: 0,
                        x: -100,
                        duration: 0.6,
                        ease: "power2.out",
                        onComplete: () => {
                            content1Ref.current!.style.display = "none";
                            content2Ref.current!.style.display = "flex";
                            gsap.fromTo(
                                content2Ref.current,
                                { opacity: 0, x: 150 },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.6,
                                    ease: "power2.out",
                                    onComplete: () => {
                                        enableScroll();
                                        entranceStep = 2; // Now ready to go to next section on second scroll
                                    },
                                }
                            );
                        },
                    });
                } else if (entranceStep === 2) {
                    scrollToSection("#second-slide-section");
                } else {
                    enableScroll();
                }
            } else if (accumulated <= -threshold) {
                disableScroll();

                // If we’re not at step 0, go back to content1
                if (entranceStep > 0) {
                    entranceStep = 0;
                    gsap.to(content2Ref.current, {
                        opacity: 0,
                        x: 150,
                        duration: 0.6,
                        ease: "power2.out",
                        onComplete: () => {
                            content2Ref.current!.style.display = "none";
                            content1Ref.current!.style.display = "flex";
                            gsap.fromTo(
                                content1Ref.current,
                                { opacity: 0, x: -100 },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.6,
                                    ease: "power2.out",
                                    onComplete: enableScroll,
                                }
                            );
                        },
                    });
                } else {
                    scrollToSection("#center-section");
                }
            }
        };


        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (mtd.inertial(e)) return;
            const deltaY = e.deltaY;
            const normalizedDelta = Math.abs(deltaY) < 1 ? deltaY * 30 : deltaY;
            handleIntent(normalizedDelta);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (["ArrowDown", "PageDown"].includes(e.key)) {
                if (isInView()) {
                    e.preventDefault();
                    disableScroll();
                    handleIntent(60);
                }
            } else if (["ArrowUp", "PageUp"].includes(e.key)) {
                if (isInView()) {
                    e.preventDefault();
                    disableScroll();
                    handleIntent(-60);
                }
            }
        };

        const handleSpaceButton = (e: KeyboardEvent) => {
            if (e.key === " ") {
                disableScroll();
                handleIntent(60);
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches.item(0);
            if (touch) {
                touchStartY.current = touch.clientY;
                disableScroll();
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches.item(0);
            if (touch) {
                handleIntent(touchStartY.current - touch.clientY);
            }
        };

        const handleTouchEnd = () => enableScroll();

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

        // Ensure initial visibility
        content1Ref.current!.style.display = "flex";
        content2Ref.current!.style.display = "none";

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
    }, []);

    return (
        <div
            id="entrance-section"
            ref={centerRef}
            className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
        >
            {/* First content */}
            <div
                ref={content1Ref}
                className="w-full flex flex-col items-start justify-start gap-24 lg:gap-8"
            >
                <div className="text-content flex flex-col items-start justify-start">
                    <p className="text-4xl md:text-5xl lg:text-6xl text-left">
                        We spend our days guiding<br />
                        companies through these<br />
                        three core stages
                    </p>
                </div>
                <div className="w-full flex flex-row items-center justify-center lg:justify-end">
                    <Step3 className="w-[60vw] h-[50vw] lg:w-[35vw] lg:h-[25vw]" />
                </div>
            </div>

            {/* Second content */}
            <div
                ref={content2Ref}
                className="w-full hidden flex-col items-center justify-center gap-8"
            >
                <div className="w-full flex flex-row items-center justify-center">
                    <Step32 className="w-[50vw] h-[40vw] lg:w-[20vw] lg:h-[20vw]" />
                </div>
                <div className="text-content flex flex-col gap-6 items-center justify-center">
                    <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
                        Gain Clarity
                    </p>
                    <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]">
                        We analyze your business operations, define high-impact AI
                        Opportunities and co-design the AI Transformation Strategy that
                        aligns with your goals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Entrance;
