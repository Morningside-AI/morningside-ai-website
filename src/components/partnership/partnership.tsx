"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { GoArrowUpRight } from "react-icons/go";
import PartnershipMarquee from "./partnersMarquee";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import Link from "next/link";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Partnership = () => {
  const mtd = new MagicTrackpadDetector();
  const centerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isAnimatingRef = useRef(false);

  const lastTransitionTime = useRef(0);
  const TRANSITION_COOLDOWN = 300; // Same as Entrance

  const handleContactClick = () => {
    window.location.href = "/contact"; // This forces a full page reload
  };

  const canTransition = () => {
    return Date.now() - lastTransitionTime.current > TRANSITION_COOLDOWN;
  };

  useEffect(() => {
    const threshold = 30;
    let accumulated = 0;
    let hasSnapped = false;
    let scrollLocked = false;
    let scrollCooldown = false;

    const preventDefault = (e: TouchEvent) => e.preventDefault();

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
      if (!isInView() || hasSnapped || !canTransition()) {
        return;
      }
      accumulated += delta;

      if (accumulated >= threshold) {
        lastTransitionTime.current = Date.now();
        accumulated = 0;
        scrollToSection("#footer-section");
      } else if (accumulated <= -threshold) {
        lastTransitionTime.current = Date.now();
        accumulated = 0;
        scrollToSection("#stats-section");
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

    const words = heading.querySelectorAll('.word');

    // Loop through each word and wrap each letter
    words.forEach(word => {
      const letters = word.textContent?.split('');
      if (letters) {
        word.innerHTML = '';
        letters.forEach(letter => {
          const span = document.createElement('span');
          span.classList.add('letter');
          span.textContent = letter;
          word.appendChild(span);
        });
      }
    });

    const letters = heading.querySelectorAll('.letter');
    let animationIn: GSAPTimeline | null = null;
    let animationOut: GSAPTimeline | null = null;

    // Initially hide each letter
    gsap.set(letters, { clipPath: 'inset(0% 100% 0% 0%)' });

    const animateIn = () => {
      // Kill the out animation if it's running
      if (animationOut) animationOut.kill();

      animationIn = gsap.timeline();
      animationIn.to(letters, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.1,
        ease: 'linear',
        stagger: {
          each: 0.04,
        },
      });
    };

    const animateOut = () => {
      // Kill the in animation if it's running
      if (animationIn) animationIn.kill();

      animationOut = gsap.timeline();
      animationOut.to(letters, {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 0.0005,
        ease: 'power2.in',
        onComplete: () => {
          // Just to be safe, ensure all letters are fully hidden
          gsap.set(letters, { clipPath: 'inset(0% 100% 0% 0%)' });
        },
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: centerRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
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
    <>
      <div
        id="partnership-section"
        ref={centerRef}
        className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] gap-8 relative overflow-hidden touch-none"
      >
        <div className="absolute top-0 left-0 w-full z-10 pt-8 flex flex-col items-center justify-center">
          <PartnershipMarquee />
        </div>

        <div className="relative w-full mb-40 mt-8 ">
          <p
            className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 -translate-x-1/2 w-full "
          >
            <span className="gray-text">
              <span className="">T</span>
              <span className="">h</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="gray-text">
              <span className="">b</span>
              <span className="">e</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="gray-text">
              <span className="">A</span>
              <span className="">I</span>
              <span className=""> </span>
            </span>
            <br className="block md:hidden" />
            <span className="gray-text ">
              <span className="">s</span>
              <span className="">y</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className="">e</span>
              <span className="">m</span>
              <span className="">s</span>
              <span className=""> </span>
            </span>
            <br className="hidden lg:block" />
            <span className="gray-text ">
              <span className="">a</span>
              <span className="">r</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">b</span>
              <span className="">u</span>
              <span className="">i</span>
              <span className="">l</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">b</span>
              <span className="">y</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className="">.</span>
            </span>
          </p>
          <p
            className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 z-50 -translate-x-1/2 w-full"
            ref={headingRef}
          >
            <span className="text-white word">
              <span className="letter">T</span>
              <span className="letter">h</span>
              <span className="letter">e</span>
              <span className="letter"> </span>
            </span>
            <span className="text-white word">
              <span className="letter">b</span>
              <span className="letter">e</span>
              <span className="letter">s</span>
              <span className="letter">t</span>
              <span className="letter"> </span>
            </span>
            <span className="text-white word">
              <span className="letter">A</span>
              <span className="letter">I</span>
              <span className="letter"> </span>
            </span>
            <br className="block md:hidden" />
            <span className="text-white word">
              <span className="letter">s</span>
              <span className="letter">y</span>
              <span className="letter">s</span>
              <span className="letter">t</span>
              <span className="letter">e</span>
              <span className="letter">m</span>
              <span className="letter">s</span>
              <span className="letter"> </span>
            </span>
            <br className="hidden lg:block" />
            <span className="text-white word">
              <span className="letter">a</span>
              <span className="letter">r</span>
              <span className="letter">e</span>
              <span className="letter"> </span>
            </span>
            <span className="text-white word">
              <span className="letter">b</span>
              <span className="letter">u</span>
              <span className="letter">i</span>
              <span className="letter">l</span>
              <span className="letter">t</span>
              <span className="letter"> </span>
            </span>
            <span className="green-text word">
              <span className="letter">s</span>
              <span className="letter">i</span>
              <span className="letter">d</span>
              <span className="letter">e</span>
              <span className="letter"> </span>
            </span>
            <span className="green-text word">
              <span className="letter">b</span>
              <span className="letter">y</span>
              <span className="letter"> </span>
            </span>
            <span className="green-text word">
              <span className="letter">s</span>
              <span className="letter">i</span>
              <span className="letter">d</span>
              <span className="letter">e</span>
              <span className="letter">.</span>
            </span>
          </p>
        </div>

        <div
          ref={buttonRef}
          className="w-full flex flex-row items-center justify-center"
        >
          <button onClick={handleContactClick} className="flex cursor-pointer items-center gap-1 px-4 py-2 lg:px-8 lg:py-4 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
            <p className="text-3xl lg:text-5xl">Let&apos;s Partner Up</p>
            <GoArrowUpRight
              size={32}
              strokeWidth={1}
              className="mt-1 transition-all duration-300"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Partnership;
