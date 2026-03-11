"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HEADLINE_LINES = ["Run Your Academy.", "Powered by AI."];

/**
 * Academies hero — light mode with gradient headline and decorative sphere video.
 * 50% viewport height with 600px minimum as per design spec.
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
      className="relative z-0 flex h-[50vh] min-h-[600px] w-full flex-col justify-end overflow-hidden bg-white px-6 pb-10 pt-[120px] lg:px-8"
      data-header-theme="light"
    >
      {/* Decorative looping sphere video above the headline */}
      <motion.div
        className="absolute left-6 top-[120px] z-10 lg:left-8"
        style={{ y: orbY, rotate: orbRotate, opacity }}
      >
        <div className="relative size-[180px] md:size-[238px]">
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

      {/* Headline with gradient text */}
      <motion.div
        className="relative z-10"
        style={{ y: headlineY, opacity }}
      >
        <h1
          className="max-w-[720px] text-[42px] uppercase leading-[1.1] md:text-[52px] lg:text-[62px]"
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
      </motion.div>
    </section>
  );
}
