"use client";

import { useState, useEffect, useRef } from "react";
import Preloader from "@/components/preloader/preloader";

const PreloaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const cleanupDone = useRef(false);

  useEffect(() => {
    if (!isPreloaderDone) {
      cleanupDone.current = false;
      
      // More aggressive scroll blocking
      const blockScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      };

      // Add event listeners with capture phase
      const options = { capture: true, passive: false };
      window.addEventListener('wheel', blockScroll, options);
      window.addEventListener('touchmove', blockScroll, options);
      window.addEventListener('scroll', blockScroll, options);

      // Lock scrolling at document level
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';

      return () => {
        if (cleanupDone.current) return;
        cleanupDone.current = true;

        // Remove all event listeners
        window.removeEventListener('wheel', blockScroll, options);
        window.removeEventListener('touchmove', blockScroll, options);
        window.removeEventListener('scroll', blockScroll, options);

        // Restore scrolling
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.top = '';
        document.body.style.left = '';

        // Force scroll to top and enable after a frame
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      };
    }
  }, [isPreloaderDone]);

  return (
    <>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />
      <div
        className={`transition-opacity duration-700 ${isPreloaderDone
            ? "opacity-100"
            : "opacity-0 pointer-events-none touch-none"
          }`}
        style={{
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