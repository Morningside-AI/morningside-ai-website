import PreloaderWrapper from "@/components/generic/preloaderWrapper";
import AnimatedMeshBackground from "@/components/generic/AnimatedMeshBackground";
import "@/styles/globals.css";
import "@/styles/fonts.css";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Morningside AI",
  description: "Morningside AI",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "/favicon-96x96.png",
    },
    { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
    { rel: "shortcut icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
  ],
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="relative bg-black" style={{ fontFamily: "DM-Sans" }}>
        <Analytics />
        <AnimatedMeshBackground />
        {children}
      </body>
    </html>
  );
}
