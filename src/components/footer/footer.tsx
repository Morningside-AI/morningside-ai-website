"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Footer = () => {
    const footerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
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
            if (!scrollLocked && !isDrawerOpen) {
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
            scrollCooldown = true;
            hasSnapped = true;
            accumulated = 0;

            gsap.to(window, {
                scrollTo: targetId,
                duration: 0.2,
                ease: "linear",
                overwrite: "auto",
                onComplete: () => {
                    enableScroll();
                    setTimeout(() => {
                        scrollCooldown = false;
                    }, 100);
                },
            });
        };

        const handleIntent = (delta: number) => {
            if (!isInView() || hasSnapped) return;
            accumulated += delta;

            if (accumulated <= -threshold) {
                disableScroll();
                scrollToSection("#partnership-section");
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (!isDrawerOpen) {
                e.preventDefault();
                handleIntent(e.deltaY);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
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

        let isSwiping = false;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (touch) {
                isSwiping = false;
                touchStartY.current = touch.clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (!touch) return;

            const deltaY = touchStartY.current - touch.clientY;

            // ✅ Only lock scroll if the user is swiping significantly
            if (!isSwiping && Math.abs(deltaY) > 10) {
                isSwiping = true;
                //disableScroll(); // only now
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
            window.removeEventListener("touchend", handleTouchEnd);
            observer.disconnect();
            enableScroll();
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
                <div className="w-full flex flex-row justify-between">
                    <p className="lg:text-6xl text-5xl text-left hidden lg:block">
                        <span className="white-silver-animated-text">
                            We look forward to helping<br />
                        </span>
                        <span className="green-text">&nbsp;your business</span>
                    </p>
                    <p className="lg:text-6xl text-5xl text-leftblock lg:hidden">
                        <span className="white-silver-animated-text">
                            We look forward to<br />
                        </span>
                        <span className="white-silver-animated-text">
                            helping<br />
                        </span>
                        <span className="green-text">your business</span>
                    </p>
                    <Logo className="w-48 h-10 mt-4 hidden lg:block" />
                </div>

                <div className="w-full flex lg:flex-row flex-col-reverse lg:items-baseline-last justify-between lg:mb-0 mb-16 pb-10 lg:pb-0 tracking-wider text-sm relative">
                    <div className="flex flex-col gap-1 lg:gap-2 order-3 md:order-1 footer-contact">
                        <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Contact</p>
                        <Link href="https://mail.google.com/mail/?view=cm&to=info@morningside.ai&su=Morningside%20AI%20Contact%20Request&body=Hi%0A%0AI%20am%20reaching%20out%20from%20the%20Morningside%20AI%20website" target="_blank" className="w-full cursor-pointer decoration-0">
                            <p className="whitespace-pre-wrap text-white cursor-pointer hover:text-white/80 my-2">info@morningside.ai</p>
                        </Link>
                        <div className="flex flex-row gap-1 relative z-10">
                            <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black whitespace-nowrap">
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
                        <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase">
                            <Link href="/terms-and-conditions" target="_blank" className="w-full cursor-pointer">
                                Terms & Conditions
                            </Link>
                        </p>
                        <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase">
                            <Link href="/privacy-policy" target="_blank" className="w-full cursor-pointer">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>

                    <div className="flex flex-col justify-end gap-2 lg:gap-4 order-3 md:order-1 text-left footer-follow">
                        <p className="whitespace-pre-wrap font-bold text-[#D9D9D9] uppercase">Follow</p>
                        <Link href="https://www.linkedin.com/company/morningside-ai/posts/?feedView=all" target="_blank" className="w-full cursor-pointer">
                            <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase">Linkedin</p>
                        </Link>
                        <Link href="https://www.youtube.com/@LiamOttley" target="_blank" className="w-full cursor-pointer">
                            <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase">Youtube</p>
                        </Link>
                    </div>
                </div>
            </div>
            <Drawer
                open={isDrawerOpen}
                onClose={toggleDrawer}
                direction='right'
                className='msaiDrawer'
            >
                <div className="flex flex-col gap-4 w-[35vw] h-[80vh] bg-[#EDECE4] p-4 rounded-md ">
                    <h2 className="text-5xl font-bold pb-6">Get In Touch</h2>
                    <div className="w-full flex flex-col items-center gap-6 overflow-y-auto">
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">What is your name?</p>
                                <input type="text" placeholder="Name" />
                            </div>
                            <div className="w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">What is your email?</p>
                                <input type="email" placeholder="Email" />
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-md font-bold">What is your role in the company?</p>
                                <input type="text" placeholder="Enter role" />
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Name</p>
                                <input type="text" placeholder="Enter company name" />
                            </div>
                            <div className="w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Website</p>
                                <input type="text" placeholder="Enter company website" />
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Size</p>
                                <select name="company-size" id="company-size">
                                    <option value="1-10">Less than 20</option>
                                    <option value="11-50">20-50</option>
                                    <option value="51-100">50-100</option>
                                    <option value="101-500">100-500</option>
                                    <option value="501-1000">More than 500</option>
                                </select>
                            </div>
                            <div className="w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company&apos;s Annual Revenue</p>
                                <select name="company-revenue" id="company-revenue">
                                    <option value="1-10">Less than $100K</option>
                                    <option value="11-50">$100K-$500K</option>
                                    <option value="51-100">$500K-$1M</option>
                                    <option value="101-500">$1M-$2M</option>
                                    <option value="501-1000">More than $2M</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-md font-bold">Project budget</p>
                                <select name="project-budget" id="project-budget">
                                    <option value="1-10">Less than $10K</option>
                                    <option value="11-50">$10K-$50K</option>
                                    <option value="51-100">$50K-$100K</option>
                                    <option value="501-1000">More than $100K</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-md font-bold">What services are you interested in?</p>
                                <select name="project-goals" id="project-goals">
                                    <option value="1-10">Getting clarity and identifying AI opportunities</option>
                                    <option value="11-50">Educating your team on AI</option>
                                    <option value="51-100">Developing custom AI solutions</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-md font-bold">Message</p>
                                <textarea rows={5} name="message" id="message" placeholder="Enter message" />
                            </div> 
                        </div>
                    </div>
                    <button className="w-full text-white py-2 px-4 rounded-full bg-[#67AC88] hover:bg-[#67AC88]/80 transition-all duration-300" >Send</button>
                </div>
            </Drawer>
        </>
    );
};

export default Footer;
