"use client";

import Image from "next/image";
import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

/** Step card data */
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

/** Responsive step card with image, badge overlay, title and description */
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
    <div className="flex flex-col gap-[18px]">
      {/* Image container - square on mobile/tablet, taller on desktop */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl md:h-[394px] md:aspect-auto lg:h-[646px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 684px"
          draggable={false}
        />
        {hasOverlay && (
          <div className="absolute inset-0 rounded-xl bg-black/25" />
        )}
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

      {/* Title + description */}
      <div className="flex flex-col gap-4">
        <h3
          className="text-[22px] font-semibold leading-[1.5] text-white"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-sm uppercase leading-[1.5] text-[#d9d9d9] md:text-base"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Steps section with responsive grid layout.
 * Mobile: single column, Tablet/Desktop: 2-column grid.
 */
export default function StepsSection() {
  return (
    <section
      aria-label="Steps"
      className="bg-[#010400] px-4 py-12 md:px-6 md:py-[60px]"
      data-header-theme="dark"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-6 text-center">
        <RevealOnScroll dramatic>
          <h2
            className="max-w-[696px] text-4xl font-medium leading-[1.25] text-white md:text-[46px]"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Bleeding-edge analysis technology, at your fingertips
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p
            className="max-w-[504px] text-sm uppercase leading-[1.5] text-white md:text-base"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Utilising advanced Artificial Intelligence and computer vision
            models, AIM analyses your personal data and provides real-time
            precision coaching designed to maximise the athlete&apos;s personal
            development.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className="w-full md:w-auto">
          <OpaqueButton onClick={openDownloadStore}>DOWNLOAD NOW</OpaqueButton>
        </RevealOnScroll>
      </div>

      {/* Spacer */}
      <div className="h-[60px] md:h-[60px]" />

      {/* Cards grid - 1 col mobile, 2 cols tablet+ */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {STEPS.map((step, index) => (
          <RevealOnScroll key={step.id} delay={index * 0.08}>
            <StepCard {...step} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
