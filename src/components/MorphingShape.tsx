"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import * as flubber from "flubber";

gsap.registerPlugin(ScrollTrigger);

export default function MorphingShape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const smallSpheresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const scrollContainer = document.querySelector("#page-wrapper");
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    const outerCircle = document.getElementById("outerCircle");
    const innerCircle = document.getElementById("innerCircle");
    const innerCircleHighlight = document.getElementById("innerCircleHighlight");

    if (!svg || !wrapper || !scrollContainer || !outerCircle || !innerCircle || !innerCircleHighlight) return;

    // Create 4 clones of innerCircle
    const clones: SVGGElement[] = [];
    for (let i = 0; i < 4; i++) {
      const clone = innerCircle.cloneNode(true) as SVGGElement;
      clone.removeAttribute("id");
      gsap.set(clone, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
      });
      svg.appendChild(clone);
      clones.push(clone);
    }

    // Initial state
    gsap.set(wrapper, { autoAlpha: 0 });
    gsap.set(svg, { y: 0, scale: 1 });

    // Fade in wrapper
    ScrollTrigger.create({
      trigger: "#snappy-31",
      start: "top center",
      end: "top center",
      scroller: scrollContainer,
      onEnter: () => {
        gsap.to(wrapper, {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      },
    });

    // Fade out wrapper when scrolling up past 31
    ScrollTrigger.create({
      trigger: "#snappy-31",
      start: "top center",
      end: "top center",
      scroller: scrollContainer,
      onLeaveBack: () => {
        gsap.to(wrapper, {
          autoAlpha: 0,
          duration: 0.1,
          ease: "none",
        });
      },
    });

    // Scroll animation from snappy-31 → snappy-32 (move & scale only)
    const fromY = isMobile ? 300 : 450;
    const toY = isMobile ? "-40vh" : "-65vh";
    const fromScale = isMobile ? 1.1 : 1.4;
    const toScale = isMobile ? 0.4 : 0.4;
    gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-31",
        start: "top center",
        endTrigger: "#snappy-32",
        end: "top 10%",
        scrub: true,
        scroller: scrollContainer,
      },
    }).fromTo(
      svg,
      { y: fromY, scale: fromScale },
      { y: toY, scale: toScale, ease: "none" }
    );


    // Clone appearance and small spheres ONLY from 32 → 33
    const smallSpheres = document.querySelectorAll(".smallSphere");
    gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-32",
        start: "center center",
        endTrigger: "#snappy-33",
        end: "top 10%",
        scrub: true,
        scroller: scrollContainer,
      },
    })
      .to([outerCircle, innerCircleHighlight], {
        opacity: 0,
        ease: "none",
        duration: 0.8,
      })
      .to([...clones], {
        scale: 1,
        x: (index) => (index - 2) * 2,
        y: 0,
        ease: "none",
        duration: 0.6,
      })
      .to(smallSpheresRef.current, {
        opacity: 1,
        duration: 1,
        delay: 0.6,
      })
      .to([...clones, innerCircle], {
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
      }, "<");

    const circlePaths = document.querySelectorAll(".smallSphere .morph-shape");
    const highlightPaths = document.querySelectorAll(".smallSphere .morph-shape-highlight");

    // Original `d` values from your circles:
    const originalShape = "M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z";
    const squareShape = `M78,66 H216 C222.627,66 228,71.373 228,78 V216 C228,222.627 222.627,228 216,228 H78 C71.373,228 66,222.627 66,216 V78 C66,71.373 71.373,66 78,66 Z`;

    smallSpheres.forEach((sphere) => {
      gsap.to(sphere, {
        opacity: 1,
        duration: 0.3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: "#snappy-34",
          start: "top bottom", // or adjust as needed
          end: "top center",
          scrub: true,
          scroller: scrollContainer,
        },
      });
    });


    circlePaths.forEach((path) => {
      const interpolator = flubber.interpolate(originalShape, squareShape, {
        maxSegmentLength: 2,
      }) as (t: number) => string;


      gsap.to(path, {
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#snappy-33",
          start: "center center",
          endTrigger: "#snappy-34",
          end: "top 10%",
          scrub: true,
          scroller: scrollContainer,
        },
        onUpdate: function () {
          const tween = this as unknown as gsap.core.Tween;
          const progress = tween.progress();
          (path as SVGPathElement).setAttribute("d", interpolator(progress));
        },
      });
    });

    highlightPaths.forEach((path) => {
      const interpolator = flubber.interpolate(originalShape, squareShape, {
        maxSegmentLength: 2,
      }) as (t: number) => string;

      gsap.to(path, {
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#snappy-33",
          start: "center center",
          endTrigger: "#snappy-34",
          end: "top 10%",
          scrub: true,
          scroller: scrollContainer,
        },
        onUpdate: function () {
          const tween = this as unknown as gsap.core.Tween;
          const progress = tween.progress();
          (path as SVGPathElement).setAttribute("d", interpolator(progress));
        },
      });
    });

    const moveTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-33",
        start: "center center",
        endTrigger: "#snappy-34",
        end: "top 10%",
        scrub: true,
        scroller: scrollContainer,
      },
    });

    // Animate gap reduction
    moveTimeline.to(smallSpheresRef.current, {
      gap: isMobile ? "1.5rem" : "1.25rem", // Tailwind's gap-5 ≈ 1.25rem
      scale: 0.8,
      marginBottom: isMobile ? ".5rem" : "1.5rem",
      duration: 0.2,
      ease: "power1.inOut",
    });

    // Delay visually (without scroll delay, use dummy animation)
    moveTimeline.to({}, {
      duration: 0.2, // pause to hold square shape
    });

    // Then move spheres
    smallSpheres.forEach((sphere, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const baseOffset = sphere.getBoundingClientRect().height / 3.52;
      const offset = isMobile ? baseOffset * 2 : baseOffset;

      moveTimeline.to(sphere, {
        y: direction * offset,
        ease: "power2.inOut",
        duration: 1.6,
      }, "<");
    });

    ScrollTrigger.create({
      trigger: "#snappy-4",
      start: "top center",
      end: "top bottom",
      scroller: scrollContainer,
      onLeave: () => {
        gsap.to(wrapper, {
          autoAlpha: 0,
          duration: 0.1,
          ease: "power2.out",
        });
      },
    });

    ScrollTrigger.create({
      trigger: "#snappy-34",
      start: "top center",
      end: "bottom center",
      scroller: scrollContainer,
      onEnterBack: () => {
        gsap.to(wrapper, {
          autoAlpha: 1,
          duration: 0.05,
          ease: "power2.out",
        });
      },
    });


  }, []);


  return (
    <div ref={wrapperRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-0"
    >
      {/* Exact SVG from step3.svg */}
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 294 294"
        fill="none"
        className="absolute left-1/2 -bottom-10 lg:-bottom-96 -translate-x-1/2 max-w-screen w-[90vw] lg:w-[50vw] aspect-square"
      >
        <g opacity={0.8} id="outerCircle">
          <g filter="url(#a)">
            <path
              fill="url(#b)"
              d="M294 147C294 65.814 228.186 0 147 0S0 65.814 0 147s65.814 147 147 147 147-65.814 147-147Z"
            />
          </g>
          <path
            stroke="url(#c)"
            strokeWidth={2.5}
            d="M292.75 147C292.75 66.504 227.495 1.25 147 1.25 66.504 1.25 1.25 66.504 1.25 147c0 80.495 65.254 145.75 145.75 145.75 80.495 0 145.75-65.255 145.75-145.75Z"
          />
        </g>
        <g filter="url(#d)" id="innerCircle">
          <path
            fill="url(#e)"
            d="M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z"
          />
        </g>
        <path
          id="innerCircleHighlight"
          stroke="url(#f)"
          strokeWidth={2.5}
          d="M225.75 147c0-44.045-35.705-79.75-79.75-79.75S66.25 102.955 66.25 147s35.705 79.75 79.75 79.75 79.75-35.705 79.75-79.75Z"
        />
        <defs>
          <linearGradient
            id="b"
            x1={147}
            x2={147}
            y1={0}
            y2={294}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
            <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient
            id="c"
            x1={147}
            x2={147}
            y1={0}
            y2={294}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FDFFFE" />
            <stop offset={0.4} stopColor="#549876" />
            <stop offset={1} stopColor="#fff" />
          </linearGradient>
          <linearGradient
            id="e"
            x1={146}
            x2={146}
            y1={66}
            y2={228}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
            <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient
            id="f"
            x1={146}
            x2={146}
            y1={66}
            y2={228}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FDFFFE" />
            <stop offset={0.4} stopColor="#549876" />
            <stop offset={1} stopColor="#fff" />
          </linearGradient>
          <filter
            id="a"
            width={294}
            height={318.088}
            x={0}
            y={-24.088}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={-24.088} />
            <feGaussianBlur stdDeviation={18.066} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
            <feBlend in2="shape" result="effect1_innerShadow_0_1" />
          </filter>
          <filter
            id="d"
            width={162}
            height={186.088}
            x={65}
            y={41.912}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={-24.088} />
            <feGaussianBlur stdDeviation={18.066} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
            <feBlend in2="shape" result="effect1_innerShadow_0_1" />
          </filter>
        </defs>
      </svg>

      <div ref={smallSpheresRef} className="absolute w-8/12 mt-16 lg:mt-0 lg:w-7/12 h-fit flex flex-row items-center justify-center gap-11 lg:gap-8 left-1/2 top-[24.5%] -translate-x-1/2 pointer-events-none opacity-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 294 294"
          fill="none"
          className="smallSphere w-80 aspect-square scale-500 lg:scale-200 opacity-20"
        >
          <g filter="url(#d)">
            <path
              fill="url(#e)"
              d="M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z"
              className="morph-shape"
            />
          </g>
          <path
            stroke="url(#f)"
            strokeWidth={2.5}
            d="M225.75 147c0-44.045-35.705-79.75-79.75-79.75S66.25 102.955 66.25 147s35.705 79.75 79.75 79.75 79.75-35.705 79.75-79.75Z"
            className="morph-shape-highlight"
          />
          <defs>
            <linearGradient
              id="b"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="c"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <linearGradient
              id="e"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="f"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <filter
              id="a"
              width={294}
              height={318.088}
              x={0}
              y={-24.088}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
            <filter
              id="d"
              width={162}
              height={186.088}
              x={65}
              y={41.912}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 294 294"
          fill="none"
          className="smallSphere w-80 aspect-square scale-500 lg:scale-200 opacity-35"
        >
          <g filter="url(#d)">
            <path
              fill="url(#e)"
              d="M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z"
              className="morph-shape"
            />
          </g>
          <path
            stroke="url(#f)"
            strokeWidth={2.5}
            d="M225.75 147c0-44.045-35.705-79.75-79.75-79.75S66.25 102.955 66.25 147s35.705 79.75 79.75 79.75 79.75-35.705 79.75-79.75Z"
            className="morph-shape-highlight"
          />
          <defs>
            <linearGradient
              id="b"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="c"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <linearGradient
              id="e"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="f"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <filter
              id="a"
              width={294}
              height={318.088}
              x={0}
              y={-24.088}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
            <filter
              id="d"
              width={162}
              height={186.088}
              x={65}
              y={41.912}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 294 294"
          fill="none"
          className="smallSphere w-80 aspect-square scale-500 lg:scale-200 opacity-50"
        >
          <g filter="url(#d)">
            <path
              fill="url(#e)"
              d="M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z"
              className="morph-shape"
            />
          </g>
          <path
            stroke="url(#f)"
            strokeWidth={2.5}
            d="M225.75 147c0-44.045-35.705-79.75-79.75-79.75S66.25 102.955 66.25 147s35.705 79.75 79.75 79.75 79.75-35.705 79.75-79.75Z"
            className="morph-shape-highlight"
          />
          <defs>
            <linearGradient
              id="b"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="c"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <linearGradient
              id="e"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="f"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <filter
              id="a"
              width={294}
              height={318.088}
              x={0}
              y={-24.088}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
            <filter
              id="d"
              width={162}
              height={186.088}
              x={65}
              y={41.912}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 294 294"
          fill="none"
          className="smallSphere w-80 aspect-square scale-500 lg:scale-200 opacity-75"
        >
          <g filter="url(#d)">
            <path
              fill="url(#e)"
              d="M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z"
              className="morph-shape"
            />
          </g>
          <path
            stroke="url(#f)"
            strokeWidth={2.5}
            d="M225.75 147c0-44.045-35.705-79.75-79.75-79.75S66.25 102.955 66.25 147s35.705 79.75 79.75 79.75 79.75-35.705 79.75-79.75Z"
            className="morph-shape-highlight"
          />
          <defs>
            <linearGradient
              id="b"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="c"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <linearGradient
              id="e"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="f"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <filter
              id="a"
              width={294}
              height={318.088}
              x={0}
              y={-24.088}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
            <filter
              id="d"
              width={162}
              height={186.088}
              x={65}
              y={41.912}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 294 294"
          fill="none"
          className="smallSphere w-80 aspect-square scale-500 lg:scale-200 opacity-100"
        >
          <g filter="url(#d)">
            <path
              fill="url(#e)"
              d="M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z"
              className="morph-shape"
            />
          </g>
          <path
            stroke="url(#f)"
            strokeWidth={2.5}
            d="M225.75 147c0-44.045-35.705-79.75-79.75-79.75S66.25 102.955 66.25 147s35.705 79.75 79.75 79.75 79.75-35.705 79.75-79.75Z"
            className="morph-shape-highlight"
          />
          <defs>
            <linearGradient
              id="b"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="c"
              x1={147}
              x2={147}
              y1={0}
              y2={294}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <linearGradient
              id="e"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={0.6} stopColor="#4CAA7D" stopOpacity={0.1} />
              <stop offset={1} stopColor="#E1FFF1" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient
              id="f"
              x1={146}
              x2={146}
              y1={66}
              y2={228}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FDFFFE" />
              <stop offset={0.4} stopColor="#549876" />
              <stop offset={1} stopColor="#fff" />
            </linearGradient>
            <filter
              id="a"
              width={294}
              height={318.088}
              x={0}
              y={-24.088}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
            <filter
              id="d"
              width={162}
              height={186.088}
              x={65}
              y={41.912}
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={-24.088} />
              <feGaussianBlur stdDeviation={18.066} />
              <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
              <feColorMatrix values="0 0 0 0 0.536175 0 0 0 0 0.741662 0 0 0 0 0.638918 0 0 0 0.7 0" />
              <feBlend in2="shape" result="effect1_innerShadow_0_1" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
