"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OpaqueButton from "@/components/ui/OpaqueButton";

const HEADLINE_LINES = ["Run Your Academy.", "Powered by AI."];

/**
 * Academies hero — light mode with gradient headline and decorative sphere video.
 * Mobile: 80vh with 600px minimum, centered layout at bottom.
 * Desktop: Left-aligned layout with parallax effects.
 */
export default function AcademiesHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const orbRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative z-0 flex h-[80vh] min-h-[600px] w-full flex-col items-center justify-end overflow-hidden bg-white px-6 pb-[42px] pt-[120px] md:items-start md:pb-10 lg:px-8"
      data-header-theme="light"
    >
      {/* Decorative looping sphere video — centered on mobile, left on desktop */}
      <motion.div
        className="relative z-10 mb-6 md:absolute md:left-6 md:top-[120px] md:mb-0 lg:left-8"
        style={{ y: orbY, rotate: orbRotate, opacity }}
      >
        <div className="relative size-[204px] md:size-[238px]">
          <video
            src="/academies/sphere.mp4"
            className="pointer-events-none size-full select-none object-contain"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
          />
        </div>
      </motion.div>

      {/* Bottom Content - Headline + CTA */}
      <motion.div
        className="relative z-10 flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between"
        style={{ y: headlineY, opacity }}
      >
        <h1
          className="max-w-[720px] text-center text-[42px] uppercase leading-[1.1] md:text-left md:text-[52px] lg:text-[62px]"
          style={{ fontFamily: "var(--font-anton), sans-serif" }}
        >
          {HEADLINE_LINES.map((line, i) => (
            <span
              key={i}
              className="hero-animate hero-animate-delay-1 block bg-gradient-to-r from-black to-[#383838] bg-clip-text text-transparent"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {line}
            </span>
          ))}
        </h1>

        {/* CTA Button - Full width on mobile, fixed 240px on tablet+ */}
        <div className="hero-animate hero-animate-delay-4 w-full shrink-0 md:w-auto">
          <OpaqueButton variant="brand" href="/membership/academy" className="md:w-[240px]">
            REGISTER INTEREST
          </OpaqueButton>
        </div>
      </motion.div>
    </section>
  );
}
