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
  const isAnimatingRef = useRef(false);
  const lastScrollTime = useRef(0);
  const lastScrollDelta = useRef(0);

  const lastTransitionTime = useRef(0);
  const TRANSITION_COOLDOWN = 500; // Same as Entrance

  const canTransition = () => {
    return Date.now() - lastTransitionTime.current > TRANSITION_COOLDOWN;
  };

  useEffect(() => {
    const threshold = 45;
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
      // Tighter viewport check
      return rect.top <= window.innerHeight * 0.4 &&
        rect.bottom > window.innerHeight * 0.4;
    };

    const scrollToSection = (targetId: string) => {
      if (scrollCooldown) return;
      scrollCooldown = true;
      hasSnapped = true;
      accumulated = 0;

      gsap.to(window, {
        scrollTo: {
          y: targetId,
        },
        duration: 0.08,
        ease: "power2.inOut",
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
      if (!isInView() || hasSnapped || !canTransition() || isAnimatingRef.current) {
        return;
      }
      accumulated += delta;

      if (accumulated >= threshold) {
        lastTransitionTime.current = Date.now();
        accumulated = 0;
        scrollToSection("#entrance-section");
      } else if (accumulated <= -threshold) {
        lastTransitionTime.current = Date.now();
        accumulated = 0;
        scrollToSection("#hero-section");
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!canTransition()) return;

      const isTrackpad = mtd.inertial(e);
      const sensitivity = isTrackpad ? 0.08 : 0.18; // Slightly different values
      const maxDelta = isTrackpad ? 12 : 25; // Different thresholds

      const baseDelta = e.deltaY * sensitivity;
      const normalizedDelta = Math.sign(baseDelta) * Math.min(Math.abs(baseDelta), maxDelta);

      // Additional velocity check
      const velocity = Math.abs(normalizedDelta) / (Date.now() - lastScrollTime.current || 1);
      if (velocity > 0.5) return;

      handleIntent(normalizedDelta);

      lastScrollTime.current = Date.now();
      lastScrollDelta.current = normalizedDelta;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (isInView()) {
          e.preventDefault();
          handleIntent(60);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (isInView()) {
          e.preventDefault();
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
        const deltaY = (touchStartY.current - touch.clientY) * 0.5; // Reduce touch sensitivity
        handleIntent(deltaY);
        touchStartY.current = touch.clientY;
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

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    let animationIn: GSAPTimeline | null = null;
    let animationOut: GSAPTimeline | null = null;

    const animateIn = () => {
      if (animationOut) animationOut.kill();
      isAnimatingRef.current = true;

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

      animationIn.fromTo(
        subTextRef.current,
        {
          opacity: 0,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.2,
          ease: "power3.out",
        },
        0 // 👈 starts 0.6s *before* heading animation finishes
      );

      animationIn.call(() => {
        isAnimatingRef.current = false;
      });
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

      animationOut.to(
        subTextRef.current,
        {
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.4,
          ease: "power2.in",
        },
        0 // <-- start subText fade-out slightly after heading starts
      );
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
      trigger.kill();
    };
  }, []);

  return (
    <div
      id="center-section"
      ref={centerRef}
      className="w-full h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal overflow-hidden touch-none"
    >
      <div className="relative w-full md:-translate-y-16 lg:-translate-y-0">
        <p
          ref={headingRef}
          className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 -translate-x-1/2 w-full "
        >
          <span className="white-silver-animated-text">We </span>
          <span className="white-silver-animated-text">put </span>
          <span className="white-silver-animated-text1">AI </span>
          <br className="block md:hidden" />
          <span className="white-silver-animated-text1">at </span>
          <span className="white-silver-animated-text2">the </span>
          <span className="white-silver-animated-text2">center </span>
          <span className="white-silver-animated-text">of </span>
          <br />
          <span className="green-text">everything </span>
          <span className="white-silver-animated-text">we </span>
          <span className="white-silver-animated-text1">do.</span>
        </p>

      </div>
      <p
        ref={subTextRef}
        className="text-xl lg:text-2xl text-center mt-40 sm:mt-40 md:mt-24 lg:mt-40 text-[#C0C0C0]"
      >
        One trusted partner to guide you <br /> through your entire AI journey.
      </p>
    </div>
  );
};

export default Center;