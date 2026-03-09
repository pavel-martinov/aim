/**
 * Animation system constants for premium, fluid animations.
 * Optimized for organic, water-like motion per workspace animation principles.
 */

/** Dramatic easing for hero/entrance animations - subtle overshoot feel */
export const DRAMATIC_EASE = [0.16, 1, 0.3, 1] as const;

/** Smooth easing for standard transitions */
export const SMOOTH_EASE = [0.4, 0, 0.2, 1] as const;

/** Exit easing - gentle acceleration out */
export const EXIT_EASE = [0.4, 0, 1, 1] as const;

/** Standard animation durations following workspace guidelines */
export const DURATION = {
  /** Fast interactions */
  fast: 0.3,
  /** Standard elements: 600-800ms */
  standard: 0.65,
  /** Hero/dramatic moments: 1000-1400ms */
  hero: 1.2,
  /** Exit animations: 400-600ms */
  exit: 0.5,
  /** Character stagger delay */
  charStagger: 0.025,
  /** Word stagger delay */
  wordStagger: 0.08,
} as const;

/** GSAP-compatible easing strings */
export const GSAP_EASE = {
  dramatic: "power3.out",
  smooth: "power2.out",
  exit: "power2.in",
  bounce: "back.out(1.2)",
} as const;

/** View transition configuration */
export const VIEW_TRANSITION = {
  duration: 400,
  enterDelay: 50,
} as const;
