"use client";

import { useRef, useEffect } from "react";
import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";

const Navbar = () => {
    const navbarLogoRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        window.navbarLogoRef = navbarLogoRef;
    }, []);

    return (
        <div className="w-full h-fit flex flex-row justify-between items-center pt-4 absolute top-0 left-0 lg:px-12 md:px-8 px-4">
            <Logo className="w-36 h-6" ref={navbarLogoRef} />
            <div className="flex items-center">
                <button className="flex border-[1.6px] cursor-pointer border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-full">
                    <div className="w-full h-full flex flex-row text-white items-center gap-1 bg-black hover:filter hover:invert-[1] transition-all duration-300 px-2 py-1 rounded-full">
                        Get In Touch
                        <GoArrowUpRight color="white" size={18} strokeWidth={1} className="mt-1" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Navbar;
