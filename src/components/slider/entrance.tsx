"use client";


import Step3 from "@/assets/images/animation/entrance.svg";
import Step32 from "@/assets/images/animation/step3.svg";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

gsap.registerPlugin(ScrollToPlugin);

const Entrance = () => {
  const [rive1Ready, setRive1Ready] = useState(false);
  const [rive2Ready, setRive2Ready] = useState(false);

  const mtd = new MagicTrackpadDetector();
  const centerRef = useRef<HTMLDivElement>(null);
  const contentRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const touchStartY = useRef(0);
  let entranceStep = 0;

  const { rive: rive1, RiveComponent: LearnRive } = useRive({
    src: "/rive/animation1.riv",
    autoplay: false,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  const { rive: rive2, RiveComponent: BuildRive } = useRive({
    src: "/rive/animation2.riv",
    autoplay: false,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  // Track when both Rive instances are ready
  useEffect(() => {
    if (rive1) {
      setRive1Ready(true); // Set to true when rive1 is initialized
    }
    if (rive2) {
      setRive2Ready(true); // Set to true when rive2 is initialized
    }
  }, [rive1, rive2]);

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

    const transition = (
      fromIndex: number,
      toIndex: number,
      direction: "forward" | "backward"
    ) => {
      const fromRef = contentRefs[fromIndex]?.current;
      const toRef = contentRefs[toIndex]?.current;
      if (!fromRef || !toRef) return;

      gsap.to(fromRef, {
        opacity: 0,
        x: direction === "forward" ? -100 : 100,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          fromRef.style.display = "none";
          toRef.style.display = "flex";

          // Ensure Rive 1 is available before playing the animation
          if (rive1Ready && rive1) {
            console.log("Rive1: Playing");
            rive1.reset();
            rive1.play();
          } else {
            console.log("Rive1: Not available or not initialized yet");
          }

          // Ensure Rive 2 is available before playing the animation
          if (rive2Ready && rive2) {
            console.log("Rive2: Playing");
            rive2.reset();
            rive2.play();
          } else {
            console.log("Rive2: Not available or not initialized yet");
          }

          gsap.fromTo(
            toRef,
            { opacity: 0, x: direction === "forward" ? 150 : -150 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                enableScroll();
              },
            }
          );
        },
      });
    };

    const handleIntent = (delta: number) => {
      if (!isInView() || hasSnapped) return;
      accumulated += delta;

      if (accumulated >= threshold) {
        disableScroll();
        if (entranceStep < contentRefs.length - 1) {
          transition(entranceStep, entranceStep + 1, "forward");
          entranceStep += 1;
        } else {
          scrollToSection("#stats-section");
        }
      } else if (accumulated <= -threshold) {
        disableScroll();
        if (entranceStep > 0) {
          transition(entranceStep, entranceStep - 1, "backward");
          entranceStep -= 1;
        } else {
          scrollToSection("#center-section");
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (mtd.inertial(e)) return;
      const deltaY = e.deltaY;
      const normalizedDelta = Math.abs(deltaY) < 1 ? deltaY * 30 : deltaY;
      handleIntent(normalizedDelta);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        if (isInView()) {
          e.preventDefault();
          disableScroll();
          handleIntent(60);
        }
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
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
        handleIntent(touchStartY.current - touch.clientY);
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

    contentRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.style.display = i === 0 ? "flex" : "none";
      }
    });

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
  }, [rive1, rive2, rive1Ready, rive2Ready]);

  return (
    <div
      id="entrance-section"
      ref={centerRef}
      className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] overflow-hidden touch-none"
    >
      {/* Content 1 */}
      <div ref={contentRefs[0]} className="w-full flex-col items-start justify-start gap-24 lg:gap-8">
        <p className="text-4xl md:text-5xl lg:text-6xl text-left">
          We spend our days guiding<br />
          companies through these<br />
          three core stages
        </p>
        <div className="w-full flex justify-center lg:justify-end">
          <Step3 className="w-[60vw] h-[50vw] lg:w-[35vw] lg:h-[25vw]" />
        </div>
      </div>

      {/* Content 2 */}
      <div ref={contentRefs[1]} className="w-full flex-col items-center justify-center gap-8">
        <div className="w-full flex justify-center">
          <Step32 className="w-[50vw] h-[40vw] lg:w-[20vw] lg:h-[20vw]" />
        </div>
        <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
          Gain Clarity
        </p>
        <p className="text-base font-light text-center max-w-[700px] text-[#A0A4A1]">
          We analyze your business operations and co-design your AI strategy.
        </p>
      </div>

      {/* Content 3 */}
      <div ref={contentRefs[2]} className="w-full flex-col items-center justify-center gap-8">
        <div className="w-full flex justify-center">
          <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[300px]">
            <LearnRive />
          </div>
        </div>
        <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">Learn AI</p>
        <p className="text-base font-light text-center max-w-[700px] text-[#A0A4A1]">
          We equip your team with the tools and knowledge to lead AI adoption.
        </p>
      </div>

      {/* Content 4 */}
      <div ref={contentRefs[3]} className="w-full flex-col items-center justify-center gap-8">
        <div className="w-full flex justify-center">
          <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[400px]">
            <BuildRive />
          </div>
        </div>
        <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">Build Solutions</p>
        <p className="text-base font-light text-center max-w-[700px] text-[#A0A4A1]">
          We design and develop custom AI systems aligned with your goals.
        </p>
      </div>
    </div>
  );
};

export default Entrance;
