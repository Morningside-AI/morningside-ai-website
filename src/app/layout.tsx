import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, DM_Sans, DM_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Morningside AI",
  description: "Morningside AI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
      <body>{children}</body>
    </html>
  );
}
