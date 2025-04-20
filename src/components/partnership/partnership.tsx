"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { GoArrowUpRight } from "react-icons/go";
import PartnershipMarquee from "./partnersMarquee";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Partnership = () => {
  const centerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
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
        scrollToSection("#footer-section");
      } else if (accumulated <= -threshold) {
        scrollToSection("#stats-section");
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleIntent(e.deltaY);
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

    if (centerRef.current) observer.observe(centerRef.current);

    // Text animation with ScrollTrigger
    const textEl = textRef.current;
    if (textEl) {
      const words = textEl.querySelectorAll("span");

      gsap.set(words, {
        opacity: 0,
        y: 120,
        rotateX: 60,
        transformOrigin: "bottom center",
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: textEl,
          start: "top center",
          end: "bottom top",
          toggleActions: "restart none none reverse",
        },
      }).to(words, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        ease: "power4.out",
        duration: 1.5,
        stagger: {
          each: 0.15,
          from: "start",
        },
      });
    }

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
      id="partnership-section"
      ref={centerRef}
      className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] gap-8 relative"
    >
      <div className="absolute top-0 left-0 w-full z-10 pt-8 flex flex-col items-center justify-center">
        <PartnershipMarquee />
      </div>

      <p className="text-7xl text-center whitespace-pre-wrap" ref={textRef}>
        <span className="white-silver-animated-text">The </span>
        <span className="white-silver-animated-text">best </span>
        <span className="white-silver-animated-text">AI </span>
        <span className="white-silver-animated-text">systems</span>
        <br />
        <span className="white-silver-animated-text">are </span>
        <span className="white-silver-animated-text">built </span>
        <span className="green-text">side </span>
        <span className="green-text">by </span>
        <span className="green-text">side</span>
      </p>

      <div className="w-full flex flex-row items-center justify-center">
        <button className="flex items-center gap-1 px-8 py-4 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
          <p className="text-5xl">Let&apos;s Partner Up</p>
          <GoArrowUpRight
            size={32}
            strokeWidth={1}
            className="mt-1 transition-all duration-300"
          />
        </button>
      </div>
    </div>
  );
};

export default Partnership;
