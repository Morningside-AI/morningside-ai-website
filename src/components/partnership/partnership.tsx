"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { GoArrowUpRight } from "react-icons/go";
import PartnershipMarquee from "./partnersMarquee";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import { IoMdClose, IoMdAlert } from "react-icons/io";
import ContactForm from "../generic/contactForm";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Partnership = () => {
  const mtd = new MagicTrackpadDetector();
  const centerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const drawerContentRef = useRef<HTMLDivElement>(null);

  const [success, setSuccess] = useState<boolean>(false)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    if (isDrawerOpen) setSuccess(false);
    setIsDrawerOpen(!isDrawerOpen);
};

  useEffect(() => {
    const threshold = 12;
    let accumulated = 0;
    let hasSnapped = false;
    let scrollLocked = false;
    let scrollCooldown = false;

    const preventDefault = (e: TouchEvent) => e.preventDefault();

    const disableScroll = () => {
      if (!scrollLocked) {
        scrollLocked = true;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        document.documentElement.style.touchAction = "none";
        window.addEventListener("touchmove", preventDefault, { passive: false });
      }
    };

    const enableScroll = () => {
      scrollLocked = false;
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.touchAction = "";
      window.removeEventListener("touchmove", preventDefault);
    };

    const isInView = () => {
      const el = centerRef.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.25;
    };

    const scrollToSection = (targetId: string) => {
      if (scrollCooldown) return;
      scrollCooldown = true;
      hasSnapped = true;
      accumulated = 0;

      gsap.to(window, {
        scrollTo: targetId,
        duration: 0.08,
        ease: "linear",
        overwrite: "auto",
        onComplete: () => {
          enableScroll();
          setTimeout(() => {
            scrollCooldown = false;
          }, 6);
        },
      });
    };

    const handleIntent = (delta: number) => {
      if (!isInView() || hasSnapped) return;

      accumulated += delta;

      if (accumulated >= threshold) {
        disableScroll();
        scrollToSection("#footer-section");
      } else if (accumulated <= -threshold) {
        disableScroll();
        scrollToSection("#stats-section");
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isDrawerOpen) return;
      e.preventDefault();

      // Use the MagicTrackpadDetector to check if the event is from a trackpad and is not an inertial scroll
      if (mtd.inertial(e)) {
        // If it's an inertial scroll event, we return early and don't process the scroll
        return;
      }

      const deltaY = e.deltaY;

      // Normalize the delta to handle macOS touchpad sensitivity
      const normalizedDelta = Math.abs(deltaY) < 1 ? deltaY * 30 : deltaY; // Adjust 30 based on your preference for sensitivity

      // Handle the scroll intent (up or down) based on the normalized delta
      handleIntent(normalizedDelta);
    };


    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDrawerOpen) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (isInView()) {
          e.preventDefault();
          disableScroll();
          handleIntent(60);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (isInView()) {
          e.preventDefault();
          disableScroll();
          handleIntent(-60);
        }
      }
    };

    const handleSpaceButton = (e: KeyboardEvent) => {
      if (isDrawerOpen) return;
      if (e.key === " ") {
        disableScroll();
        handleIntent(60);
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (isDrawerOpen) return;
      const touch = e.touches.item(0);
      if (touch) {
        touchStartY.current = touch.clientY;
        disableScroll();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDrawerOpen) return;
      const touch = e.touches.item(0);
      if (touch) {
        handleIntent(touchStartY.current - touch.clientY);
      }
    };


    const handleTouchEnd = () => {
      enableScroll();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleSpaceButton);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          hasSnapped = false;
          accumulated = 0;
        }
      },
      { threshold: 0.5 }
    );

    if (centerRef.current) observer.observe(centerRef.current);

    const textEl = textRef.current;
    const buttonEl = buttonRef.current;

    if (textEl && buttonEl) {
      const words = textEl.querySelectorAll("span");

      gsap.set(words, {
        opacity: 0,
        y: 100,
        rotateX: 100,
        transformOrigin: "bottom center",
      });

      gsap.set(buttonEl, {
        opacity: 0,
        y: 60,
      });

      ScrollTrigger.create({
        trigger: centerRef.current,
        start: "top center",
        end: "bottom top",
        toggleActions: "play none none reverse",
        onEnter: animateIn,
        onEnterBack: animateIn,
        onLeave: animateOut,
        onLeaveBack: animateOut,
      });

      function animateIn() {
        const tl = gsap.timeline();
        tl.to(words, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          ease: "linear",
          duration: 0.5,
          stagger: {
            each: 0.12,
            from: "start",
          },
        }).fromTo(
          words,
          {
            rotateX: 100,
            transformOrigin: "bottom center",
          },
          {
            rotateX: 0,
            duration: 0.5,
            ease: "power4.out",
            stagger: {
              each: 0.12,
              from: "start",
            },
          },
          "<" // run in parallel with opacity/y
        ).to(
          buttonEl,
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
          },
          "+=0.1" // slight delay after word animation
        );
      }


      function animateOut() {
        if (!textEl || !buttonEl) return;

        const spans = textEl.querySelectorAll("span");
        gsap.to([spans, buttonEl], {
          opacity: 0,
          y: 60,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleSpaceButton);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      observer.disconnect();
      enableScroll();
    };
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
        // Lock background scroll (body)
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    } else {
        // Enable background scroll
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    }
}, [isDrawerOpen]);

