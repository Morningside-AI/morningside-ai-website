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
    const threshold = 30; // same as Hero
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
      trigger: statsRef.current,
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
      ref={statsRef}
      id="stats-section"
      className="w-full will-change-transform h-screen flex flex-col justify-center text-white leading-normal tracking-normal md:gap-32 gap-12 my-auto relative overflow-hidden touch-none"
    >

      <LogoMarkWhite ref={svgContainerRef} className="absolute -top-[50vh] -left-[50vw] lg:top-0 lg:left-0 h-[200vh] w-[200vw] lg:w-full lg:h-full z-[-1]" />
      <div className="relative w-full -translate-y-20 lg:-translate-y-14">
        <p
          className="text-4xl md:text-5xl text-center whitespace-pre-wrap absolute top-0 left-0 z-0"
        >
          <span className="">
            <span className="gray-text">W</span>
            <span className="gray-text">e</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">d</span>
            <span className="gray-text">o</span>
            <span className="gray-text">n</span>
            <span className="gray-text">&apos;</span>
            <span className="gray-text">t</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">s</span>
            <span className="gray-text">e</span>
            <span className="gray-text">l</span>
            <span className="gray-text">l</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">A</span>
            <span className="gray-text">I</span>
            <span className="gray-text">.</span>
          </span>
          <br className="block lg:hidden" />
          <span className="">
            <span className="gray-text">W</span>
            <span className="gray-text">e</span>
            <span className="gray-text">&nbsp;</span>
            <span className="gray-text">s</span>
            <span className="gray-text">e</span>
            <span className="gray-text">l</span>
            <span className="gray-text">l</span>
            <span className="gray-text">&nbsp;</span>
          </span>
          <span className="">
            <span className="gray-text">R</span>
            <span className="gray-text">e</span>
            <span className="gray-text">s</span>
            <span className="gray-text">u</span>
            <span className="letter">l</span>
            <span className="gray-text">t</span>
            <span className="gray-text">s</span>
            <span className="gray-text">.</span>
          </span>
        </p>
        <p
          className="text-4xl md:text-5xl text-center whitespace-pre-wrap absolute top-0 left-0 z-10"
          ref={headingRef}
        >
          <span className="text-white word">
            <span className="letter">W</span>
            <span className="letter">e</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">d</span>
            <span className="letter">o</span>
            <span className="letter">n</span>
            <span className="letter">&apos;</span>
            <span className="letter">t</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">s</span>
            <span className="letter">e</span>
            <span className="letter">l</span>
            <span className="letter">l</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">A</span>
            <span className="letter">I</span>
            <span className="letter">.</span>
          </span>
          <br className="block lg:hidden" />
          <span className="text-white word">
            <span className="letter">W</span>
            <span className="letter">e</span>
            <span className="letter">&nbsp;</span>
            <span className="letter">s</span>
            <span className="letter">e</span>
            <span className="letter">l</span>
            <span className="letter">l</span>
            <span className="letter">&nbsp;</span>
          </span>
          <span className="green-text word">
            <span className="letter">R</span>
            <span className="letter">e</span>
            <span className="letter">s</span>
            <span className="letter">u</span>
            <span className="letter">l</span>
            <span className="letter">t</span>
            <span className="letter">s</span>
            <span className="letter">.</span>
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
