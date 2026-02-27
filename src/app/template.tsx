"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { SMOOTH_EASE } from "@/lib/animations";

const LAST_PATHNAME_KEY = "aim:lastPathname";

/** Page transition wrapper using Next.js template pattern for proper re-mounting on navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const previous = window.sessionStorage.getItem(LAST_PATHNAME_KEY);
    if (previous && previous !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    window.sessionStorage.setItem(LAST_PATHNAME_KEY, pathname);
  }, [pathname]);

  useLayoutEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <motion.div
      initial={isFirstRender.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: SMOOTH_EASE }}
    >
      {children}
    </motion.div>
  );
}
