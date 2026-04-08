"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import { cn } from "@/lib/utils";

const GIRL_POWER_SRC = "/WomensFootball/GirlPower.svg";
const HERO_MOBILE = "/WomensFootball/hero-mobile.png";
const HERO_TABLET = "/WomensFootball/hero-tablet.png";
const HERO_DESKTOP = "/WomensFootball/WomensFootballBanner.png";

const BODY_COPY =
  "We are building dedicated female pathways and showcases to ensure girls have the same access to elite coaching, visibility, and progression as boys.";

/** Pink script-style eyebrow graphic from Figma (“Girl Power”). */
function GirlPowerMark({ className }: { className?: string }) {
  return (
    <Image
      src={GIRL_POWER_SRC}
      alt=""
      width={171}
      height={72}
      className={cn("h-10 w-auto max-w-full object-contain md:h-11 lg:h-12", className)}
      draggable={false}
    />
  );
}

/** Shared headline with site typography scale (Geist, StepsSection-aligned sizes). */
function SectionHeadline({ className }: { className?: string }) {
  return (
    <h2
      className={cn(
        "text-center text-4xl font-medium leading-[1.25] text-black lg:text-[46px]",
        className,
      )}
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <span className="block">The Future of </span>
      <span className="block">Women&apos;s Football</span>
    </h2>
  );
}

/** Body paragraph: uppercase, mobile 14px / desktop 16px scale. */
function BodyParagraph({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-center text-sm font-normal uppercase leading-[1.5] text-black lg:text-base",
        className,
      )}
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {BODY_COPY}
    </p>
  );
}

/**
 * Women’s Football promo block: Figma 259:306 (desktop 50/50, 800px), 513:611 (mobile),
 * 513:612 (tablet stacked + 830px image). Art direction via picture sources.
 */
export default function WomensFootballSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle image drift/zoom to avoid a static, stiff feel.
  const rawImageY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const rawImageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);
  const imageY = useSpring(rawImageY, { stiffness: 70, damping: 20, mass: 0.8 });
  const imageScale = useSpring(rawImageScale, {
    stiffness: 70,
    damping: 20,
    mass: 0.8,
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Women's football"
      data-header-theme="light"
      className="flex min-h-screen flex-col bg-white lg:h-[800px] lg:min-h-0 lg:flex-row"
    >
      {/* Copy column */}
      <div className="relative flex w-full shrink-0 flex-col bg-white px-4 py-[60px] lg:h-full lg:w-1/2 lg:px-6">
        {/* Mobile + tablet: Girl Power, headline, body (Figma 513:611 / 513:612) */}
        <div className="flex flex-col items-center gap-6 lg:hidden">
          <RevealOnScroll dramatic blur scale>
            <GirlPowerMark />
          </RevealOnScroll>
          <RevealOnScroll dramatic delay={0.1} blur>
            <SectionHeadline />
          </RevealOnScroll>
          <RevealOnScroll delay={0.15} blur>
            <BodyParagraph />
          </RevealOnScroll>
        </div>

        {/* Desktop: centered headline + bottom body (Figma 259:306) */}
        <div className="relative hidden min-h-0 flex-1 flex-col lg:flex">
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="flex max-w-[672px] flex-col items-center gap-4">
              <RevealOnScroll dramatic blur scale>
                <GirlPowerMark />
              </RevealOnScroll>
              <RevealOnScroll dramatic delay={0.1} blur>
                <SectionHeadline />
              </RevealOnScroll>
            </div>
          </div>
          <RevealOnScroll delay={0.15} blur className="relative z-10 mt-auto w-full">
            <BodyParagraph />
          </RevealOnScroll>
        </div>
      </div>

      {/* Visual column */}
      <div
        className={cn(
          "relative min-h-0 w-full flex-1 bg-black",
          "min-h-[50svh] md:h-[830px] md:min-h-[830px] md:shrink-0 md:flex-none",
          "lg:h-full lg:min-h-0 lg:w-1/2 lg:shrink-0 lg:flex-1",
        )}
      >
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
          className="absolute inset-0"
        >
          <picture className="absolute inset-0 block h-full w-full">
            <source media="(min-width: 1024px)" srcSet={HERO_DESKTOP} />
            <source media="(min-width: 768px)" srcSet={HERO_TABLET} />
            <img
              src={HERO_MOBILE}
              alt="Female football player — AIM campaign: Your game reimagined"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </picture>
        </motion.div>
      </div>
    </section>
  );
}
