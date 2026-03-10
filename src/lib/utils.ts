import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes with clsx, resolving conflicts via tailwind-merge. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Detects uploaded or captured images (data URLs) that should bypass Next.js image optimization. */
export const isDataImage = (src?: string) => Boolean(src?.startsWith("data:"));