useEffect(() => {
    const drawerContent = drawerContentRef.current;
    if (!drawerContent) return;

    const stopPropagation = (e: Event) => {
        e.stopPropagation();
    };

    // Prevent drawer scroll events from reaching the window
    drawerContent.addEventListener("wheel", stopPropagation, { passive: false });
    drawerContent.addEventListener("touchmove", stopPropagation, { passive: false });

    return () => {
        drawerContent.removeEventListener("wheel", stopPropagation);
        drawerContent.removeEventListener("touchmove", stopPropagation);
    };
}, [isDrawerOpen]);

  return (
    <>
      <div
        id="partnership-section"
        ref={centerRef}
        className="w-full h-screen flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-[90%] gap-8 relative overflow-hidden touch-none"
      >
        <div className="absolute top-0 left-0 w-full z-10 pt-8 flex flex-col items-center justify-center">
          <PartnershipMarquee />
        </div>

        <p
          className="text-5xl md:text-6xl lg:text-7xl text-center whitespace-pre-wrap"
          ref={textRef}
        >
          <span className="white-silver-animated-text">The </span>
          <span className="white-silver-animated-text">best </span>
          <span className="white-silver-animated-text">AI </span>
          <br className="block lg:hidden" />
          <span className="white-silver-animated-text">systems </span>
          <br className="hidden lg:block" />
          <span className="white-silver-animated-text">are </span>
          <span className="white-silver-animated-text">built </span>
          <span className="green-text">side </span>
          <span className="green-text">by </span>
          <span className="green-text">side.</span>
        </p>

        <div
          ref={buttonRef}
          className="w-full flex flex-row items-center justify-center opacity-0"
        >
          <button onClick={toggleDrawer} className="flex cursor-pointer items-center gap-1 px-4 py-2 lg:px-8 lg:py-4 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
            <p className="text-3xl lg:text-5xl">Let&apos;s Partner Up</p>
            <GoArrowUpRight
              size={32}
              strokeWidth={1}
              className="mt-1 transition-all duration-300"
            />
          </button>
        </div>
      </div>
      <Drawer
                open={isDrawerOpen}
                onClose={toggleDrawer}
                direction='right'
                className='msaiDrawer'
                duration={600}
                overlayOpacity={0.5}
                style={{
                    width: '98vw',
                    maxWidth: '35vw',
                    background: 'transparent',
                    boxShadow: 'none',
                }}
            >
                <div className="flex flex-col gap-4 w-[98vw] lg:w-[35vw] h-[80vh] bg-[#EDECE4] p-4 rounded-md ">
                    <div className="flex flex-row justify-between items-start">
                        <h2 className="text-4xl font-medium pb-6">Get In Touch</h2>
                        <button onClick={toggleDrawer} className="p-3 cursor-pointer hover:opacity-50">
                            <IoMdClose size={28} />
                        </button>
                    </div>
                    <div
                        className="w-full flex flex-col items-center gap-6 overflow-y-auto pe-4"
                        ref={drawerContentRef}
                    >
                        {
                            success ? (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <p className="green-text font-medium">Message sent succesfully !</p>
                                </div>
                            ) : (
                                <ContactForm setSuccess={setSuccess} />
                            )
                        }
                    </div>
                </div>
            </Drawer>
    </>
  );
};

export default Partnership;
