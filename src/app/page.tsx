"use client";

import { useRef } from "react";
import NewPreloaderWrapper from "@/components/generic/NewPreloaderWrapper";
import SnappySection1 from "@/components/SnappySection1";
import SnappySection2 from "@/components/SnappySection2";
import SnappySection31 from "@/components/SnappySection31";
import SnappySection32 from "@/components/SnappySection32";
import SnappySection33 from "@/components/SnappySection33";
import SnappySection34 from "@/components/SnappySection34";
import SnappySection4 from "@/components/SnappySection4";
import SnappySection5 from "@/components/SnappySection5";
import SnappySection6 from "@/components/SnappySection6";
import SnappySection7 from "@/components/SnappySection7";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <NewPreloaderWrapper>
      <div
        id="page-wrapper"
        ref={scrollContainerRef}
        tabIndex={0}
        role="region"
        aria-label="Main content sections"
        className="snap-y snap-mandatory overflow-y-scroll h-[100dvh] min-h-[100dvh] w-full overflow-x-hidden no-scrollbar"
      >
        <div className="snap-always snap-center min-h-screen">
          <SnappySection1 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection2 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection31 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection32 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection33 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection34 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection4 scrollContainerRef={scrollContainerRef} />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection5 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection6 />
        </div>
        <div className="snap-always snap-center min-h-screen">
          <SnappySection7 />
        </div>
      </div>
    </NewPreloaderWrapper>
  );
}
