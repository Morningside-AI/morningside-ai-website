"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const Center = () => {
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const threshold = 200;
    let accumulated = 0;
    let hasSnapped = false;

    const handleWheel = (e: WheelEvent) => {
      const el = centerRef.current;
      if (!el || hasSnapped) return;

      const rect = el.getBoundingClientRect();
      const isInView =
        rect.top <= window.innerHeight * 0.5 &&
        rect.bottom > window.innerHeight * 0.25;

      if (!isInView) return;

      e.preventDefault();
      e.stopPropagation();

      accumulated += e.deltaY;

      // Scroll down to next section
      if (accumulated >= threshold && e.deltaY > 0) {
        hasSnapped = true;
        gsap.to(window, {
          scrollTo: "#stats-section",
          duration: 1,
          ease: "power2.out",
        });
        window.removeEventListener("wheel", handleWheel);
      }

      // Scroll up to previous section
      if (accumulated <= -threshold && e.deltaY < 0) {
        hasSnapped = true;
        gsap.to(window, {
          scrollTo: "#hero-section",
          duration: 1,
          ease: "power2.out",
        });
        window.removeEventListener("wheel", handleWheel);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      id="center-section"
      ref={centerRef}
      className="w-full h-screen flex flex-col justify-center items-center text-white tracking-[-0.04em] leading-[90%]"
    >
      <p className="text-7xl text-center">
        <span className="white-silver-animated-text">
          We put AI at the centre of<br />
        </span>
        <span className="green-text">everything</span>
        <span className="white-silver-animated-text">&nbsp;we do</span>
      </p>
      <p className="text-2xl text-center mt-12 text-[#C0C0C0]">
        One trusted partner to guide you <br /> through your entire AI journey.
      </p>
    </div>
  );
};

export default Center;
