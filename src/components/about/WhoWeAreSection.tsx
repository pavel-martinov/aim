"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DRAMATIC_EASE, SMOOTH_EASE } from "@/lib/animations";

const STATS = [
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: 50, suffix: "+", label: "Builders" },
  { value: 1000000, suffix: "+", label: "Data Points", format: "M" },
  { value: 10000, suffix: "+", label: "Athletes Analysed", format: "K" },
] as const;

function useCounter(end: number, duration: number = 2, inView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

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

function StatCard({
  value,
  suffix,
  label,
  format,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  format?: "K" | "M";
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.5 });
  const count = useCounter(value, 2.5, isInView);

  let formattedValue = count.toString();
  if (format === "M" && count > 0) {
    formattedValue = (count / 1000000).toFixed(count >= 1000000 ? 0 : 1).replace(/\.0$/, "");
    if (formattedValue === "0") formattedValue = "0.1"; // just to show something before it hits 1M
  } else if (format === "K" && count > 0) {
    formattedValue = (count / 1000).toFixed(count >= 1000 ? 0 : 1).replace(/\.0$/, "");
    if (formattedValue === "0") formattedValue = "0.1";
  }

  // Adjust display for intermediate values
  const displayValue = format === "M" ? `${formattedValue}M` : format === "K" ? `${formattedValue}K` : formattedValue;

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-black/5 bg-black/5 p-8 transition-colors hover:border-[var(--color-brand)]/50 lg:p-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        ease: DRAMATIC_EASE,
        delay: index * 0.1,
      }}
    >
      <span
        className="text-[42px] leading-[1.1] text-black transition-colors group-hover:text-[var(--color-brand)] lg:text-[62px]"
        style={{ fontFamily: "var(--font-anton), sans-serif" }}
      >
        {displayValue}
        {suffix}
      </span>
      <span
        className="text-center text-sm uppercase tracking-[0.2em] text-black/60 lg:text-base"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function WhoWeAreSection() {
  const textRef = useRef(null);
  
  return (
    <section
      className="relative overflow-hidden bg-white py-32 lg:py-40"
      data-header-theme="light"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-24 px-6 lg:px-12">
        
        {/* Text content */}
        <motion.div 
          ref={textRef}
          className="flex flex-col items-center gap-8 text-center max-w-4xl"
        >
          <motion.span
            className="text-xs uppercase tracking-[0.3em] text-black/50"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: DRAMATIC_EASE }}
          >
            Who We Are
          </motion.span>
          
          <motion.p
            className="text-[36px] font-medium capitalize leading-[1.25] tracking-tight text-black lg:text-[52px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: SMOOTH_EASE, delay: 0.1 }}
          >
            AIM was born from a team of serial entrepreneurs, technical gurus and sports experts who all share a love of the game.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>
        
      </div>
    </section>
  );
}
