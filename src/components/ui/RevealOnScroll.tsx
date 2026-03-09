"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, GSAP_EASE } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  /** Use longer duration for hero elements */
  dramatic?: boolean;
  /** Fraction of element visible to trigger reveal (default 0.15) */
  threshold?: number;
  /** Add blur-to-clear effect for dramatic reveals */
  blur?: boolean;
  /** Add subtle scale effect */
  scale?: boolean;
  /** Scrub mode: animation progress tied to scroll position */
  scrub?: boolean;
};

/** Returns initial transform offset based on direction */
function getOffset(direction: Direction, dramatic: boolean): { x?: number; y?: number } {
  const offset = dramatic ? 50 : 30;

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

/**
 * Elegant reveal animation triggered on scroll using GSAP ScrollTrigger.
 * Provides organic, fluid motion with optional blur, scale, and scrub modes.
 */
export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  dramatic = false,
  threshold = 0.15,
  blur = false,
  scale = false,
  scrub = false,
}: RevealOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const duration = dramatic ? DURATION.hero : DURATION.standard;
  const offset = getOffset(direction, dramatic);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated.current) return;

    const initialState: gsap.TweenVars = {
      opacity: 0,
      ...offset,
      ...(blur && { filter: "blur(6px)" }),
      ...(scale && { scale: 0.95 }),
    };

    const finalState: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur && { filter: "blur(0px)" }),
      ...(scale && { scale: 1 }),
      duration,
      ease: GSAP_EASE.dramatic,
      delay,
    };

    gsap.set(element, initialState);

    // Check if element is already in view on mount
    const rect = element.getBoundingClientRect();
    const triggerThreshold = 1 - threshold;
    const isAlreadyInView = rect.top < window.innerHeight * triggerThreshold;

    if (scrub) {
      gsap.to(element, {
        ...finalState,
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          end: "top 40%",
          scrub: 1,
        },
      });
    } else if (isAlreadyInView) {
      // Element already visible on mount - animate immediately
      hasAnimated.current = true;
      gsap.to(element, finalState);
    } else {
      // Element below fold - use scroll trigger
      ScrollTrigger.create({
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;
          gsap.to(element, finalState);
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [offset, blur, scale, duration, delay, threshold, scrub]);

  return (
    <div ref={elementRef} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
