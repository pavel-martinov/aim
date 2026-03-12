"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { DRAMATIC_EASE } from "@/lib/animations";
import OpaqueButton from "@/components/ui/OpaqueButton";

/**
 * Academy Pre-CTA section — large green headline with iPad mockup overlay.
 * Mobile: 900px height, 58px headline, iPad bleeds off sides, full-width CTA.
 * Desktop: Larger headline, contained iPad mockup.
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
      className="relative flex h-[900px] items-center justify-center overflow-hidden bg-[#010400] px-4 py-12 md:min-h-[max(100vh,1000px)] lg:px-0 lg:py-24"
      data-header-theme="dark"
      aria-label="Unlock Your Potential"
    >
      {/* Content container */}
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col items-center justify-between md:h-[900px]">
        {/* Headline - positioned at top, behind mockup (z-10) */}
        <motion.div
          className="relative z-10 w-full text-center"
          style={{ opacity: contentOpacity, y: headlineY }}
        >
          <h2
            className="whitespace-nowrap text-[58px] uppercase leading-[1.1] tracking-tight text-[var(--color-brand)] md:text-[100px] lg:text-[144px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            <span className="block">UNLOCK</span>
            <span className="block">FULL POTENTIAL</span>
          </h2>
        </motion.div>

        {/* iPad Mockup - overlaying headline (z-20), bleeds off sides on mobile */}
        <motion.div
          className="absolute left-1/2 top-[calc(50%-43px)] z-20 -translate-x-1/2 -translate-y-1/2 md:top-[40px] md:translate-y-0"
          style={{ y: mockupY, scale: mockupScale }}
        >
          <div className="relative h-[420px] w-[746px] md:h-[600px] md:w-[900px] lg:h-[700px] lg:w-[1244px]">
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
          className="relative z-30 flex w-full flex-col items-center gap-6"
          style={{ opacity: contentOpacity }}
        >
          <p
            className="w-full text-center text-[14px] uppercase leading-[1.5] tracking-wide text-[#d9d9d9] md:w-[563px] md:text-lg md:leading-[1.25]"
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
