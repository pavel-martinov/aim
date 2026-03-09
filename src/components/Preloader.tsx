"use client";
"use no memo";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import OpaqueButton from "@/components/ui/OpaqueButton";

const FILL_START_MS = 2500;
const FILL_DURATION_MS = 3500;

const EPIC_PHRASE = "Every legend was once unknown. This is where they begin.";

type PreloaderProps = {
  onComplete?: () => void;
};

/**
 * Preloader with CSS-driven animations and minimal JS state.
 * Opted out of React Compiler via "use no memo" to prevent animation interference.
 * Logo/text/loader visibility is fully CSS (animation-delay + fill-mode: both).
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const [showCta, setShowCta] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Animate percentage counter via direct DOM writes (bypasses React render cycle entirely)
  useEffect(() => {
    let raf = 0;

    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(100, ((now - start) / FILL_DURATION_MS) * 100);
        if (counterRef.current) counterRef.current.textContent = `${Math.round(p)}%`;
        if (p < 100) {
          raf = requestAnimationFrame(tick);
        } else {
          setShowCta(true);
        }
      };
      raf = requestAnimationFrame(tick);
    }, FILL_START_MS);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleEnter = useCallback(() => setIsExiting(true), []);
  const handleExitComplete = useCallback(() => onComplete?.(), [onComplete]);

  if (isExiting) {
    return <PortalExit onComplete={handleExitComplete} phrase={EPIC_PHRASE} />;
  }

  return (
    <div
      className="preloader-root fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-8 overflow-hidden bg-black px-6 py-12 text-white"
      style={{ height: "100dvh" }}
    >
      <div className="preloader-logo">
        <Image src="/Logotype.svg" alt="AIM" width={46} height={52} priority />
      </div>

      <p
        className="preloader-text max-w-xl text-center text-lg font-light leading-relaxed text-white/90 sm:text-xl"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {EPIC_PHRASE}
      </p>

      <div className="preloader-loader w-full max-w-md">
        <div className="flex items-center gap-4">
          <span
            ref={counterRef}
            className="font-mono text-sm tabular-nums text-white/70"
            style={{ fontFamily: "var(--font-geist-mono), monospace", minWidth: "2.5rem" }}
          >
            0%
          </span>
          <div className="h-px flex-1 bg-white/30 overflow-hidden">
            <div className="preloader-fill h-full bg-[var(--color-brand)]" />
          </div>
        </div>
      </div>

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

/** Exit: tagline fades out with scale + blur, white flash, then onComplete. */
function PortalExit({
  onComplete,
  phrase,
}: {
  onComplete: () => void;
  phrase: string;
}) {
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      onComplete();
    }, 1600);
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
