"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import FreePlanBanner from "./FreePlanBanner";
import AcademyPricingCard from "./AcademyPricingCard";
import CurrencySelector from "@/components/ui/CurrencySelector";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import OpaqueButton from "@/components/ui/OpaqueButton";
import CheckIcon from "@/components/ui/CheckIcon";
import { cn } from "@/lib/utils";
import { PLANS, type BillingCycle, type PlanConfig, getPlanPrice } from "@/lib/constants";
import { useCurrency } from "@/lib/context/CurrencyContext";

/** Billing toggle switch - Redesigned to be a compact pill shape */
function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  return (
    <div className="flex items-center rounded-full bg-white/5 p-1">
      <button
        onClick={() => onChange("monthly")}
        className={cn(
          "rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-300",
          value === "monthly" 
            ? "bg-[var(--color-brand)] text-black shadow-sm" 
            : "text-white/70 hover:text-white"
        )}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        Monthly
      </button>

      <button
        onClick={() => onChange("annual")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-300",
          value === "annual" 
            ? "bg-[var(--color-brand)] text-black shadow-sm" 
            : "text-white/70 hover:text-white"
        )}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        Yearly
        <span className={cn(
          "text-[10px] font-bold",
          value === "annual" ? "text-black/70" : "text-white/50"
        )}>
          (-20%)
        </span>
      </button>
    </div>
  );
}

/** Individual pricing card for B2C plans */
function PricingCard({
  plan,
  billingCycle,
  onCtaClick,
}: {
  plan: PlanConfig;
  billingCycle: BillingCycle;
  onCtaClick: (planId: string) => void;
}) {
  const { currency, formatPrice } = useCurrency();
  const price = getPlanPrice(plan.id, billingCycle, currency);
  const monthlyPrice = getPlanPrice(plan.id, "monthly", currency);
  const isFree = price === null;
  const showDiscount = !isFree && billingCycle === "annual" && monthlyPrice !== null;

  const handleCtaClick = () => {
    onCtaClick(plan.id);
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
      {/* Background visual texture for non-highlighted cards */}
      {!plan.highlighted && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
      )}

      {/* Badge */}
      {plan.badge && (
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6 lg:left-10 lg:top-10">
          <span
            className="whitespace-nowrap bg-black px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-bold uppercase tracking-widest text-white"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {plan.badge}
          </span>
        </div>
      )}

      {/* Spacer for badge if needed */}
      {plan.badge && <div className="h-4 sm:h-6 lg:h-12" />}

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

      {/* Price with Brevo-style discount display */}
      <div className="relative z-10 mb-3 sm:mb-4 lg:mb-5 min-h-[70px] sm:min-h-[80px] lg:min-h-[90px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${billingCycle}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
            className="flex flex-col"
          >
            {/* Crossed-out original price + discount badge (or invisible placeholder) */}
            <div className={cn("flex items-center gap-2 mb-3 transition-opacity duration-300", showDiscount ? "opacity-100" : "opacity-0 select-none pointer-events-none")} aria-hidden={!showDiscount}>
              <span
                className={cn(
                  "text-sm sm:text-base line-through",
                  plan.highlighted ? "text-black/40" : "text-white/40"
                )}
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                {monthlyPrice !== null ? formatPrice(monthlyPrice) : "0"}
              </span>
              <span className="rounded-sm bg-[var(--color-brand)] px-1.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase text-black">
                -20%
              </span>
            </div>
            
            <div className="flex items-baseline gap-1 sm:gap-2">
              {isFree ? (
                <span
                  className="text-[32px] sm:text-[40px] lg:text-[56px] uppercase leading-[0.9] tracking-tight"
                  style={{ fontFamily: "var(--font-anton), sans-serif" }}
                >
                  Free
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

      {/* CTA Button */}
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

/** Mobile Plan Selector dropdown */
function MobilePlanSelector({
  plans,
  selectedPlanId,
  onSelect,
}: {
  plans: PlanConfig[];
  selectedPlanId: string;
  onSelect: (planId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <div ref={containerRef} className="relative z-50 w-full mb-6 md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#080808] px-5 py-4",
          "text-base font-medium text-white transition-all duration-300",
          isOpen && "border-white/20 bg-white/5"
        )}
      >
        <span style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
          {selectedPlan?.name || "Select a Plan"}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl shadow-black/50"
          >
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  onSelect(plan.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-5 py-4 text-left text-sm transition-colors",
                  plan.id === selectedPlanId
                    ? "bg-[var(--color-brand)] text-black font-semibold"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                )}
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                {plan.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Pricing plans section with integrated hero headline and billing toggle.
 * Designed to show pricing immediately above the fold.
 */
export default function PricingPlans() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const displayPlans = PLANS.filter(p => p.id !== "starter");
  const [selectedMobilePlan, setSelectedMobilePlan] = useState<string>(displayPlans[0]?.id || "pro");

  const handlePlanCtaClick = (planId: string, students?: number) => {
    if (planId === "academy" && students) {
      router.push(`/membership/academy?cycle=${billingCycle}&students=${students}`);
    } else {
      router.push(`/membership/checkout?plan=${planId}&cycle=${billingCycle}`);
    }
  };

  return (
    <section className="relative bg-black px-4 pb-12 pt-[100px] md:pt-[140px] lg:px-6 lg:pb-32 lg:pt-32 min-h-[100dvh] flex flex-col justify-start lg:justify-center overflow-x-hidden overflow-y-visible gap-8 md:gap-4 w-full">
      {/* Hero Header */}
      <div className="mx-auto text-center mt-2 sm:mt-2 md:mt-8 lg:mt-0 flex flex-col gap-3 md:gap-2 w-full relative z-20 max-w-[1440px]">
        <RevealOnScroll delay={0.1}>
          <FreePlanBanner />
        </RevealOnScroll>

        {/* Controls Row */}
        <RevealOnScroll delay={0.15}>
          <div className="flex flex-row items-center justify-between gap-4 mb-6 mt-4">
            <div className="flex-1 hidden md:block" /> {/* Spacer for centering toggle */}
            <div className="flex justify-start md:justify-center flex-1">
              <BillingToggle value={billingCycle} onChange={setBillingCycle} />
            </div>
            <div className="flex justify-end flex-1">
              <CurrencySelector />
            </div>
          </div>
        </RevealOnScroll>

        {/* Mobile Plan Selector */}
        <RevealOnScroll delay={0.18}>
          <MobilePlanSelector 
            plans={displayPlans}
            selectedPlanId={selectedMobilePlan}
            onSelect={setSelectedMobilePlan}
          />
        </RevealOnScroll>
      </div>

      {/* Pricing cards grid */}
      <RevealOnScroll delay={0.2} className="flex-1 w-full">
        <div className="mx-auto grid max-w-[1440px] h-full items-stretch gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8 overflow-visible px-1 py-1">
          {displayPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={cn(
                "min-h-full transition-all",
                plan.id !== selectedMobilePlan ? "hidden md:block" : "block"
              )}
            >
              {plan.id === "academy" ? (
                <AcademyPricingCard plan={plan} billingCycle={billingCycle} onCtaClick={handlePlanCtaClick} />
              ) : (
                <PricingCard plan={plan} billingCycle={billingCycle} onCtaClick={handlePlanCtaClick} />
              )}
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
