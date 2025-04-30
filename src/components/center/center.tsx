"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Center = () => {
  const centerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

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
    <div
      id="center-section"
      ref={centerRef}
      className="w-full h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white leading-normal tracking-normal"
    >
      <div className="relative w-full md:-translate-y-16 lg:-translate-y-0">
        <p
          className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 -translate-x-1/2 w-full "
        >
          <span className="gray-text">We </span>
          <span className="gray-text">put </span>
          <span className="gray-text">AI </span>
          <br className="block md:hidden" />
          <span className="gray-text">at </span>
          <span className="gray-text">the </span>
          <span className="gray-text">center </span>
          <span className="gray-text">of </span>
          <br />
          <span className="gray-text">everything </span>
          <span className="gray-text">we </span>
          <span className="gray-text">do.</span>
        </p>
        <p
          className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap absolute top-1/2 left-1/2 z-50 -translate-x-1/2 w-full"
          ref={headingRef}
        >
          <span className="text-white word">
            <span className="letter">W</span>
            <span className="letter">e</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">p</span>
            <span className="letter">u</span>
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
            <span className="letter">a</span>
            <span className="letter">t</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">t</span>
            <span className="letter">h</span>
            <span className="letter">e</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">c</span>
            <span className="letter">e</span>
            <span className="letter">n</span>
            <span className="letter">t</span>
            <span className="letter">e</span>
            <span className="letter">r</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">o</span>
            <span className="letter">f</span>
            <span className="letter"> </span>
          </span>
          <br />
          <span className="green-text word">
            <span className="letter">e</span>
            <span className="letter">v</span>
            <span className="letter">e</span>
            <span className="letter">r</span>
            <span className="letter">y</span>
            <span className="letter">t</span>
            <span className="letter">h</span>
            <span className="letter">i</span>
            <span className="letter">n</span>
            <span className="letter">g</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">w</span>
            <span className="letter">e</span>
            <span className="letter"> </span>
          </span>
          <span className="text-white word">
            <span className="letter">d</span>
            <span className="letter">o</span>
            <span className="letter">.</span>
          </span>
        </p>

      </div>
      <p
        ref={subTextRef}
        className="text-xl lg:text-2xl text-center mt-40 sm:mt-40 md:mt-24 lg:mt-40 text-[#C0C0C0]"
      >
        One trusted partner to guide you <br /> through your entire AI journey.
      </p>
    </div>
  );
};

export default Center;