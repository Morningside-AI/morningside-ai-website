"use client";

import { useRef, useEffect, useState } from "react";
import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { IoMdClose, IoMdAlert } from "react-icons/io";

const Navbar = () => {
    const navbarLogoRef = useRef<SVGSVGElement>(null);
    const drawerContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.navbarLogoRef = navbarLogoRef;
    }, []);

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
            company_size: formData.company_size.trim().length < 0,
            companys_revenue: formData.companys_revenue.trim().length < 0,
            project_budget: formData.project_budget.trim().length < 0,
            services_needed: formData.services_needed.trim().length < 0,
            message: formData.message.trim().length < 0,
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
            await fetch(`/api/sendFormData`, {
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

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

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


    return (
        <>
            <div className="w-full h-fit flex flex-row justify-between items-center pt-4 absolute z-10 top-0 left-0 lg:px-12 md:px-8 px-4">
                <Logo className="w-36 h-6" ref={navbarLogoRef} />
                <div className="flex items-center">
                    <button onClick={toggleDrawer} className="flex items-center gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
                        Get In Touch
                        <GoArrowUpRight
                            size={18}
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

export default Navbar;
