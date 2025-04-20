"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Center = () => {
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
        scrollToSection("#stats-section");
      } else if (accumulated <= -threshold) {
        disableScroll();
        scrollToSection("#hero-section");
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
        e.preventDefault();
        touchStartY.current = touch.clientY;
        disableScroll();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches.item(0);
      if (touch) {
        e.preventDefault();
        const deltaY = touchStartY.current - touch.clientY;
        handleIntent(deltaY);
      }
    };

    const handleTouchEnd = () => enableScroll();

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
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

    // Animate main heading
    if (headingRef.current && subTextRef.current) {
      gsap.set(headingRef.current, { opacity: 0, y: 80 });
      gsap.set(subTextRef.current, { opacity: 0, y: 60 });

      ScrollTrigger.create({
        trigger: centerRef.current,
        start: "top center",
        end: "bottom top",
        onEnter: () => {
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          });
          gsap.to(subTextRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "power4.out",
            delay: 0.4,
          });
        },
        onEnterBack: () => {
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          });
          gsap.to(subTextRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "power4.out",
            delay: 0.4,
          });
        },
        onLeave: () => {
          gsap.to([headingRef.current, subTextRef.current], {
            opacity: 0,
            y: 80,
            duration: 0.6,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to([headingRef.current, subTextRef.current], {
            opacity: 0,
            y: 80,
            duration: 0.6,
            ease: "power2.inOut",
          });
        },
      });
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
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
      <div ref={headingRef}>
        <p className="hidden md:block text-5xl md:text-6xl lg:text-7xl text-center">
          <span className="white-silver-animated-text">
            We put AI at the centre of<br />
          </span>
          <span className="green-text">everything</span>
          <span className="white-silver-animated-text">&nbsp;we do</span>
        </p>
        <p className="block md:hidden text-5xl md:text-6xl lg:text-7xl text-center -mt-4">
          <span className="white-silver-animated-text">
            We put AI<br />
          </span>
          <span className="white-silver-animated-text">
            at the center of<br />
          </span>
          <span className="green-text">everything</span>
          <span className="white-silver-animated-text">&nbsp;we do</span>
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
