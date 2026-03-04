"use client";

import { useSearchParams } from "next/navigation";
import AcademyCheckout from "@/components/checkout/AcademyCheckout";

/**
 * Client wrapper that reads URL search params and passes them to AcademyCheckout.
 * Separated to allow Suspense wrapping in the server page component.
 */
export default function AcademyCheckoutClient() {
  const params = useSearchParams();

  const cycle = (params.get("cycle") === "monthly" ? "monthly" : "annual") as
    | "monthly"
    | "annual";
  const students = Math.min(
    Math.max(parseInt(params.get("students") ?? "10", 10) || 10, 10),
    110
  );

  // Re-derive price from params (mirrors PricingPlans.tsx logic)
  const basePrice = cycle === "annual" ? 24.99 : 29.99;
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
  let price = basePrice;
  if (students > 10) {
    for (const tier of SEAT_TIERS[cycle]) {
      if (students >= tier.min) {
        const seatsInTier = Math.min(students, tier.max) - tier.min + 1;
        price += seatsInTier * tier.rate;
      }
    }
    price = Math.round(price * 100) / 100;
  }

  return <AcademyCheckout price={price} cycle={cycle} students={students} />;
}
