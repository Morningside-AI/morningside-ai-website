"use client";

import { useRef, useEffect, useState } from "react";
import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

const Navbar = () => {
    const navbarLogoRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        window.navbarLogoRef = navbarLogoRef;
    }, []);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };


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
            >
                <div className="flex flex-col gap-4 w-[98vw] lg:w-[35vw] h-[80vh] bg-[#EDECE4] p-4 rounded-md ">
                    <h2 className="text-5xl font-bold pb-6">Get In Touch</h2>
                    <div className="w-full flex flex-col items-center gap-6 overflow-y-auto">
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">What is your name?</p>
                                <input type="text" placeholder="Name" />
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
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
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Name</p>
                                <input type="text" placeholder="Enter company name" />
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Website</p>
                                <input type="text" placeholder="Enter company website" />
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-2">
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                <p className="text-md font-bold">Company Size</p>
                                <select name="company-size" id="company-size">
                                    <option value="1-10">Less than 20</option>
                                    <option value="11-50">20-50</option>
                                    <option value="51-100">50-100</option>
                                    <option value="101-500">100-500</option>
                                    <option value="501-1000">More than 500</option>
                                </select>
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-2">
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
                    <button className="w-full text-white py-2 px-4 rounded-full bg-[#67AC88] hover:bg-[#67AC88]/80" >Send</button>
                </div>
            </Drawer>
        </>
    );
};

export default Navbar;
