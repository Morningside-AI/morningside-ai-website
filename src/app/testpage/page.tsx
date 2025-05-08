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
        className="snap-y snap-mandatory overflow-y-scroll h-screen w-full overflow-x-hidden no-scrollbar"
      >
        <div className="snap-always snap-center">
          <SnappySection1 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection2 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection31 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection32 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection33 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection34 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection4 scrollContainerRef={scrollContainerRef} />
        </div>
        <div className="snap-always snap-center">
          <SnappySection5 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection6 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection7 />
        </div>
      </div>
    </NewPreloaderWrapper>
  );
}
