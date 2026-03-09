"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  isDynamicPrice?: boolean;
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
    id: "academies",
    name: "Academies",
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
      "Priority support",
    ],
    ctaText: "Start Free Trial",
    isDynamicPrice: true,
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
          -23%
        </span>
      </button>
    </div>
  );
}

/** Pricing tiers for per-seat pricing (above the base 10 students) */
const SEAT_TIERS = {
  monthly: [
    { min: 11, max: 25, rate: 2.99 },
    { min: 26, max: 50, rate: 2.49 },
    { min: 51, max: 100, rate: 1.99 },
  ],
  annual: [
    { min: 11, max: 25, rate: 2.49 },
    { min: 26, max: 50, rate: 1.99 },
    { min: 51, max: 100, rate: 1.49 },
  ],
};

/** Calculates total price for academies plan based on student count */
function calculateAcademiesPrice(
  students: number,
  cycle: BillingCycle,
  baseMonthly: number,
  baseAnnual: number
): number {
  const basePrice = cycle === "annual" ? baseAnnual : baseMonthly;
  if (students <= 10) return basePrice;

  const tiers = SEAT_TIERS[cycle];
  let total = basePrice;

  for (const tier of tiers) {
    if (students >= tier.min) {
      const seatsInTier = Math.min(students, tier.max) - tier.min + 1;
      total += seatsInTier * tier.rate;
    }
  }

  return Math.round(total * 100) / 100;
}

/** Custom slider for selecting student count */
function StudentSlider({
  value,
  onChange,
  isHighlighted,
}: {
  value: number;
  onChange: (val: number) => void;
  isHighlighted?: boolean;
}) {
  const isEnterprise = value > 100;
  const displayValue = isEnterprise ? "100+" : value;

  return (
    <div className="mb-6 mt-2 relative z-10">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            "text-xs uppercase leading-[1.5]",
            isHighlighted ? "text-black/60" : "text-white/50"
          )}
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          Students
        </span>
        <span
          className={cn(
            "text-sm font-bold uppercase",
            isHighlighted ? "text-black" : "text-white"
          )}
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
        className="student-slider h-2 w-full cursor-pointer appearance-none rounded-full outline-none transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={
          {
            "--slider-progress": `${((value - 10) / 100) * 100}%`,
            background: isHighlighted
              ? `linear-gradient(to right, black 0%, black var(--slider-progress), rgba(0,0,0,0.15) var(--slider-progress), rgba(0,0,0,0.15) 100%)`
              : `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) var(--slider-progress), rgba(255,255,255,0.1) var(--slider-progress), rgba(255,255,255,0.1) 100%)`,
          } as React.CSSProperties
        }
      />
      <style jsx>{`
        .student-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${isHighlighted ? "black" : "var(--color-brand)"};
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .student-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .student-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: ${isHighlighted ? "black" : "var(--color-brand)"};
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .student-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
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
  const router = useRouter();
  const [students, setStudents] = useState(10);

  const isEnterprise = plan.isDynamicPrice && students > 100;
  const dynamicPrice = plan.isDynamicPrice
    ? calculateAcademiesPrice(
        students,
        billingCycle,
        plan.monthlyPrice ?? 0,
        plan.annualPrice ?? 0
      )
    : null;

  const price = plan.isDynamicPrice
    ? dynamicPrice
    : billingCycle === "annual"
      ? plan.annualPrice
      : plan.monthlyPrice;

  const isFree = price === null;
  const ctaText = isEnterprise ? "Contact Sales" : plan.ctaText;

  const handleCtaClick = () => {
    if (plan.isDynamicPrice && !isEnterprise) {
      router.push(
        `/membership/academy?cycle=${billingCycle}&students=${students}`
      );
    } else {
      openDownloadStore();
    }
  };

  return (
    <motion.div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[24px] p-4 sm:p-6 transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:rounded-[32px] lg:p-10",
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
      <div className="relative z-10 mb-2 sm:mb-4 lg:mb-6">
        <h3
          className="text-[20px] sm:text-[24px] lg:text-[40px] font-semibold leading-[1.25]"
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
      <div className="relative z-10 mb-4 sm:mb-6 lg:mb-8 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${billingCycle}-${students}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
            className="flex items-baseline gap-1 sm:gap-2"
          >
            {isFree ? (
              <span
                className="text-[36px] sm:text-[48px] lg:text-[80px] uppercase leading-[0.9] tracking-tight"
                style={{ fontFamily: "var(--font-anton), sans-serif" }}
              >
                Free
              </span>
            ) : isEnterprise ? (
              <span
                className="text-2xl sm:text-3xl lg:text-5xl uppercase tracking-tight"
                style={{ fontFamily: "var(--font-anton), sans-serif" }}
              >
                Custom
              </span>
            ) : (
              <>
                <span
                  className="text-[36px] sm:text-[48px] lg:text-[80px] leading-[0.9] tracking-tight"
                  style={{ fontFamily: "var(--font-anton), sans-serif" }}
                >
                  ${price?.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "text-xs sm:text-sm lg:text-lg font-bold uppercase tracking-wider",
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

        {/* Annual savings or enterprise note */}
        {isEnterprise ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "mt-1 sm:mt-2 lg:mt-3 text-[10px] sm:text-xs lg:text-sm font-bold uppercase leading-[1.5]",
              plan.highlighted ? "text-black/60" : "text-white/50"
            )}
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Enterprise pricing for 100+ students
          </motion.p>
        ) : (
          !isFree &&
          billingCycle === "annual" &&
          plan.annualSavings && (
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
          )
        )}
      </div>

      {/* Student slider for dynamic pricing */}
      {plan.isDynamicPrice && (
        <StudentSlider 
          value={students} 
          onChange={setStudents} 
          isHighlighted={plan.highlighted} 
        />
      )}

      {/* Features list */}
      <ul className="relative z-10 flex-1 space-y-2 sm:space-y-3 lg:space-y-4 min-h-[140px]">
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
      <div className="relative z-10 mt-4 sm:mt-6 lg:mt-10">
        <OpaqueButton
          variant="dark"
          onClick={handleCtaClick}
          className={cn(
            "!w-full md:!w-full !py-2 sm:!py-3 lg:!py-4 text-[10px] sm:text-xs lg:text-sm",
            plan.highlighted
              ? "!bg-black !text-white hover:!bg-black/80 focus-visible:!ring-black focus-visible:!ring-offset-[var(--color-brand)]"
              : ""
          )}
        >
          {ctaText}
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
    <section className="relative bg-black px-4 pb-12 pt-[140px] md:pt-[100px] lg:px-6 lg:pb-32 lg:pt-16 min-h-[100dvh] flex flex-col justify-start lg:justify-center overflow-x-hidden overflow-y-visible gap-8 md:gap-4 w-full">
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

      {/* Per-seat pricing note */}
      <RevealOnScroll delay={0.3}>
        <p
          className="mx-auto mt-12 max-w-2xl text-center text-xs uppercase leading-[1.5] text-white/30"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          Academies includes up to 10 students. Use the slider to calculate pricing
          for larger teams.
        </p>
      </RevealOnScroll>
    </section>
  );
}
