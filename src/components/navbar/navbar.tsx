"use client";

import { useRef, useEffect, useState } from "react";
import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { IoMdClose } from "react-icons/io";
import ContactForm from "../generic/contactForm";

const Navbar = () => {
    const navbarLogoRef = useRef<SVGSVGElement>(null);
    const drawerContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.navbarLogoRef = navbarLogoRef;
    }, []);

    const [success, setSuccess] = useState<boolean>(false)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        if (isDrawerOpen) setSuccess(false);
        setIsDrawerOpen(!isDrawerOpen);
    };

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
            <div className="w-full h-fit flex flex-row justify-between items-center pt-4 absolute z-10 top-0 left-0 lg:px-12 md:px-8 px-4">
                <Logo className="w-36 h-6" ref={navbarLogoRef} />
                <div className="flex items-center">
                    <button onClick={toggleDrawer} className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
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

export default Navbar;
