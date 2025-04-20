"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin, } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const Footer = () => {
    const footerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    useEffect(() => {
        const threshold = 20;
        let accumulated = 0;
        let hasSnapped = false;
        let scrollLocked = false;
        let scrollCooldown = false;

        const disableScroll = () => {
            if (!scrollLocked) {
                scrollLocked = true;
                document.body.style.overflow = "hidden";
                document.documentElement.style.overflow = "hidden";
            }
        };

        const enableScroll = () => {
            scrollLocked = false;
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };

        const isInView = () => {
            const el = footerRef.current;
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
                duration: 1.4,
                ease: "power4.out",
                overwrite: "auto",
                onComplete: () => {
                    enableScroll();
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 800); // prevent double triggering
                },
            });
        };

        const handleIntent = (delta: number) => {
            if (!isInView() || hasSnapped) return;

            disableScroll();
            accumulated += delta;

            if (accumulated <= -threshold) {
                scrollToSection("#partnership-section");
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            handleIntent(e.deltaY);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
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

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches.item(0);
            if (touch) {
                touchStartY.current = touch.clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches.item(0);
            if (touch) {
                const deltaY = touchStartY.current - touch.clientY;
                handleIntent(deltaY);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    hasSnapped = false;
                    accumulated = 0;
                }
            },
            { threshold: 0.5 }
        );

        if (footerRef.current) observer.observe(footerRef.current);

        const contactEl = document.querySelector(".footer-contact");
        const followEl = document.querySelector(".footer-follow");

        if (contactEl && followEl && footerRef.current) {
            gsap.set(contactEl, { opacity: 0, y: 60 });
            gsap.set(followEl, { opacity: 0, x: 60 });
          
            const trigger = ScrollTrigger.create({
              trigger: footerRef.current,
              start: "top 70%",
              end: "bottom top",
              toggleActions: "play none none reverse",
              onEnter: animateIn,
              onEnterBack: animateIn,
              onLeaveBack: animateOut,
            });
          
            function animateIn() {
              gsap.to(contactEl, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power4.out",
              });
              gsap.to(followEl, {
                opacity: 1,
                x: 0,
                duration: 1.2,
                ease: "power4.out",
                delay: 0.4,
              });
            }
          
            function animateOut() {
              gsap.to(contactEl, {
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: "power2.inOut",
              });
              gsap.to(followEl, {
                opacity: 0,
                x: 60,
                duration: 0.8,
                ease: "power2.inOut",
              });
            }
          
            ScrollTrigger.refresh();
          
            return () => {
              trigger.kill();
            };
          }

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            observer.disconnect();
            enableScroll();
        };
    }, []);

    return (
        <div
            id="footer-section"
            ref={footerRef}
            className="w-full h-screen flex flex-col will-change-transform justify-between items-center text-white tracking-[-0.04em] leading-[90%] pt-6"
        >
            <div className="w-full flex felx-row justify-between">
                <p className="lg:text-6xl text-5xl text-left">
                    <span className="white-silver-animated-text">
                        We look forward to helping<br />
                    </span>
                    <span className="white-silver-animated-text">&nbsp;your business</span>
                </p>
                <Logo className="w-48 h-10 mt-4" />
            </div>
            <div className="w-full flex md:flex-row flex-col justify-between md:mb-2 mb-16 tracking-wider text-sm">
                <div className="flex flex-col gap-2 order-3 md:order-1 footer-contact">
                    <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Contact</p>
                    <p className="whitespace-pre-wrap text-white cursor-pointer hover:text-white/80 my-2">info@morningside.ai</p>
                    <div className="flex flex-row gap-1">
                        <button className="flex items-center gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
                            Get In Touch
                            <GoArrowUpRight
                                size={18}
                                strokeWidth={1}
                                className="mt-1 transition-all duration-300"
                            />
                        </button>
                        <button className="flex items-center gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
                            Explore Careers
                            <GoArrowUpRight
                                size={18}
                                strokeWidth={1}
                                className="mt-1 transition-all duration-300"
                            />
                        </button>
                    </div>
                </div>
                <div className="flex flex-row items-end gap-2 order-3 md:order-1">
                    <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Terms & Conditions</p>
                    <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Privacy Policy</p>
                </div>
                <div className="flex flex-col justify-end gap-4 order-3 md:order-1 text-left footer-follow">
                    <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Follow</p>
                    <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase">Linkedin</p>
                    <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase">Youtube</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
