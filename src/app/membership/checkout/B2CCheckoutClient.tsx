"use client";

import { useSearchParams } from "next/navigation";
import B2CCheckout from "@/components/checkout/B2CCheckout";
import { isValidPlanId, type BillingCycle } from "@/lib/constants";

/**
 * Client wrapper that reads URL search params and passes them to B2CCheckout.
 * Separated to allow Suspense wrapping in the server page component.
 */
export default function B2CCheckoutClient() {
  const params = useSearchParams();

  const planParam = params.get("plan");
  const plan = isValidPlanId(planParam) ? planParam : "starter";
  const cycle: BillingCycle = params.get("cycle") === "monthly" ? "monthly" : "annual";

  return <B2CCheckout plan={plan} cycle={cycle} />;
}
