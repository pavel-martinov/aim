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
  mobile: 314,
  tablet: 762,
  desktop: 1160,
};

const GAP = 24;
const PADDING = 16; // px-4 on mobile
const PADDING_LG = 24; // px-6 on lg

/** Returns card width based on viewport width */
function getCardWidth(viewportWidth: number): number {
  if (viewportWidth >= 1024) return CARD_WIDTHS.desktop;
  if (viewportWidth >= 768) return CARD_WIDTHS.tablet;
  return CARD_WIDTHS.mobile;
}

/** Returns padding based on viewport width */
function getPadding(viewportWidth: number): number {
  return viewportWidth >= 1024 ? PADDING_LG : PADDING;
}

/** Step card data for the horizontal carousel */
const STEPS = [
  {
    id: "begin",
    badge: "BEGIN",
    title: "Begin",
    description:
      "Begin Your Training Journey, Master Skills That Change Your Game. Every stat tells a story, and our AI analyzes your moves, offering the data needed for real progress. This is more than tracking performance; it's about personal growth, driven by valuable feedback.",
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

/** Reusable step card component with image, badge, title, and description */
function StepCard({
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
    <div className="flex w-[314px] flex-shrink-0 flex-col gap-[18px] md:w-[762px] lg:w-[1160px]">
      {/* Image container with centered badge */}
      <div className="relative h-[422px] w-full overflow-hidden rounded-xl lg:h-[646px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 314px, (max-width: 1024px) 762px, 1160px"
        />
        {hasOverlay && <div className="absolute inset-0 bg-black/25 rounded-xl" />}
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
 * Steps section with horizontal scroll-lock animation.
 * Cards pin when visible and scroll horizontally as user scrolls vertically.
 */
export default function StepsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Calculate scroll distance on mount and resize
  useEffect(() => {
    function calculateScrollDistance() {
      const viewportWidth = window.innerWidth;
      const cardWidth = getCardWidth(viewportWidth);
      const padding = getPadding(viewportWidth);
      
      // Total width: all cards + gaps between them + left padding
      const totalCardsWidth =
        STEPS.length * cardWidth + (STEPS.length - 1) * GAP + padding;
      
      // Distance to scroll so last card is right-aligned with padding
      const distance = totalCardsWidth - viewportWidth + padding;
      setScrollDistance(Math.max(0, distance));
    }

    calculateScrollDistance();
    window.addEventListener("resize", calculateScrollDistance);
    return () => window.removeEventListener("resize", calculateScrollDistance);
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
      <div className="px-4 pb-0 pt-12 lg:px-6 lg:pt-[60px]">
        <div className="flex flex-col gap-6 lg:gap-10">
          {/* Title + Description row */}
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <RevealOnScroll className="flex-1 pr-0 lg:pr-6">
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
          <RevealOnScroll delay={0.2}>
            <OpaqueButton variant="card" onClick={openDownloadStore} className="w-full md:w-[240px]">
              DOWNLOAD NOW
            </OpaqueButton>
          </RevealOnScroll>
        </div>
      </div>

      {/* Spacer between header and cards */}
      <div className="h-[120px] lg:h-[240px]" />

      {/* Scroll-pinned cards section */}
      <div ref={scrollContainerRef} className="relative">
        {/* Scroll height container - 280vh for slower, more dramatic horizontal scroll */}
        <div className="h-[280vh]">
          {/* Sticky container pins cards while scrolling */}
          <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
            <motion.div
              className="flex gap-6 px-4 lg:px-6"
              style={{ x: cardsX }}
              transition={{ ease: DRAMATIC_EASE, duration: 0.8 }}
            >
              {STEPS.map((step) => (
                <StepCard key={step.id} {...step} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
