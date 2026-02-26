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
  dramatic?: boolean;
  /** Fraction of element visible to trigger reveal (default 0.2, use lower for tall elements) */
  viewportAmount?: number;
};

/** Returns initial transform offset based on direction */
function getInitialTransform(direction: Direction, dramatic: boolean) {
  const offset = dramatic ? 40 : 24;

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

/** Returns final transform values (origin position) */
function getAnimateTransform(direction: Direction) {
  return direction === "left" || direction === "right" ? { x: 0 } : { y: 0 };
}

/**
 * Clean fade + translate reveal animation on scroll.
 * Industry-standard approach used by Apple, Stripe, Linear, Vercel.
 * Set dramatic=true for hero elements (1s duration, larger offset).
 */
export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
  dramatic = false,
  viewportAmount = 0.2,
}: RevealOnScrollProps) {
  const MotionComponent = motion[as] as typeof motion.div;
  const duration = dramatic ? 1.0 : DURATION.standard;

  return (
    <MotionComponent
      className={className}
      style={{ willChange: "transform, opacity" }}
      initial={{ opacity: 0, ...getInitialTransform(direction, dramatic) }}
      whileInView={{ opacity: 1, ...getAnimateTransform(direction) }}
      viewport={{ once: true, amount: viewportAmount }}
      transition={{ duration, ease: DRAMATIC_EASE, delay }}
    >
      {children}
    </MotionComponent>
  );
}
