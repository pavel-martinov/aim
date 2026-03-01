"use client";

import { motion } from "framer-motion";
import { DRAMATIC_EASE } from "@/lib/animations";

type SectionHeaderProps = {
  /** Small label above the headline */
  eyebrow: string;
  /** Main headline content - can be string or JSX for styled text */
  headline: React.ReactNode;
  /** Use dark text for light backgrounds */
  variant?: "dark" | "light";
  /** Additional classes for the container */
  className?: string;
};

/**
 * Reusable section header with eyebrow label and headline.
 * Includes fade-in animation on scroll.
 */
export default function SectionHeader({
  eyebrow,
  headline,
  variant = "dark",
  className = "",
}: SectionHeaderProps) {
  const isDark = variant === "dark";

  return (
    <motion.div
      className={`flex flex-col items-center gap-4 text-center ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: DRAMATIC_EASE }}
    >
      <span
        className={`font-mono text-xs uppercase tracking-[0.3em] ${
          isDark ? "text-[var(--color-brand)]" : "text-black/50"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`font-display max-w-2xl text-4xl uppercase leading-[1.05] sm:text-5xl lg:text-[52px] ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {headline}
      </h2>
    </motion.div>
  );
}
