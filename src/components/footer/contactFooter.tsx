"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ContactFooter = () => {
   const footerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
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
    }, []);

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
                            <button className="flex cursor-pointer items-center gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black whitespace-nowrap">
                                Get In Touch
                                <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 transition-all duration-300" />
                            </button>
                            <Link href="https://bit.ly/mai-website" target="_blank" className="w-full cursor-pointer">
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
        </>
    );
};

export default ContactFooter;