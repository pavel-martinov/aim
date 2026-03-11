"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProps = {
  children: React.ReactNode;
};

const LENIS_STOP_EVENT = "aim:lenis-stop";
const LENIS_START_EVENT = "aim:lenis-start";
const SCROLL_TO_TOP_EVENT = "aim:scroll-to-top";
const SCROLL_INSTANT_TOP_EVENT = "aim:scroll-instant-top";

/** Returns true if device is touch-primary (mobile/tablet). */
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/** Smooth scrolling wrapper using Lenis, integrated with GSAP ScrollTrigger. Disabled on touch devices for native scroll. */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Skip Lenis on touch devices - native scroll is already smooth and performs better
    if (isTouchDevice()) {
      return;
    }

    let lenis: Lenis;

    try {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 2,
        infinite: false,
      });
    } catch (e) {
      console.error("[SmoothScroll] Lenis init failed, running without smooth scroll:", e);
      return;
    }

    // Sync Lenis scroll position with GSAP ScrollTrigger for proper pinning
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /** Stops Lenis (preloader lock). */
    const stop = () => lenis.stop();
    /** Starts Lenis (unlock after preloader). */
    const start = () => lenis.start();

    /** Scrolls gracefully to top */
    const scrollToTop = () => lenis.scrollTo(0, { duration: 1.2 });

    /** Scrolls instantly to top without animation */
    const scrollInstantTop = () => lenis.scrollTo(0, { immediate: true });

    window.addEventListener(LENIS_STOP_EVENT, stop);
    window.addEventListener(LENIS_START_EVENT, start);
    window.addEventListener(SCROLL_TO_TOP_EVENT, scrollToTop);
    window.addEventListener(SCROLL_INSTANT_TOP_EVENT, scrollInstantTop);

    // If something mounted before SmoothScroll and already locked, honor it.
    if (document.documentElement.classList.contains("lenis-stopped")) {
      lenis.stop();
    }

    return () => {
      window.removeEventListener(LENIS_STOP_EVENT, stop);
      window.removeEventListener(LENIS_START_EVENT, start);
      window.removeEventListener(SCROLL_TO_TOP_EVENT, scrollToTop);
      window.removeEventListener(SCROLL_INSTANT_TOP_EVENT, scrollInstantTop);
      lenis.destroy();
    };
  }, []);

  return children;
}
