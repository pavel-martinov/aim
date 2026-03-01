"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { DRAMATIC_EASE } from "@/lib/animations";
import SectionHeader from "@/components/ui/SectionHeader";

/** Stats data with designer-style numbers */
const STATS = [
  { value: 500000, suffix: "+", label: "Active Users", prefix: "" },
  { value: 98, suffix: "%", label: "Accuracy Rate", prefix: "" },
  { value: 24, suffix: "/7", label: "AI Analysis", prefix: "" },
  { value: 150, suffix: "+", label: "Countries", prefix: "" },
] as const;

/**
 * Animated counter hook for count-up effect.
 */
function useCounter(end: number, duration: number = 2, inView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);

  return count;
}

/**
 * Individual stat card with animated counter.
 */
function StatCard({
  value,
  suffix,
  prefix,
  label,
  index,
}: {
  value: number;
  suffix: string;
  prefix: string;
  label: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.5 });
  const count = useCounter(value, 2.5, isInView);

  // Format large numbers with K suffix
  const formattedValue =
    value >= 1000 ? `${Math.floor(count / 1000)}K` : count.toString();

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:border-[var(--color-brand)]/30 lg:p-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        ease: DRAMATIC_EASE,
        delay: index * 0.1,
      }}
    >
      {/* Stat value */}
      <span
        className="text-5xl text-white transition-colors group-hover:text-[var(--color-brand)] sm:text-6xl lg:text-[80px]"
        style={{ fontFamily: "var(--font-anton), sans-serif" }}
      >
        {prefix}
        {formattedValue}
        {suffix}
      </span>

      {/* Label */}
      <span
        className="text-xs uppercase tracking-[0.2em] text-white/60"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {label}
      </span>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[var(--color-brand)] transition-all duration-500 group-hover:w-1/2" />
    </motion.div>
  );
}

/**
 * Stats section with designer-style numbers and count-up animations.
 */
export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#010400] py-24 lg:py-32"
      data-header-theme="dark"
    >
      {/* Subtle background pattern */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          y: bgY,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, var(--color-brand) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center gap-16 px-6">
        <SectionHeader eyebrow="In Numbers" headline="The impact we've made" />

        {/* Stats grid */}
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
