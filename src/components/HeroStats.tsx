"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { DRAMATIC_EASE } from "@/lib/animations";

const STATS_DATA = [
  { label: "Ball Control", value: 93, suffix: "%" },
  { label: "Technique", value: 69, suffix: "%" },
  { label: "Movement", value: 75, suffix: "%" },
] as const;

const COUNT_DURATION = 2500;
const ENTRANCE_DURATION = 1.0;
const STAGGER_DELAY = 0.35;
const DOT_CYCLE_INTERVAL = 1000;
const MOBILE_STAT_CYCLE_INTERVAL = 5000;
const RANDOM_CYCLE_INTERVAL = 5000;
const RANDOM_VALUE_MIN = 60;
const RANDOM_VALUE_MAX = 99;

/** Easing function: easeOutCubic for smooth deceleration */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Generates a random value different from current */
const generateRandomValue = (current: number) => {
  let newValue;
  do {
    newValue =
      Math.floor(Math.random() * (RANDOM_VALUE_MAX - RANDOM_VALUE_MIN + 1)) +
      RANDOM_VALUE_MIN;
  } while (newValue === current);
  return newValue;
};

/** Cycling dots indicator that auto-switches active state */
function AnimatedDots() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, DOT_CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-300",
            activeIndex === i ? "opacity-100" : "opacity-30"
          )}
        />
      ))}
    </div>
  );
}

/** Single stat item with animated entrance, number counting, and auto-cycling */
function StatItem({
  label,
  value,
  suffix,
  index,
  shouldAnimate,
}: {
  label: string;
  value: number;
  suffix: string;
  index: number;
  shouldAnimate: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [startCount, setStartCount] = useState(false);
  const [targetValue, setTargetValue] = useState(value);
  const [startValue, setStartValue] = useState(0);
  const [isCycling, setIsCycling] = useState(false);
  const animationRef = useRef<number | null>(null);

  const entranceDelay = index * STAGGER_DELAY;

  useEffect(() => {
    if (!startCount) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / COUNT_DURATION, 1);
      const easedProgress = easeOutCubic(progress);

      const newValue = Math.round(
        startValue + (targetValue - startValue) * easedProgress
      );
      setDisplayValue(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (!isCycling) {
        setIsCycling(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startCount, targetValue, startValue, isCycling]);

  useEffect(() => {
    if (!isCycling) return;

    const interval = setInterval(() => {
      setStartValue(displayValue);
      setTargetValue(generateRandomValue(displayValue));
    }, RANDOM_CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [isCycling, displayValue]);

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: ENTRANCE_DURATION,
        ease: DRAMATIC_EASE,
        delay: entranceDelay,
      }}
      onAnimationComplete={() => {
        if (shouldAnimate && !startCount) {
          setStartCount(true);
        }
      }}
    >
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(to right, transparent, white)" }}
      />
      <div className="flex items-center justify-between pt-6">
        <div className="flex flex-col">
          <span className="text-sm uppercase text-white/60 lg:text-base">
            {label}
          </span>
          <span className="text-4xl font-medium text-white lg:text-[52px] lg:leading-[1.25]">
            {displayValue}
            {suffix}
          </span>
        </div>
        <AnimatedDots />
      </div>
    </motion.div>
  );
}

/** Mobile stat item with count-up animation triggered when becoming active */
function MobileStatItem({
  label,
  value,
  suffix,
  isActive,
}: {
  label: string;
  value: number;
  suffix: string;
  isActive: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const prevActiveRef = useRef(false);

  useEffect(() => {
    // Reset and start animation when becoming active
    if (isActive && !prevActiveRef.current) {
      setDisplayValue(0);
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / COUNT_DURATION, 1);
        const easedProgress = easeOutCubic(progress);
        const newValue = Math.round(value * easedProgress);
        setDisplayValue(newValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    prevActiveRef.current = isActive;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, value]);

  return (
    <div className="flex flex-col">
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(to right, transparent, white)" }}
      />
      <div className="flex items-center justify-between pt-3">
        <div className="flex flex-col">
          <span className="text-sm uppercase text-white/60">{label}</span>
          <span className="text-4xl font-medium text-white">
            {displayValue}
            {suffix}
          </span>
        </div>
        <AnimatedDots />
      </div>
    </div>
  );
}

/**
 * Hero stats component with epic dramatic animations.
 * Desktop/Tablet: Staggered entrance with count-up after each appears.
 * Mobile: Cycles through stats one at a time (5s each) with smooth fade transition.
 */
export default function HeroStats({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Start cycling when component comes into view
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  // Cycle through stats every 5 seconds
  useEffect(() => {
    if (!hasStarted) return;

    const interval = setInterval(() => {
      setMobileActiveIndex((prev) => (prev + 1) % STATS_DATA.length);
    }, MOBILE_STAT_CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [hasStarted]);

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-2.5", className)}>
      {/* Desktop/Tablet: Staggered dramatic entrance */}
      <div className="hidden md:flex md:w-[336px] md:flex-col md:gap-2.5">
        {STATS_DATA.map((stat, index) => (
          <StatItem
            key={stat.label}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            index={index}
            shouldAnimate={isInView}
          />
        ))}
      </div>

      {/* Mobile: Cycling stats with dramatic fade transition */}
      <div className="relative h-[72px] w-full md:hidden">
        {STATS_DATA.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="absolute inset-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: mobileActiveIndex === index ? 1 : 0,
              y: mobileActiveIndex === index ? 0 : 10,
            }}
            transition={{ duration: 0.65, ease: DRAMATIC_EASE }}
          >
            <MobileStatItem
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              isActive={hasStarted && mobileActiveIndex === index}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
