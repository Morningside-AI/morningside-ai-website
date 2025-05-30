"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight, GoX } from "react-icons/go";
import Link from "next/link";
import ContactForm from "../generic/contactForm";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface NavbarProps {
  isConctactPage?: boolean;
}

const Navbar = ({ isConctactPage = false }: NavbarProps) => {
  const navbarLogoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    window.navbarLogoRef = navbarLogoRef;
  }, []);

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

  const handleLogoClick = () => {
    window.location.href = "/"; // Forces full reload
  };

  const handleContactClick = () => {
    window.location.href = "/contact";
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full z-10 pt-4">
        <div className="w-full px-4 md:px-8 lg:px-12 mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="w-fit cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleLogoClick();
            }}
          >
            <Logo className="w-36 h-6" ref={navbarLogoRef} />
          </Link>

          {!isConctactPage && (
            <div className="flex items-center">
              <button
                onClick={toggleDrawer}
                className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-[#EDECE4] hover:text-black transition-all duration-300"
              >
                Get In Touch
                <GoArrowUpRight
                  size={18}
                  strokeWidth={1}
                  className="mt-1 transition-all duration-300"
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[#1C1B1C]/80 backdrop-blur-[2px] opacity-0 pointer-events-none z-40 transition-opacity"
        onClick={toggleDrawer}
      />

      {/* Drawer Component */}
      <div
        ref={drawerRef}
        className="fixed right-0 md:right-0 top-0 md:top-[0vh] h-[95vh] md:h-[100vh] lg:h-[100vh] w-full lg:w-[40vw] px-2 flex flex-row items-center justify-center text-black transform translate-x-full z-50"
      >
        <div className="shadow-2xl rounded-xl w-[96%] md:w-[98%] lg:w-full h-[90%] bg-[#EDECE4] overflow-hidden">
          {/* Drawer Header */}
          <div className="flex flex-col px-4 md:px-6 py-2">
            <div className="flex flex-row justify-end">
              <button
                onClick={toggleDrawer}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <GoX size={24} className="text-gray-600" />
              </button>
            </div>
            <h2 className="text-3xl md:text-4xl font-medium pt-0 pb-[1.75rem] text-left">
              {!success ? "Tell us where you’re at" : 'We’ve got it. The next move is ours.'}
            </h2>
          </div>

          {/* Scrollable Content Area */}
          <div className="h-[calc(100%-56px)] overflow-y-auto px-4 py-1 md:px-6 md:py-2">
            <div className="space-y-4 msaiDrawer">
              {!success ? (
                <>
                  <ContactForm setSuccess={setSuccess} />
                  <div className="h-[100px] w-full"></div>
                </>
              ) : (
                <div className="flex flex-col">
                  <p className="w-full md:w-11/12 text-base">
                    We&apos;re aligning the right experts on our end and will get back to you within a couple of days to explore how we can move forward together.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
