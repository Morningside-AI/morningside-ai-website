"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import StatsBox from "./statsBox";
import LogoMarkWhite from "@/assets/images/morningside-assets/Logomark-White.svg?url";

gsap.registerPlugin(ScrollToPlugin);

const Stats = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    useEffect(() => {
        const threshold = 20;
        let accumulated = 0;
        let hasSnapped = false;
        let scrollLocked = false;
        let scrollCooldown = false;

        const disableScroll = () => {
            if (!scrollLocked) {
                scrollLocked = true;
                document.body.style.overflow = "hidden";
                document.documentElement.style.overflow = "hidden";
            }
        };

        const enableScroll = () => {
            scrollLocked = false;
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };

        const isInView = () => {
            const el = statsRef.current;
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
                duration: 1.4,
                ease: "power4.out",
                overwrite: "auto",
                onComplete: () => {
                    enableScroll();
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 800);
                },
            });
        };

        const handleIntent = (delta: number) => {
            if (!isInView() || hasSnapped) return;

            disableScroll();
            accumulated += delta;

            if (accumulated >= threshold) {
                scrollToSection("#test-section");
            } else if (accumulated <= -threshold) {
                scrollToSection("#center-section");
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            handleIntent(e.deltaY);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "PageDown") {
                e.preventDefault();
                handleIntent(60);
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
                e.preventDefault();
                handleIntent(-60);
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches.item(0);
            if (touch) {
                touchStartY.current = touch.clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches.item(0);
            if (touch) {
                const deltaY = touchStartY.current - touch.clientY;
                handleIntent(deltaY);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    hasSnapped = false;
                    accumulated = 0;
                }
            },
            { threshold: 0.5 }
        );

        if (statsRef.current) observer.observe(statsRef.current);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            observer.disconnect();
            enableScroll();
        };
    }, []);

    return (
        <div
            ref={statsRef}
            id="stats-section"
            className="w-full will-change-transform h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] md:gap-32 gap-12 my-auto relative"
        >
            <div
                className="absolute top-0 left-0 w-full h-full z-[-1] opacity-[0.03]"
                style={{
                    backgroundImage: `url(${LogoMarkWhite})`,
                    backgroundSize: "110%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
            />
            <p className="white-silver-animated-text">
                <span className="md:text-5xl text-4xl">We don&apos;t sell AI.</span>
                <span className="md:text-5xl text-4xl">&nbsp;We sell&nbsp;</span>
                <span
                    style={{ fontFamily: "DM-Mono-Italic" }}
                    className="md:text-5xl text-4xl"
                >
                    Results.
                </span>
            </p>
            <div className="flex flex-row justify-start items-start gap-4">
                <StatsBox
                    number={17}
                    numberText="M+"
                    text="Individuals Educated on AI via Our Platforms"
                    link="https://www.youtube.com/@LiamOttley"
                    linkText="Watch our content here"
                />
                <StatsBox
                    number={435}
                    numberText="+"
                    text="AI Solutions Identified by MorningSide AI"
                    link=""
                    linkText=""
                />
                <StatsBox
                    number={55}
                    numberText="+"
                    text="Bespoke AI Solutions Developed"
                    link=""
                    linkText=""
                />
            </div>
        </div>
    );
};

export default Stats;
