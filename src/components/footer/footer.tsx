"use client";

import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight, GoX } from "react-icons/go";
import Link from "next/link";
import ContactForm from "@/components/generic/contactForm";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Footer = () => {
    const footerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
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

    const handleContactClick = () => {
        window.location.href = "/contact"; // This forces a full page reload
    };

    return (
        <>
            <div
                id="footer-section"
                ref={footerRef}
                className="box-border w-full h-[100dvh] min-h-[100dvh] flex flex-col will-change-transform justify-center items-center text-white tracking-[-0.04em] leading-tight px-4 md:px-8 lg:px-12 overflow-hidden touch-pan-down"
            >
                <div className="w-full h-11/12 flex flex-col justify-between">
                    <div className="w-full h-fit flex flex-row justify-between" ref={textRef}>
                        <p className="w-full lg:text-6xl text-5xl text-left leading-tight">
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
                        <Logo className="w-48 h-0 lg:h-10 mt-0 lg:mt-4 hidden lg:block" />
                    </div>

                    <div className="w-full h-fit flex lg:flex-row flex-col-reverse lg:items-baseline-last justify-between tracking-wider text-sm relative gap-8 lg:gap-0">
                        <div className="flex flex-col w-full lg:w-1/3 gap-1 lg:gap-2 order-3 md:order-1 footer-contact">
                            <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Contact</p>
                            <Link href="https://mail.google.com/mail/?view=cm&to=info@morningside.ai&su=Morningside%20AI%20Contact%20Request&body=Hi%0A%0AI%20am%20reaching%20out%20from%20the%20Morningside%20AI%20website" target="_blank" className="w-full cursor-pointer decoration-0">
                                <p className="whitespace-pre-wrap text-white cursor-pointer hover:text-white/80 my-2">info@morningside.ai</p>
                            </Link>
                            <div className="flex flex-row gap-2 relative z-10">
                                <button onClick={toggleDrawer} className="flex cursor-pointer items-center gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-[#EDECE4] hover:text-black whitespace-nowrap">
                                    Get In Touch
                                    <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 transition-all duration-300" />
                                </button>
                                <Link href="https://tally.so/r/wbYr52" target="_blank" className="w-full cursor-pointer">
                                    <button className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-[#EDECE4] hover:text-black whitespace-nowrap">
                                        Explore Careers
                                        <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 transition-all duration-300" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 flex flex-col lg:flex-row items-start lg:items-end lg:justify-center gap-2 lg:gap-4 order-3 lg:order-1">
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

                        <div className="w-full lg:w-1/3 flex flex-col justify-end lg:items-end gap-2 lg:gap-4 order-3 md:order-1 text-left footer-follow">
                            <p className="whitespace-pre-wrap text-[#D9D9D9] uppercase">Follow</p>
                            <Link href="https://www.linkedin.com/company/morningside-ai/posts/?feedView=all" target="_blank" className="w-fit cursor-pointer hover:opacity-80">
                                <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase hover:text-white/70">Linkedin</p>
                            </Link>
                            <Link href="https://www.youtube.com/@LiamOttley" target="_blank" className="w-fit cursor-pointer hover:opacity-80">
                                <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase hover:text-white/70">Youtube</p>
                            </Link>
                        </div>
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
                className="fixed right-0 md:right-0 top-5 md:top-[2.5vh] h-[85vh] md:h-[95vh] w-full md:w-[40vw] bg-[#EDECE4] text-black transform translate-x-full shadow-2xl z-50 rounded-xl overflow-hidden"
            >
                {/* Drawer Header */}
                <div className="flex flex-col p-6">
                    <div className="flex flex-row justify-end">
                        <button
                            onClick={toggleDrawer}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <GoX size={24} className="text-gray-600" />
                        </button>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-medium text-left">
                        {!success ? 'Get In Touch' : 'Thank you'}
                    </h2>
                </div>

                {/* Scrollable Content Area */}
                <div className="h-[calc(100%-56px)] overflow-y-auto p-4 md:p-6">
                    <div className="space-y-4 msaiDrawer">
                        {!success ? (
                            <>
                                <ContactForm setSuccess={setSuccess} />
                                <div className="h-[50px] w-full"></div>
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

export default Footer;