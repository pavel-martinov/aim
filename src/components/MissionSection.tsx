"use client";

import Image from "next/image";
import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

/** Product card data for carousel */
const PRODUCTS = [
  {
    title: "Data Analysis",
    description:
      "Monitor your every move with precise, frame-by-frame analysis. Our AI provides real-time insights into your speed, technique, and control.",
    image: "/images/data-analysis.jpg",
    overlayOpacity: 0.32,
  },
  {
    title: "Progress Tracking",
    description:
      "Turn raw performance data into clear visuals. Discover your strengths, weaknesses, and progress over time with sleek, interactive charts that keep you focused on growth.",
    image: "/images/progress-tracking.jpg",
    overlayOpacity: 0.52,
  },
  {
    title: "Tailored Insights",
    description:
      "Review your training sessions, note key insights, and celebrate achievements. The journal helps you stay mentally sharp and emotionally engaged in your growth.",
    image: "/images/tailored-insights.jpg",
    overlayOpacity: 0,
  },
  {
    title: "Goals & Milestones",
    description:
      "Set clear, personalised targets and track your journey towards them. From micro-goals to major breakthroughs, AIM helps you stay motivated and accountable with structured progress checkpoints.",
    image: "/images/goals-milestones.jpg",
    overlayOpacity: 0.52,
  },
];

/** Simplified product card with background image, title, and description */
function ProductCard({
  title,
  description,
  image,
  overlayOpacity,
}: {
  title: string;
  description: string;
  image: string;
  overlayOpacity: number;
}) {
  return (
    <div className="relative flex h-[500px] w-[320px] flex-shrink-0 flex-col overflow-hidden rounded-[24px] md:h-[520px] md:w-[467px] lg:h-[646px] lg:w-[580px]">
      {/* Background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 320px, (max-width: 1024px) 467px, 580px"
        draggable={false}
      />

      {/* Dark overlay */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 rounded-[24px]"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 p-6 md:p-10 lg:p-12">
        <h3 className="text-2xl font-semibold leading-[1.25] text-white md:text-[32px] lg:text-[40px]">
          {title}
        </h3>
        <p className="text-sm font-normal uppercase leading-[1.5] text-white md:text-[13px] lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Mission section with centered header and product cards.
 * Mobile: Touch-swipeable horizontal scroll with snap.
 * Desktop: Auto-scrolling infinite carousel.
 */
export default function MissionSection() {
  return (
    <section
      aria-label="Our Mission"
      className="relative bg-white py-[60px]"
      data-header-theme="light"
    >
      {/* Header content - centered with constrained width */}
      <div className="mx-auto flex max-w-[696px] flex-col items-center gap-6 px-4 text-center lg:px-6">
        <RevealOnScroll dramatic>
          <h2 className="text-4xl font-medium capitalize leading-[1.25] text-black lg:text-[46px]">
            Building The World&apos;s Most Intelligent Training System.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p className="max-w-[516px] text-sm font-normal uppercase leading-[1.5] text-black lg:text-base">
            AIM isn&apos;t just about improvement, it&apos;s about evolution. We
            believe elite coaching should be available to anyone with a ball, a
            dream, and a desire to be better.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className="w-full md:w-auto">
          <OpaqueButton onClick={openDownloadStore}>
            Download Now
          </OpaqueButton>
        </RevealOnScroll>
      </div>

      {/* Mobile: Touch-swipeable horizontal scroll with snap */}
      <RevealOnScroll delay={0.3} viewportAmount={0.1}>
        <div
          className="mission-carousel mt-[60px] flex gap-3 overflow-x-auto px-4 md:hidden"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {PRODUCTS.map((product) => (
            <div
              key={product.title}
              className="flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard
                title={product.title}
                description={product.description}
                image={product.image}
                overlayOpacity={product.overlayOpacity}
              />
            </div>
          ))}
        </div>
      </RevealOnScroll>

      {/* Desktop: Auto-scrolling infinite carousel */}
      <RevealOnScroll delay={0.3} viewportAmount={0.1}>
        <div className="relative left-1/2 mt-[60px] hidden w-screen -translate-x-1/2 overflow-hidden md:block">
          <div
            className="flex gap-3 motion-reduce:animate-none"
            style={{
              animation: "marquee 41.67s linear infinite",
              willChange: "transform",
            }}
          >
            {/* First set of cards */}
            {PRODUCTS.map((product) => (
              <ProductCard
                key={`first-${product.title}`}
                title={product.title}
                description={product.description}
                image={product.image}
                overlayOpacity={product.overlayOpacity}
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {PRODUCTS.map((product) => (
              <ProductCard
                key={`second-${product.title}`}
                title={product.title}
                description={product.description}
                image={product.image}
                overlayOpacity={product.overlayOpacity}
              />
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
