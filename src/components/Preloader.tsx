"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { DRAMATIC_EASE, EXIT_EASE } from "@/lib/animations";

// Timing constants for animation sequence
const TEXT_APPEAR_MS = 0;            // Text visible immediately with logo
const LOADER_APPEAR_MS = 2000;       // Loader appears at 2s
const LOADER_START_DELAY_MS = 500;   // Shorter delay before filling
const LOAD_DURATION_MS = 3500;       // 30% faster loading

const EPIC_PHRASE =
  "Every legend was once unknown. This is where they begin.";

const fromBelow = { opacity: 0, y: 30 };
const visible = { opacity: 1, y: 0 };

// Transition presets for consistent fluid motion
const layoutTransition = { type: "tween" as const, duration: 0.8, ease: DRAMATIC_EASE };
const pushTransition = { type: "tween" as const, duration: 0.8, ease: DRAMATIC_EASE };
const textTransition = { type: "tween" as const, duration: 1.2, ease: DRAMATIC_EASE };

type PreloaderProps = {
  onComplete?: () => void;
};

/**
 * Preloader: Logo centered, epic text fades in at 3s, green loader at 5s,
 * CTA appears after loading completes. Fluid, dramatic, elegant.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const [showText, setShowText] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderStarted, setLoaderStarted] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Show epic text after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowText(true), TEXT_APPEAR_MS);
    return () => clearTimeout(t);
  }, []);

  // Show loader at 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowLoader(true), LOADER_APPEAR_MS);
    return () => clearTimeout(t);
  }, []);

  // Start loader filling after 1 second delay once loader is visible
  useEffect(() => {
    if (!showLoader) return;
    const t = setTimeout(() => setLoaderStarted(true), LOADER_START_DELAY_MS);
    return () => clearTimeout(t);
  }, [showLoader]);

  // Animate progress bar once loader has started
  useEffect(() => {
    if (!loaderStarted) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / LOAD_DURATION_MS) * 100);
      setProgress(p);
      if (p < 100) requestAnimationFrame(tick);
      else setShowCta(true);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [loaderStarted]);

  const handleEnter = useCallback(() => setIsExiting(true), []);
  const handleExitComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  if (isExiting) {
    return (
      <PortalExit onComplete={handleExitComplete} phrase={EPIC_PHRASE} />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100000] flex h-[100dvh] flex-col overflow-hidden bg-black text-white"
      style={{ height: "100dvh" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <LayoutGroup>
        <motion.div
          layout
          className="flex h-full flex-col items-center justify-center gap-8 overflow-hidden px-6 py-12"
        >
          {/* Logo - always visible, centered anchor with smooth layout animation */}
          <motion.div layout transition={layoutTransition}>
            <Image
              src="/Logotype.svg"
              alt="AIM"
              width={46}
              height={52}
              priority
              className="opacity-80"
            />
          </motion.div>

          {/* Epic text - appears at 3s with dramatic fade */}
          <AnimatePresence mode="popLayout">
            {showText && (
              <motion.p
                layout
                className="max-w-xl text-center text-lg font-light leading-relaxed text-white/90 sm:text-xl"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                initial={fromBelow}
                animate={visible}
                exit={{ opacity: 0 }}
                transition={{ layout: layoutTransition, ...textTransition }}
              >
                {EPIC_PHRASE}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Loader - appears at 5s, starts filling after 1s delay */}
          <AnimatePresence mode="popLayout">
            {showLoader && (
              <motion.div
                layout
                className="w-full max-w-md"
                initial={fromBelow}
                animate={visible}
                exit={{ opacity: 0 }}
                transition={{ layout: layoutTransition, ...pushTransition }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="font-mono text-sm tabular-nums text-white/70"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    {Math.round(progress)}%
                  </span>
                  <div className="h-px flex-1 overflow-hidden bg-white/30">
                    <motion.div
                      className="h-full bg-[var(--color-brand)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.15, ease: "linear" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA button - appears after loading completes */}
          <AnimatePresence mode="popLayout">
            {showCta && (
              <motion.div
                layout
                initial={fromBelow}
                animate={visible}
                exit={{ opacity: 0 }}
                transition={{ layout: layoutTransition, ...pushTransition }}
              >
                <OpaqueButton variant="inline" onClick={handleEnter}>
                  Enter the Experience
                </OpaqueButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
}

/** Exit: tagline fades out with scale + blur, subtle overlay, then onComplete. */
function PortalExit({
  onComplete,
  phrase,
}: {
  onComplete: () => void;
  phrase: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center overflow-hidden bg-black"
      style={{ height: "100dvh" }}
    >
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white pointer-events-none"
        initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        animate={{
          opacity: 0,
          scale: 1.06,
          filter: "blur(6px)",
        }}
        transition={{
          type: "tween",
          duration: 1,
          ease: EXIT_EASE,
        }}
      >
        <p
          className="max-w-xl text-lg font-light leading-relaxed text-white/90 sm:text-xl"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {phrase}
        </p>
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{
          type: "tween",
          duration: 0.6,
          times: [0, 0.5, 1],
          ease: EXIT_EASE,
        }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
}
