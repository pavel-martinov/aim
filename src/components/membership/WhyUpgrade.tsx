"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

/** Feature card data */
type Feature = {
  id: string;
  title: string;
  description: string;
  image: string;
  number: string;
  isFullWidth: boolean;
};

/** The Aim Advantage Features - Bento Box layout */
const FEATURES: Feature[] = [
  {
    id: "ai-analysis",
    title: "Advanced AI Analysis",
    description:
      "Frame-by-frame performance breakdown with deep technical insights. Our AI identifies patterns invisible to the human eye.",
    image: "/images/data-analysis.jpg",
    number: "01",
    isFullWidth: true,
  },
  {
    id: "unlimited-coaching",
    title: "Unlimited AI Coaching",
    description:
      "Your personal coach that never sleeps. Get instant, contextual feedback after every drill—voice or chat, anytime.",
    image: "/images/progress-tracking.jpg",
    number: "02",
    isFullWidth: false,
  },
  {
    id: "premium-community",
    title: "Premium Community",
    description:
      "Connect with coaches, scouts, and serious athletes. Access exclusive channels where real opportunities are shared.",
    image: "/images/tailored-insights.jpg",
    number: "03",
    isFullWidth: false,
  },
  {
    id: "drill-insights",
    title: "Deep Drill Insights",
    description:
      "Full metric visibility with trend analysis over time. See exactly what's working and what needs attention.",
    image: "/images/goals-milestones.jpg",
    number: "04",
    isFullWidth: true,
  },
];

/** Individual feature card in the Bento grid */
function BentoCard({ feature, index }: { feature: Feature; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax on the background image
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <RevealOnScroll
      delay={index * 0.1}
      className={cn(
        "relative h-[400px] overflow-hidden rounded-[32px] bg-[#080808] md:h-[500px]",
        feature.isFullWidth ? "lg:col-span-2" : "lg:col-span-1"
      )}
    >
      <motion.div
        ref={cardRef}
        className="group flex h-full w-full flex-col justify-end"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
      >
        {/* Background Image with Parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
            sizes={
              feature.isFullWidth
                ? "(max-width: 1024px) 100vw, 100vw"
                : "(max-width: 1024px) 100vw, 50vw"
            }
          />
        </motion.div>

        {/* Heavy Black Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-80" />
        <div className="absolute inset-0 z-10 bg-black/20 mix-blend-multiply" />

        {/* Giant Number in Background */}
        <div className="absolute -right-8 -top-12 z-20 select-none opacity-20 transition-transform duration-[800ms] group-hover:-translate-y-4 group-hover:translate-x-4">
          <span
            className="text-[200px] leading-none tracking-tighter text-white md:text-[280px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            {feature.number}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-30 flex flex-col gap-4 p-8 md:p-12 lg:p-16">
          <h3
            className="text-2xl font-semibold leading-[1.25] text-white md:text-[32px] lg:text-[40px]"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {feature.title}
          </h3>
          <p
            className="max-w-md text-sm uppercase leading-[1.5] text-white/70 md:text-base"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {feature.description}
          </p>
        </div>

        {/* Subtle border */}
        <div className="pointer-events-none absolute inset-0 z-40 rounded-[32px] border border-white/10 transition-colors duration-500 group-hover:border-[var(--color-brand)]/30" />
      </motion.div>
    </RevealOnScroll>
  );
}

/**
 * The Aim Advantage section showcasing premium features in a modern Bento grid.
 */
export default function WhyUpgrade() {
  return (
    <section className="relative bg-black px-4 py-20 lg:px-6 lg:py-32">
      {/* Section Header */}
      <div className="mx-auto mb-16 max-w-[1280px] lg:mb-24">
        <RevealOnScroll>
          <span
            className="mb-6 inline-block bg-[var(--color-brand)] px-4 py-2 text-sm font-bold uppercase tracking-widest text-black"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Premium Features
          </span>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} dramatic>
          <h2
            className="text-[58px] uppercase leading-[1.1] tracking-tight text-white md:text-[124px] lg:text-[144px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            THE AIM <br className="hidden md:block" /> ADVANTAGE
          </h2>
        </RevealOnScroll>
      </div>

      {/* Bento Grid */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {FEATURES.map((feature, index) => (
          <BentoCard key={feature.id} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
