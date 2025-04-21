"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import Step3 from "@/assets/images/animation/entrance.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Entrance = () => {
    const mtd = new MagicTrackpadDetector();
    const centerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLParagraphElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<SVGElement>(null); // Reference for the Step3 SVG element
    const touchStartY = useRef(0);

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
                scrollToSection("#first-slide-section");
            } else if (accumulated <= -threshold) {
                disableScroll();
                scrollToSection("#center-section");
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            // Use the MagicTrackpadDetector to check if the event is from a trackpad and is not an inertial scroll
            if (mtd.inertial(e)) {
                // If it's an inertial scroll event, we return early and don't process the scroll
                return;
            }

            const deltaY = e.deltaY;

            // Normalize the delta to handle macOS touchpad sensitivity
            const normalizedDelta = Math.abs(deltaY) < 1 ? deltaY * 30 : deltaY; // Adjust 30 based on your preference for sensitivity

            // Handle the scroll intent (up or down) based on the normalized delta
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
            gsap.set(headingRef.current, { opacity: 0, y: 0, x: -120 });
            gsap.set(subTextRef.current, { opacity: 0, y: 0, x: -120 });
            gsap.set(step3Ref.current, { opacity: 0, y: 0, x: -120, scale: 0.5 });  // Initial state of the SVG

            ScrollTrigger.create({
                trigger: centerRef.current,
                start: "top center",
                end: "bottom top",
                onEnter: () => {
                    // Fade in and slide up text
                    gsap.to(headingRef.current, {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        duration: 1.2,
                        ease: "power4.out",
                    });
                    gsap.to(subTextRef.current, {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        duration: 1.4,
                        ease: "power4.out",
                        delay: 0.4,
                    });

                    // Animate Step3 SVG (fade-in from bottom)
                    gsap.to(step3Ref.current, {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        duration: 1.4,
                        ease: "power4.out",
                    });
                },
                onEnterBack: () => {
                    // Fade in and slide up text
                    gsap.to(headingRef.current, {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        duration: 1.2,
                        ease: "power4.out",
                    });
                    gsap.to(subTextRef.current, {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        duration: 1.4,
                        ease: "power4.out",
                        delay: 0.4,
                    });

                    // Animate Step3 SVG (fade-in from bottom)
                    gsap.to(step3Ref.current, {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        duration: 1.4,
                        ease: "power4.out",
                    });
                },
                onLeave: () => {
                    // Move and scale up the SVG (fade out and move towards the bottom)
                    gsap.to([headingRef.current, subTextRef.current], {
                        opacity: 0,
                        y: 0,
                        x: -120,
                        duration: 0.6,
                        ease: "power2.inOut",
                    });

                    gsap.to(step3Ref.current, {
                        opacity: 0,
                        y: 0,  // Move towards the bottom
                        x: -120,
                        scale: 1.4,  // Scale up by 40%
                        duration: 1.2,
                        ease: "power2.inOut",
                    });
                },
                onLeaveBack: () => {
                    // Move and scale up the SVG (fade out and move towards the bottom)
                    gsap.to([headingRef.current, subTextRef.current], {
                        opacity: 0,
                        y: 0,
                        x: -120,
                        duration: 0.6,
                        ease: "power2.inOut",
                    });

                    gsap.to(step3Ref.current, {
                        opacity: 0,
                        y: 0,  // Move towards the bottom
                        x: -120,
                        scale: 1.4,  // Scale up by 40%
                        duration: 1.2,
                        ease: "power2.inOut",
                    });
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
    }, []);

    return (
        <div
            id="entrance-section"
            ref={centerRef}
            className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
        >
           <div className="w-full flex flex-col items-start justify-start gap-24 lg:gap-8">
                <div ref={textRef} className="text-content flex flex-col items-start justify-start">
                <p className="hidden md:block text-4xl md:text-5xl lg:text-6xl text-left" ref={headingRef}>
                        <span className="white-silver-animated-text">
                            We spend our days guiding<br />
                        </span>
                        <span className="white-silver-animated-text">
                            companies through these<br />
                        </span>
                        <span className="white-silver-animated-text">
                            three core stages
                        </span>
                    </p>
                    <p className="block md:hidden text-4xl md:text-5xl lg:text-6xl text-left" ref={subTextRef}>
                        <span className="white-silver-animated-text">
                            We spend our days <br />
                        </span>
                        <span className="white-silver-animated-text">
                            guiding companies<br />
                        </span>
                        <span className="white-silver-animated-text">
                            through these<br />
                        </span>
                        <span className="white-silver-animated-text">
                            three core stages
                        </span>
                    </p>
                </div>
                <div ref={boxRef} className="w-full flex flex-row items-center justify-center lg:justify-end">
                    <Step3 ref={step3Ref} className="w-[60vw] h-[50vw] lg:w-[35vw] lg:h-[25vw]" />
                </div>
            </div>
        </div>
    );
};

export default Entrance;
