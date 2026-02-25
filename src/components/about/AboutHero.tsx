"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { DRAMATIC_EASE } from "@/lib/animations";

/**
 * About page hero section with large headline and scroll-based parallax.
 */
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for headline
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0a]"
      data-header-theme="dark"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#010400] to-[#0a0a0a]" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6 text-center"
        style={{ y: headlineY, opacity }}
      >
        {/* Eyebrow */}
        <motion.span
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: DRAMATIC_EASE, delay: 0.2 }}
        >
          About AIM
        </motion.span>

        {/* Main headline */}
        <motion.h1
          className="flex flex-col text-5xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[120px]"
          style={{ fontFamily: "var(--font-anton), sans-serif" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: DRAMATIC_EASE, delay: 0.4 }}
        >
          <span>Redefining</span>
          <span className="text-[var(--color-brand)]">Athletic</span>
          <span>Training</span>
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          className="h-px w-32 bg-gradient-to-r from-transparent via-[var(--color-brand)] to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: DRAMATIC_EASE, delay: 0.8 }}
        />

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.div
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-2 w-0.5 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
