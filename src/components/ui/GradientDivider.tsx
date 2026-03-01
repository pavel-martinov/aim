"use client";

import { motion } from "framer-motion";
import { SMOOTH_EASE, DRAMATIC_EASE } from "@/lib/animations";

type GradientDividerProps = {
  /** Width style: 'narrow' for accent lines, 'wide' for full-width section dividers */
  width?: "narrow" | "wide";
  /** Color variant for the gradient center */
  variant?: "brand" | "brand-muted" | "dark";
  /** Enable scale animation on scroll */
  animate?: boolean;
  /** Additional classes */
  className?: string;
};

/**
 * Decorative gradient divider line used between sections.
 */
export default function GradientDivider({
  width = "wide",
  variant = "brand-muted",
  animate = true,
  className = "",
}: GradientDividerProps) {
  const widthClass = width === "narrow" ? "w-32" : "w-full max-w-3xl";

  const colorClass = {
    brand: "via-[var(--color-brand)]",
    "brand-muted": "via-[var(--color-brand)]/30",
    dark: "via-black/20",
  }[variant];

  const baseClass = `h-px bg-gradient-to-r from-transparent ${colorClass} to-transparent ${widthClass} ${className}`;

  if (!animate) {
    return <div className={baseClass} />;
  }

  return (
    <motion.div
      className={baseClass}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: variant === "dark" ? SMOOTH_EASE : DRAMATIC_EASE }}
    />
  );
}
