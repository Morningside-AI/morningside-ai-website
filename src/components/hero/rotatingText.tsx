"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "@/styles/fonts.css";

const words = ["Consulting", "Education", "Development"];

const RotatingText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const letterRefs = useRef<HTMLSpanElement[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    letterRefs.current = words.map((word) =>
      Array(word.length)
        .fill(null)
        .map(() => React.createRef<HTMLSpanElement>().current!)
    );
  }, []);

  useEffect(() => {
    const animate = () => {
      const letters =
        containerRef.current?.querySelectorAll("span[data-letter]") ?? [];

      // Fade in letters left to right
      gsap.fromTo(
        letters,
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        }
      );

      // Wait, then fade out right to left
      gsap.to(letters, {
        delay: 2,
        opacity: 0,
        x: 20,
        duration: 0.4,
        stagger: {
          each: 0.04,
          from: "end",
        },
        ease: "power2.in",
        onComplete: () => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        },
      });
    };

    animate();
  }, [currentWordIndex]);

  const currentWord = words[currentWordIndex];

  return (
    <div
      ref={containerRef}
      className="text-5xl md:text-7xl lg:text-8xl w-full green-text flex gap-[0.02em] tracking-[-0.08em] text-center"
    >
      {currentWord?.split("").map((char, index) => (
        <span key={index} data-letter className="inline-block opacity-0" style={{
          fontFamily: "DM-Mono-Italic, monospace",
          fontStyle: "italic",
        }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default RotatingText;
