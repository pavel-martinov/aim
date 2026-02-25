"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { DRAMATIC_EASE } from "@/lib/animations";
import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

/** Responsive card dimensions from Figma */
const CARD_WIDTHS = { mobile: 314, desktop: 580 };
const CARD_HEIGHTS = { mobile: 444, desktop: 646 };
const GAPS = { mobile: 12, desktop: 24 };
const PADDING = { mobile: 16, desktop: 24 };

/** Returns card width based on viewport (lg breakpoint = 1024px) */
function getCardWidth(viewportWidth: number): number {
  return viewportWidth >= 1024 ? CARD_WIDTHS.desktop : CARD_WIDTHS.mobile;
}

/** Returns gap based on viewport */
function getGap(viewportWidth: number): number {
  return viewportWidth >= 1024 ? GAPS.desktop : GAPS.mobile;
}

/** Returns padding based on viewport */
function getPadding(viewportWidth: number): number {
  return viewportWidth >= 1024 ? PADDING.desktop : PADDING.mobile;
}

/** Product card data for the horizontal carousel */
const PRODUCTS = [
  {
    title: "Data Analysis",
    description:
      "Monitor your every move with precise, frame-by-frame analysis. Our AI provides real-time insights into your speed, technique, and control.",
    image: "/images/data-analysis.jpg",
    overlay: "bg-black/30",
  },
  {
    title: "Progress Tracking",
    description:
      "Turn raw performance data into clear visuals. Discover your strengths, weaknesses, and progress over time with sleek, interactive charts that keep you focused on growth.",
    image: "/images/progress-tracking.jpg",
    overlay: "bg-black/50",
  },
  {
    title: "Tailored Insights",
    description:
      "Review your training sessions, note key insights, and celebrate achievements. The journal helps you stay mentally sharp and emotionally engaged in your growth.",
    image: "/images/tailored-insights.jpg",
    overlay: "",
  },
  {
    title: "Goals & Milestones",
    description:
      "Set clear, personalized targets and track your journey toward them. From micro-goals to major breakthroughs, AIM helps you stay motivated and accountable with structured progress checkpoints.",
    image: "/images/goals-milestones.jpg",
    overlay: "bg-black/50",
  },
];

/** Reusable product card - responsive dimensions: 314x444 mobile, 580x646 desktop */
function ProductCard({
  title,
  description,
  image,
  overlay,
}: {
  title: string;
  description: string;
  image: string;
  overlay: string;
}) {
  return (
    <div className="relative h-full w-[314px] flex-shrink-0 overflow-hidden rounded-[12px] lg:w-[580px]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 314px, 580px"
      />
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      <div className="relative z-10 flex h-full flex-col gap-4 p-6 lg:p-12">
        <h3
          className="text-2xl font-semibold leading-[1.25] text-white lg:text-[40px]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-sm uppercase leading-[1.5] text-white lg:text-base"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Horizontal scroll-lock products section.
 * Cards pin when visible and scroll horizontally as user scrolls vertically.
 * Animation holds briefly after last card is visible, then releases.
 */
export default function MissionSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Calculate scroll distance on mount and resize
  useEffect(() => {
    function calculateScrollDistance() {
      const viewportWidth = window.innerWidth;
      const cardWidth = getCardWidth(viewportWidth);
      const gap = getGap(viewportWidth);
      const padding = getPadding(viewportWidth);

      // Total width: all cards + gaps between them + left padding
      const totalCardsWidth =
        PRODUCTS.length * cardWidth + (PRODUCTS.length - 1) * gap + padding;

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

  // Horizontal scroll with hold zone at end (0.88-1.0 = hold period before release)
  const cardsX = useTransform(
    scrollYProgress,
    [0, 0.88, 1],
    [0, -scrollDistance, -scrollDistance]
  );

  return (
    <section aria-label="Our Products" className="relative bg-white" data-header-theme="light">
      {/* Static header content - scrolls normally with page */}
      <div className="px-4 pb-0 pt-[60px] lg:px-6">
        <div className="flex flex-col gap-6 lg:gap-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
            <RevealOnScroll className="flex-1 pr-0 lg:pr-6">
              <h2
                className="text-4xl font-medium leading-[1.25] text-black lg:text-[52px]"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                AIM is building the world&apos;s most intelligent training
                system merging human ambition with AI precision.
              </h2>
            </RevealOnScroll>

            <RevealOnScroll className="flex-1 pl-0 lg:pl-6" delay={0.1}>
              <p
                className="text-sm uppercase leading-[1.5] text-black lg:text-base"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                AIM isn&apos;t just about improvement, it&apos;s about
                evolution.
                <br />
                We believe elite coaching should be available to anyone with a
                ball, a dream, and a desire to be better.
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={0.2}>
            <OpaqueButton variant="solid" href="#products">
              Learn More
            </OpaqueButton>
          </RevealOnScroll>
        </div>
      </div>

      {/* Spacer between header and cards - 120px mobile / 240px desktop from Figma */}
      <div className="h-[120px] lg:h-[240px]" />

      {/* Scroll-pinned cards section */}
      <div ref={scrollContainerRef} className="relative">
        {/* Scroll height container - 280vh for slower, dramatic horizontal scroll */}
        <div className="h-[280vh]">
          {/* Sticky container pins cards while scrolling */}
          <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
            <motion.div
              className="flex gap-3 px-4 lg:gap-6 lg:px-6"
              style={{ x: cardsX }}
              transition={{ ease: DRAMATIC_EASE, duration: 0.8 }}
            >
              {/* Cards container - responsive height: 444px mobile / 646px desktop */}
              <div className="flex h-[444px] gap-3 lg:h-[646px] lg:gap-6">
                {PRODUCTS.map((product) => (
                  <ProductCard key={product.title} {...product} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
