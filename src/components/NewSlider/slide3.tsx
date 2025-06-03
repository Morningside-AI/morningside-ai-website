"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/fonts.css";
import Step3 from "@/assets/images/animation/entrance.svg";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Slide3 = () => {
  const slide3Ref = useRef(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector("#page-wrapper");
    if (!scrollContainer || !titleRef.current || !textRef.current || !slide3Ref.current) return;

    const title = titleRef.current;
    const text = textRef.current;

    gsap.set([title, text], { opacity: 0, x: 100 });

    const trigger = ScrollTrigger.create({
      trigger: slide3Ref.current,
      start: "top center",
      end: "bottom center",
      scroller: scrollContainer,
      onEnter: () => animateIn(title, text),
      onLeave: () => animateOut(title, text),
      onEnterBack: () => animateIn(title, text),
      onLeaveBack: () => animateOut(title, text),
    });

    const handleScroll = () => {
      if (!trigger.isActive) {
        gsap.set([title, text], { opacity: 0, x: 100 });
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      trigger.kill();
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const animateIn = (title: HTMLElement, text: HTMLElement) => {
    gsap.fromTo(
      [title, text],
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 0.4, delay: 0.06, ease: "none" }
    );
  };

  const animateOut = (title: HTMLElement, text: HTMLElement) => {
    gsap.to([title, text], {
      opacity: 0,
      x: 100,
      duration: 0.2,
      delay: 0.03,
      ease: "none",
    });
  };

  return (
    <div
      id="slide3"
      ref={slide3Ref}
      className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center text-white"
    >
      <div className="w-full flex justify-center opacity-0">
        <Step3 className="w-[35vw] h-[50vh] lg:w-[35vw] lg:h-[28vw]" />
      </div>

      <div className="fixed w-11/12 lg:w-full bottom-5 md:bottom-10 lg:bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-center pointer-events-none z-50">
        <p
          ref={titleRef}
          id="snappy-33-title"
          className="text-6xl lg:text-7xl font-light opacity-0"
        >
          Educate
        </p>
        <p
          ref={textRef}
          id="snappy-33-text"
          className="text-base lg:text-lg lg:w-6/12 text-[#A0A4A1] px-1 lg:px-2 opacity-0"
        >
          We train and support your team with the right tools and know-how <br className="hidden lg:block"/>to embed AI across your entire organization.
        </p>
      </div>
    </div>
  );
};

export default Slide3;
