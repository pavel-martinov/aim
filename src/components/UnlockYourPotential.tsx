"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { DRAMATIC_EASE } from "@/lib/animations";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { openDownloadStore } from "@/lib/download";

/**
 * UnlockYourPotential section: Large green headline with phone mockup overlaying it,
 * description text, and download button. Features scroll-based parallax animations.
 */
export default function UnlockYourPotential() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect for phone mockup
  const phoneY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.97, 1, 1, 0.97]);

  // Fade in elements as section enters viewport
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[max(100vh,1028px)] items-center justify-center overflow-hidden bg-[#010400] px-4 py-12 md:min-h-[max(100vh,1112px)] lg:min-h-[max(100vh,1092px)] lg:px-0 lg:py-24"
      data-header-theme="dark"
      aria-label="Unlock Your Potential"
    >
      {/* Content container with fixed height per breakpoint */}
      <div className="relative mx-auto h-[932px] w-full max-w-[1440px] md:h-[1016px] lg:h-[900px]">
        {/* Headline - positioned at top, behind phone (z-10) */}
        <motion.div
          className="absolute left-1/2 top-0 z-10 w-full -translate-x-1/2 text-center"
          style={{ opacity: contentOpacity, y: headlineY }}
        >
          <h2
            className="whitespace-nowrap text-[58px] uppercase leading-[1.1] tracking-tight text-[var(--color-brand)] md:text-[124px] lg:text-[144px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            <span className="block">UNLOCK</span>
            <span className="block">YOUR POTENTIAL</span>
          </h2>
        </motion.div>

        {/* Phone Mockup - overlaying headline (z-20) */}
        <motion.div
          className="absolute left-1/2 top-[16px] z-20 -translate-x-1/2 md:top-[24px]"
          style={{ y: phoneY, scale: phoneScale }}
        >
          <div className="relative h-[680px] w-[678px] md:h-[816px] md:w-[812px] lg:h-[852px] lg:w-[848px]">
            <Image
              src="/UnlockYourPotential/Mockup.png"
              alt="AIM app showing soccer training drills, levels, and performance tracking"
              fill
              className="object-contain drop-shadow-[0_4px_41px_rgba(0,0,0,0.72)]"
              priority
            />
          </div>
        </motion.div>

        {/* Bottom content: Description + Button (z-30) */}
        <motion.div
          className="absolute bottom-12 left-1/2 z-30 flex w-full -translate-x-1/2 flex-col items-center gap-6 px-0 md:bottom-0 md:px-0"
          style={{ opacity: contentOpacity }}
        >
          <p
            className="w-full text-center text-sm uppercase leading-[1.5] tracking-wide text-[#d9d9d9] md:w-[563px] md:text-lg md:leading-[1.25]"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Every stat tells a story. From shot speed to jump height, our AI
            captures and breaks down your every move—giving you clear, measurable
            data that drives real progress.
          </p>

          <motion.div
            className="w-full md:w-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: DRAMATIC_EASE, delay: 0.3 }}
          >
            <OpaqueButton onClick={openDownloadStore}>
              DOWNLOAD NOW
            </OpaqueButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
