"use client";

import { useRef, useEffect } from "react";
import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";

const Navbar = () => {
    const navbarLogoRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        window.navbarLogoRef = navbarLogoRef;
    }, []);


    return (
        <>
            <div className="w-full h-fit flex flex-row justify-between items-center pt-4 absolute z-10 top-0 left-0 lg:px-12 md:px-8 px-4">
                <Logo className="w-36 h-6" ref={navbarLogoRef} />
                <div className="flex items-center">
                    <Link href="/contact" target="_blank" className="w-fit cursor-pointer">
                        <button className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
                            Get In Touch
                            <GoArrowUpRight
                                size={18}
                                strokeWidth={1}
                                className="mt-1 transition-all duration-300"
                            />
                        </button>
                    </Link>

                </div>
            </div>
        </>
    );
};

export default Navbar;
