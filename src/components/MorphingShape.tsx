"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import * as flubber from "flubber";
import "@/styles/fonts.css";

gsap.registerPlugin(ScrollTrigger);

const LABELS = [
  { title: "Introduction", index: 0, targetId: null },
  { title: "Identify", index: 1, targetId: "snappy-32" },
  { title: "Educate", index: 2, targetId: "snappy-33" },
  { title: "Develop", index: 3, targetId: "snappy-34" },
];


export default function MorphingShape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const smallSpheresRef = useRef<HTMLDivElement>(null);
  const [activeLabelIndex, setActiveLabelIndex] = useState<number | null>(null);

  let refreshTimeout: ReturnType<typeof setTimeout>;

  const scrollToLabel = (targetId: string | null) => {
    if (!targetId) return;

    const scrollContainer = document.querySelector("#page-wrapper");
    const target = document.getElementById(targetId);

    if (scrollContainer && target) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const scrollOffset = targetRect.top - containerRect.top + scrollContainer.scrollTop;

      gsap.to(scrollContainer, {
        scrollTop: scrollOffset,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          clearTimeout(refreshTimeout);
          refreshTimeout = setTimeout(() => {
            ScrollTrigger.refresh();

            // 🔥 Force-hide all slide text/title elements
            const allTitles = document.querySelectorAll('[id^="snappy-"][id$="-title"]');
            const allTexts = document.querySelectorAll('[id^="snappy-"][id$="-text"]');
            allTitles.forEach((el) => (el as HTMLElement).style.opacity = "0");
            allTexts.forEach((el) => (el as HTMLElement).style.opacity = "0");

            // Optional: re-trigger visibility for the active section's text/title
            const visibleTitle = document.querySelector(`#${targetId}-title`);
            const visibleText = document.querySelector(`#${targetId}-text`);
            if (visibleTitle && visibleText) {
              gsap.to([visibleTitle, visibleText], {
                opacity: 1,
                x: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }

          }, 100);
        },
      });
    }
  };


  useEffect(() => {
    const isMobile = window.innerWidth < 768;           // < 768px
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024; // 768px - 1023px
    const isSmallLaptop = window.innerWidth >= 1024 && window.innerWidth < 1366; // 1024px - 1365px

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
          duration: 1,
          delay: 0.5,
          ease: "none",
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
    const fromY = isMobile ? 300 : isTablet ? 250 : 400;
    const toY = isMobile ? "-40vh" : isTablet ? "-50vh" : "-45vh";
    const fromScale = isMobile ? 1.1 : isTablet ? 1.2 : 1.4;
    const toScale = isMobile ? 0.4 : isTablet ? 0.5 : 0.4;
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
        ease: "none"
      })
      .to([...clones, innerCircle], {
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "none"
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
      gap: isMobile ? "1.5rem" : isTablet ? "1.125rem" : "1.25rem", // Tailwind's gap-5 ≈ 1.25rem
      scale: 0.8,
      marginBottom: isMobile ? ".5rem" : isTablet ? "2rem" : "1.5rem",
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
      const offset = isMobile ? baseOffset * 2.2 : isTablet ? baseOffset * 2.1 : baseOffset;

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

    [
      { trigger: "#snappy-31", labelIndex: null },
      { trigger: "#snappy-32", labelIndex: 1 },
      { trigger: "#snappy-33", labelIndex: 2 },
      { trigger: "#snappy-34", labelIndex: 3 },
    ].forEach(({ trigger, labelIndex }) => {
      ScrollTrigger.create({
        trigger,
        start: "top center",
        end: "bottom center",
        scroller: scrollContainer,
        onEnter: () => setActiveLabelIndex(labelIndex),
        onEnterBack: () => setActiveLabelIndex(labelIndex),
        onLeave: () => setActiveLabelIndex(null),
        onLeaveBack: () => setActiveLabelIndex(null),
      });
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
        className="absolute left-1/2 -bottom-10 md:-bottom-64 lg:-bottom-[20vh] -translate-x-1/2 max-w-screen w-[90vw] md:w-[80vw] lg:w-[40vw] aspect-square"
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

      <div ref={smallSpheresRef} className="absolute w-8/12 md:w-9/12 mt-16 md:mt-40 lg:mt-0 lg:w-7/12 h-fit flex flex-row items-center justify-center gap-11 md:gap-20 lg:gap-8 left-1/2 top-[24.5%] -translate-x-1/2 pointer-events-none opacity-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 294 294"
          fill="none"
          className="smallSphere w-80 aspect-square scale-500 md:scale-350 lg:scale-200 opacity-20"
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
          className="smallSphere w-80 aspect-square scale-500 md:scale-350 lg:scale-200 opacity-35"
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
          className="smallSphere w-80 aspect-square scale-500 md:scale-350 lg:scale-200 opacity-50"
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
          className="smallSphere w-80 aspect-square scale-500 md:scale-350 lg:scale-200 opacity-75"
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
          className="smallSphere w-80 aspect-square scale-500 md:scale-350 lg:scale-200 opacity-100"
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

      <div
        className="absolute left-1/2 lg:left-2 lg:top-1/2 top-[5vh] 
             -translate-x-1/2 lg:-translate-x-0 lg:-translate-y-1/2 
             -translate-y-1/2 flex flex-row lg:flex-col lg:items-start 
             items-center justify-center lg:gap-2 gap-6 
             px-4 md:px-8 lg:px-12 mx-auto 
             pointer-events-auto z-[999]"
      >
        {LABELS.map((label, index) => (
          <button
            key={label.title}
            className={`
              text-left 
              ${index === 0 ? "hidden" : ""} 
              transition-colors duration-300
              ${activeLabelIndex === index ? "text-white" : "text-gray-500"}
            `}
            style={{
              fontFamily: "DM-Mono-Light, monospace",
            }}
          >
            {label.title}
          </button>
        ))}
      </div>
    </div>
  );
}
