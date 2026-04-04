import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollControls from "@/components/ScrollControls";
import { APP_NAME } from "@/utils/constants";

const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":true;var r=document.documentElement;if(d)r.classList.add("dark");else r.classList.remove("dark");}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Production-ready Blog Content Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 overflow-x-hidden">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-10 lg:px-12">{children}</main>
        <Footer />
        <ScrollControls />
      </body>
    </html>
  );
}
