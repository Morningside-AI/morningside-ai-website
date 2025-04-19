"use client";

import Navbar from "@/components/navbar/navbar";
import Hero from "@/components/hero/hero";
import Center from "@/components/center/center";
import TestSection from "@/components/test/testSection";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center lg:px-12 md:px-8 px-4 relative main-container">
      <Navbar />
      <Hero />
      <Center />
      <TestSection />
    </main>
  );
}
