"use client";

import PreloaderWrapper from "@/components/generic/preloaderWrapper";
import Navbar from "@/components/navbar/navbar";
import Hero from "@/components/hero/hero";
import Center from "@/components/center/center";
import Stats from "@/components/stats/stats";
import Partnership from "@/components/partnership/partnership";
import Footer from "@/components/footer/footer";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function HomePage() {
  return (
    <PreloaderWrapper>
      <main className="flex flex-col overflow-y-auto snap-y snap-mandatory scroll-smooth h-screen w-full relative">
        <Hero />
        <Center />
        <Partnership />
        <Footer />
      </main>
    </PreloaderWrapper>
  );
}
