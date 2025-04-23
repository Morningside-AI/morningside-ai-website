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

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Footer = () => {
    const mtd = new MagicTrackpadDetector();
    const footerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const drawerContentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        company_name: "",
        company_website: "",
        company_size: "",
        companys_revenue: "",
        project_budget: "",
        services_needed: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors: string[] = [];

        if (formData.name.trim().length < 2) errors.push("Name must be at least 2 characters.");
        if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push("Invalid email address.");
        if (formData.role.trim().length < 2) errors.push("Role must be at least 2 characters.");
        if (formData.company_name.trim().length < 2) errors.push("Company name must be at least 2 characters.");
        if (formData.company_website.trim().length < 2) errors.push("Company website must be at least 2 characters.");
        if (formData.company_size.trim().length < 2) errors.push("Company size must be selected.");
        if (formData.companys_revenue.trim().length < 2) errors.push("Company revenue must be selected.");
        if (formData.project_budget.trim().length < 2) errors.push("Project budget must be selected.");
        if (formData.services_needed.trim().length < 2) errors.push("Services needed must be selected.");
        if (formData.message.trim().length < 2) errors.push("Message must be at least 2 characters.");

        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();

        if (errors.length > 0) {
            console.log(errors.join("\n"));
            return;
        }

        try {
            await fetch("https://hook.eu2.make.com/7k7oe359aq8op254a1o6elozana7565d", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log("Form submitted successfully!");
        } catch (err) {
            console.error(err);
            console.log("Submission failed.");
        }
    };





    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleWheel = (e: WheelEvent) => {
        if (isDrawerOpen && drawerContentRef.current) {
            // Prevent page scroll when hovering over drawer
            e.preventDefault();
            // Manually scroll the drawer content
            drawerContentRef.current.scrollTop += e.deltaY;
        }
    };

    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("wheel", handleWheel, { passive: false });
        } else {
            document.body.style.overflow = "";
            window.removeEventListener("wheel", handleWheel);
        }

        return () => {
            window.removeEventListener("wheel", handleWheel);
            document.body.style.overflow = "";
        };
    }, [isDrawerOpen]);

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

            if (accumulated <= -threshold) {
                disableScroll();
                scrollToSection("#partnership-section");
            }
        };

        const handleWheel = (e: WheelEvent) => {
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
            if (e.key === " ") {
                disableScroll();
                handleIntent(60);
            }
        }

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



        // Replace the text animation code with this
        if (textEl) {
            const words = textEl.querySelectorAll("span");

            // Reset all animations first
            gsap.killTweensOf(words);

            // Set initial state
            gsap.set(words, {
                opacity: 0,
                y: 100,
                rotateX: 100,
                transformOrigin: "bottom center",
                overwrite: "auto"
            });

            // Create scroll trigger
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

            // Refresh ScrollTrigger after setup
            ScrollTrigger.refresh();
        }

        // Add these outside the useEffect
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

    return (
        <>
            <div
                id="footer-section"
                ref={footerRef}
                style={{ touchAction: "auto", pointerEvents: "auto" }}
                className="w-full h-screen flex flex-col will-change-transform justify-between items-center text-white tracking-[-0.04em] leading-[90%] pt-6 overflow-hidden"
            >
                <div className="w-full flex flex-row justify-between" ref={textRef}>
                    <p className="lg:text-6xl text-5xl text-left">
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
                        <Link href="https://www.linkedin.com/company/morningside-ai/posts/?feedView=all" target="_blank" className="w-fit cursor-pointer">
                            <p className="whitespace-pre-wrap font-medium text-[#D9D9D9] uppercase">Linkedin</p>
                        </Link>
                        <Link href="https://www.youtube.com/@LiamOttley" target="_blank" className="w-fit cursor-pointer">
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
                lockBackgroundScroll
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
                        <h2 className="text-5xl font-bold pb-6">Get In Touch</h2>
                        <button onClick={toggleDrawer} className="p-3 cursor-pointer">
                            <IoMdClose size={28} />
                        </button>
                    </div>
                    <div
                        className="w-full flex flex-col items-center gap-6 overflow-y-auto pe-4"
                        ref={drawerContentRef}
                        onTouchStart={(e) => e.stopPropagation()} // Add touch handlers
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">What is your name?</p>
                                <input type="text" placeholder="name" id="name" name="name" onChange={handleChange} value={formData.name} />
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">What is your email?</p>
                                <input type="email" placeholder="Email" name="email" id="email" onChange={handleChange} value={formData.email} />
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-md font-bold">What is your role in the company?</p>
                                <input type="text" placeholder="Enter role" name="role" id="role" onChange={handleChange} value={formData.role} />
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Name</p>
                                <input type="text" placeholder="Enter company name" name="company_name" id="company_name" onChange={handleChange} value={formData.company_name} />
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Website</p>
                                <input type="text" placeholder="Enter company website" name="company_website" id="company_website" onChange={handleChange} value={formData.company_website} />
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Size</p>
                                <select name="company_size" id="company_size" onChange={handleChange} value={formData.company_size}>
                                    <option value="1-10">Less than 20</option>
                                    <option value="11-50">20-50</option>
                                    <option value="51-100">50-100</option>
                                    <option value="101-500">100-500</option>
                                    <option value="501-1000">More than 500</option>
                                </select>
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company&apos;s Annual Revenue</p>
                                <select name="companys_revenue" id="companys_revenue" onChange={handleChange} value={formData.companys_revenue}>
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
                                <select name="project_budget" id="project_budget" onChange={handleChange} value={formData.project_budget}>
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
                                <select name="services_needed" id="services_needed" onChange={handleChange} value={formData.services_needed}>
                                    <option value="1-10">Getting clarity and identifying AI opportunities</option>
                                    <option value="11-50">Educating your team on AI</option>
                                    <option value="51-100">Developing custom AI solutions</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-md font-bold">Message</p>
                                <textarea rows={5} name="message" id="message" placeholder="Enter message" onChange={handleChange} value={formData.message} />
                            </div>
                        </div>
                    </div>
                    <button className="w-full text-white py-2 px-4 rounded-full bg-[#67AC88] hover:bg-[#67AC88]/80" onClick={handleSubmit} >Send</button>
                </div>
            </Drawer>
        </>
    );
};

export default Footer;
