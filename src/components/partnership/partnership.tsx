"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { FiArrowUpRight } from "react-icons/fi";
import PartnershipMarquee from "./partnersMarquee";
import { GoArrowUpRight, GoX } from "react-icons/go";
import Link from "next/link";
import ContactForm from "@/components/generic/contactForm";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Partnership = () => {
  const centerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleDrawer = useCallback(() => {
    const tl = gsap.timeline();

    if (!isDrawerOpen) {
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
        onStart: () => {
          if (overlayRef.current) overlayRef.current.style.pointerEvents = 'auto';
        }
      })
        .to(drawerRef.current, {
          x: 0,
          duration: 0.4,
          ease: "power3.out"
        }, 0);
    } else {
      tl.to(drawerRef.current, {
        x: "103%",
        duration: 0.4,
        ease: "power3.in"
      })
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none';
            // Reset success state only if it was true
            setSuccess(prevSuccess => {
              if (prevSuccess) {
                return false;
              }
              return prevSuccess;
            });
          }
        }, 0);
    }

    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <>
      <div
        id="partnership-section"
        ref={centerRef}
        className="box-border w-full h-[100dvh] min-h-[100dvh] flex flex-col snap-always snap-center will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] gap-8 px-4 md:px-8 lg:px-12 relative"
      >
        <div className="absolute top-0 left-0 w-full z-10 pt-8 flex flex-col items-center justify-center">
          <PartnershipMarquee />
        </div>

        <div className="relative w-full mt-8 ">
          <p
            ref={headingRef}
            className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap w-full "
          >
            <span className="white-silver-animated-text">
              <span className="">T</span>
              <span className="">h</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="white-silver-animated-text1">
              <span className="">b</span>
              <span className="">e</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="white-silver-animated-text2">
              <span className="">A</span>
              <span className="">I</span>
              <span className=""> </span>
            </span>
            <br className="block md:hidden" />
            <span className="white-silver-animated-text ">
              <span className="">s</span>
              <span className="">y</span>
              <span className="">s</span>
              <span className="">t</span>
              <span className="">e</span>
              <span className="">m</span>
              <span className="">s</span>
              <span className=""> </span>
            </span>
            <br className="hidden lg:block" />
            <span className="white-silver-animated-text1">
              <span className="">a</span>
              <span className="">r</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="white-silver-animated-text2">
              <span className="">b</span>
              <span className="">u</span>
              <span className="">i</span>
              <span className="">l</span>
              <span className="">t</span>
              <span className=""> </span>
            </span>
            <span className="green-text">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className=""> </span>
            </span>
            <span className="green-text ">
              <span className="">b</span>
              <span className="">y</span>
              <span className=""> </span>
            </span>
            <span className="green-text ">
              <span className="">s</span>
              <span className="">i</span>
              <span className="">d</span>
              <span className="">e</span>
              <span className="">.</span>
            </span>
          </p>
        </div>

        <div
          ref={buttonRef}
          className="w-full flex flex-row items-center justify-center"
        >
          <div onClick={toggleDrawer} className="flex cursor-pointer items-center gap-1 px-5 py-2 lg:px-8 lg:py-4 border-2 border-white rounded-full text-white bg-transparent hover:bg-[#EDECE4] hover:text-black transition-all duration-300">
            <p className="text-3xl lg:text-4xl">Let&apos;s Partner Up</p>
            <FiArrowUpRight
              size={34}
              strokeWidth={2}
              className="mt-1 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 pointer-events-none z-40 transition-opacity"
        onClick={toggleDrawer}
      />

      {/* Drawer Component */}
      <div
        ref={drawerRef}
        className="fixed right-0 md:right-0 top-5 md:top-[2.5vh] h-[85vh] md:h-[95vh] w-full md:w-[99vw] lg:w-[40vw] bg-[#EDECE4] text-black transform translate-x-full shadow-2xl z-50 rounded-xl overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="flex flex-col px-4 md:px-6 py-6">
          <div className="flex flex-row justify-end">
            <button
              onClick={toggleDrawer}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <GoX size={24} className="text-gray-600" />
            </button>
          </div>
          <h2 className="text-3xl md:text-4xl font-medium pt-2 text-left">
            {!success ? 'Get In Touch' : 'Thank you'}
          </h2>
        </div>

        {/* Scrollable Content Area */}
        <div className="h-[calc(100%-56px)] overflow-y-auto px-4 py-1 md:px-6 md:py-2">
          <div className="space-y-4 msaiDrawer">
            {!success ? (
              <>
                <ContactForm setSuccess={setSuccess} />
                <div className="h-[80px] w-full"></div>
              </>
            ) : (
              <div className="flex flex-col">
                <p className="w-full md:w-9/12 text-base md:text-inherit">
                  Thank you for sending your inquiry, our sales team will get in touch
                  with you within a couple of days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Partnership;
