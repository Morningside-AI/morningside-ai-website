"use client";
import { useState } from "react";
import Navbar from "@/components/navbar/navbar";
import ContactForm from "@/components/generic/contactForm";
import ContactFooter2 from "@/components/footer/contactFooter2";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

export default function HomePage() {
    const [success, setSuccess] = useState(false);
    return (
        <main className="flex min-h-screen w-full flex-col items-center lg:px-12 md:px-8 px-4 relative main-container">
            <Navbar />
            <div className="w-full flex flex-col-reverse lg:flex-row gap-4 lg:gap-2 lg:h-[80vh] mt-32 overflow-clip rounded-[10px]">
                <div className="h-full w-full lg:w-1/2 flex flex-col gap-3 lg:px-4 tracking-[-0.04em] leading-[90%]">
                    <p className="lg:text-6xl text-5xl text-left leading-normal">
                        <span className="white-silver-animated-text">We&nbsp;</span>
                        <span className="white-silver-animated-text">look&nbsp;</span>
                        <span className="white-silver-animated-text">forward&nbsp;</span>
                        <br className="block lg:hidden" />
                        <span className="white-silver-animated-text">to&nbsp;</span>
                        <span className="white-silver-animated-text">helping&nbsp;</span>
                        <br />
                        <span className="green-text">your&nbsp;</span>
                        <span className="green-text">business</span>
                    </p>
                    <p className="text-xl lg:text-2xl pr-2 text-[#C0C0C0]">
                    At Morningside AI, we transform AI potential into measurable business outcomes through strategic consultation and custom solution development. Our experts work directly with your team to identify high-impact automation opportunities, implement intelligent systems, and create frameworks that drive growth while aligning with your operational needs. From workflow optimization to data-driven decision support, we focus on practical implementations that deliver ROI and position your organization at the forefront of enterprise AI innovation.
                    </p>
                </div>
                <div className={`w-full lg:w-1/2 h-[75vh] lg:h-full flex flex-col bg-[#EDECE4] px-4 msaiDrawer overflow-y-auto ${!success ? "lg:pt-72 pt-8" : "lg:pt-0 pt-0"}`}>
                    {
                        !success ? (
                            <div className="w-full flex flex-row lg:mt-20">
                                <h2 className="text-4xl font-medium text-left pt-4 lg:pt-0 pb-10">Get In Touch</h2>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center mt-auto gap-2">
                                <p className="text-green-500 text-lg">Thank you for your message! We will get back to you soon.</p>
                                <Link href="/" className="w-full cursor-pointer flex flex-row items-center justify-center gap-1.5 hover:opacity-75 transition-all duration-300">
                                    <p className="text-md font-medium">Back to Home</p>
                                    <GoArrowUpRight size={18} strokeWidth={1} className="mt-1 rotate-45 duration-300" />
                                </Link>
                            </div>
                        )
                    }
                    <div className="w-full pr-4 lg:pr-0 flex flex-col flex-1">
                        {
                            !success && (
                                <ContactForm setSuccess={setSuccess} />
                            )
                        }
                        <div className="w-full h-2 mt-auto"></div>
                    </div>
                </div>
            </div>

            <ContactFooter2 />
        </main>
    );
}