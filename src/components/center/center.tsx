"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Center = () => {
  const mtd = new MagicTrackpadDetector();
  const centerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
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
        duration: 0.12,
        ease: "linear",
        overwrite: "auto",
        onComplete: () => {
          enableScroll();
          setTimeout(() => {
            scrollCooldown = false;
          }, 6);
        },
      });
    };

    const handleIntent = (delta: number) => {
      if (!isInView() || hasSnapped) return;
      accumulated += delta;

      if (accumulated >= threshold) {
        disableScroll();
        scrollToSection("#entrance-section");
      } else if (accumulated <= -threshold) {
        disableScroll();
        scrollToSection("#hero-section");
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

    const headingEl = headingRef.current;

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
      id="center-section"
      ref={centerRef}
      className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
    >
      <div>
        <p
          className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap"
          ref={headingRef}
        >
          <span className="white-silver-animated-text">We </span>
          <span className="white-silver-animated-text1">put </span>
          <span className="white-silver-animated-text2">AI </span>
          <br className="block lg:hidden" />
          <span className="white-silver-animated-text2">at </span>
          <span className="white-silver-animated-text1">the </span>
          <span className="white-silver-animated-text">center </span>
          <span className="white-silver-animated-text1">of </span>
          <br />
          <span className="green-text">everything </span>
          <span className="white-silver-animated-text2">we </span>
          <span className="white-silver-animated-text">do</span>
        </p>
      </div>
      <p
        ref={subTextRef}
        className="text-xl lg:text-2xl text-center mt-12 text-[#C0C0C0]"
      >
        One trusted partner to guide you <br /> through your entire AI journey.
      </p>
    </div>
  );
};

export default Center;
