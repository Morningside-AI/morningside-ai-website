"use client";
import Navbar from "@/components/navbar/navbar";
import ContactForm from "@/components/generic/contactForm";
import ContactFooter2 from "@/components/footer/contactFooter2";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


export default function HomePage() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center lg:px-12 md:px-8 px-4 relative main-container">
            <Navbar />
            <div className="w-11/12 lg:w-7/12 flex flex-col bg-[#EDECE4] p-4 rounded-2xl mt-32 mb-10 msaiDrawer">
                <div className="w-full flex flex-row">
                <h2 className="text-4xl font-medium text-left pb-10">Get In Touch</h2>
                </div>
                <ContactForm />
            </div>
            <ContactFooter2 />
        </main>
    );
}
