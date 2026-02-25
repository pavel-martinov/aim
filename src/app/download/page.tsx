"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DRAMATIC_EASE } from "@/lib/animations";

/**
 * Download page with iOS and Android app store buttons.
 */
export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black" data-header-theme="dark">
      <Header />

      {/* Hero section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: DRAMATIC_EASE }}
            className="mb-8 inline-block rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 px-4 py-2 text-xs uppercase tracking-widest text-[var(--color-brand)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Available Now
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: DRAMATIC_EASE }}
            className="mb-6 text-4xl uppercase leading-[1.1] text-white md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            <span className="text-[var(--color-brand)]">Download</span> AIM
            <br />
            Start Training
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: DRAMATIC_EASE }}
            className="mb-12 max-w-xl text-lg text-white/60"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Get AI-powered training analysis in your pocket. Track progress,
            receive personalized coaching, and unlock your full potential.
          </motion.p>

          {/* Download buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: DRAMATIC_EASE }}
            className="flex flex-col gap-4 sm:flex-row sm:gap-6"
          >
            <AppStoreButton
              platform="ios"
              href="https://apps.apple.com"
              storeName="App Store"
              storeLabel="Download on the"
            />
            <AppStoreButton
              platform="android"
              href="https://play.google.com"
              storeName="Google Play"
              storeLabel="Get it on"
            />
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: DRAMATIC_EASE }}
          className="mx-auto mt-24 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3"
        >
          <Feature
            title="AI Analysis"
            description="Advanced video analysis breaks down every aspect of your game"
          />
          <Feature
            title="Report Cards"
            description="Get detailed performance metrics and personalized insights"
          />
          <Feature
            title="Track Progress"
            description="Monitor your improvement over time with visual dashboards"
          />
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

/** App store download button with platform branding */
function AppStoreButton({
  platform,
  href,
  storeName,
  storeLabel,
}: {
  platform: "ios" | "android";
  href: string;
  storeName: string;
  storeLabel: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-fill-hover flex items-center gap-4 border border-white/30 bg-transparent px-6 py-4 transition-all hover:border-[var(--color-brand)]"
    >
      {platform === "ios" ? <AppleIcon /> : <PlayStoreIcon />}
      <div className="flex flex-col items-start">
        <span
          className="text-[10px] uppercase tracking-wide text-white/60"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {storeLabel}
        </span>
        <span
          className="text-lg font-medium text-white"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {storeName}
        </span>
      </div>
    </a>
  );
}

/** Feature card */
function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-l border-white/20 pl-6">
      <h3
        className="text-sm uppercase tracking-widest text-[var(--color-brand)]"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed text-white/60"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {description}
      </p>
    </div>
  );
}

/** Apple icon */
function AppleIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/** Google Play icon */
function PlayStoreIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}
