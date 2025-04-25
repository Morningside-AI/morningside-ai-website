"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { MagicTrackpadDetector } from "@hscmap/magic-trackpad-detector";
import { IoMdClose } from "react-icons/io";
import { div } from "three/tsl";
import ContactForm from "../generic/contactForm";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Footer = () => {
    const mtd = new MagicTrackpadDetector();
    const footerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const drawerContentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

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
            const el = footerRef.current;
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top <= window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.25;
        };

        const scrollToSection = (targetId: string) => {
            if (scrollCooldown) return;
            if (isDrawerOpen) {
                disableScroll();
            }
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
            if (isDrawerOpen) {
                disableScroll();
                return;
            }
            if (!isInView() || hasSnapped) return;
            accumulated += delta;

            if (accumulated <= -threshold && !isDrawerOpen) {
                disableScroll();
                scrollToSection("#partnership-section");
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (isDrawerOpen) return;
            e.preventDefault();

            if (mtd.inertial(e)) {
                return;
            }

            const deltaY = e.deltaY;
            const normalizedDelta = Math.abs(deltaY) < 1 ? deltaY * 30 : deltaY;
            handleIntent(normalizedDelta);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isDrawerOpen) return;
            if (e.key === "ArrowUp" || e.key === "PageUp") {
                if (isInView()) {
                    e.preventDefault();
                    disableScroll();
                    handleIntent(-60);
                }
            } else if (e.key === "ArrowDown" || e.key === "PageDown") {
                if (isInView()) {
                    e.preventDefault();
                    disableScroll();
                    handleIntent(60);
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

        let isSwiping = false;

        const handleTouchStart = (e: TouchEvent) => {
            if (isDrawerOpen) return;
            const touch = e.touches[0];
            if (touch) {
                isSwiping = false;
                touchStartY.current = touch.clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDrawerOpen) return;
            const touch = e.touches[0];
            if (!touch) return;

            const deltaY = touchStartY.current - touch.clientY;

            if (!isSwiping && Math.abs(deltaY) > 10) {
                isSwiping = true;
            }

            if (isSwiping) {
                e.preventDefault();
                handleIntent(deltaY);
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
        if (footerRef.current) observer.observe(footerRef.current);

        const contactEl = document.querySelector(".footer-contact");
        const followEl = document.querySelector(".footer-follow");
        const textEl = textRef.current;

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

        if (textEl) {
            const words = textEl.querySelectorAll("span");

            gsap.killTweensOf(words);
            gsap.set(words, {
                opacity: 0,
                y: 100,
                rotateX: 100,
                transformOrigin: "bottom center",
                overwrite: "auto"
            });

            ScrollTrigger.create({
                id: "footer-text",
                trigger: footerRef.current,
                start: "top 80%",
                end: "bottom top",
                toggleActions: "play none none reverse",
                onEnter: () => animateTextIn(words),
                onEnterBack: () => animateTextIn(words),
                onLeave: () => animateTextOut(words),
                onLeaveBack: () => animateTextOut(words)
            });

            ScrollTrigger.refresh();
        }

        const animateTextIn = (words: NodeListOf<Element>) => {
            const tl = gsap.timeline();
            tl.to(words, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                ease: "power4.out",
                duration: 1.2,
                stagger: {
                    each: 0.15,
                    from: "start"
                }
            });
        };

        const animateTextOut = (words: NodeListOf<Element>) => {
            gsap.to(words, {
                opacity: 0,
                y: 60,
                duration: 0.6,
                ease: "power2.inOut"
            });
        };

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
                id="footer-section"
                ref={footerRef}
                style={{ touchAction: "auto", pointerEvents: "auto" }}
                className="w-full h-screen flex flex-col will-change-transform justify-between items-center text-white tracking-[-0.04em] leading-[90%] pt-6 overflow-hidden"
            >
                <div className="w-full flex flex-row justify-between" ref={textRef}>
                    <p className="lg:text-6xl text-5xl text-left leading-normal">
                        <span className="white-silver-animated-text">We&nbsp;</span>
                        <span className="white-silver-animated-text">look&nbsp;</span>
                        <span className="white-silver-animated-text">forward&nbsp;</span>
                        <br className="block lg:hidden" />
                        <span className="white-silver-animated-text">to&nbsp;</span>
                        <span className="white-silver-animated-text">helping&nbsp;</span>
                        <br />
                        <span className="green-text">your&nbsp;</span>
                        <span className="green-text">business</span>
                    </p>
                    <Logo className="w-48 h-10 mt-4 hidden lg:block" />
                </div>

                <div className="w-full flex lg:flex-row flex-col-reverse lg:items-baseline-last justify-between lg:mb-0 mb-16 pb-10 lg:pb-0 tracking-wider text-sm relative">
                    <div className="flex flex-col gap-1 lg:gap-2 order-3 md:order-1 footer-contact">
                        <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Contact</p>
                        <Link href="https://mail.google.com/mail/?view=cm&to=info@morningside.ai&su=Morningside%20AI%20Contact%20Request&body=Hi%0A%0AI%20am%20reaching%20out%20from%20the%20Morningside%20AI%20website" target="_blank" className="w-full cursor-pointer decoration-0">
                            <p className="whitespace-pre-wrap text-white cursor-pointer hover:text-white/80 my-2">info@morningside.ai</p>
                        </Link>
                        <div className="flex flex-row gap-2 relative z-10">
                            <button onClick={() => setIsDrawerOpen(true)} className="flex cursor-pointer items-center gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black whitespace-nowrap">
                                Get In Touch
                                <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 transition-all duration-300" />
                            </button>
                            <Link href="https://tally.so/r/wbYr52" target="_blank" className="w-full cursor-pointer">
                                <button className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black whitespace-nowrap">
                                    Explore Careers
                                    <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 transition-all duration-300" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full flex flex-col lg:flex-row items-start lg:items-end lg:justify-center gap-2 lg:gap-4 order-3 lg:order-1 my-8">
                        <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase hover:opacity-70">
                            <Link href="/terms-and-conditions" target="_blank" className="w-full cursor-pointer">
                                Terms & Conditions
                            </Link>
                        </p>
                        <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase hover:opacity-70">
                            <Link href="/privacy-policy" target="_blank" className="w-full cursor-pointer ">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>

                    <div className="flex flex-col justify-end gap-2 lg:gap-4 order-3 md:order-1 text-left footer-follow">
                        <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Follow</p>
                        <Link href="https://www.linkedin.com/company/morningside-ai/posts/?feedView=all" target="_blank" className="w-fit cursor-pointer hover:opacity-80">
                            <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase hover:text-white/70">Linkedin</p>
                        </Link>
                        <Link href="https://www.youtube.com/@LiamOttley" target="_blank" className="w-fit cursor-pointer hover:opacity-80">
                            <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase hover:text-white/70">Youtube</p>
                        </Link>
                    </div>
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
                <div className="flex flex-col gap-4 w-[98vw] lg:w-[35vw] h-[80vh] bg-[#EDECE4] p-4 rounded-md overflow-y-auto pe-4" ref={drawerContentRef}>
                    <div className="flex flex-row justify-between items-start">
                        <h2 className="text-4xl font-medium pb-6">Get In Touch</h2>
                        <button onClick={toggleDrawer} className="p-3 cursor-pointer hover:opacity-50">
                            <IoMdClose size={28} />
                        </button>
                    </div>
                    <div
                        className="w-full flex flex-col items-center gap-6">
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

export default Footer;