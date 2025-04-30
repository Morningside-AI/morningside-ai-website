"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { GoArrowUpRight } from "react-icons/go";
import PartnershipMarquee from "./partnersMarquee";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Partnership = () => {
  const centerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleContactClick = () => {
    window.location.href = "/contact"; // This forces a full page reload
  };

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Wrap letters in spans (same as before)
    const words = heading.querySelectorAll('.word');
    words.forEach(word => {
      const letters = word.textContent?.split('');
      if (letters) {
        word.innerHTML = '';
        letters.forEach(letter => {
          const span = document.createElement('span');
          span.classList.add('letter');
          span.textContent = letter;
          word.appendChild(span);
        });
      }
    });

    const letters = heading.querySelectorAll('.letter');
    gsap.set(letters, { clipPath: 'inset(0% 100% 0% 0%)' });

    // Create a timeline for the reveal animation
    const tl = gsap.timeline({
      defaults: { ease: 'linear' }
    });

    tl.to(letters, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.1,
      stagger: 0.04
    });

    // Create scroll trigger with scrub
    const trigger = ScrollTrigger.create({
      trigger: centerRef.current,
      start: 'top 60%',
      end: 'bottom 90%',
      scrub: true,
      animation: tl,
      markers: false // Set to true to see trigger positions
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <>
      <div
        id="partnership-section"
        ref={centerRef}
        className="w-full h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] gap-8 relative overflow-hidden touch-none"
      >
        <div className="absolute top-0 left-0 w-full z-10 pt-8 flex flex-col items-center justify-center">
          <PartnershipMarquee />
        </div>

        <div className="relative w-full mb-40 mt-8 ">
          <p
            className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 -translate-x-1/2 w-full "
          >
            <span className="gray-text">
              <span className="">T</span>
              <span className="">h</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="gray-text">
              <span className="">b</span>
              <span className="">e</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="gray-text">
              <span className="">A</span>
              <span className="">I</span>
              <span className=""> </span>
            </span>
            <br className="block md:hidden" />
            <span className="gray-text ">
              <span className="">s</span>
              <span className="">y</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className="">e</span>
              <span className="">m</span>
              <span className="">s</span>
              <span className=""> </span>
            </span>
            <br className="hidden lg:block" />
            <span className="gray-text ">
              <span className="">a</span>
              <span className="">r</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">b</span>
              <span className="">u</span>
              <span className="">i</span>
              <span className="">l</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">b</span>
              <span className="">y</span>
              <span className=""> </span>
            </span>
            <span className="gray-text ">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className="">.</span>
            </span>
          </p>
          <p
            className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 z-50 -translate-x-1/2 w-full"
            ref={headingRef}
          >
            <span className="text-white word">
              <span className="letter">T</span>
              <span className="letter">h</span>
              <span className="letter">e</span>
              <span className="letter"> </span>
            </span>
            <span className="text-white word">
              <span className="letter">b</span>
              <span className="letter">e</span>
              <span className="letter">s</span>
              <span className="letter">t</span>
              <span className="letter"> </span>
            </span>
            <span className="text-white word">
              <span className="letter">A</span>
              <span className="letter">I</span>
              <span className="letter"> </span>
            </span>
            <br className="block md:hidden" />
            <span className="text-white word">
              <span className="letter">s</span>
              <span className="letter">y</span>
              <span className="letter">s</span>
              <span className="letter">t</span>
              <span className="letter">e</span>
              <span className="letter">m</span>
              <span className="letter">s</span>
              <span className="letter"> </span>
            </span>
            <br className="hidden lg:block" />
            <span className="text-white word">
              <span className="letter">a</span>
              <span className="letter">r</span>
              <span className="letter">e</span>
              <span className="letter"> </span>
            </span>
            <span className="text-white word">
              <span className="letter">b</span>
              <span className="letter">u</span>
              <span className="letter">i</span>
              <span className="letter">l</span>
              <span className="letter">t</span>
              <span className="letter"> </span>
            </span>
            <span className="green-text word">
              <span className="letter">s</span>
              <span className="letter">i</span>
              <span className="letter">d</span>
              <span className="letter">e</span>
              <span className="letter"> </span>
            </span>
            <span className="green-text word">
              <span className="letter">b</span>
              <span className="letter">y</span>
              <span className="letter"> </span>
            </span>
            <span className="green-text word">
              <span className="letter">s</span>
              <span className="letter">i</span>
              <span className="letter">d</span>
              <span className="letter">e</span>
              <span className="letter">.</span>
            </span>
          </p>
        </div>

        <div
          ref={buttonRef}
          className="w-full flex flex-row items-center justify-center"
        >
          <button onClick={handleContactClick} className="flex cursor-pointer items-center gap-1 px-4 py-2 lg:px-8 lg:py-4 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
            <p className="text-3xl lg:text-5xl">Let&apos;s Partner Up</p>
            <GoArrowUpRight
              size={32}
              strokeWidth={1}
              className="mt-1 transition-all duration-300"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Partnership;
