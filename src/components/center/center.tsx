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

  const lastTransitionTime = useRef(0);
  const TRANSITION_COOLDOWN = 400; // Same as Entrance

  const canTransition = () => {
    return Date.now() - lastTransitionTime.current > TRANSITION_COOLDOWN;
  };

  useEffect(() => {
    const threshold = 30;
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
      if (!isInView() || hasSnapped || !canTransition()) {
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
    <div
      id="center-section"
      ref={centerRef}
      className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal overflow-hidden touch-none"
    >
      <div className="relative w-full md:-translate-y-16 lg:-translate-y-0">
        <p
          className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 -translate-x-1/2 w-full "
        >
          <span className="gray-text">We </span>
          <span className="gray-text">put </span>
          <span className="gray-text">AI </span>
          <br className="block md:hidden" />
          <span className="gray-text">at </span>
          <span className="gray-text">the </span>
          <span className="gray-text">center </span>
          <span className="gray-text">of </span>
          <br />
          <span className="gray-text">everything </span>
          <span className="gray-text">we </span>
          <span className="gray-text">do.</span>
        </p>
        <p
          className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 z-50 -translate-x-1/2 w-full"
          ref={headingRef}
        >
          <span className="text-white word">
            <span className="letter">W</span>
            <span className="letter">e</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">p</span>
            <span className="letter">u</span>
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
            <span className="letter">a</span>
            <span className="letter">t</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">t</span>
            <span className="letter">h</span>
            <span className="letter">e</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">c</span>
            <span className="letter">e</span>
            <span className="letter">n</span>
            <span className="letter">t</span>
            <span className="letter">e</span>
            <span className="letter">r</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">o</span>
            <span className="letter">f</span>
            <span className="letter"> </span>
          </span>
          <br />
          <span className="green-text word">
            <span className="letter">e</span>
            <span className="letter">v</span>
            <span className="letter">e</span>
            <span className="letter">r</span>
            <span className="letter">y</span>
            <span className="letter">t</span>
            <span className="letter">h</span>
            <span className="letter">i</span>
            <span className="letter">n</span>
            <span className="letter">g</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">w</span>
            <span className="letter">e</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">d</span>
            <span className="letter">o</span>
            <span className="letter">.</span>
          </span>
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