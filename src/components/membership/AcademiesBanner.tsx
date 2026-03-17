"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { cn } from "@/lib/utils";
import { calculateAcademiesPrice, type BillingCycle } from "@/lib/constants";
import { useCurrency } from "@/lib/context/CurrencyContext";

const ACADEMIES_FEATURES = [
  "Coach CRM & player management",
  "Assign drills & homework",
  "Team analytics dashboard",
  "Unlimited challenge creation",
  "Priority support",
];

/** Custom slider for selecting student count */
function StudentSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const isEnterprise = value > 100;
  const displayValue = isEnterprise ? "100+" : value;

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-xs font-medium uppercase tracking-[0.14em] text-white/85"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Players
        </span>
        <span
          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold uppercase text-white"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={10}
        max={110}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="academies-slider h-2 w-full cursor-pointer appearance-none rounded-full outline-none transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={
          {
            "--slider-progress": `${((value - 10) / 100) * 100}%`,
            background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) var(--slider-progress), rgba(255,255,255,0.35) var(--slider-progress), rgba(255,255,255,0.35) 100%)`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

interface AcademiesBannerProps {
  billingCycle: BillingCycle;
}

/**
 * Wide banner component for Academies (B2B) plan.
 * Displays background image, plan details, player count slider, and dynamic pricing.
 */
export default function AcademiesBanner({ billingCycle }: AcademiesBannerProps) {
  const router = useRouter();
  const { currency, formatPrice } = useCurrency();
  const [students, setStudents] = useState(10);

  const isEnterprise = students > 100;
  const price = calculateAcademiesPrice(students, billingCycle, currency);
  const ctaText = isEnterprise ? "Contact Sales" : "Start Free Trial";

  const handleCtaClick = () => {
    if (!isEnterprise) {
      router.push(`/membership/academy?cycle=${billingCycle}&students=${students}`);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/gallery-1.jpg"
          alt="Soccer athlete training"
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12 lg:p-12">
        {/* Left side - Plan info */}
        <div className="flex flex-1 flex-col">
          <h3
            className="text-[32px] uppercase leading-[0.95] tracking-tight text-white sm:text-[40px] lg:text-[56px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            Academies
          </h3>
          <p
            className="mt-2 max-w-md text-sm leading-relaxed text-white/60 sm:text-base lg:mt-3"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Enhance your academy performance and be in complete control. Manage players, assign drills, and track progress in one place, with Pro plan access automatically included for every player.
          </p>

          {/* Features list */}
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 lg:mt-6">
            {ACADEMIES_FEATURES.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-white/70 sm:text-sm"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0 text-[var(--color-brand)]"
                >
                  <path
                    d="M2.5 7l3 3 6-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Compact CTA aligned with other pricing package buttons */}
          <div className="mt-5">
            <OpaqueButton
              variant="inline"
              onClick={handleCtaClick}
              showIcon={false}
              className="!w-full justify-center !py-2.5 text-xs sm:!w-auto sm:!py-3 sm:text-sm"
            >
              {ctaText}
            </OpaqueButton>
          </div>
        </div>

        {/* Right side - Player selector and pricing */}
        <div className="flex w-full flex-col justify-center rounded-[24px] border border-white/10 bg-black/25 p-5 backdrop-blur-sm sm:p-6 lg:max-w-sm lg:items-end lg:text-right">
          {/* Slider */}
          <StudentSlider value={students} onChange={setStudents} />

          {/* Price display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`academies-${billingCycle}-${students}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
              className="mt-5 flex flex-col items-start lg:items-end"
            >
              {isEnterprise ? (
                <span
                  className="text-3xl uppercase tracking-tight text-white sm:text-4xl lg:text-5xl"
                  style={{ fontFamily: "var(--font-anton), sans-serif" }}
                >
                  Custom
                </span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[40px] leading-[0.9] tracking-tight text-white sm:text-[56px] lg:text-[64px]"
                    style={{ fontFamily: "var(--font-anton), sans-serif" }}
                  >
                    {formatPrice(price)}
                  </span>
                  <span
                    className="text-sm font-bold uppercase tracking-wider text-white/40 lg:text-lg"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    /mo
                  </span>
                </div>
              )}
              <p
                className={cn(
                  "mt-1 text-xs uppercase lg:text-sm",
                  isEnterprise ? "text-white/50" : "text-[var(--color-brand)]"
                )}
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                {isEnterprise
                  ? "Enterprise pricing for 100+ players"
                  : `Includes ${students} players with Pro plan access`}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
