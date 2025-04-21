"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";  // Use SwiperInstance for correct typing
import { Mousewheel, Keyboard, Pagination, EffectCreative, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Slide1 from "./slide1";
import Slide2 from "./slide2";
import Slide3 from "./slide3";
import Entrance from "./entrance";

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

const slideLabels = ["Intro", "Explore", "Learn", "Build"];

const Slider = ({ activeIndex, setActiveIndex }: { activeIndex: number, setActiveIndex: React.Dispatch<React.SetStateAction<number>> }) => {
  const swiperRef = useRef<SwiperInstance | null>(null); // Ref with correct type
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Use Intersection Observer to ensure focusing when swiper is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && swiperRef.current) {
          // Focus the swiper container when it comes into the viewport
          containerRef.current?.focus();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect(); // Clean up observer on unmount
  }, []);

  const handleSlideChange = (swiper: SwiperInstance) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div
      ref={containerRef}
      id="slider-container"
      className="w-screen h-screen relative"
      tabIndex={0} // Make the container focusable
    >
      {/* Custom vertical labels */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
        {slideLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideTo(i); // Use swiperRef's slideTo method
              }
            }} // Navigate to the slide on click
            className={`text-sm font-medium transition-colors ${activeIndex === i ? "text-white font-bold" : "text-gray-400 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <Swiper
        ref={swiperRef} // Use ref directly with Swiper instance
        direction="horizontal"
        slidesPerView={1}
        spaceBetween={0}
        speed={1200}
        mousewheel
        pagination={{ clickable: true }}
        effect="creative"
        creativeEffect={{
          prev: { opacity: 0, translate: ["-20%", 0, -1], scale: 0.95 },
          next: { opacity: 1, translate: ["100%", 0, 0] },
        }}
        modules={[Mousewheel, Keyboard, Pagination, EffectCreative, EffectFade]}
        onSlideChange={handleSlideChange}
        className="mySwiper"
      >
        <SwiperSlide><Entrance /></SwiperSlide>
        <SwiperSlide><Slide1 /></SwiperSlide>
        <SwiperSlide><Slide2 isActive={activeIndex === 2} /></SwiperSlide>
        <SwiperSlide><Slide3 isActive={activeIndex === 3} /></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;
