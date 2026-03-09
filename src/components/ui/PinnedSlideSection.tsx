"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

gsap.registerPlugin(ScrollTrigger);

/** Returns true if device is touch-primary (mobile/tablet). */
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

type Slide = {
  id: number;
  text: string;
  video: string;
};

type PinnedSlideSectionProps = {
  slides: Slide[];
  classPrefix: string;
  ariaLabel: string;
  sectionClassName?: string;
  /** ScrollTrigger end value - controls scroll distance. */
  scrollEnd?: number;
  /** Scrub value - controls animation smoothness. */
  scrub?: number | boolean;
  /** Refresh ScrollTrigger after setup (useful for mobile). */
  refreshOnSetup?: boolean;
  /** Skip pinned animation on touch devices and show stacked fallback. Default true. */
  disablePinOnTouch?: boolean;
};

/**
 * Reusable full-screen pinned section with scroll-driven slide transitions.
 * Cycles through slides with animated text and progress stepper.
 */
export default function PinnedSlideSection({
  slides,
  classPrefix,
  ariaLabel,
  sectionClassName = "bg-[#0a0a0a]",
  scrollEnd = 5000,
  scrub = 0.8,
  refreshOnSetup = false,
  disablePinOnTouch = true,
}: PinnedSlideSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile] = useState(isTouchDevice);

  useLayoutEffect(() => {
    // Skip ScrollTrigger pinning on touch devices when disablePinOnTouch is true
    if (isTouchDevice() && disablePinOnTouch) {
      return;
    }

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollEnd}`,
          scrub,
          pin: true,
          pinSpacing: true,
          pinReparent: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 0.33, 0.66, 1],
            duration: { min: 0.3, max: 0.6 },
            ease: "power2.inOut",
          },
        },
      });

      const blurIn = "blur(18px)";
      const blurOut = "blur(14px)";

      /** Animate text with 3D perspective effect */
      function animateTextIn(selector: string) {
        master.fromTo(
          `${selector} .${classPrefix}-line`,
          {
            opacity: 0,
            yPercent: 30,
            z: -150,
            rotateX: 8,
            filter: blurIn,
          },
          {
            opacity: 1,
            yPercent: 0,
            z: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 4,
            ease: "power3.out",
          },
          "<"
        );
      }

      function animateTextOut(selector: string) {
        master.to(
          `${selector} .${classPrefix}-line`,
          {
            opacity: 0,
            yPercent: -30,
            z: -200,
            rotateX: -8,
            filter: blurOut,
            duration: 3,
            ease: "power3.in",
          },
          ">1.5"
        );
      }

      // Slide 1 - stays sharp for full duration
      master.fromTo(
        `.${classPrefix}-text-1 .${classPrefix}-line`,
        { opacity: 1, yPercent: 0, z: 0, rotateX: 0, filter: "blur(0px)" },
        { opacity: 1, yPercent: 0, z: 0, rotateX: 0, filter: "blur(0px)", duration: 4, ease: "none" }
      );
      master.to(`.${classPrefix}-text-1`, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, "<");
      master.fromTo(`.${classPrefix}-progress-1`, { width: "0%" }, { width: "100%", ease: "none", duration: 4 }, "<");
      master.to(`.${classPrefix}-bg-1`, { opacity: 1, duration: 0.2 }, "<");
      animateTextOut(`.${classPrefix}-text-1`);
      master.to(`.${classPrefix}-text-1`, { opacity: 0, y: -20, duration: 0.3, ease: "none" });

      // Slide 2
      master.to(`.${classPrefix}-text-2`, { opacity: 1, y: 0, duration: 0.3, ease: "none" });
      master.to(`.${classPrefix}-bg-1`, { opacity: 0, duration: 0.5 }, "<");
      master.to(`.${classPrefix}-bg-2`, { opacity: 1, duration: 0.5 }, "<");
      animateTextIn(`.${classPrefix}-text-2`);
      master.fromTo(`.${classPrefix}-progress-2`, { width: "0%" }, { width: "100%", ease: "none", duration: 4 }, "<");
      animateTextOut(`.${classPrefix}-text-2`);
      master.to(`.${classPrefix}-text-2`, { opacity: 0, y: -20, duration: 0.3, ease: "none" });

      // Slide 3
      master.to(`.${classPrefix}-text-3`, { opacity: 1, y: 0, duration: 0.3, ease: "none" });
      master.to(`.${classPrefix}-bg-2`, { opacity: 0, duration: 0.5 }, "<");
      master.to(`.${classPrefix}-bg-3`, { opacity: 1, duration: 0.5 }, "<");
      animateTextIn(`.${classPrefix}-text-3`);
      master.fromTo(`.${classPrefix}-progress-3`, { width: "0%" }, { width: "100%", ease: "none", duration: 4 }, "<");

      if (refreshOnSetup) {
        ScrollTrigger.refresh();
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [classPrefix, scrollEnd, scrub, refreshOnSetup, disablePinOnTouch]);

  // Mobile fallback: Show slides stacked vertically (only when disablePinOnTouch is true)
  if (isMobile && disablePinOnTouch) {
    return (
      <section
        ref={sectionRef}
        aria-label={ariaLabel}
        className={`${classPrefix}-section relative ${sectionClassName}`}
        data-header-theme="dark"
      >
        {/* Mobile: Stacked slides */}
        <div className="flex flex-col">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-16"
            >
              {/* Background video for this slide */}
              <div className="absolute inset-0 overflow-hidden">
                <BackgroundVideo src={slide.video} overlay overlayOpacity={0.35} />
              </div>
              {/* Slide text */}
              <p
                className="relative z-10 text-center text-[28px] font-medium capitalize leading-[1.3] text-white sm:text-[36px]"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                {slide.text}
              </p>
              {/* Slide indicator */}
              <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full ${i === index ? "bg-white" : "bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: Pinned scroll animation
  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className={`${classPrefix}-section relative ${sectionClassName}`}
      data-header-theme="dark"
    >
      {/* Pinned content container */}
      <div className="relative flex h-screen w-full flex-col items-center justify-center px-4 py-[60px] lg:px-6">
        {/* Background videos */}
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${classPrefix}-bg-${index + 1} absolute inset-0`}
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <BackgroundVideo src={slide.video} overlay overlayOpacity={0.25} />
            </div>
          ))}
        </div>

        {/* Text slides */}
        <div className="relative z-10 w-full max-w-[740px]" style={{ perspective: "1000px" }}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${classPrefix}-text-${index + 1} absolute inset-0 flex items-center justify-center`}
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <p
                className={`${classPrefix}-line text-center text-[36px] font-medium capitalize leading-[1.25] text-white lg:text-[52px]`}
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity, filter",
                }}
              >
                {slide.text}
              </p>
            </div>
          ))}
        </div>

        {/* Progress stepper */}
        <div className="absolute bottom-[60px] left-4 right-4 z-10 flex h-px gap-[6px] md:bottom-[24px] md:left-1/2 md:right-auto md:w-full md:max-w-[720px] md:-translate-x-1/2">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative h-full flex-1">
              <div className="absolute inset-0 bg-white/50" />
              <div
                className={`${classPrefix}-progress-${index + 1} absolute left-0 top-0 h-full bg-white`}
                style={{ width: "0%", transformOrigin: "left center" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
