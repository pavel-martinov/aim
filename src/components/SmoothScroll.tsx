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

/** Smooth scrolling wrapper using Lenis, integrated with GSAP ScrollTrigger. */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    let lenis: Lenis;

    try {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      });
    } catch (e) {
      console.error("[SmoothScroll] Lenis init failed, running without smooth scroll:", e);
      return;
    }

    // Sync Lenis scroll position with GSAP ScrollTrigger for proper pinning on mobile
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

    window.addEventListener(LENIS_STOP_EVENT, stop);
    window.addEventListener(LENIS_START_EVENT, start);
    window.addEventListener(SCROLL_TO_TOP_EVENT, scrollToTop);

    // If something mounted before SmoothScroll and already locked, honor it.
    if (document.documentElement.classList.contains("lenis-stopped")) {
      lenis.stop();
    }

    return () => {
      window.removeEventListener(LENIS_STOP_EVENT, stop);
      window.removeEventListener(LENIS_START_EVENT, start);
      window.removeEventListener(SCROLL_TO_TOP_EVENT, scrollToTop);
      lenis.destroy();
    };
  }, []);

  return children;
}
