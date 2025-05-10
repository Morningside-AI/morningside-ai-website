"use client";

import { useState, useEffect, useRef } from "react";
import Preloader from "@/components/preloader/preloader";

const PreloaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const cleanupDone = useRef(false);

  useEffect(() => {
    if (!isPreloaderDone) {
      return () => {
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
        className={`transition-opacity duration-700 ease-in-out w-screen ${
          isPreloaderDone ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default PreloaderWrapper;
