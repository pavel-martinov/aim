"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * Academy Storytelling section — light mode with two parallax images.
 * Left image: horizontal parallax (left to center).
 * Right image: vertical parallax (bottom to top).
 * Text elements animate with scroll-linked reveals for immersive reading.
 * Respects prefers-reduced-motion for accessibility.
 */
export default function AcademiesStorytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Headline: scroll-linked reveal (y + opacity + blur) — disabled if reduced motion
  const headlineY = useTransform(scrollYProgress, [0, 0.25], prefersReducedMotion ? [0, 0] : [40, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0.6]);
  const headlineBlurValue = useTransform(scrollYProgress, [0, 0.2], prefersReducedMotion ? [0, 0] : [8, 0]);
  const headlineFilter = useTransform(headlineBlurValue, (v) => `blur(${v}px)`);

  // Paragraph: scroll-linked reveal with slight delay — disabled if reduced motion
  const paragraphY = useTransform(scrollYProgress, [0.05, 0.3], prefersReducedMotion ? [0, 0] : [30, 0]);
  const paragraphOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0.6]);
  const paragraphBlurValue = useTransform(scrollYProgress, [0.05, 0.25], prefersReducedMotion ? [0, 0] : [6, 0]);
  const paragraphFilter = useTransform(paragraphBlurValue, (v) => `blur(${v}px)`);

  // Left image: horizontal parallax — disabled if reduced motion
  const leftImageX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-80, 20]);
  const leftImageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0.5, 1, 1, 0.5]);

  // Right image: vertical parallax — disabled if reduced motion
  const rightImageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [120, -40]);
  const rightImageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0.5, 1, 1, 0.5]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[1000px] w-full overflow-hidden bg-white px-6 py-[120px] lg:min-h-[1252px] lg:px-8"
      data-header-theme="light"
    >
      {/* Large headline at top — scroll-linked reveal */}
      <motion.div
        className="max-w-[696px]"
        style={{
          y: headlineY,
          opacity: headlineOpacity,
          filter: headlineFilter,
          willChange: "transform, opacity, filter",
        }}
      >
        <h2
          className="text-[32px] font-medium capitalize leading-[1.25] text-[#0d1c28] md:text-[40px] lg:text-[46px]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          Watch every player grow, even when you&apos;re not on the pitch
        </h2>
      </motion.div>

      {/* Subtitle / description text — scroll-linked reveal with stagger */}
      <motion.p
        className="absolute left-6 top-[300px] max-w-[516px] text-[14px] font-medium uppercase leading-[1.5] text-black md:left-[360px] md:top-[354px] md:text-[16px] lg:left-[360px]"
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          y: paragraphY,
          opacity: paragraphOpacity,
          filter: paragraphFilter,
          willChange: "transform, opacity, filter",
        }}
      >
        You can&apos;t be at every training session. But your coaching can be. AIM gives you eyes on every player&apos;s progress, turning their solo practice into real development you can track, measure, and shape from anywhere. No more blind spots in your squad.
      </motion.p>

      {/* Left Image - horizontal parallax */}
      <motion.div
        className="absolute bottom-[80px] left-0 h-[380px] w-[280px] overflow-hidden md:bottom-[120px] md:h-[472px] md:w-[336px] lg:left-0"
        style={{ x: leftImageX, opacity: leftImageOpacity }}
      >
        <Image
          src="/academies/story-left.jpg"
          alt="Player training with ball"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Right Image - vertical parallax */}
      <motion.div
        className="absolute bottom-[40px] right-0 h-[380px] w-[320px] overflow-hidden md:bottom-[120px] md:h-[472px] md:w-[500px] lg:right-0 lg:w-[696px]"
        style={{ y: rightImageY, opacity: rightImageOpacity }}
      >
        <Image
          src="/academies/story-right.jpg"
          alt="Coach analyzing player performance"
          fill
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
