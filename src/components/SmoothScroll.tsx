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

/** Smooth scrolling wrapper using Lenis, integrated with GSAP ScrollTrigger. */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

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

    window.addEventListener(LENIS_STOP_EVENT, stop);
    window.addEventListener(LENIS_START_EVENT, start);

    // If something mounted before SmoothScroll and already locked, honor it.
    if (document.documentElement.classList.contains("lenis-stopped")) {
      lenis.stop();
    }

    return () => {
      window.removeEventListener(LENIS_STOP_EVENT, stop);
      window.removeEventListener(LENIS_START_EVENT, start);
      lenis.destroy();
    };
  }, []);

  return children;
}
