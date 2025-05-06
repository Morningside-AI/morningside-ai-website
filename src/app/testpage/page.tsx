"use client";

import { useRef } from "react";
import NewPreloaderWrapper from "@/components/generic/NewPreloaderWrapper";
import SnappySection1 from "@/components/SnappySection1";
import SnappySection2 from "@/components/SnappySection2";
import SnappySection3 from "@/components/SnappySection3";
import SnappySection4 from "@/components/SnappySection4";
import SnappySection5 from "@/components/SnappySection5";
import SnappySection6 from "@/components/SnappySection6";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <NewPreloaderWrapper>
      <div
        id="page-wrapper"
        ref={scrollContainerRef}
        className="snap-y snap-mandatory overflow-y-scroll h-screen w-full overflow-x-hidden no-scrollbar"
      >
        <div className="snap-always snap-center">
          <SnappySection1 />
        </div>
        <div className="snap-always snap-center" id="snappyCenter">
          <SnappySection2 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection3 scrollContainerRef={scrollContainerRef} />
        </div>
        <div className="snap-always snap-center" id="snappyStats">
          <SnappySection4 scrollContainerRef={scrollContainerRef} />
        </div>
        <div className="snap-always snap-center">
          <SnappySection5 />
        </div>
        <div className="snap-always snap-center">
          <SnappySection6 />
        </div>
      </div>
    </NewPreloaderWrapper>
  );
}
