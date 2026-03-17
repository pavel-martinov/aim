import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes with clsx, resolving conflicts via tailwind-merge. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Detects uploaded or captured images (data URLs) that should bypass Next.js image optimization. */
export const isDataImage = (src?: string) => Boolean(src?.startsWith("data:"));

/** Simulates network delay for mock functions */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Detects touch-capable devices for animation/scroll behavior decisions */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/** Email validation regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates email format */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
