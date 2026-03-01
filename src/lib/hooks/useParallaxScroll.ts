"use client";

import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

type ScrollOffset = ["start start" | "start end", "end start"];

type UseParallaxScrollOptions = {
  /** Scroll offset configuration */
  offset?: ScrollOffset;
  /** Input range for useTransform (default: [0, 1]) */
  inputRange?: number[];
  /** Output range for Y transform (default: [0, -50]) */
  outputRange?: (number | string)[];
};

type UseParallaxScrollResult<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  scrollYProgress: MotionValue<number>;
  y: MotionValue<number | string>;
};

/**
 * Hook for scroll-based parallax effects.
 * Returns a ref to attach to the section and a y transform value.
 */
export function useParallaxScroll<T extends HTMLElement = HTMLElement>(
  options: UseParallaxScrollOptions = {}
): UseParallaxScrollResult<T> {
  const {
    offset = ["start end", "end start"],
    inputRange = [0, 1],
    outputRange = [0, -50],
  } = options;

  const ref = useRef<T>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(scrollYProgress, inputRange, outputRange);

  return { ref, scrollYProgress, y };
}
