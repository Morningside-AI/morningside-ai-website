"use client";

import "@/styles/fonts.css";
import RotatingText from "./rotatingText";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    const threshold = 50;
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

    const isHeroInView = () => {
      const el = heroRef.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > window.innerHeight * 0.5;
    };

    const goToNext = () => {
      if (scrollCooldown) return;

      scrollCooldown = true;
      hasSnapped = true;
      accumulated = 0;

      gsap.to(window, {
        scrollTo: "#center-section",
        duration: 1.4,
        ease: "power4.out",
        overwrite: "auto",
        onComplete: () => {
          enableScroll();
          setTimeout(() => {
            scrollCooldown = false;
          }, 800); // cooldown to prevent double trigger
        },
      });
    };

    const handleIntent = (delta: number) => {
      if (!isHeroInView() || hasSnapped || delta <= 0) return;

      disableScroll();
      accumulated += delta;

      if (accumulated >= threshold) {
        goToNext();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleIntent(e.deltaY);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "ArrowDown" || e.key === "PageDown") && isHeroInView()) {
        e.preventDefault();
        disableScroll();
        handleIntent(60); // Simulated delta
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
    if (heroRef.current) observer.observe(heroRef.current);

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
      id="hero-section"
      ref={heroRef}
      className="w-full h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-10 will-change-transform"
    >
      <div>
        <p className="text-9xl white-silver-animated-text">We are not an AI</p>
        <div className="h-32">
          <RotatingText />
        </div>
        <p className="text-9xl white-silver-animated-text">Company</p>
      </div>
      <p className="text-4xl mt-12 tracking-normal white-silver-animated-text">
        We are all of the above.
      </p>
    </div>
  );
};

export default Hero;
