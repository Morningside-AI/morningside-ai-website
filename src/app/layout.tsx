import PreloaderWrapper from "@/components/generic/preloaderWrapper";
import AnimatedMeshBackground from "@/components/generic/AnimatedMeshBackground";
import "@/styles/globals.css";
import { type Metadata } from "next";
import { DM_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Morningside AI",
  description: "Morningside AI",
  icons: [
    { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon-96x96.png" },
    { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
    { rel: "shortcut icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
  ],
  manifest: "/site.webmanifest",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <body className="bg-black relative">
        <AnimatedMeshBackground />
        <PreloaderWrapper>{children}</PreloaderWrapper>
      </body>
    </html>
  );
}
