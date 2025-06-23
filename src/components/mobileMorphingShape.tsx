"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import * as flubber from "flubber";
import "@/styles/fonts.css";

gsap.registerPlugin(ScrollTrigger);

const LABELS = [
  { title: "Introduction", index: 0, targetId: null },
  { title: "IDENTIFY", index: 1, targetId: "snappy-32" },
  { title: "EDUCATE", index: 2, targetId: "snappy-33" },
  { title: "DEVELOP", index: 3, targetId: "snappy-34" },
];


export default function MorphingShape({
  isMobile,
  isTablet
}: {
  isMobile: boolean;
  isTablet: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const smallSpheresRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
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
    const scrollContainer = document.querySelector("#page-wrapper");
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    const outerCircle = document.getElementById("outerCircle");
    const innerCircle = document.getElementById("innerCircle");
    const innerCircleHighlight = document.getElementById("innerCircleHighlight");
    const labels = labelsRef.current;

    if (!svg || !wrapper || !scrollContainer || !outerCircle || !innerCircle || !innerCircleHighlight) return;

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
          ease: "none",
        });
      },
    });

    // Scroll animation from snappy-31 → snappy-32 (move & scale only)

    const fromY = isMobile ? "-75vh" : isTablet ? "-52rem" : "-48rem";
    const toY = isMobile ? "36vh" : isTablet ? "36vh" : "14vh";
    const fromScale = isMobile ? 1.2 : isTablet ? 1.2 : 1;
    const toScale = isMobile ? 0.42 : isTablet ? 0.6 : 0.4;
    gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-31",
        start: "top 90%",
        endTrigger: "#snappy-32",
        end: "top top",
        scrub: 0.5,
        scroller: scrollContainer,
      },
    }).fromTo(
      svg,
      { bottom: fromY, scale: fromScale },
      { bottom: toY, scale: toScale, ease: "none" }
    );

    gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-32",
        start: "top 90%",
        endTrigger: "#snappy-32",
        end: "top top",
        scrub: 0.4,
        scroller: scrollContainer,
      },
    }).fromTo(
      labels,
      {
        opacity: 0,
        duration: 0.2,
        ease: "none",
      },
      {
        opacity: 1,
        duration: 0.2,
        ease: "none",
      }
    );


    // appearance of small spheres ONLY from 32 → 33
    const smallSpheres = document.querySelectorAll(".smallSphere");
    const smallSpheresArray = Array.from(smallSpheres);

    const middleSphere = smallSpheresArray[1] as SVGGraphicsElement;
    const clone = middleSphere.cloneNode(true) as SVGGraphicsElement;
    clone.classList.add("clonedSphere");
    middleSphere.parentElement?.appendChild(clone);

    // Set up cloned sphere
    gsap.set(clone, {
      opacity: 0,
      yPercent: 0,
    });


    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-32",
        start: "top top",
        endTrigger: "#snappy-33",
        end: "+=100%",
        scrub: 0.4,
        scroller: scrollContainer,
      },
    });



    // Inside your useEffect after the first timeline
    tl.to([outerCircle, innerCircleHighlight], {
      opacity: 0,
      ease: "none",
      duration: 0.2,
    })
      .to([innerCircle], {
        opacity: 0,
        duration: 0.2,
        ease: "none",
      })
      .to(smallSpheresRef.current, {
        opacity: 1,
        duration: 0.2,
        scale: 1.25,
        ease: "none",
        // Add position synchronization here
        onStart: () => {
          const innerCircle = document.getElementById("innerCircle");
          const smallSpheres = smallSpheresRef.current;

          if (!innerCircle || !smallSpheres) return;

          // Get positions relative to viewport
          const innerRect = innerCircle.getBoundingClientRect();
          const wrapperRect = wrapperRef.current?.getBoundingClientRect();

          if (!wrapperRect) return;

          // Calculate position relative to wrapper
          const topPosition = innerRect.top - wrapperRect.top;

          // Apply position to smallSpheres
          gsap.set(smallSpheres, {
            position: "absolute",
            top: topPosition + "px",
            left: "50%",
            xPercent: -50,
            yPercent: -50
          });
        }
      });

    const centerIndex = Math.floor(smallSpheres.length / 2);
    const spacing = isMobile ? 100 : isTablet ? 155 : 155;
    const scaling = isMobile ? 1 : isTablet ? 1 : 1;

    // Position 3 original spheres: center stays still
    tl.to(smallSpheresArray, {
      x: (i) => {
        if (i === 0) return -spacing;
        if (i === 1) return 0;
        if (i === 2) return spacing;
        return 0;
      },
      y: 0,
      xPercent: -50,
      yPercent: 0,
      scale: scaling,
      duration: 0.4,
      delay: 0.1,
      ease: "none",
    });



    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-33",
        start: "center 70%",
        endTrigger: "#snappy-34",
        end: "top 10%",
        scrub: 0.4,
        scroller: scrollContainer,
      },
    });

    const circlePaths = document.querySelectorAll(".smallSphere .morph-shape");
    const highlightPaths = document.querySelectorAll(".smallSphere .morph-shape-highlight");

    // Original `d` values from your circles:
    const originalShape = "M227 147c0-44.735-36.265-81-81-81s-81 36.265-81 81 36.265 81 81 81 81-36.265 81-81Z";
    const squareShape = `M78,66 H216 C222.627,66 228,71.373 228,78 V216 C228,222.627 222.627,228 216,228 H78 C71.373,228 66,222.627 66,216 V78 C66,71.373 71.373,66 78,66 Z`;

    smallSpheres.forEach((sphere) => {
      masterTimeline.to(sphere, {
        opacity: 1,
        duration: 0.3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: "#snappy-34",
          start: "top bottom", // or adjust as needed
          end: "top center",
          scrub: 0.4,
          scroller: scrollContainer,
        },
      });
    });

    const moveTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#snappy-33",
        start: "bottom bottom",
        endTrigger: "#snappy-34",
        end: "top top",
        scrub: 0.4,
        scroller: scrollContainer,
      },
    });

    // Delay visually (without scroll delay, use dummy animation)
    masterTimeline.to({}, {
      duration: 0.2, // pause to hold square shape
    });

    // Animate gap reduction
    masterTimeline.to(smallSpheresRef.current, {
      gap: isMobile ? "0.1rem" : isTablet ? "0.1rem" : "0px",
      opacity: 1,
      duration: 0.2,
      delay: 0.2,
      ease: "power1.inOut",
    });

    const spheresMoveTimeline = gsap.timeline();

    for (let i = 0; i < circlePaths.length; i++) {
      const circlePath = circlePaths[i] as SVGPathElement;
      const highlightPath = highlightPaths[i] as SVGPathElement;
    
      const circleInterpolator = flubber.interpolate(originalShape, squareShape, {
        maxSegmentLength: 2,
      }) as (t: number) => string;
    
      const highlightInterpolator = flubber.interpolate(originalShape, squareShape, {
        maxSegmentLength: 2,
      }) as (t: number) => string;
    
      moveTimeline.to(
        {},
        {
          duration: 1,
          ease: "none",
          onUpdate: function () {
            const tween = this as unknown as gsap.core.Tween;
            const progress = tween.progress();
            circlePath.setAttribute("d", circleInterpolator(progress));
            highlightPath.setAttribute("d", highlightInterpolator(progress));
          },
        },
        0 // 👈 ensures all paths morph together in perfect sync
      );
    }

    spheresMoveTimeline.to({}, {
      duration: 0.2, // pause to hold square shape
    });
    // Animate original 3 spheres
    smallSpheresArray.forEach((sphere, index) => {
      const baseOffset = sphere.getBoundingClientRect().height;
      const offset = isMobile ? baseOffset / 3 : isTablet ? baseOffset / 3 : baseOffset / 3;

      // Direction logic:
      // 0 → down, 1 → up, 2 → down
      const direction = index === 1 ? -1 : 1;

      moveTimeline.to(
        sphere,
        {
          y: direction * offset,
          marginTop: "0rem",
          ease: "power2.inOut",
          duration: 1.6,
        },
        "spheresMove"  
      );
    });

    // Animate clone further downward
    if (clone) {
      const clones = document.querySelectorAll(".clonedSphere");
      const clonesArray = Array.from(clones);

      clonesArray.forEach((cloneSphere, index) => {
        const baseOffset = clone.getBoundingClientRect().height;
        const offset = isMobile ? baseOffset : isTablet ? baseOffset : baseOffset / 3;
        const deeperOffset = offset * 2;

        moveTimeline.fromTo(
          cloneSphere,
          {
            ease: "power2.inOut",
            y: offset,
            opacity: 0,
            duration: 1.6,
          },
          {
            y: offset, // move down
            ease: "power2.inOut",
            opacity: 1,
            duration: 1.6,
          },
          "spheresMove"  
        );
      })
    }

    // Add to master timeline
    masterTimeline.add(spheresMoveTimeline);



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
        start: "top bottom",
        end: "bottom bottom",
        scroller: scrollContainer,
        onEnter: () => setActiveLabelIndex(labelIndex),
        onEnterBack: () => setActiveLabelIndex(labelIndex),
        onLeave: () => setActiveLabelIndex(null),
        onLeaveBack: () => setActiveLabelIndex(null),
      });
    });

  }, [isMobile, isTablet]);

  useEffect(() => {
    const handleResize = () => {
      // Optional: force reset transform or layout if needed
      if (svgRef.current) {
        gsap.set(svgRef.current, {
          x: 0, // or remove/clear transform if applied
          xPercent: -50, // reapply horizontal centering
        });
      }

      ScrollTrigger.refresh(); // Recalculate scroll positions
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);




  return (
    <div ref={wrapperRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-0"
      id="masterAnimationWrapper"
    >
      {/* Exact SVG from step3.svg */}
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 294 294"
        fill="none"
        className="absolute left-1/2 -translate-x-1/2 max-w-screen w-[31rem] md:w-[31rem] lg:w-[42rem] aspect-square"
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

      <div ref={smallSpheresRef} className="absolute w-10/12 md:w-11/12 lg:w-6/12 h-fit flex flex-row items-center justify-center gap-2 md:gap-8 lg:gap-4 pointer-events-none opacity-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="64 64 166 166"
          fill="none"
          className="smallSphere absolute left-1/2 top-1/2 -translate-x-1/2 w-[22%] md:w-[20%] lg:w-[9.5rem] aspect-square opacity-70"
        >
          <g>
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
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="64 64 166 166"
          fill="none"
          className="smallSphere absolute left-1/2 top-1/2 -translate-x-1/2 w-[22%] md:w-[20%] lg:w-[9.5rem] aspect-square opacity-85"
        >
          <g>
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
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="64 64 166 166"
          fill="none"
          className="smallSphere absolute left-1/2  top-1/2 -translate-x-1/2 w-[22%] md:w-[20%] lg:w-[9.5rem] aspect-square opacity-100"
        >
          <g>
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
          </defs>
        </svg>
      </div>

      <div
        ref={labelsRef}
        className="absolute left-1/2 lg:left-2 lg:top-1/2 bottom-[1vh] 
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
