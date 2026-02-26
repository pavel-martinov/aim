"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { DRAMATIC_EASE } from "@/lib/animations";
import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

/** Breakpoint card widths matching Tailwind classes */
const CARD_WIDTHS = {
  tablet: 762,
  desktop: 1160,
};

const GAP = 24;
const PADDING_LG = 24;

/** Returns card width based on viewport width (tablet/desktop only) */
function getCardWidth(viewportWidth: number): number {
  if (viewportWidth >= 1024) return CARD_WIDTHS.desktop;
  return CARD_WIDTHS.tablet;
}

/** Step card data for the horizontal carousel */
const STEPS = [
  {
    id: "begin",
    badge: "BEGIN",
    title: "Begin",
    description:
      "Begin Your Training Journey, Master Skills That Change Your Game. Every stat tells a story, and our AI analyses your moves, offering the data needed for real progress. This is more than tracking performance; it's about personal growth, driven by valuable feedback.",
    image: "/images/steps/begin.jpg",
    hasOverlay: false,
  },
  {
    id: "record",
    badge: "RECORD",
    title: "Record",
    description:
      "Turn raw performance data into clear visuals. Discover your strengths, weaknesses, and progress over time with sleek, interactive charts that keep you focused on growth.",
    image: "/images/steps/record.jpg",
    hasOverlay: false,
  },
  {
    id: "analyse",
    badge: "ANALYSE",
    title: "Analyse",
    description:
      "Review your training sessions, note key insights, and celebrate achievements. The journal helps you stay mentally sharp and emotionally engaged in your growth.",
    image: "/images/steps/analyse.jpg",
    hasOverlay: true,
  },
  {
    id: "learn",
    badge: "LEARN",
    title: "Learn",
    description:
      "Review your training sessions, note key insights, and celebrate achievements. The journal helps you stay mentally sharp and emotionally engaged in your growth.",
    image: "/images/steps/learn.jpg",
    hasOverlay: true,
  },
];

/** Mobile step card - full-width vertical layout per Figma */
function MobileStepCard({
  badge,
  title,
  description,
  image,
  hasOverlay,
}: {
  badge: string;
  title: string;
  description: string;
  image: string;
  hasOverlay: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-[18px]">
      {/* Image container with centered badge - square aspect ratio */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 343px"
          draggable={false}
        />
        {hasOverlay && <div className="absolute inset-0 rounded-xl bg-black/25" />}
        {/* Centered badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-white/[0.12] px-6 py-3 backdrop-blur-sm">
            <span
              className="text-base uppercase leading-[1.25] tracking-[0.02em] text-white"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {badge}
            </span>
          </div>
        </div>
      </div>

      {/* Title + description below image */}
      <div className="flex flex-col gap-4">
        <h3
          className="text-[22px] font-semibold leading-[1.5] text-white"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-sm uppercase leading-[1.5] text-[#d9d9d9]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/** Desktop step card - larger version for scroll-lock animation */
function DesktopStepCard({
  badge,
  title,
  description,
  image,
  hasOverlay,
}: {
  badge: string;
  title: string;
  description: string;
  image: string;
  hasOverlay: boolean;
}) {
  return (
    <div className="flex w-[762px] flex-shrink-0 flex-col gap-[18px] lg:w-[1160px]">
      {/* Image container with centered badge */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-xl lg:h-[646px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 762px, 1160px"
        />
        {hasOverlay && <div className="absolute inset-0 rounded-xl bg-black/25" />}
        {/* Centered badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-white/[0.12] px-6 py-3 backdrop-blur-sm">
            <span
              className="text-base uppercase leading-[1.25] tracking-[0.02em] text-white"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {badge}
            </span>
          </div>
        </div>
      </div>

      {/* Title + description below image */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h3
          className="text-[22px] font-semibold leading-[1.5] text-white lg:flex-shrink-0"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-sm uppercase leading-[1.5] text-[#d9d9d9] lg:w-[824px] lg:text-base"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Steps section with different scroll behaviors for mobile and desktop.
 * Mobile: Vertically stacked cards (CSS hidden on md+).
 * Desktop/Tablet: Scroll-lock animation with horizontal scroll on vertical scroll.
 */
export default function StepsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Calculate scroll distance for desktop horizontal animation
  useEffect(() => {
    function handleResize() {
      const viewportWidth = window.innerWidth;
      if (viewportWidth >= 768) {
        const cardWidth = getCardWidth(viewportWidth);
        const totalCardsWidth =
          STEPS.length * cardWidth + (STEPS.length - 1) * GAP + PADDING_LG;
        const distance = totalCardsWidth - viewportWidth + PADDING_LG;
        setScrollDistance(Math.max(0, distance));
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  // Horizontal scroll with hold zone at end (0.88-1.0 = hold period)
  const cardsX = useTransform(
    scrollYProgress,
    [0, 0.88, 1],
    [0, -scrollDistance, -scrollDistance]
  );

  return (
    <section
      aria-label="Steps"
      className="relative bg-[#010400]"
      data-header-theme="dark"
    >
      {/* Header content */}
      <div className="px-4 pb-0 pt-12 md:px-6 lg:pt-[60px]">
        <div className="flex flex-col gap-6 lg:gap-10">
          {/* Title + Description row */}
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:items-start lg:text-left">
            <RevealOnScroll className="flex-1 pr-0 lg:pr-6" dramatic>
              <h2
                className="text-4xl font-medium leading-[1.25] text-white lg:text-[52px]"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                Bleeding-edge analysis technology, at your fingertips
              </h2>
            </RevealOnScroll>

            <RevealOnScroll className="flex-1 pl-0 lg:pl-6" delay={0.1}>
              <p
                className="text-sm uppercase leading-[1.5] text-white lg:text-base"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                Utilising advanced Artificial Intelligence and computer vision
                models, AIM analyses your personal data and provides real-time
                precision coaching designed to maximise the athlete&apos;s personal
                development.
              </p>
            </RevealOnScroll>
          </div>

          {/* Download button */}
          <RevealOnScroll delay={0.2} className="w-full md:w-auto">
            <OpaqueButton onClick={openDownloadStore}>
              DOWNLOAD NOW
            </OpaqueButton>
          </RevealOnScroll>
        </div>
      </div>

      {/* Mobile: Vertically stacked cards (hidden on md+) */}
      <div className="mt-[60px] flex flex-col gap-6 px-4 pb-12 md:hidden">
        {STEPS.map((step) => (
          <MobileStepCard key={step.id} {...step} />
        ))}
      </div>

      {/* Spacer between header and cards - desktop only */}
      <div className="hidden h-[120px] md:block lg:h-[240px]" />

      {/* Desktop/Tablet: Scroll-pinned cards section */}
      <div ref={scrollContainerRef} className="relative hidden md:block">
        {/* Scroll height container - 280vh for slower, more dramatic horizontal scroll */}
        <div className="h-[280vh]">
          {/* Sticky container pins cards while scrolling */}
          <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
            <motion.div
              className="flex gap-6 px-6"
              style={{ x: cardsX }}
              transition={{ ease: DRAMATIC_EASE, duration: 0.8 }}
            >
              {STEPS.map((step) => (
                <DesktopStepCard key={step.id} {...step} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
