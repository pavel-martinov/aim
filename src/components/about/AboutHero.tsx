"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { openDownloadStore } from "@/lib/download";
import { DRAMATIC_EASE } from "@/lib/animations";
import HeroVideoPlayer from "@/components/about/HeroVideoPlayer";

/**
 * About page hero - full-screen with gradient headline, video, and CTA.
 * Desktop: headline + video side-by-side, bottom content right-aligned.
 * Mobile: stacked — headline, video (fills remaining space), bottom content.
 */
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100dvh] w-full flex-col gap-8 overflow-hidden bg-black px-4 pb-6 pt-[100px] md:px-6 md:pb-6 md:pt-[124px] lg:gap-12"
      data-header-theme="dark"
    >
      {/* Top: headline + video — row on desktop, column on mobile */}
      <div className="flex min-h-0 flex-1 flex-col gap-8 lg:flex-row lg:items-start lg:gap-2.5">
        <motion.h1
          className="shrink-0 bg-gradient-to-r from-white to-[#c4c4c4] bg-clip-text text-[42px] uppercase leading-[1.1] text-transparent md:text-[62px] lg:flex-1"
          style={{
            fontFamily: "var(--font-anton), sans-serif",
            y: headlineY,
            opacity,
          }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: DRAMATIC_EASE, delay: 0.2 }}
          >
            Your AI Coach.
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: DRAMATIC_EASE, delay: 0.35 }}
          >
            Your Path To Pro.
          </motion.span>
        </motion.h1>

        <div className="min-h-0 flex-1 w-full lg:flex-none lg:h-full lg:w-[696px]">
          <HeroVideoPlayer />
        </div>
      </div>

      {/* Bottom content — right-aligned container on desktop, left-aligned text */}
      <motion.div
        className="flex w-full shrink-0 flex-col gap-6 lg:items-end"
        style={{ y: contentY, opacity }}
      >
        <motion.p
          className="text-base font-medium uppercase leading-[1.5] text-white lg:w-[696px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: DRAMATIC_EASE, delay: 0.5 }}
        >
          The gap between raw talent and elite coaching has kept millions from
          reaching their potential.
          <br />
          We&apos;re closing it.
        </motion.p>

        <motion.div
          className="w-full lg:w-[696px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: DRAMATIC_EASE, delay: 0.65 }}
        >
          <OpaqueButton onClick={openDownloadStore}>DOWNLOAD NOW</OpaqueButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
