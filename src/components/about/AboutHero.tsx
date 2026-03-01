"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { DRAMATIC_EASE } from "@/lib/animations";

/**
 * About page hero section with cinematic dark theme and fluid parallax.
 */
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0a]"
      data-header-theme="dark"
    >
      {/* Subtle, slowly rotating radial gradient background */}
      <motion.div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--color-brand) 0%, transparent 40%)",
          transformOrigin: "center center",
          scale: 1.5,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />

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
          About Us
        </motion.span>

        {/* Main headline */}
        <motion.h1
          className="flex flex-col text-[42px] uppercase leading-[1.1] tracking-tight text-white lg:text-[62px]"
          style={{ fontFamily: "var(--font-anton), sans-serif" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: DRAMATIC_EASE, delay: 0.3 }}
          >
            From insight to impact —
          </motion.span>
          <motion.span
            className="text-white/80"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: DRAMATIC_EASE, delay: 0.4 }}
          >
            we&apos;re revolutionising
          </motion.span>
          <motion.span
            className="text-[var(--color-brand)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: DRAMATIC_EASE, delay: 0.5 }}
          >
            the game…
          </motion.span>
        </motion.h1>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
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
