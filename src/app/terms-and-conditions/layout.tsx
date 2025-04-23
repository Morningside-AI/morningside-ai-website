import "@/styles/globals.css";
import "@/styles/fonts.css";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Morningside AI - Terms and Conditions",
  description: "Morningside AI - Terms and Conditions",
  icons: [
    { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon-96x96.png" },
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
      <body className="bg-black relative" style={{ fontFamily: "DM-Sans" }}>
        {children}
      </body>
    </html>
  );
}
