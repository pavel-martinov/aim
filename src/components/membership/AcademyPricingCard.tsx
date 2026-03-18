"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import OpaqueButton from "@/components/ui/OpaqueButton";
import CheckIcon from "@/components/ui/CheckIcon";
import { cn } from "@/lib/utils";
import { calculateAcademiesPrice, type BillingCycle, type PlanConfig } from "@/lib/constants";
import { useCurrency } from "@/lib/context/CurrencyContext";

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
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Players
        </span>
        <span
          className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase text-white"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
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
        className="academies-slider h-1.5 sm:h-2 w-full cursor-pointer appearance-none rounded-full outline-none transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={
          {
            "--slider-progress": `${((value - 10) / 100) * 100}%`,
            background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) var(--slider-progress), rgba(255,255,255,0.2) var(--slider-progress), rgba(255,255,255,0.2) 100%)`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default function AcademyPricingCard({
  plan,
  billingCycle,
  onCtaClick,
}: {
  plan: PlanConfig;
  billingCycle: BillingCycle;
  onCtaClick: (planId: string, students: number) => void;
}) {
  const { currency, formatPrice } = useCurrency();
  const [students, setStudents] = useState(10);
  
  const isEnterprise = students > 100;
  const price = calculateAcademiesPrice(students, billingCycle, currency);
  const monthlyPrice = calculateAcademiesPrice(students, "monthly", currency);
  const showDiscount = billingCycle === "annual" && !isEnterprise;

  const handleCtaClick = () => {
    onCtaClick(plan.id, students);
  };

  return (
    <motion.div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[24px] p-4 sm:p-6 transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:rounded-[32px] lg:p-6",
        plan.highlighted
          ? "z-10 bg-[var(--color-brand)] text-black shadow-2xl"
          : "border border-white/10 bg-[#080808] text-white"
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
    >
      {!plan.highlighted && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
      )}

      {/* Plan header */}
      <div className="relative z-10 mb-2 sm:mb-3 lg:mb-4">
        <h3
          className="text-[20px] sm:text-[24px] lg:text-[32px] font-semibold leading-[1.25]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {plan.name}
        </h3>
        {plan.tagline && (
          <p
            className={cn(
              "mt-1 sm:mt-2 text-[10px] sm:text-sm uppercase leading-[1.5]",
              plan.highlighted ? "text-black/70" : "text-white/50"
            )}
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {plan.tagline}
          </p>
        )}
      </div>

      {/* Price - now at top for horizontal alignment */}
      <div className="relative z-10 mb-3 sm:mb-4 lg:mb-5 min-h-[70px] sm:min-h-[80px] lg:min-h-[90px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`academies-${billingCycle}-${students}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
            className="flex flex-col"
          >
            {/* Crossed-out original price + discount badge */}
            {showDiscount && (
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={cn(
                    "text-sm sm:text-base line-through",
                    plan.highlighted ? "text-black/40" : "text-white/40"
                  )}
                  style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  {formatPrice(monthlyPrice)}
                </span>
                <span className="rounded-sm bg-[var(--color-brand)] px-1.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase text-black">
                  -20%
                </span>
              </div>
            )}
            
            <div className="flex items-baseline gap-1 sm:gap-2">
              {isEnterprise ? (
                <span
                  className="text-[32px] sm:text-[40px] lg:text-[56px] uppercase leading-[0.9] tracking-tight"
                  style={{ fontFamily: "var(--font-anton), sans-serif" }}
                >
                  Custom
                </span>
              ) : (
                <>
                  <span
                    className="text-[32px] sm:text-[40px] lg:text-[56px] leading-[0.9] tracking-tight"
                    style={{ fontFamily: "var(--font-anton), sans-serif" }}
                  >
                    {formatPrice(price)}
                  </span>
                  <span
                    className={cn(
                      "text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider",
                      plan.highlighted ? "text-black/50" : "text-white/40"
                    )}
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    /mo
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider - now below price */}
      <div className="relative z-10 mb-6 pb-6 border-b border-white/10">
        <StudentSlider value={students} onChange={setStudents} />
      </div>

      {/* Features list with checkmarks */}
      <div className="relative z-10 flex-1">
        {plan.featuresHeader && (
          <p
            className={cn(
              "mb-3 text-[12px] sm:text-sm lg:text-[15px] font-medium leading-[1.4]",
              plan.highlighted ? "text-black/90" : "text-white/90"
            )}
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {plan.featuresHeader}
          </p>
        )}
        <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3">
          {plan.features.map((feature, i) => (
            <li
              key={i}
              className={cn(
                "flex items-start gap-2 sm:gap-2.5 lg:gap-3 text-[11px] sm:text-xs lg:text-sm leading-[1.5]",
                plan.highlighted ? "text-black/80" : "text-white/70"
              )}
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                  plan.highlighted ? "bg-black" : "bg-[var(--color-brand)]"
                )}
              >
                <CheckIcon size={10} className={plan.highlighted ? "text-[var(--color-brand)]" : "text-black"} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button - 40px spacing */}
      <div className="relative z-10 mt-auto pt-10">
        <OpaqueButton
          variant="inline"
          onClick={handleCtaClick}
          showIcon={false}
          className="!w-full justify-center !py-2.5 sm:!py-3 text-xs sm:text-sm"
        >
          {plan.ctaText}
        </OpaqueButton>
      </div>
    </motion.div>
  );
}
