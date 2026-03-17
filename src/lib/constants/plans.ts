/**
 * Plan types and pricing configuration.
 * Single source of truth for all plan-related data across checkout and membership pages.
 */

export const PLAN_IDS = ["starter", "pro", "pathway"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type BillingCycle = "monthly" | "annual";

// ─────────────────────────────────────────────────────────────────────────────
// Currency Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const CURRENCIES = ["AED", "USD", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "AED";

export interface CurrencyInfo {
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCY_CONFIG: Record<Currency, CurrencyInfo> = {
  AED: { symbol: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  USD: { symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  EUR: { symbol: "€", name: "Euro", flag: "🇪🇺" },
  GBP: { symbol: "£", name: "British Pound", flag: "🇬🇧" },
};

/** Maps country codes to default currency */
export const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  AE: "AED",
  US: "USD",
  GB: "GBP",
  UK: "GBP",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
};

// ─────────────────────────────────────────────────────────────────────────────
// Multi-Currency Pricing
// ─────────────────────────────────────────────────────────────────────────────

interface PriceTier {
  monthly: number | null;
  annual: number | null;
}

/** Price per plan per currency */
export const PLAN_PRICES: Record<PlanId, Record<Currency, PriceTier>> = {
  starter: {
    AED: { monthly: null, annual: null },
    USD: { monthly: null, annual: null },
    EUR: { monthly: null, annual: null },
    GBP: { monthly: null, annual: null },
  },
  pro: {
    AED: { monthly: 100, annual: 80 },
    USD: { monthly: 27, annual: 22 },
    EUR: { monthly: 25, annual: 20 },
    GBP: { monthly: 21, annual: 17 },
  },
  pathway: {
    AED: { monthly: 200, annual: 160 },
    USD: { monthly: 55, annual: 44 },
    EUR: { monthly: 50, annual: 40 },
    GBP: { monthly: 43, annual: 34 },
  },
};

/** Academies base pricing per currency */
export const ACADEMIES_BASE_PRICES: Record<Currency, { monthly: number; annual: number }> = {
  AED: { monthly: 500, annual: 400 },
  USD: { monthly: 136, annual: 109 },
  EUR: { monthly: 125, annual: 100 },
  GBP: { monthly: 107, annual: 86 },
};

/** Per-seat pricing tiers per currency (for students above base 10) */
export const ACADEMIES_SEAT_TIERS: Record<Currency, Record<BillingCycle, { min: number; max: number; rate: number }[]>> = {
  AED: {
    monthly: [
      { min: 11, max: 25, rate: 15 },
      { min: 26, max: 50, rate: 12 },
      { min: 51, max: 100, rate: 10 },
    ],
    annual: [
      { min: 11, max: 25, rate: 12 },
      { min: 26, max: 50, rate: 10 },
      { min: 51, max: 100, rate: 8 },
    ],
  },
  USD: {
    monthly: [
      { min: 11, max: 25, rate: 4 },
      { min: 26, max: 50, rate: 3 },
      { min: 51, max: 100, rate: 3 },
    ],
    annual: [
      { min: 11, max: 25, rate: 3 },
      { min: 26, max: 50, rate: 3 },
      { min: 51, max: 100, rate: 2 },
    ],
  },
  EUR: {
    monthly: [
      { min: 11, max: 25, rate: 4 },
      { min: 26, max: 50, rate: 3 },
      { min: 51, max: 100, rate: 2 },
    ],
    annual: [
      { min: 11, max: 25, rate: 3 },
      { min: 26, max: 50, rate: 2 },
      { min: 51, max: 100, rate: 2 },
    ],
  },
  GBP: {
    monthly: [
      { min: 11, max: 25, rate: 3 },
      { min: 26, max: 50, rate: 3 },
      { min: 51, max: 100, rate: 2 },
    ],
    annual: [
      { min: 11, max: 25, rate: 3 },
      { min: 26, max: 50, rate: 2 },
      { min: 51, max: 100, rate: 2 },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Plan Configuration (UI)
// ─────────────────────────────────────────────────────────────────────────────

export interface PlanInfo {
  name: string;
  tagline: string;
}

export interface PlanConfig extends PlanInfo {
  id: PlanId;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
  badge?: string;
}

/** Basic plan info for checkout pages */
export const PLAN_INFO: Record<PlanId, PlanInfo> = {
  starter: { name: "Starter", tagline: "Free" },
  pro: { name: "Pro", tagline: "Premium" },
  pathway: { name: "Pathway", tagline: "Elite" },
};

/** Full plan configuration for pricing pages */
export const PLANS: PlanConfig[] = [
  {
    id: "starter",
    ...PLAN_INFO.starter,
    features: ["Lvl 1 Drills Only", "3 Uploads / Week", "Basic AI Scoring", "Community XP"],
    ctaText: "Get Started Free",
  },
  {
    id: "pro",
    ...PLAN_INFO.pro,
    features: ["Unlimited Uploads", "Full AI Analysis", "Scorecard History", "Skill Progression", "Scout Visibility"],
    ctaText: "Start Free Trial",
  },
  {
    id: "pathway",
    ...PLAN_INFO.pathway,
    features: ["Career Roadmap", "Position Modules", "Biomechanics Reports", "Showcase Invites"],
    ctaText: "Start Free Trial",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/** Returns price for a given plan, billing cycle, and currency */
export function getPlanPrice(planId: PlanId, cycle: BillingCycle, currency: Currency = DEFAULT_CURRENCY): number | null {
  const prices = PLAN_PRICES[planId]?.[currency];
  if (!prices) return null;
  return cycle === "annual" ? prices.annual : prices.monthly;
}

/** Calculates annual savings for a plan in the given currency */
export function getAnnualSavings(planId: PlanId, currency: Currency): number | null {
  const prices = PLAN_PRICES[planId]?.[currency];
  if (!prices || prices.monthly === null || prices.annual === null) return null;
  return (prices.monthly - prices.annual) * 12;
}

/** Formats annual savings text */
export function formatAnnualSavings(planId: PlanId, currency: Currency): string | null {
  const savings = getAnnualSavings(planId, currency);
  if (savings === null || savings <= 0) return null;
  const { symbol } = CURRENCY_CONFIG[currency];
  return `Save ${symbol}${savings}/year`;
}

/** Calculates academies price for a given student count, cycle, and currency */
export function calculateAcademiesPrice(students: number, cycle: BillingCycle, currency: Currency = DEFAULT_CURRENCY): number {
  const basePrice = cycle === "annual" ? ACADEMIES_BASE_PRICES[currency].annual : ACADEMIES_BASE_PRICES[currency].monthly;
  if (students <= 10) return basePrice;

  const tiers = ACADEMIES_SEAT_TIERS[currency][cycle];
  let total = basePrice;

  for (const tier of tiers) {
    if (students >= tier.min) {
      const seatsInTier = Math.min(students, tier.max) - tier.min + 1;
      total += seatsInTier * tier.rate;
    }
  }

  return Math.round(total);
}

/** Formats a price with currency symbol */
export function formatPrice(price: number | null, currency: Currency): string {
  if (price === null) return "Free";
  const { symbol } = CURRENCY_CONFIG[currency];
  return `${symbol}${price}`;
}

/** Validates if a string is a valid plan ID */
export function isValidPlanId(value: string | null | undefined): value is PlanId {
  return PLAN_IDS.includes(value as PlanId);
}

/** Validates if a string is a valid currency */
export function isValidCurrency(value: string | null | undefined): value is Currency {
  return CURRENCIES.includes(value as Currency);
}
