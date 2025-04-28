"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import StatsBox from "./statsBox";
import LogoMarkWhite from "@/assets/images/morningside-assets/Logomark-White.svg";
import "@/styles/fonts.css";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Stats = () => {
  const mtd = new MagicTrackpadDetector();
  const statsRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<SVGSVGElement>(null);
  const touchStartY = useRef(0);
  const isAnimatingRef = useRef(false);
  const headingRef = useRef<HTMLDivElement>(null);

  const lastTransitionTime = useRef(0);
  const TRANSITION_COOLDOWN = 300; // Same as Entrance

  const canTransition = () => {
    return Date.now() - lastTransitionTime.current > TRANSITION_COOLDOWN;
  };

  useEffect(() => {
    const threshold = 30; // same as Hero
    let accumulated = 0;
    let hasSnapped = false;
    let scrollLocked = false;
    let scrollCooldown = false;

    const svg = svgContainerRef.current;
    if (svg) {
      const part1 = svg.querySelector(".logoMarkPart1");
      const part2 = svg.querySelector(".logoMarkPart2");
      const part3 = svg.querySelector(".logoMarkPart3");

      gsap.set([part1, part2, part3], { opacity: 0.001 }); // Start hidden

      gsap.timeline({
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      })
        .to(part3, { opacity: 0.03, duration: 0.2, ease: "power2.inOut" })
        .to(part2, { opacity: 0.03, duration: 0.3, ease: "power2.inOut" }, "+=0.2")
        .to(part1, { opacity: 0.03, duration: 0.4, ease: "power2.inOut" }, "+=0.35");
    }


    const preventDefault = (e: TouchEvent): void => {
      e.preventDefault();
    };

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
      const el = statsRef.current;
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
      if (!isInView() || hasSnapped || !canTransition()) return; // Add cooldown check
      accumulated += delta;
    
      if (accumulated >= threshold) {
        lastTransitionTime.current = Date.now(); // Record transition time
        disableScroll();
        scrollToSection("#partnership-section");
      } else if (accumulated <= -threshold) {
        lastTransitionTime.current = Date.now(); // Record transition time
        disableScroll();
        scrollToSection("#entrance-section");
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (mtd.inertial(e)) return;

      // Add delta normalization
      const baseDelta = e.deltaY * 0.3;
      const deltaY = Math.sign(baseDelta) * Math.min(Math.abs(baseDelta), 20);
      handleIntent(deltaY);
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
        const deltaY = (touchStartY.current - touch.clientY) * 0.5; // Reduce touch sensitivity
        handleIntent(deltaY);
        touchStartY.current = touch.clientY;
      }
    };


    const handleTouchEnd = () => {
      enableScroll();
    };

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

      const animateIn = () => {
        isAnimatingRef.current = true;
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
          }
        });
  
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
          "<"
        );
  
        return tl;
      };

      const animateOut = () => {
        isAnimatingRef.current = true;
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
          }
        });
  
        tl.to(words, {
          opacity: 0,
          y: 60,
          duration: 0.6,
          ease: "power2.inOut"
        });
  
        return tl;
      };

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top center",
        end: "bottom top",
        toggleActions: "play none none reverse",
        onEnter: animateIn,
        onEnterBack: animateIn,
        onLeave: animateOut,
        onLeaveBack: animateOut
      });

      
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

    if (statsRef.current) observer.observe(statsRef.current);

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
      ref={statsRef}
      id="stats-section"
      className="w-full will-change-transform h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] md:gap-32 gap-12 my-auto relative overflow-hidden touch-none"
    >

      <LogoMarkWhite ref={svgContainerRef} className="absolute -top-[50vh] -left-[50vw] lg:top-0 lg:left-0 h-[200vh] w-[200vw] lg:w-full lg:h-full z-[-1]" />
      <p className="white-silver-animated-text" ref={headingRef}>
        <span className="md:text-5xl text-4xl white-silver-animated-text1">We don&apos;t sell AI.&nbsp;</span>
        <br className="block lg:hidden" />
        <span className="md:text-5xl text-4xl white-silver-animated-text">We sell&nbsp;</span>
        <span
          style={{
            fontFamily: "DM-Mono-Italic, monospace",
            fontStyle: "italic",
          }}
          className="md:text-5xl text-4xl white-silver-animated-text2 tracking-[-0.04em]"
        >
          Results.
        </span>
      </p>
      <div className="flex flex-col lg:flex-row justify-start items-start gap-4">
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
          text="AI Solutions Identified by Morningside AI"
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
