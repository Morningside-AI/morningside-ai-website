"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StatsBoxProps {
  number: number;
  numberText: string;
  text: string;
  link?: string;
  linkText?: string;
}

const StatsBox = ({ number, numberText, text, link, linkText }: StatsBoxProps) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!numberRef.current || !textRef.current) return;

    const numberEl = numberRef.current;
    const textEl = textRef.current;
    const linkEl = linkText && link ? linkRef.current : null;

    const obj = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: numberEl,
        start: "top 80%",
        end: "bottom 10%",
        toggleActions: "play reverse play reverse",
        onLeave: () => {
          // Fade out all elements when leaving
          gsap.to([numberEl, textEl, linkEl], {
            opacity: 0,
            duration: 0.4,
            ease: "power1.out",
          });
        },
        onEnterBack: () => {
          // Reset the counter and reanimate
          obj.val = 0;

          gsap.fromTo(
            [textEl, linkEl],
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power2.out",
            }
          );

          gsap.to(obj, {
            val: number,
            duration: 1.6,
            ease: "power3.out",
            onUpdate: () => {
              if (numberEl) numberEl.textContent = Math.floor(obj.val).toLocaleString();
            },
          });
        },
      },
    });

    // Initial entry animation
    tl.fromTo(
      [textEl, linkEl],
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    tl.to(obj, {
      val: number,
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => {
        if (numberEl) numberEl.textContent = Math.floor(obj.val).toLocaleString();
      },
    }, "<");

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [number, linkText, link]);

  return (
    <div className="flex flex-col w-1/3 md:mb-0 mb-2 gap-4">
      <p className="lg:text-8xl md:text-7xl text-6xl tracking-widest">
        <span ref={numberRef}>0</span>{numberText}
      </p>
      <hr className="border-[#325E43] border-1 md:my-4 my-1" />
      <p ref={textRef} className="text-lg text-white">
        {text}
      </p>
      {link && linkText && (
        <Link
          ref={linkRef}
          href={link}
          target="_blank"
          className="decoration-none flex flex-row items-center gap-1"
        >
          <p className="text-md green-text font-bold">{linkText}</p>
          <GoArrowUpRight className="mt-1" strokeWidth={1} color="#325E43" size={18} />
        </Link>
      )}
    </div>
  );
};

export default StatsBox;
