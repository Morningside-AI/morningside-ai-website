"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const logoCover = preloaderRef.current?.querySelector<HTMLDivElement>(".logoCover");
      const shapes = svgRef.current?.querySelectorAll<SVGPathElement>(".logo-shape");
      const text = svgRef.current?.querySelector<SVGTextElement>(".logo-text");

      if (!shapes || !text || !logoCover) return;

      gsap.set(shapes, { opacity: 0, scale: 0.5, transformOrigin: "center" });
      gsap.set(text, { opacity: 0, x: -100 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          setIsAnimating(false);
          onComplete();
        },
      });

      tl.to(logoCover, {
        opacity: 0,
        duration: 0.2,
        delay: 0.5,
      });

      tl.to(shapes, {
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        duration: 0.8,
      });

      tl.to(text, {
        opacity: 1,
        x: 130,
        duration: 0.8,
      }, "-=0.3");


      tl.call(() => {
        const el = logoWrapperRef.current;
        if (!el) return;

        const { left, top, width, height } = el.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // ✅ Responsive values
        const isMobile = window.innerWidth < 768;
        const paddingX = isMobile ? 80 : 128;
        const paddingY = isMobile ? 24 : 32;
        const scale = isMobile ? 0.3 : 0.36;

        const dx = paddingX - centerX;
        const dy = paddingY - centerY;

        gsap.to(el, {
          x: dx,
          y: dy,
          scale,
          duration: 1,
          ease: "power2.inOut",
        });
      });

      tl.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 1.0,
      });
    }, preloaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!isAnimating) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed pt-4 inset-0 z-50 flex items-center justify-center bg-transparent text-white"
    >
      <div className="absolute inset-0 bg-black w-screen h-screen z-10 logoCover"></div>
      <div
        ref={logoWrapperRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px]"
      >
        <Logo ref={svgRef} className="w-full h-auto" />
      </div>
    </div>
  );
};

export default Preloader;
