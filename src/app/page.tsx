"use client";
import PreloaderWrapper from "@/components/generic/preloaderWrapper";
import Navbar from "@/components/navbar/navbar";
import Hero from "@/components/hero/hero";
import Center from "@/components/center/center";
import Stats from "@/components/stats/stats";
import Partnership from "@/components/partnership/partnership";
import Footer from "@/components/footer/footer";
import Entrance from "@/components/slider/entrance";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


export default function HomePage() {
  return (
    <PreloaderWrapper>
      <main className="flex min-h-screen w-full flex-col items-center lg:px-12 md:px-8 px-4 relative main-container">
        <Navbar />
        <Hero />
        <Center />
        <Entrance />
        <Stats />
        <Partnership />
        <Footer />
      </main>
    </PreloaderWrapper>

  );
}
