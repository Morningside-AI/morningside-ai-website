"use client";

import { useState, useEffect } from "react";
import Preloader from "@/components/preloader/preloader";

const PreloaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  useEffect(() => {
    if (!isPreloaderDone) {
      const preventDefault = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };

      const handleKeydown = (e: KeyboardEvent) => {
        const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // Keys for space, page up/down, home, end, arrows
        if (scrollKeys.includes(e.keyCode)) {
          preventDefault(e);
        }
      };

      const options = { passive: false } as AddEventListenerOptions;

      // Block scroll events
      window.addEventListener("wheel", preventDefault, options);
      window.addEventListener("touchmove", preventDefault, options);
      window.addEventListener("keydown", handleKeydown, options);

      // Lock body scroll and reset position
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);

      return () => {
        // Cleanup event listeners
        window.removeEventListener("wheel", preventDefault);
        window.removeEventListener("touchmove", preventDefault);
        window.removeEventListener("keydown", handleKeydown);
        
        // Restore body overflow
        document.body.style.overflow = "";
      };
    }
  }, [isPreloaderDone]);

  return (
    <>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />
      <div
        className={`transition-opacity duration-700 ${
          isPreloaderDone
            ? "opacity-100"
            : "opacity-0 pointer-events-none touch-none"
        }`}
        style={{
          // Prevent layout shifts and internal scrolling
          height: isPreloaderDone ? "auto" : "100vh",
          overflow: isPreloaderDone ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default PreloaderWrapper;
