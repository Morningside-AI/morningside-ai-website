"use client";

import { useRef, useEffect } from "react";
import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";

interface NavbarProps {
  isConctactPage?: boolean;
}

const Navbar = ({ isConctactPage = false }: NavbarProps) => {
  const navbarLogoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    window.navbarLogoRef = navbarLogoRef;
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/"; // Forces full reload
  };

  const handleContactClick = () => {
    window.location.href = "/contact";
  };

  return (
    <div className="absolute top-0 left-0 w-full z-10 pt-4">
      <div className="w-full max-w-screen-xl px-4 md:px-8 lg:px-12 mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="w-fit cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleLogoClick();
          }}
        >
          <Logo className="w-36 h-6" ref={navbarLogoRef} />
        </Link>

        {!isConctactPage && (
          <div className="flex items-center">
            <button
              onClick={handleContactClick}
              className="flex items-center cursor-pointer gap-1 px-4 py-2 border border-white rounded-full text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300"
            >
              Get In Touch
              <GoArrowUpRight
                size={18}
                strokeWidth={1}
                className="mt-1 transition-all duration-300"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
