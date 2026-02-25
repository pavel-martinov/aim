/**
 * Centralized animation constants for consistent, fluid animations across the app.
 * Following workspace animation principles: water-like fluidity, calm over speed.
 */

/** Dramatic easing for hero/entrance animations - subtle overshoot feel */
export const DRAMATIC_EASE = [0.16, 1, 0.3, 1] as const;

/** Smooth easing for standard transitions */
export const SMOOTH_EASE = [0.4, 0, 0.2, 1] as const;

/** Exit easing - gentle acceleration out */
export const EXIT_EASE = [0.4, 0, 1, 1] as const;

/** Standard animation durations following workspace guidelines */
export const DURATION = {
  /** Standard elements: 600-800ms */
  standard: 0.65,
  /** Hero/dramatic moments: 1000-1400ms */
  hero: 1.2,
  /** Exit animations: 400-600ms */
  exit: 0.5,
  /** Fast interactions */
  fast: 0.3,
} as const;
