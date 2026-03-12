"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * Academy Storytelling section — light mode with two parallax images.
 * Mobile: Stacked layout with images animating from left on scroll.
 * Desktop: Left image horizontal parallax, right image vertical parallax.
 * Respects prefers-reduced-motion for accessibility.
 */
export default function AcademiesStorytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Headline: scroll-linked reveal (y + opacity + blur)
  const headlineY = useTransform(scrollYProgress, [0, 0.25], prefersReducedMotion ? [0, 0] : [40, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0.6]);
  const headlineBlurValue = useTransform(scrollYProgress, [0, 0.2], prefersReducedMotion ? [0, 0] : [8, 0]);
  const headlineFilter = useTransform(headlineBlurValue, (v) => `blur(${v}px)`);

  // Paragraph: scroll-linked reveal with slight delay
  const paragraphY = useTransform(scrollYProgress, [0.05, 0.3], prefersReducedMotion ? [0, 0] : [30, 0]);
  const paragraphOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0.6]);
  const paragraphBlurValue = useTransform(scrollYProgress, [0.05, 0.25], prefersReducedMotion ? [0, 0] : [6, 0]);
  const paragraphFilter = useTransform(paragraphBlurValue, (v) => `blur(${v}px)`);

  // Mobile: Images slide in from left
  const mobileImage1X = useTransform(scrollYProgress, [0.15, 0.35], prefersReducedMotion ? [0, 0] : [-100, 0]);
  const mobileImage1Opacity = useTransform(scrollYProgress, [0.15, 0.3], prefersReducedMotion ? [1, 1] : [0, 1]);
  const mobileImage2X = useTransform(scrollYProgress, [0.35, 0.55], prefersReducedMotion ? [0, 0] : [-100, 0]);
  const mobileImage2Opacity = useTransform(scrollYProgress, [0.35, 0.5], prefersReducedMotion ? [1, 1] : [0, 1]);

  // Desktop: Left image horizontal parallax
  const leftImageX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-80, 20]);
  const leftImageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0.5, 1, 1, 0.5]);

  // Desktop: Right image vertical parallax
  const rightImageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [120, -40]);
  const rightImageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0.5, 1, 1, 0.5]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[2028px] w-full overflow-hidden bg-white px-4 py-[120px] md:min-h-[1000px] md:px-6 lg:min-h-[1252px] lg:px-8"
      data-header-theme="light"
    >
      {/* Large headline at top */}
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

      {/* Subtitle / description text */}
      <motion.p
        className="mt-[60px] max-w-[343px] text-[16px] font-medium uppercase leading-[1.5] text-black md:absolute md:left-[360px] md:top-[354px] md:mt-0 md:max-w-[516px] md:text-[16px] lg:left-[360px]"
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

      {/* Mobile: First Image - slides from left */}
      <motion.div
        className="mt-[60px] h-[472px] w-[calc(100%-16px)] overflow-hidden md:hidden"
        style={{ 
          x: mobileImage1X, 
          opacity: mobileImage1Opacity,
          willChange: "transform, opacity",
        }}
      >
        <Image
          src="/academies/story-left.jpg"
          alt="Player training with ball"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Mobile: Second Image - slides from left */}
      <motion.div
        className="mt-[100px] h-[472px] w-[calc(100%-16px)] overflow-hidden md:hidden"
        style={{ 
          x: mobileImage2X, 
          opacity: mobileImage2Opacity,
          willChange: "transform, opacity",
        }}
      >
        <Image
          src="/academies/story-right.jpg"
          alt="Coach analyzing player performance"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Desktop: Left Image - horizontal parallax */}
      <motion.div
        className="absolute bottom-[120px] left-0 hidden h-[472px] w-[336px] overflow-hidden md:block lg:left-0"
        style={{ x: leftImageX, opacity: leftImageOpacity }}
      >
        <Image
          src="/academies/story-left.jpg"
          alt="Player training with ball"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Desktop: Right Image - vertical parallax */}
      <motion.div
        className="absolute bottom-[120px] right-0 hidden h-[472px] w-[500px] overflow-hidden md:block lg:right-0 lg:w-[696px]"
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
