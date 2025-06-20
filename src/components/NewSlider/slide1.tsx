"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/fonts.css";
import Step3 from "@/assets/images/animation/entrance.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide1 = () => {
  const slide1Ref = useRef(null);
  const titleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector("#page-wrapper");
    if (!scrollContainer || !titleRef.current || !slide1Ref.current) return;

    const title = titleRef.current;

    gsap.set([title], { opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: slide1Ref.current,
      start: "top center",
      end: "bottom center",
      scroller: scrollContainer,
      onEnter: () => animateIn(title),
      onLeave: () => animateOut(title),
      onEnterBack: () => animateIn(title),
      onLeaveBack: () => animateOut(title),
    });

    const handleScroll = () => {
      if (!trigger.isActive) {
        gsap.set([title], { opacity: 0 });
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      trigger.kill();
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const animateIn = (title: HTMLElement) => {
    gsap.fromTo(
      [title],
      { opacity: 0 },
      { opacity: 1, duration: 0.6, delay: 0.3, ease: "sine.inOut", }
    );
  };

  const animateOut = (title: HTMLElement) => {
    gsap.to([title], {
      opacity: 0,
      duration: 0.4,
      delay: 0.03,
      ease: "sine.inOut",
    });
  };



  return (
    <div
      id="center-section"
      ref={slide1Ref}
      className="box-border gap-8 w-full h-[100dvh] min-h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
    >
      <div className="w-full flex-col items-center justify-center gap-12 px-4 md:px-8 lg:px-12 mx-auto">
        <p
          className="text-2xl md:text-5xl w-full text-center leading-tight whitespace-pre-wrap"
          ref={titleRef}
        >
          <span className="white-silver-animated-text">We </span>
          <span className="white-silver-animated-text1">spend </span>
          <span className="white-silver-animated-text2">our </span>
          <span className="white-silver-animated-text2">days </span>
          <span className="white-silver-animated-text1">guiding </span>
          <span className="white-silver-animated-text1">companies </span>
          <br className="hidden lg:block"/>
          <span className="white-silver-animated-text1">through </span>
          <span className="white-silver-animated-text2">our </span>
          <span className="white-silver-animated-text">3-step </span>
          <span className="green-text">AI </span>
          <span className="green-text">Transformation </span>
          <span className="white-silver-animated-text">Journey.</span>
        </p>
        <div className="w-full opacity-0 flex justify-center">
          <Step3 className="w-[50vw] h-[50vw] lg:w-[35vw] lg:h-[20vw]" />
        </div>
      </div>
    </div>
  );
};

export default Slide1;
