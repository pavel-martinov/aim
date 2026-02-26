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
};

/** Returns initial 3D transform values with blur, depth, and rotation */
function getInitialTransform(direction: Direction, dramatic: boolean) {
  const offset = dramatic ? 60 : 30;
  const blur = dramatic ? 12 : 8;
  const z = dramatic ? -100 : -50;
  const rotateX = dramatic ? 8 : 4;

  const base = { filter: `blur(${blur}px)`, z, rotateX };

  switch (direction) {
    case "up":
      return { ...base, y: offset };
    case "down":
      return { ...base, y: -offset };
    case "left":
      return { ...base, x: offset };
    case "right":
      return { ...base, x: -offset };
  }
}

/** Returns final transform values (origin position, no blur/rotation) */
function getAnimateTransform(direction: Direction) {
  const base = { filter: "blur(0px)", z: 0, rotateX: 0 };
  return direction === "left" || direction === "right"
    ? { ...base, x: 0 }
    : { ...base, y: 0 };
}

/**
 * Premium 3D blur reveal animation on scroll.
 * Text emerges from depth with blur clearing for cinematic effect.
 * Set dramatic=true for hero elements (1.2s duration, larger effects).
 */
export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
  dramatic = false,
}: RevealOnScrollProps) {
  const MotionComponent = motion[as] as typeof motion.div;
  const duration = dramatic ? DURATION.hero : DURATION.standard;

  return (
    <div style={{ perspective: "1000px" }}>
      <MotionComponent
        className={className}
        style={{ transformStyle: "preserve-3d", willChange: "transform, opacity, filter" }}
        initial={{ opacity: 0, ...getInitialTransform(direction, dramatic) }}
        whileInView={{ opacity: 1, ...getAnimateTransform(direction) }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration, ease: DRAMATIC_EASE, delay }}
      >
        {children}
      </MotionComponent>
    </div>
  );
}
