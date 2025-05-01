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
  const TRANSITION_COOLDOWN = 500;

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
      return rect.top <= window.innerHeight * 0.35 &&
        rect.bottom > window.innerHeight * 0.35;
    };

    // In both Hero and Center sections
    const goToNext = () => {
      if (scrollCooldown) return;
      scrollCooldown = true;
      hasSnapped = true;
      accumulated = 0;

      // Add temporary scroll lock
      disableScroll();

      gsap.to(window, {
        scrollTo: "#center-section",
        duration: 0.1, // Slightly longer duration
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
      if (!isHeroInView() || hasSnapped || !canTransition()) return;
      disableScroll();
      accumulated += delta;

      if (accumulated >= threshold) {
        lastTransitionTime.current = Date.now();
        goToNext();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!canTransition()) return;

      // 1. Use mtd as primary trackpad detector
      const isTrackpad = mtd.inertial(e);

      // 2. Apply different handling based on input type
      const sensitivity = isTrackpad ? 0.1 : 0.2;
      const maxDelta = isTrackpad ? 10 : 20;

      // 3. Normalize delta values
      const baseDelta = e.deltaY * sensitivity;
      const normalizedDelta = Math.sign(baseDelta) * Math.min(Math.abs(baseDelta), maxDelta);

      // 4. Momentum scroll prevention
      const now = Date.now();
      const isMomentumScroll = isTrackpad &&
        (now - lastScrollTime.current < 16) && // < 60fps
        Math.abs(normalizedDelta) > 8;

      if (!isMomentumScroll) {
        handleIntent(normalizedDelta);
      }

      // 5. Update timing refs
      lastScrollTime.current = now;
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
      gsap.set(para, { opacity: 0, y: 80 });

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
            y: 80,
            duration: 1.2,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(para, {
            opacity: 0,
            y: 80,
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
      className="w-full h-[100dvh] flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-10 will-change-transform overflow-hidden touch-none"
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
