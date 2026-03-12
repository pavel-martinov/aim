"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";

type Direction = "up" | "down" | "left" | "right" | "none";

interface DynamicImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  /** Add subtle scale effect */
  scale?: boolean;
}

export default function DynamicImageReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  scale = true,
}: DynamicImageRevealProps) {
  // Determine starting position based on direction
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: 40 };
      case "down":
        return { y: -40 };
      case "left":
        return { x: 40 };
      case "right":
        return { x: -40 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getOffset();

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...initialOffset,
        ...(scale && { scale: 0.95 }),
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        ...(scale && { scale: 1 }),
      }}
      exit={{
        opacity: 0,
        ...initialOffset,
        ...(scale && { scale: 0.95 }),
      }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ 
        duration: DURATION.hero, 
        ease: DRAMATIC_EASE, 
        delay 
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
