"use client";

import { useState } from "react";
import Preloader from "@/components/preloader/preloader";

const PreloaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />
      <div
        className={`transition-opacity duration-700 ${
          isPreloaderDone ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default PreloaderWrapper;
