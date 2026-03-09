"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import OpaqueButton from "@/components/ui/OpaqueButton";
// No framer-motion: React Compiler conflicts with framer-motion's animation runtime

// Timing constants
const LOADER_APPEAR_MS = 2000;
const LOADER_START_DELAY_MS = 500;
const LOAD_DURATION_MS = 3500;

const EPIC_PHRASE = "Every legend was once unknown. This is where they begin.";

type PreloaderProps = {
  onComplete?: () => void;
};

/**
 * Preloader: CSS-only animations (immune to React Compiler / Framer Motion conflicts).
 * Logo fades in immediately, loader bar at 2s, CTA after load completes.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [loaderStarted, setLoaderStarted] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(true), LOADER_APPEAR_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showLoader) return;
    const t = setTimeout(() => setLoaderStarted(true), LOADER_START_DELAY_MS);
    return () => clearTimeout(t);
  }, [showLoader]);

  useEffect(() => {
    if (!loaderStarted) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / LOAD_DURATION_MS) * 100);
      setProgress(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
      else setShowCta(true);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loaderStarted]);

  const handleEnter = useCallback(() => setIsExiting(true), []);
  const handleExitComplete = useCallback(() => onComplete?.(), [onComplete]);

  if (isExiting) {
    return <PortalExit onComplete={handleExitComplete} phrase={EPIC_PHRASE} />;
  }

  return (
    <div className="preloader-root fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-8 overflow-hidden bg-black px-6 py-12 text-white" style={{ height: "100dvh" }}>
      {/* Logo */}
      <div className="preloader-logo">
        <Image src="/Logotype.svg" alt="AIM" width={46} height={52} priority />
      </div>

      {/* Epic phrase */}
      <p
        className="preloader-text max-w-xl text-center text-lg font-light leading-relaxed text-white/90 sm:text-xl"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {EPIC_PHRASE}
      </p>

      {/* Loader bar */}
      {showLoader && (
        <div className="preloader-loader w-full max-w-md">
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-sm tabular-nums text-white/70"
              style={{ fontFamily: "var(--font-geist-mono), monospace", minWidth: "2.5rem" }}
            >
              {Math.round(progress)}%
            </span>
            <div className="h-px flex-1 bg-white/30 overflow-hidden">
              <div
                className="h-full bg-[var(--color-brand)] transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      {showCta && (
        <div className="preloader-cta">
          <OpaqueButton variant="inline" onClick={handleEnter}>
            Enter the Experience
          </OpaqueButton>
        </div>
      )}
    </div>
  );
}

/** Exit: tagline fades out with scale + blur, white flash, then onComplete. CSS-only for React Compiler compatibility. */
function PortalExit({
  onComplete,
  phrase,
}: {
  onComplete: () => void;
  phrase: string;
}) {
  const hasCompletedRef = useRef(false);

  // Fire onComplete after the exit animation finishes (1s phrase fade + 0.6s flash)
  useEffect(() => {
    const t = setTimeout(() => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      onComplete();
    }, 1000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center overflow-hidden bg-black"
      style={{ height: "100dvh" }}
    >
      <div className="preloader-exit-phrase absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white pointer-events-none">
        <p
          className="max-w-xl text-lg font-light leading-relaxed text-white/90 sm:text-xl"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {phrase}
        </p>
      </div>
      <div className="preloader-exit-flash absolute inset-0 bg-white" />
    </div>
  );
}
