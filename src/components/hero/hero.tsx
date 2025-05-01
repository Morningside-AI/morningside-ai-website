"use client";

import "@/styles/fonts.css";
import RotatingText from "./rotatingText";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector"


gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Hero = () => {
  const mtd = new MagicTrackpadDetector();
  const heroRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const touchStartY = useRef(0);
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

      // Add temporary scroll lock
      disableScroll();

      gsap.to(window, {
        scrollTo: "#center-section",
        duration: 0.08, // Slightly longer duration
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          enableScroll();
          setTimeout(() => {
            scrollCooldown = false;
          }, 6); // Longer cooldown after animation
        },
      });
    };

    const handleIntent = (delta: number) => {
      if (!isHeroInView() || hasSnapped || !canTransition()) {
        return;
      }
      accumulated += delta;

      if (accumulated >= threshold) {
        lastTransitionTime.current = Date.now();
        accumulated = 0;
        goToNext();
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
      if ((e.key === "ArrowDown" || e.key === "PageDown") && isHeroInView()) {
        e.preventDefault();
        disableScroll();
        handleIntent(60);
      }
    };

    const handleSpaceButton = (e: KeyboardEvent) => {
      if (e.key === " ") {
        disableScroll();
        handleIntent(60);
      }
    }

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
        const deltaY = (touchStartY.current - touch.clientY) * 0.5;
        handleIntent(deltaY);
        touchStartY.current = touch.clientY;
      }
    };


    const handleTouchEnd = () => {
      enableScroll();
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
    if (heroRef.current) observer.observe(heroRef.current);

    // Animate paragraph
    if (paragraphRef.current) {
      const para = paragraphRef.current;
      gsap.set(para, { opacity: 0, y: 200 });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top center",
        end: "bottom top",
        onEnter: () => {
          gsap.to(para, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          });
        },
        onEnterBack: () => {
          gsap.to(para, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          });
        },
        onLeave: () => {
          gsap.to(para, {
            opacity: 0,
            y: 200,
            duration: 1.2,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(para, {
            opacity: 0,
            y: 200,
            duration: 1.2,
            ease: "power2.inOut",
          });
        },
      });

      // Run animation manually if already in view on load
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        gsap.to(para, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
        });
      }
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
      id="hero-section"
      ref={heroRef}
      className="w-full h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-10 will-change-transform overflow-hidden touch-none"
    >
      <div>
        <p className="text-5xl md:text-7xl lg:text-9xl white-silver-animated-text">
          We are not an AI
        </p>
        <div className="h-16 md:h-20 lg:h-32 flex flex-row items-center">
          <RotatingText />
        </div>
        <p className="text-5xl md:text-7xl lg:text-9xl white-silver-animated-text1">
          Company
        </p>
      </div>
      <p
        ref={paragraphRef}
        className="text-2xl md:text-3xl lg:text-4xl mt-12 tracking-normal white-silver-animated-text2"
      >
        We are all of the above.
      </p>
    </div>
  );
};

export default Hero;
