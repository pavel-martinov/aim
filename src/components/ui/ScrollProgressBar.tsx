"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/** Top-of-page scroll progress bar; width reflects scroll amount. Uses mix-blend-difference so it inverts against light/dark/multicolour backgrounds. */
export default function ScrollProgressBar() {
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const widthTransform = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const widthSpring = useSpring(widthTransform, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const width = reduceMotion ? widthTransform : widthSpring;

  return (
    <div
      className="relative h-0.5 w-full overflow-hidden pointer-events-none"
      aria-hidden
    >
      <div className="h-full w-full bg-white/20" />
      <motion.div
        className="absolute left-0 top-0 h-full bg-[var(--color-brand)]"
        style={{ width }}
      />
    </div>
  );
}
