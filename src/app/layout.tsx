import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderThemeProvider } from "@/contexts/HeaderThemeContext";
import { AudioProvider } from "@/contexts/AudioContext";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIM — Sports Training App",
  description:
    "Track your progress, analyse performance, and achieve your athletic goals.",
};

// Root layout shell for global styles and motion wrappers.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}
      >
        <AudioProvider>
          <SmoothScroll>
            <PageTransition>
              <HeaderThemeProvider>{children}</HeaderThemeProvider>
            </PageTransition>
          </SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
