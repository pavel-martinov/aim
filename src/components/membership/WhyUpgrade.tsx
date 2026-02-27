"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

/** Feature card data */
type Feature = {
  id: string;
  title: string;
  description: string;
  image: string;
};

/** Premium features that justify upgrading */
const FEATURES: Feature[] = [
  {
    id: "ai-analysis",
    title: "Advanced AI Analysis",
    description:
      "Frame-by-frame performance breakdown with deep technical insights. Our AI identifies patterns invisible to the human eye.",
    image: "/images/data-analysis.jpg",
  },
  {
    id: "unlimited-coaching",
    title: "Unlimited AI Coaching",
    description:
      "Your personal coach that never sleeps. Get instant, contextual feedback after every drill—voice or chat, anytime.",
    image: "/images/progress-tracking.jpg",
  },
  {
    id: "premium-community",
    title: "Premium Community",
    description:
      "Connect with coaches, scouts, and serious athletes. Access exclusive channels where real opportunities are shared.",
    image: "/images/tailored-insights.jpg",
  },
  {
    id: "drill-insights",
    title: "Deep Drill Insights",
    description:
      "Full metric visibility with trend analysis over time. See exactly what's working and what needs attention.",
    image: "/images/goals-milestones.jpg",
  },
];

/** Individual feature card with image background */
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <RevealOnScroll delay={index * 0.08} className="h-full">
      <motion.div
        className="group relative flex h-[340px] flex-col overflow-hidden rounded-xl md:h-[380px] lg:h-[420px]"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
      >
        {/* Background image */}
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

        {/* Content */}
        <div className="relative z-10 mt-auto flex flex-col gap-2 p-5 lg:p-6">
          <h3
            className="text-lg uppercase tracking-tight text-white lg:text-xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            {feature.title}
          </h3>

          <p
            className="text-xs leading-relaxed text-white/60 lg:text-sm"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {feature.description}
          </p>
        </div>

        {/* Subtle border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/0 transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:border-white/10" />
      </motion.div>
    </RevealOnScroll>
  );
}

/**
 * Why Upgrade section showcasing premium features with visual cards.
 * Clean, professional design without icons or emojis.
 */
export default function WhyUpgrade() {
  return (
    <section className="relative bg-[#0a0a0a] px-4 py-16 lg:px-6 lg:py-20">
      {/* Section header */}
      <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
        <RevealOnScroll>
          <span
            className="mb-3 inline-block text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Premium Features
          </span>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} dramatic>
          <h2
            className="text-3xl uppercase tracking-tight text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            Why Go Premium
          </h2>
        </RevealOnScroll>
      </div>

      {/* Feature cards grid */}
      <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
