"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide2 = () => {
    const [rivePlay, setRivePlay] = useState(false); // State to control the Rive animation
    const mtd = new MagicTrackpadDetector();
    const centerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLParagraphElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    const { rive, RiveComponent: LearnRive } = useRive({
        src: "/rive/animation1.riv",
        autoplay: false, // Control autoplay with state
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    useEffect(() => {
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
                scrollToSection("#third-slide-section");
            } else if (accumulated <= -threshold) {
                disableScroll();
                scrollToSection("#first-slide-section");
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (mtd.inertial(e)) {
                return;
            }

            const deltaY = e.deltaY;
            const normalizedDelta = Math.abs(deltaY) < 1 ? deltaY * 30 : deltaY;

            handleIntent(normalizedDelta);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "PageDown") {
                if (isInView()) {
                    e.preventDefault();
                    disableScroll();
                    handleIntent(60);
                }
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
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

        // Animate main heading and subtext with GSAP (fade in from bottom)
        if (headingRef.current && subTextRef.current) {
            gsap.set(headingRef.current, { opacity: 0, y: 80 });
            gsap.set(subTextRef.current, { opacity: 0, y: 60 });

            // ScrollTrigger to trigger on both enter and re-enter
            ScrollTrigger.create({
                trigger: centerRef.current,
                start: "top center",
                end: "bottom top",
                onEnter: () => {
                    gsap.to(headingRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power4.out",
                    });
                    gsap.to(subTextRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 1.4,
                        ease: "power4.out",
                        delay: 0.4,
                    });

                    // Trigger Rive animation after text animation
                    if (rive) {
                        rive.play();
                    }
                },
                onEnterBack: () => {
                    gsap.to(headingRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power4.out",
                    });
                    gsap.to(subTextRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 1.4,
                        ease: "power4.out",
                        delay: 0.4,
                    });

                    if (rive) {
                        rive.play();// Immediately start Rive animation when entering
                    } // Immediately start Rive animation when re-entering
                },
                onLeave: () => {
                    gsap.to([headingRef.current, subTextRef.current], {
                        opacity: 0,
                        y: 80,
                        duration: 0.6,
                        ease: "power2.inOut",
                    });

                    if (rive) {
                        rive.reset();
                    }
                },
                onLeaveBack: () => {
                    gsap.to([headingRef.current, subTextRef.current], {
                        opacity: 0,
                        y: 80,
                        duration: 0.6,
                        ease: "power2.inOut",
                    });
                    if (rive) {
                        rive.reset();
                    }
                },
            });
        }

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
    }, [rive]); // Empty dependency array to run once on mount

    return (
        <div
            id="second-slide-section"
            ref={centerRef}
            className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
        >
            <div className="w-full flex flex-col items-center justify-center gap-8">
                <div ref={boxRef} className="relative w-full flex flex-row items-center justify-center gap-8">
                    <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[300px]">
                        <LearnRive />
                    </div>
                </div>

                <div ref={textRef} className="text-content flex flex-col gap-6 items-center justify-center">
                    <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize" ref={headingRef}>
                        Learn AI
                    </p>
                    <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]" ref={subTextRef}>
                        Our experts equip your team with the tools, frameworks, and strategic
                        know-how to adopt AI confidently across all organizational levels.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Slide2;
