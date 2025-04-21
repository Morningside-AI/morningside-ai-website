"use client";

import Navbar from "@/components/navbar/navbar";
import Hero from "@/components/hero/hero";
import Center from "@/components/center/center";
import Stats from "@/components/stats/stats";
import Partnership from "@/components/partnership/partnership";
import Footer from "@/components/footer/footer";
import Slide1 from "@/components/slider/slide1";
import Slide2 from "@/components/slider/slide2";
import Slide3 from "@/components/slider/slide3";
import Entrance from "@/components/slider/entrance";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center lg:px-12 md:px-8 px-4 relative main-container">
      <Navbar />
      <Hero />
      <Center />
      <Entrance />
      <Stats />
      <Partnership />
      <Footer />
    </main>
  );
}
