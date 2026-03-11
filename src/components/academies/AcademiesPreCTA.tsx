"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { DRAMATIC_EASE } from "@/lib/animations";
import OpaqueButton from "@/components/ui/OpaqueButton";

/**
 * Academy Pre-CTA section — large green headline with iPad mockup overlay.
 * Same structure as UnlockYourPotential but with academy-specific content.
 */
export default function AcademiesPreCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect for mockup
  const mockupY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.97, 1, 1, 0.97]);

  // Fade in elements as section enters viewport
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[max(100vh,900px)] items-center justify-center overflow-hidden bg-[#010400] px-4 py-12 md:min-h-[max(100vh,1000px)] lg:px-0 lg:py-24"
      data-header-theme="dark"
      aria-label="Unlock Your Potential"
    >
      {/* Content container */}
      <div className="relative mx-auto h-[800px] w-full max-w-[1440px] md:h-[900px]">
        {/* Headline - positioned at top, behind mockup (z-10) */}
        <motion.div
          className="absolute left-1/2 top-0 z-10 w-full -translate-x-1/2 text-center"
          style={{ opacity: contentOpacity, y: headlineY }}
        >
          <h2
            className="whitespace-nowrap text-[48px] uppercase leading-[1.1] tracking-tight text-[var(--color-brand)] md:text-[100px] lg:text-[144px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            <span className="block">UNLOCK</span>
            <span className="block">YOUR POTENTIAL</span>
          </h2>
        </motion.div>

        {/* iPad Mockup - overlaying headline (z-20) */}
        <motion.div
          className="absolute left-1/2 top-[60px] z-20 -translate-x-1/2 md:top-[40px]"
          style={{ y: mockupY, scale: mockupScale }}
        >
          <div className="relative h-[500px] w-[700px] md:h-[600px] md:w-[900px] lg:h-[700px] lg:w-[1244px]">
            <Image
              src="/academies/ipad-mockup.png"
              alt="AIM Academy dashboard on iPad showing team analytics and player performance"
              fill
              className="object-contain drop-shadow-[0_4px_41px_rgba(0,0,0,0.72)]"
              priority
            />
          </div>
        </motion.div>

        {/* Bottom content: Description + Button (z-30) */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-30 flex w-full -translate-x-1/2 flex-col items-center gap-6 px-4 md:bottom-0 md:px-0"
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
            <OpaqueButton href="/membership" variant="brand">
              Explore Plans
            </OpaqueButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
