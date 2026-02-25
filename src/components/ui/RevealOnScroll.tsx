"use client";

import { motion } from "framer-motion";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";

type Direction = "up" | "down" | "left" | "right";

type RevealOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  as?: keyof typeof motion;
};

/** Returns initial transform values based on reveal direction */
function getInitialTransform(direction: Direction) {
  const offset = 24;
  switch (direction) {
    case "up":
      return { y: offset };
    case "down":
      return { y: -offset };
    case "left":
      return { x: offset };
    case "right":
      return { x: -offset };
  }
}

/** Returns animate transform values (always return to origin) */
function getAnimateTransform(direction: Direction) {
  return direction === "left" || direction === "right" ? { x: 0 } : { y: 0 };
}

/**
 * Wraps content with scroll-triggered reveal animation.
 * Uses GPU-accelerated transform + opacity for optimal performance.
 */
export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: RevealOnScrollProps) {
  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, ...getInitialTransform(direction) }}
      whileInView={{ opacity: 1, ...getAnimateTransform(direction) }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE, delay }}
    >
      {children}
    </MotionComponent>
  );
}
