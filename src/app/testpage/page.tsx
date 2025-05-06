"use client"

import { useRef } from "react";
import PreloaderWrapper from "@/components/generic/preloaderWrapper";
import SnappySection1 from "@/components/SnappySection1";
import SnappySection2 from "@/components/SnappySection2";
import SnappySection4 from "@/components/SnappySection4";
import SnappySection5 from "@/components/SnappySection5";
import SnappySection6 from "@/components/SnappySection6";

export default function Home() {

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollContainerRef} className="snap-y snap-mandatory overflow-y-scroll h-screen w-full overflow-x-hidden ">
      <div className="snap-always snap-center">
        <SnappySection1 />
      </div>
      <div className="snap-always snap-center" >
        <SnappySection2 />
      </div>
      <div className="snap-always snap-center" >
        <SnappySection4 scrollContainerRef={scrollContainerRef} />
      </div>
      <div className="snap-always snap-center" >
        <SnappySection5 />
      </div>
      <div className="snap-always snap-center" >
        <SnappySection6 />
      </div>
    </div>
  );
}