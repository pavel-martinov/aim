"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { DRAMATIC_EASE, SMOOTH_EASE } from "@/lib/animations";
import GradientDivider from "@/components/ui/GradientDivider";

/**
 * Goal/Mission section with white background and staggered text reveal.
 */
export default function GoalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 lg:py-40"
      data-header-theme="light"
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-16 px-6 lg:px-12"
        style={{ opacity: contentOpacity }}
      >
        {/* Section header */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: DRAMATIC_EASE }}
        >
          <span
            className="text-xs uppercase tracking-[0.3em] text-black/50"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Our Goal
          </span>
          <h2
            className="flex max-w-4xl flex-wrap justify-center gap-x-[0.3em] text-center text-4xl uppercase leading-[1.05] text-black sm:text-5xl lg:text-[64px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            <span>To make</span>
            <span className="text-black">professional-grade training</span>
            <span>accessible to everyone</span>
          </h2>
        </motion.div>

        {/* Mission content */}
        <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: SMOOTH_EASE, delay: 0.1 }}
          >
            <p
              className="text-lg leading-relaxed text-black/70"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              We believe that exceptional athletic performance shouldn&apos;t be
              limited by geography, wealth, or access. AIM brings cutting-edge
              AI technology directly to your home, transforming any space into a
              professional training facility.
            </p>
            <p
              className="text-lg leading-relaxed text-black/70"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              Our mission is simple: democratise athletic training through
              intelligent technology that adapts to you, learns from your
              performance, and helps you achieve your full potential.
            </p>
          </motion.div>

          {/* Right column */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: SMOOTH_EASE, delay: 0.2 }}
          >
            <p
              className="text-lg leading-relaxed text-black/70"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              From professional athletes refining their craft to beginners
              taking their first steps, AIM provides personalised,
              data-driven insights that were once only available to elite
              training centres.
            </p>
            <p
              className="text-lg leading-relaxed text-black/70"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              Every session becomes an opportunity for growth. Every stat tells
              a story. And every athlete, regardless of their starting point,
              deserves the tools to write their own success story.
            </p>
          </motion.div>
        </div>

        <GradientDivider variant="dark" />
      </motion.div>
    </section>
  );
}
