"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/navbar";
import ContactForm from "@/components/generic/contactForm";
import ContactFooter2 from "@/components/footer/contactFooter2";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function ContactPage() {
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Unlock scroll when Contact page mounts
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.style.touchAction = "";
        document.documentElement.style.touchAction = "";
    }, []);

    const handleBackClick = () => {
        window.location.href = "/"; // This forces a full page reload
    };

    return (
        <main className="flex min-h-screen w-full flex-col items-center lg:px-12 md:px-8 px-0 relative">
            <Navbar isConctactPage />

            {success ? (
                // Success message
                <div className="w-11/12 lg:w-7/12 h-[50vh] flex flex-col items-center justify-center bg-[#EDECE4] rounded-2xl mt-32 mb-10 msaiDrawer">
                    <div className="w-full h-full flex flex-col items-center justify-center mt-auto gap-2">
                        <p className="text-green-500 text-lg text-center w-11/12">Thank you for your message! We will get back to you soon.</p>
                        <Link href="/" onClick={(e)=>{e.preventDefault(); handleBackClick()}} className="w-full cursor-pointer flex flex-row items-center justify-center gap-1.5 hover:opacity-75 transition-all duration-300">
                            <p className="text-md font-medium">Back to Home</p>
                            <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 rotate-45 duration-300" />
                        </Link>
                    </div>
                </div>
            ) : (
                // Contact form
                <div className="w-11/12 lg:w-7/12 flex flex-col items-start justify-start bg-[#EDECE4] pl-3 pr-10 py-4 lg:p-4 rounded-2xl mt-32 mb-10 msaiDrawer">
                    <div className="w-full flex flex-row">
                        <h2 className="text-4xl font-medium text-left pb-10">Get In Touch</h2>
                    </div>
                    <ContactForm setSuccess={setSuccess} />
                </div>
            )}

            <ContactFooter2 />
        </main>
    );
}
