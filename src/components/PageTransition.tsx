"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SMOOTH_EASE } from "@/lib/animations";

type PageTransitionProps = {
  children: React.ReactNode;
};

const LAST_PATHNAME_KEY = "aim:lastPathname";

/**
 * Page-level transition wrapper. Only handles exit animation (fade out).
 * Components handle their own entrance animations to avoid double-animation.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  // Scroll to top on route change
  useEffect(() => {
    const previous = window.sessionStorage.getItem(LAST_PATHNAME_KEY);

    if (previous && previous !== pathname && prevPathname.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    window.sessionStorage.setItem(LAST_PATHNAME_KEY, pathname);
    prevPathname.current = pathname;
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.4,
          ease: SMOOTH_EASE,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
