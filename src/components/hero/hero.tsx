"use client";

import "@/styles/fonts.css";
import RotatingText from "./rotatingText";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    const threshold = 12;
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

        // Prevent iOS overscroll bounce & touchmove
        document.body.style.touchAction = "none";              // disables gesture scrolling
        document.documentElement.style.touchAction = "none";

        // Prevent default scrolling behavior globally
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
    
      gsap.to(window, {
        scrollTo: "#center-section",
        duration: 0.9, // faster scroll
        ease: "power3.inOut",
        overwrite: "auto",
        onComplete: () => {
          enableScroll();
          setTimeout(() => {
            scrollCooldown = false;
          }, 600); // shorter cooldown since animation is faster
        },
      });
    };
    

    const handleIntent = (delta: number) => {
      if (!isHeroInView() || hasSnapped || delta <= 0) return;
    
      accumulated += delta;
    
      if (accumulated >= threshold) {
        disableScroll();
        goToNext();
      }
    };
    

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleIntent(e.deltaY);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "ArrowDown" || e.key === "PageDown") && isHeroInView()) {
        e.preventDefault();
        disableScroll();
        handleIntent(60); // Simulated delta
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches.item(0);
      if (touch) {
        e.preventDefault(); // Prevent native scroll
        touchStartY.current = touch.clientY;
        disableScroll(); // Lock scroll immediately
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches.item(0);
      if (touch) {
        e.preventDefault();
        const deltaY = touchStartY.current - touch.clientY;
    
        // Directly apply without frame delay
        handleIntent(deltaY);
      }
    };    

    const handleTouchEnd = () => {
      enableScroll(); // Optional: re-enable scroll after touch ends
    };


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
    if (heroRef.current) observer.observe(heroRef.current);

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
      id="hero-section"
      ref={heroRef}
      className="w-full h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-10 will-change-transform overflow-hidden touch-none"
    >
      <div>
        <p className="text-5xl md:text-7xl lg:text-9xl white-silver-animated-text">We are not an AI</p>
        <div className="h-16 md:h-20 lg:h-32 flex flex-row items-center">
          <RotatingText />
        </div>
        <p className="text-5xl md:text-7xl lg:text-9xl white-silver-animated-text">Company</p>
      </div>
      <p className="text-2xl md:text-3xl lg:text-4xl mt-12 tracking-normal white-silver-animated-text">
        We are all of the above.
      </p>
    </div>
  );
};

export default Hero;
