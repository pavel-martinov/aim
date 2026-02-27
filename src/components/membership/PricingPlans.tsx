"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { openDownloadStore } from "@/lib/download";

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

/** Pricing plans data based on PRICING_AND_PLANS_V1.md */
const PLANS: Plan[] = [
  {
    id: "kickoff",
    name: "Kickoff",
    tagline: "Start your journey",
    monthlyPrice: null,
    annualPrice: null,
    features: [
      "5 AI coach sessions per week",
      "Basic avatar selection",
      "Basic drill analysis",
      "Public community chat",
      "Selected public challenges",
    ],
    ctaText: "Get Started Free",
  },
  {
    id: "first-touch",
    name: "First Touch",
    tagline: "For serious athletes",
    monthlyPrice: 12.99,
    annualPrice: 9.99,
    annualSavings: "Save $36/year",
    features: [
      "Unlimited AI coach feedback",
      "Full avatar customization",
      "Advanced AI drill analysis",
      "Premium community channels",
      "Priority event invitations",
      "Create personal challenges",
      "14-day free trial",
    ],
    highlighted: true,
    badge: "Most Popular",
    ctaText: "Start Free Trial",
  },
  {
    id: "dugout",
    name: "Dugout",
    tagline: "For coaches & academies",
    monthlyPrice: 29.99,
    annualPrice: 24.99,
    annualSavings: "Save $60/year",
    features: [
      "Everything in First Touch",
      "Coach CRM & player management",
      "Assign drills & homework",
      "Unlimited challenge creation",
      "Team analytics dashboard",
      "Up to 10 players included",
      "Priority support",
    ],
    ctaText: "Start Free Trial",
  },
];

/** Billing toggle switch */
function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onChange("monthly")}
        className={`px-4 py-2 text-sm uppercase tracking-wider transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          value === "monthly"
            ? "text-white"
            : "text-white/40 hover:text-white/60"
        }`}
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Monthly
      </button>

      <button
        onClick={() => onChange(value === "monthly" ? "annual" : "monthly")}
        className="relative h-7 w-12 rounded-full bg-white/10 p-0.5 transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/15"
        aria-label="Toggle billing cycle"
      >
        <motion.div
          className="h-6 w-6 rounded-full bg-[var(--color-brand)]"
          initial={false}
          animate={{ x: value === "annual" ? 20 : 0 }}
          transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
        />
      </button>

      <button
        onClick={() => onChange("annual")}
        className={`flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-wider transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          value === "annual"
            ? "text-white"
            : "text-white/40 hover:text-white/60"
        }`}
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Annual
        <span className="rounded bg-[var(--color-brand)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-black">
          -23%
        </span>
      </button>
    </div>
  );
}

/** Individual pricing card */
function PricingCard({
  plan,
  billingCycle,
}: {
  plan: Plan;
  billingCycle: BillingCycle;
}) {
  const price =
    billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const isFree = price === null;

  return (
    <motion.div
      className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:p-8 ${
        plan.highlighted
          ? "border-[var(--color-brand)]/40 bg-[var(--color-brand)]/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="whitespace-nowrap rounded bg-[var(--color-brand)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-4">
        <h3
          className="text-2xl uppercase tracking-tight text-white lg:text-3xl"
          style={{ fontFamily: "var(--font-anton), sans-serif" }}
        >
          {plan.name}
        </h3>
        <p
          className="mt-1 text-xs uppercase tracking-wide text-white/50"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${billingCycle}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
            className="flex items-baseline gap-1"
          >
            {isFree ? (
              <span
                className="text-5xl uppercase tracking-tight text-white lg:text-6xl"
                style={{ fontFamily: "var(--font-anton), sans-serif" }}
              >
                Free
              </span>
            ) : (
              <>
                <span
                  className="text-5xl tracking-tight text-white lg:text-6xl"
                  style={{ fontFamily: "var(--font-anton), sans-serif" }}
                >
                  ${price}
                </span>
                <span
                  className="text-sm text-white/40"
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
            className="mt-1 text-xs text-[var(--color-brand)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {plan.annualSavings}
          </motion.p>
        )}
      </div>

      {/* Features list */}
      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((feature, i) => (
          <li
            key={i}
            className="text-sm text-white/70"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button - Full width */}
      <OpaqueButton
        variant={plan.highlighted ? "brand" : "dark"}
        onClick={openDownloadStore}
        className="!h-14 !w-full md:!w-full"
      >
        {plan.ctaText}
      </OpaqueButton>
    </motion.div>
  );
}

/**
 * Pricing plans section with integrated hero headline and billing toggle.
 * Designed to show pricing immediately above the fold.
 */
export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");

  return (
    <section className="relative bg-black px-4 pb-16 pt-28 lg:px-6 lg:pb-24 lg:pt-32">
      {/* Integrated Hero Header */}
      <div className="mx-auto mb-10 max-w-4xl text-center lg:mb-12">
        <RevealOnScroll dramatic>
          <h1
            className="mb-4 text-5xl uppercase leading-[0.95] tracking-tight text-[var(--color-brand)] md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            Membership
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p
            className="mb-6 text-sm uppercase tracking-wide text-white/50 md:text-base"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </RevealOnScroll>

        {/* Billing toggle */}
        <RevealOnScroll delay={0.15}>
          <BillingToggle value={billingCycle} onChange={setBillingCycle} />
        </RevealOnScroll>
      </div>

      {/* Pricing cards grid */}
      <RevealOnScroll delay={0.2}>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 lg:gap-5">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} billingCycle={billingCycle} />
          ))}
        </div>
      </RevealOnScroll>

      {/* Per-seat pricing note */}
      <RevealOnScroll delay={0.3}>
        <p
          className="mx-auto mt-6 max-w-2xl text-center text-xs text-white/30"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Dugout includes up to 10 players. Additional seats available at volume
          discounts.
        </p>
      </RevealOnScroll>
    </section>
  );
}
