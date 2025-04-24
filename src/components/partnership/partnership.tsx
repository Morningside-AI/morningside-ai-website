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

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Partnership = () => {
  const mtd = new MagicTrackpadDetector();
  const centerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const drawerContentRef = useRef<HTMLDivElement>(null);

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

const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    role: false,
    company_name: false,
    company_website: false,
    company_size: false,
    companys_revenue: false,
    project_budget: false,
    services_needed: false,
    message: false,
});

const [success, setSuccess] = useState<boolean>(false)

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
    // Clear error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
        setFieldErrors(prev => ({
            ...prev,
            [name]: false
        }));
    }
};

const validateForm = () => {
    const errors = {
        name: formData.name.trim().length < 2,
        email: !/\S+@\S+\.\S+/.test(formData.email),
        role: formData.role.trim().length < 2,
        company_name: formData.company_name.trim().length < 2,
        company_website: formData.company_website.trim().length < 2,
        company_size: formData.company_size.trim().length < 2,
        companys_revenue: formData.companys_revenue.trim().length < 2,
        project_budget: formData.project_budget.trim().length < 2,
        services_needed: formData.services_needed.trim().length < 2,
        message: formData.message.trim().length < 2,
    };

    setFieldErrors(errors);
    return Object.values(errors).some(error => error);
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors = validateForm();

    if (hasErrors) {
        return;
    }

    try {
        await fetch("https://api.backendless.com/21B586A5-D90D-40E9-B17C-B637D2E49D0A/DA2469F6-EBCE-40E1-8F07-D2B357ADB1BB/data/morningside", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        console.log("Form submitted successfully!");
        setSuccess(true);
        // Reset form after successful submission
        setFormData({
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
    } catch (err) {
        console.error(err);
        console.log("Submission failed.");
    }
};

const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleWheel = (e: WheelEvent) => {
    if (isDrawerOpen && drawerContentRef.current) {
      // Prevent page scroll when hovering over drawer
      document.body.style.overflow = "hidden";
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
      if (e.key === " ") {
        disableScroll();
        handleIntent(60);
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches.item(0);
      if (touch) {
        touchStartY.current = touch.clientY;
        disableScroll();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
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
          <span className="green-text">side</span>
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
                        <h2 className="text-4xl font-medium pb-6">Get In Touch</h2>
                        <button onClick={toggleDrawer} className="p-3 cursor-pointer hover:opacity-50">
                            <IoMdClose size={28} />
                        </button>
                    </div>
                    <div
                        className="w-full flex flex-col items-center gap-6 overflow-y-auto pe-4"
                        ref={drawerContentRef}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        {
                            success ? (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <p className="green-text font-medium">Message sent succesfully !</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                                    <div className="w-full flex flex-col lg:flex-row gap-2 mb-4">
                                        <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">What is your name?</p>
                                                {fieldErrors.name && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                placeholder="name"
                                                id="name"
                                                name="name"
                                                onChange={handleChange}
                                                value={formData.name}
                                                className={fieldErrors.name ? "border-red-500" : ""}
                                            />
                                        </div>
                                        <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">What is your email?</p>
                                                {fieldErrors.email && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                placeholder="Email"
                                                name="email"
                                                id="email"
                                                onChange={handleChange}
                                                value={formData.email}
                                                className={fieldErrors.email ? "border-red-500" : ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col lg:flex-row gap-2 mb-4">
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">What is your role in the company?</p>
                                                {fieldErrors.role && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter role"
                                                name="role"
                                                id="role"
                                                onChange={handleChange}
                                                value={formData.role}
                                                className={fieldErrors.role ? "border-red-500" : ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col lg:flex-row gap-2 mb-4">
                                        <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">Company Name</p>
                                                {fieldErrors.company_name && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter company name"
                                                name="company_name"
                                                id="company_name"
                                                onChange={handleChange}
                                                value={formData.company_name}
                                                className={fieldErrors.company_name ? "border-red-500" : ""}
                                            />
                                        </div>
                                        <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">Company Website</p>
                                                {fieldErrors.company_website && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter company website"
                                                name="company_website"
                                                id="company_website"
                                                onChange={handleChange}
                                                value={formData.company_website}
                                                className={fieldErrors.company_website ? "border-red-500" : ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col lg:flex-row gap-2 mb-4">
                                        <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">Company Size</p>
                                                {fieldErrors.company_size && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <select
                                                name="company_size"
                                                id="company_size"
                                                onChange={handleChange}
                                                value={formData.company_size}
                                                className={fieldErrors.company_size ? "border-red-500" : ""}
                                            >
                                                <option value="">Select company size</option>
                                                <option value="1-10">Less than 20</option>
                                                <option value="11-50">20-50</option>
                                                <option value="51-100">50-100</option>
                                                <option value="101-500">100-500</option>
                                                <option value="501-1000">More than 500</option>
                                            </select>
                                        </div>
                                        <div className="w-full lg:w-1/2 flex flex-col gap-2 mb-4">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">Company&apos;s Annual Revenue</p>
                                                {fieldErrors.companys_revenue && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <select
                                                name="companys_revenue"
                                                id="companys_revenue"
                                                onChange={handleChange}
                                                value={formData.companys_revenue}
                                                className={fieldErrors.companys_revenue ? "border-red-500" : ""}
                                            >
                                                <option value="">Select revenue range</option>
                                                <option value="1-10">Less than $100K</option>
                                                <option value="11-50">$100K-$500K</option>
                                                <option value="51-100">$500K-$1M</option>
                                                <option value="101-500">$1M-$2M</option>
                                                <option value="501-1000">More than $2M</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col lg:flex-row gap-2 mb-4">
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">Project budget</p>
                                                {fieldErrors.project_budget && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <select
                                                name="project_budget"
                                                id="project_budget"
                                                onChange={handleChange}
                                                value={formData.project_budget}
                                                className={fieldErrors.project_budget ? "border-red-500" : ""}
                                            >
                                                <option value="">Select budget range</option>
                                                <option value="1-10">Less than $10K</option>
                                                <option value="11-50">$10K-$50K</option>
                                                <option value="51-100">$50K-$100K</option>
                                                <option value="501-1000">More than $100K</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col lg:flex-row gap-2 mb-4">
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">What services are you interested in?</p>
                                                {fieldErrors.services_needed && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <select
                                                name="services_needed"
                                                id="services_needed"
                                                onChange={handleChange}
                                                value={formData.services_needed}
                                                className={fieldErrors.services_needed ? "border-red-500" : ""}
                                            >
                                                <option value="">Select service</option>
                                                <option value="1-10">Getting clarity and identifying AI opportunities</option>
                                                <option value="11-50">Educating your team on AI</option>
                                                <option value="51-100">Developing custom AI solutions</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col lg:flex-row gap-2 mb-4">
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-md font-medium">Message</p>
                                                {fieldErrors.message && <IoMdAlert size={14} color="red" />}
                                            </div>
                                            <textarea
                                                required
                                                rows={7}
                                                name="message"
                                                id="message"
                                                placeholder="Enter message"
                                                onChange={handleChange}
                                                value={formData.message}
                                                className={fieldErrors.message ? "border-red-500 resize-none" : "resize-none"}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full text-white cursor-pointer py-2 px-4 rounded-full bg-[#67AC88] hover:bg-[#67AC88]/70">
                                        Send
                                    </button>
                                </form>
                            )
                        }
                    </div>
                </div>
            </Drawer>
    </>
  );
};

export default Partnership;
