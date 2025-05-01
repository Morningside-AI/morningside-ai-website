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
  const lastScrollTime = useRef(0);
  const lastScrollDelta = useRef(0);

  const lastTransitionTime = useRef(0);
  const TRANSITION_COOLDOWN = 500; // Same as Entrance

  const canTransition = () => {
    return Date.now() - lastTransitionTime.current > TRANSITION_COOLDOWN;
  };

  useEffect(() => {
    const svg = svgContainerRef.current;
    if (svg) {
      const part1 = svg.querySelector(".logoMarkPart1");
      const part2 = svg.querySelector(".logoMarkPart2");
      const part3 = svg.querySelector(".logoMarkPart3");

      // Always start hidden
      gsap.set([part1, part2, part3], { opacity: 0.001 });

      const animateSVGIn = () => {
        gsap.timeline()
          .to(part3, { opacity: 0.03, duration: 0.2, ease: "power2.inOut" })
          .to(part2, { opacity: 0.03, duration: 0.3, ease: "power2.inOut" }, "+=0.2")
          .to(part1, { opacity: 0.03, duration: 0.4, ease: "power2.inOut" }, "+=0.35");
      };

      const animateSVGOut = () => {
        gsap.timeline()
          .to([part1, part2, part3], { opacity: 0.001, duration: 0.00001, ease: "power2.inOut" });
      };

      // Set up ScrollTrigger
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: animateSVGIn,
        onEnterBack: animateSVGIn,
        onLeave: animateSVGOut,
        onLeaveBack: animateSVGOut,
      });
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  useEffect(() => {
    const threshold = 45; // same as Hero
    let accumulated = 0;
    let hasSnapped = false;
    let scrollLocked = false;
    let scrollCooldown = false;

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
      if (!isInView() || hasSnapped || !canTransition() || isAnimatingRef.current) return; // Add cooldown check
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

    };



    const trigger = ScrollTrigger.create({
      trigger: statsRef.current,
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
      ref={statsRef}
      id="stats-section"
      className="w-full will-change-transform h-[100dvh] flex flex-col justify-center text-white leading-normal tracking-normal md:gap-32 gap-12 my-auto relative overflow-hidden touch-none"
    >

      <LogoMarkWhite ref={svgContainerRef} className="absolute -top-[50vh] -left-[50vw] lg:top-0 lg:left-0 h-[200vh] w-[200vw] lg:w-full lg:h-full z-[-1]" />
      <div className="relative w-full -translate-y-20 lg:-translate-y-14">
        <p
          ref={headingRef}
          className="text-4xl md:text-5xl text-center whitespace-pre-wrap absolute top-0 left-0 z-0"
        >
          <span className="lg:mr-1 white-silver-animated-text">
            <span className="">W</span>
            <span className="">e</span>
            <span className="">&nbsp;</span>
            <span className="">d</span>
            <span className="">o</span>
            <span className="">n</span>
            <span className="">&apos;</span>
            <span className="">t</span>
            <span className="">&nbsp;</span>
            <span className="">s</span>
            <span className="">e</span>
            <span className="">l</span>
            <span className="">l</span>
            <span className="">&nbsp;</span>
            <span className="">A</span>
            <span className="">I</span>
            <span className="">.</span>
          </span>
          <br className="block lg:hidden" />
          <span className="white-silver-animated-text1">
            <span className="">W</span>
            <span className="">e</span>
            <span className="">&nbsp;</span>
            <span className="">s</span>
            <span className="">e</span>
            <span className="">l</span>
            <span className="">l</span>
            <span className="">&nbsp;</span>
          </span>
          <span className="white-silver-animated-text2 italic">
            <span className="">R</span>
            <span className="">e</span>
            <span className="">s</span>
            <span className="">u</span>
            <span className="">l</span>
            <span className="">t</span>
            <span className="">s</span>
            <span className="">.</span>
          </span>
        </p>
      </div>

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
