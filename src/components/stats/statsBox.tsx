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

  useEffect(() => {
    if (!numberRef.current) return;
  
    const el = numberRef.current;
  
    const obj = { val: 0 };
  
    gsap.fromTo(
      obj,
      { val: 0 },
      {
        val: number,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toLocaleString();
        },
      }
    );
  }, [number]);
  

  return (
    <div className="flex flex-col w-1/3 md:mb-0 mb-2 gap-4">
      <p className="lg:text-8xl md:text-7xl text-6xl tracking-widest">
        <span ref={numberRef}>0</span>{numberText}
      </p>
      <hr className="border-[#325E43] border-1 md:my-4 my-1" />
      <p className="text-lg text-white">
        {text}
      </p>
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
