"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AcademiesBanner from "./AcademiesBanner";
import gsap from "gsap";
import { DRAMATIC_EASE, DURATION, GSAP_EASE } from "@/lib/animations";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { openDownloadStore } from "@/lib/download";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "annual";

/** Plan configuration */
type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  annualSavings?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaText: string;
};

/** B2C Pricing plans - Starter, Pro (Core), Pathway (Elite) */
const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Free",
    monthlyPrice: null,
    annualPrice: null,
    features: [
      "Lvl 1 Drills Only",
      "3 Uploads / Week",
      "Basic AI Scoring",
      "Community XP",
    ],
    ctaText: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Premium",
    monthlyPrice: 100,
    annualPrice: 80,
    annualSavings: "Save 240 AED/year",
    features: [
      "Unlimited Uploads",
      "Full AI Analysis",
      "Scorecard History",
      "Skill Progression",
      "Scout Visibility",
    ],
    ctaText: "Start Free Trial",
  },
  {
    id: "pathway",
    name: "Pathway",
    tagline: "Elite",
    monthlyPrice: 200,
    annualPrice: 160,
    annualSavings: "Save 480 AED/year",
    features: [
      "Career Roadmap",
      "Position Modules",
      "Biomechanics Reports",
      "Showcase Invites",
    ],
    ctaText: "Start Free Trial",
  },
];

/** Billing toggle switch - Redesigned to be larger and more tactile */
function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <button
        onClick={() => onChange("monthly")}
        className={cn(
          "px-2 sm:px-4 py-2 text-sm sm:text-base uppercase tracking-wider transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          value === "monthly" ? "text-white font-bold" : "text-white/40 hover:text-white/60"
        )}
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Monthly
      </button>

      <button
        onClick={() => onChange(value === "monthly" ? "annual" : "monthly")}
        className="relative h-8 w-16 sm:h-10 sm:w-20 rounded-full bg-white/10 p-1 transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/15"
        aria-label="Toggle billing cycle"
      >
        <motion.div
          className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[var(--color-brand)]"
          initial={false}
          animate={{ x: value === "annual" ? "100%" : 0 }}
          transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
        />
      </button>

      <button
        onClick={() => onChange("annual")}
        className={cn(
          "flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 text-sm sm:text-base uppercase tracking-wider transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          value === "annual" ? "text-white font-bold" : "text-white/40 hover:text-white/60"
        )}
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Annual
        <span className="rounded-sm bg-[var(--color-brand)] px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase text-black">
          -20%
        </span>
      </button>
    </div>
  );
}

/** Individual pricing card for B2C plans */
function PricingCard({
  plan,
  billingCycle,
}: {
  plan: Plan;
  billingCycle: BillingCycle;
}) {
  const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const isFree = price === null;

  const handleCtaClick = () => {
    openDownloadStore();
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
        <p
          className={cn(
            "mt-1 sm:mt-2 text-[10px] sm:text-sm uppercase leading-[1.5]",
            plan.highlighted ? "text-black/70" : "text-white/50"
          )}
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="relative z-10 mb-3 sm:mb-4 lg:mb-5 min-h-[50px] sm:min-h-[60px] lg:min-h-[70px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${billingCycle}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
            className="flex items-baseline gap-1 sm:gap-2"
          >
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
                  {price} AED
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
          </motion.div>
        </AnimatePresence>

        {/* Annual savings */}
        {!isFree && billingCycle === "annual" && plan.annualSavings && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "mt-1 sm:mt-2 lg:mt-3 text-[10px] sm:text-xs lg:text-sm font-bold uppercase leading-[1.5]",
              plan.highlighted ? "text-black" : "text-[var(--color-brand)]"
            )}
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {plan.annualSavings}
          </motion.p>
        )}
      </div>

      {/* Features list */}
      <ul className="relative z-10 flex-1 space-y-1.5 sm:space-y-2 lg:space-y-2.5">
        {plan.features.map((feature, i) => (
          <li
            key={i}
            className={cn(
              "flex items-start gap-1.5 sm:gap-2 lg:gap-3 text-[10px] sm:text-xs lg:text-sm uppercase leading-[1.5]",
              plan.highlighted ? "text-black/80" : "text-white/70"
            )}
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            <span
              className={
                plan.highlighted ? "text-black" : "text-[var(--color-brand)]"
              }
            >
              •
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="relative z-10 mt-4 sm:mt-5 lg:mt-6">
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

/**
 * Pricing plans section with integrated hero headline and billing toggle.
 * Designed to show pricing immediately above the fold.
 */
export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    const chars = headline.querySelectorAll<HTMLElement>(".membership-char");

    gsap.set(chars, {
      opacity: 0,
      y: 30,
      rotateX: -35,
      filter: "blur(3px)",
      transformOrigin: "center bottom",
    });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      duration: DURATION.hero,
      stagger: DURATION.charStagger,
      ease: GSAP_EASE.dramatic,
      delay: 0.15,
    });
  }, []);

  return (
    <section className="relative bg-black px-4 pb-12 pt-[140px] md:pt-[140px] lg:px-6 lg:pb-32 lg:pt-32 min-h-[100dvh] flex flex-col justify-start lg:justify-center overflow-x-hidden overflow-y-visible gap-8 md:gap-4 w-full">
      {/* Integrated Hero Header */}
      <div className="mx-auto text-center mt-2 sm:mt-2 md:mt-8 lg:mt-0 flex flex-col gap-3 md:gap-2 w-full relative z-20">
        <h1
          ref={headlineRef}
          className="text-[40px] uppercase leading-[0.95] tracking-tight text-white md:text-[60px] lg:text-[80px]"
          style={{ fontFamily: "var(--font-anton), sans-serif", perspective: "1000px" }}
        >
          {"Membership".split("").map((char, i) => (
            <span
              key={i}
              className="membership-char inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char}
            </span>
          ))}
        </h1>

        <RevealOnScroll delay={0.1}>
          <p
            className="text-[10px] uppercase leading-[1.5] text-white/50 sm:text-sm md:text-base"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
        </RevealOnScroll>

        {/* Billing toggle */}
        <RevealOnScroll delay={0.15}>
          <BillingToggle value={billingCycle} onChange={setBillingCycle} />
        </RevealOnScroll>
      </div>

      {/* Pricing cards grid */}
      <RevealOnScroll delay={0.2} className="flex-1 w-full">
        <div className="mx-auto grid max-w-[1280px] h-full items-stretch gap-4 sm:gap-6 md:grid-cols-3 lg:mt-6 lg:gap-8 overflow-visible px-1 py-1">
          {PLANS.map((plan) => (
            <div key={plan.id} className="min-h-full">
              <PricingCard plan={plan} billingCycle={billingCycle} />
            </div>
          ))}
        </div>
      </RevealOnScroll>

      {/* Academies Banner */}
      <RevealOnScroll delay={0.3} className="w-full">
        <div className="mx-auto max-w-[1280px] mt-8 lg:mt-12 px-1">
          <AcademiesBanner billingCycle={billingCycle} />
        </div>
      </RevealOnScroll>
    </section>
  );
}
