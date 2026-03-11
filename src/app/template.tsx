"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";

/** Page transition wrapper using Framer Motion for an elegant, Awwwards-style sweeping curtain reveal. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Ensure we start at the top of the page on route change.
  useEffect(() => {
    window.dispatchEvent(new Event("aim:scroll-instant-top"));
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <>
      {/* 
        The Curtain: 
        A dramatic overlay that sweeps up to reveal the new page.
        Starts fully covering the viewport (scaleY: 1) from the bottom (origin-bottom),
        animates to scaleY: 0 (sweeping up) to reveal the content.
      */}
      <motion.div
        className="fixed inset-0 z-[9999] bg-[var(--background)] pointer-events-none origin-bottom"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: DURATION.hero, ease: DRAMATIC_EASE }}
      />

      {/* 
        The Content Reveal:
        Subtle scale up and fade/blur reveal synced with the curtain sweep.
      */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)", y: 20 }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: DURATION.hero, ease: DRAMATIC_EASE, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
