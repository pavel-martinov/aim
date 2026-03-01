"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { DRAMATIC_EASE } from "@/lib/animations";
import SectionHeader from "@/components/ui/SectionHeader";
import GradientDivider from "@/components/ui/GradientDivider";

/** Gallery images placeholder data */
const GALLERY_IMAGES = [
  { id: 1, span: "large" }, // Large left
  { id: 2, span: "small" }, // Small top-right
  { id: 3, span: "small" }, // Small bottom-right
  { id: 4, span: "wide" }, // Wide bottom
  { id: 5, span: "medium" }, // Medium left
  { id: 6, span: "medium" }, // Medium right
] as const;

/**
 * Individual gallery image with hover effects and parallax.
 */
function GalleryImage({
  index,
  span,
  parallaxY,
}: {
  index: number;
  span: string;
  parallaxY: MotionValue<number>;
}) {
  // Determine grid classes based on span type
  const spanClasses = {
    large: "col-span-1 row-span-2 lg:col-span-1 lg:row-span-2",
    small: "col-span-1 row-span-1",
    wide: "col-span-2 row-span-1",
    medium: "col-span-1 row-span-1",
  }[span];

  const heightClasses = {
    large: "h-[400px] lg:h-full",
    small: "h-[200px] lg:h-[240px]",
    wide: "h-[250px] lg:h-[300px]",
    medium: "h-[250px] lg:h-[280px]",
  }[span];

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-xl ${spanClasses} ${heightClasses}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        ease: DRAMATIC_EASE,
        delay: index * 0.1,
      }}
      style={{ y: parallaxY }}
    >
      {/* Placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a]">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, var(--color-brand) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brand)]/5 blur-3xl transition-all duration-700 group-hover:bg-[var(--color-brand)]/15" />
      </div>

      {/* Placeholder text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-xs uppercase tracking-widest text-white/30"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Image {index + 1}
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[var(--color-brand)]/0 transition-all duration-500 group-hover:bg-[var(--color-brand)]/10" />

      {/* Border */}
      <div className="absolute inset-0 rounded-xl border border-white/5 transition-colors duration-500 group-hover:border-[var(--color-brand)]/30" />

      {/* Corner accent on hover */}
      <div className="absolute bottom-0 left-0 h-0 w-0 border-b-[3px] border-l-[3px] border-transparent transition-all duration-500 group-hover:h-8 group-hover:w-8 group-hover:border-[var(--color-brand)]" />
    </motion.div>
  );
}

/**
 * Gallery section with masonry-style image grid and parallax effects.
 */
export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Different parallax speeds for visual depth
  const parallax1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const parallax3 = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const parallaxValues = [parallax1, parallax2, parallax3, parallax1, parallax2, parallax3];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#010400] py-24 lg:py-32"
      data-header-theme="dark"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-16 px-6">
        <SectionHeader eyebrow="Gallery" headline="See AIM in the wild" />

        {/* Masonry grid */}
        <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Row 1: Large left + 2 small stacked right */}
          <GalleryImage index={0} span="large" parallaxY={parallaxValues[0]} />
          <div className="col-span-1 flex flex-col gap-4 lg:gap-6">
            <GalleryImage index={1} span="small" parallaxY={parallaxValues[1]} />
            <GalleryImage index={2} span="small" parallaxY={parallaxValues[2]} />
          </div>
          {/* Third column on large screens */}
          <div className="col-span-2 lg:col-span-1">
            <GalleryImage index={3} span="wide" parallaxY={parallaxValues[3]} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid w-full grid-cols-2 gap-4 lg:gap-6">
          <GalleryImage index={4} span="medium" parallaxY={parallaxValues[4]} />
          <GalleryImage index={5} span="medium" parallaxY={parallaxValues[5]} />
        </div>

        <GradientDivider />
      </div>
    </section>
  );
}
