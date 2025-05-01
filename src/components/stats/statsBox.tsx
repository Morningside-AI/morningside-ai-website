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
  link: string;
  linkText: string;
}

const StatsBox = ({ number, numberText, text, link, linkText }: StatsBoxProps) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hrRef = useRef<HTMLHRElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const numberEl = numberRef.current;
    const contentEl = contentRef.current;
    const hrEl = hrRef.current;
    const textEl = textRef.current;
    const linkEl = linkRef.current;

    if (!numberEl || !contentEl || !hrEl || !textEl || !linkEl) return;

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: contentEl,
      start: "top 80%",
      end: "bottom 30%",
      onEnter: () => {
        obj.val = 0;
        gsap.to(obj, {
          val: number,
          duration: 1.5,
          ease: "power3.out",
          onUpdate: () => {
            numberEl.textContent = Math.floor(obj.val).toLocaleString();
          },
        });

        gsap.fromTo(
          hrEl,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.1 }
        );

        gsap.fromTo(
          textEl,
          {
            opacity: 0,
            y: 40,
            rotateX: 65,
            transformOrigin: "bottom center",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.2,
          }

        );

        gsap.fromTo(
          linkEl,
          {
            opacity: 0,
            y: 40,
            rotateX: 65,
            transformOrigin: "bottom center",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.2,
          }
        );
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

        gsap.fromTo(
          hrEl,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.1 }
        );

        gsap.fromTo(
          textEl,
          {
            opacity: 0,
            y: 40,
            rotateX: 65,
            transformOrigin: "bottom center",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.2,
          }
        );

        gsap.fromTo(
          linkEl,
          {
            opacity: 0,
            y: 40,
            rotateX: 65,
            transformOrigin: "bottom center",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      },
      onLeave: () => {
        numberEl.textContent = "0";
        gsap.set([hrEl, textEl, linkEl], { opacity: 0 });
      },
      onLeaveBack: () => {
        numberEl.textContent = "0";
        gsap.set([hrEl, textEl, linkEl], { opacity: 0 });
      },
    });
  }, [number]);



  return (
    <div
      ref={contentRef}
      className="flex flex-col w-full lg:w-1/3 md:mb-0 mb-2 gap-1 lg:gap-4"
    >
      <p className="lg:text-8xl md:text-7xl text-6xl tracking-widest">
        <span ref={numberRef}>0</span>
        {numberText}
      </p>
      <hr
        ref={hrRef}
        className="border-[#325E43] border-1 md:my-4 my-0 opacity-0"
      />
      <p ref={textRef} className="text-lg text-white opacity-0">
        {text}
      </p>

      <Link
        href={link}
        target="_blank"
        ref={linkRef}
        className={`decoration-none flex flex-row items-center gap-1 ${link == "" || linkText == "" ? "cursor-default" : "cursor-pointer"}`}
        onClick={(e) => {
          if (link == "" || linkText == "") e.preventDefault()
        }}
      >
        <p className="text-md green-text font-bold">{linkText}</p>
        {
          link != "" && linkText != "" && <GoArrowUpRight
            className="mt-1"
            strokeWidth={1}
            color="#325E43"
            size={18}
          />
        }
      </Link>
    </div>
  );
};

export default StatsBox;
