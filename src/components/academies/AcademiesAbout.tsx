"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/**
 * About Academy section — full-bleed background image with white text overlay.
 * 90% viewport height with 800px minimum as per design spec.
 */
export default function AcademiesAbout() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-[max(90vh,800px)] w-full flex-col justify-end overflow-hidden px-6 py-[60px] lg:px-8"
      data-header-theme="dark"
    >
      {/* Background Image with parallax zoom */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: imageScale }}
      >
        <Image
          src="/academies/about-bg.jpg"
          alt="Sports academy facility"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </motion.div>

      {/* Text Content */}
      <motion.div
        className="relative z-10 flex w-full flex-col gap-1"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* First line - indented, shorter trailing phrase */}
        <div className="pl-0 md:pl-[120px]">
          <p
            className="text-[32px] font-medium capitalize leading-[1.25] text-white md:text-[42px] lg:text-[52px]"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            AIM goes beyond player improvement. It&apos;s about
          </p>
        </div>

        {/* Second line - full width, continues the thought */}
        <p
          className="text-[32px] font-medium capitalize leading-[1.25] text-white md:text-[42px] lg:text-[52px]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          building futures for anyone with a ball, a dream, and the hunger to get better every single day.
        </p>
      </motion.div>
    </section>
  );
}
