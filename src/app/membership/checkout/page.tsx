import { Suspense } from "react";
import { Metadata } from "next";
import B2CCheckoutClient from "./B2CCheckoutClient";
import { CurrencyProvider } from "@/lib/context/CurrencyContext";

export const metadata: Metadata = {
  title: "Checkout - AIM",
  description: "Complete your AIM subscription",
};

/** B2C checkout page - reads plan params from searchParams */
export default function B2CCheckoutPage() {
  return (
    <CurrencyProvider>
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <B2CCheckoutClient />
      </Suspense>
    </CurrencyProvider>
  );
}
