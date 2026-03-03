"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { openDownloadStore } from "@/lib/download";
import { DRAMATIC_EASE } from "@/lib/animations";

/**
 * About page hero - full-screen with gradient headline and CTA.
 * Layout: headline top-left, subtext + CTA bottom-right (desktop) / bottom-left (mobile).
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
      className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-black px-4 pb-6 pt-[100px] md:px-6 md:pb-6 md:pt-[124px]"
      data-header-theme="dark"
    >
      {/* Gradient Headline - top left */}
      <motion.h1
        className="relative z-10 bg-gradient-to-r from-white to-[#c4c4c4] bg-clip-text text-[42px] uppercase leading-[1.1] text-transparent md:text-[62px]"
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
          It&apos;s time. To rise.
        </motion.span>
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: DRAMATIC_EASE, delay: 0.35 }}
        >
          From Streets To Stadiums.
        </motion.span>
      </motion.h1>

      {/* Bottom content - subtext + CTA */}
      <motion.div
        className="relative z-10 flex w-full flex-col gap-6 md:items-end"
        style={{ y: contentY, opacity }}
      >
        <motion.p
          className="text-base font-medium uppercase leading-[1.5] text-white md:w-[696px] md:text-right"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: DRAMATIC_EASE, delay: 0.5 }}
        >
          The gap between raw talent and elite coaching has kept millions from reaching their potential.
          <br />
          We&apos;re closing it.
        </motion.p>

        <motion.div
          className="md:w-[696px] md:flex md:justify-end"
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
