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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const numberEl = numberRef.current;
    const contentEl = contentRef.current;

    if (!numberEl || !contentEl) return;

    const obj = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contentEl,
        start: "top 80%",
        end: "bottom 30%",
        toggleActions: "restart none none reverse",
        onLeaveBack: () => {
          numberEl.textContent = "0";
          gsap.to(contentEl, { opacity: 0, y: 20, duration: 0.3, ease: "power1.out" });
        },
        onEnterBack: () => {
          obj.val = 0;
          gsap.to(obj, {
            val: number,
            duration: 1.5,
            ease: "power3.out",
            onUpdate: () => {
              numberEl.textContent = Math.floor(obj.val).toLocaleString();
            },
          });
          gsap.to(contentEl, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        },
      },
    });

    tl.fromTo(obj, 
      { val: 0 },
      {
        val: number,
        duration: 1.5,
        ease: "power3.out",
        onUpdate: () => {
          numberEl.textContent = Math.floor(obj.val).toLocaleString();
        },
      }
    );

    tl.fromTo(
      contentEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [number]);

  return (
    <div ref={contentRef} className="flex flex-col w-full lg:w-1/3 md:mb-0 mb-2 gap-1 lg:gap-4 opacity-0">
      <p className="lg:text-8xl md:text-7xl text-6xl tracking-widest">
        <span ref={numberRef}>0</span>{numberText}
      </p>
      <hr className="border-[#325E43] border-1 md:my-4 my-0" />
      <p className="text-lg text-white">{text}</p>
      {link && linkText && (
        <Link href={link} target="_blank" className="decoration-none flex flex-row items-center gap-1">
          <p className="text-md green-text font-bold">{linkText}</p>
          <GoArrowUpRight className="mt-1" strokeWidth={1} color="#325E43" size={18} />
        </Link>
      )}
    </div>
  );
};

export default StatsBox;
