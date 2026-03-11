"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/**
 * Full-screen divider image section — athlete silhouette with AIM logo.
 * No text overlay, subtle parallax zoom effect.
 */
export default function AcademiesDivider() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] w-full overflow-hidden lg:min-h-[900px]"
      data-header-theme="dark"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
      >
        <Image
          src="/academies/divider.jpg"
          alt="Athlete with football"
          fill
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
