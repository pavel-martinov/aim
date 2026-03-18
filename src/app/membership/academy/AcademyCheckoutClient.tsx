"use client";

import AcademyCheckout from "@/components/checkout/AcademyCheckout";

/**
 * Client wrapper for the academy interest registration flow.
 * Separated to allow Suspense wrapping in the server page component.
 */
export default function AcademyCheckoutClient() {
  return <AcademyCheckout />;
}
