import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
}

/**
 * Animated card wrapper used throughout profile and billing sections.
 */
export default function SectionCard({ children, className, delay = 0 }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay }}
      className={cn("rounded-2xl border border-white/10 bg-white/[0.02] p-6", className)}
    >
      {children}
    </motion.div>
  );
}
