"use client";
import { useState } from "react";
import Navbar from "@/components/navbar/navbar";
import ContactForm from "@/components/generic/contactForm";
import ContactFooter2 from "@/components/footer/contactFooter2";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


export default function HomePage() {
    const [success, setSuccess] = useState(false);
    return (
        <main className="flex min-h-screen w-full flex-col items-center lg:px-12 md:px-8 px-0 relative main-container">
            <Navbar />
            <div className="w-11/12 lg:w-7/12 flex flex-col items-start justify-start bg-[#EDECE4] pl-3 pr-10 py-4 lg:p-4 rounded-2xl mt-32 mb-10 msaiDrawer">
                <div className="w-full flex flex-row">
                    <h2 className="text-4xl font-medium text-left pb-10">Get In Touch</h2>
                </div>
                <ContactForm setSuccess={setSuccess} />
            </div>
            <ContactFooter2 />
        </main>
    );
}
