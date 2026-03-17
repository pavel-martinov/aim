"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";

interface ProfileCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "compact" | "gradient";
  animated?: boolean;
  animationDelay?: number;
}

/**
 * Reusable card container for profile sections.
 * Provides consistent styling across parent dashboard components.
 */
export default function ProfileCard({
  children,
  className,
  variant = "default",
  animated = true,
  animationDelay = 0,
  ...props
}: ProfileCardProps) {
  const baseStyles = "border border-white/10";
  
  const variantStyles = {
    default: "rounded-2xl bg-white/[0.02] p-6",
    compact: "rounded-xl bg-white/[0.02] p-4",
    gradient: "rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6",
  };

  const motionProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: DURATION.standard, ease: SMOOTH_EASE, delay: animationDelay },
      }
    : {};

  return (
    <motion.div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Subheading label for card sections */
export function ProfileCardLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-xs uppercase tracking-widest text-white/40 font-mono", className)}>
      {children}
    </h3>
  );
}
