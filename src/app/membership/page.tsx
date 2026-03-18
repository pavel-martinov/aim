"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlans from "@/components/membership/PricingPlans";
import { CurrencyProvider } from "@/lib/context/CurrencyContext";

/**
 * Membership page with pricing tiers and feature cards.
 * Designed to convert users with a premium, exclusive feel.
 */
export default function MembershipPage() {
  return (
    <CurrencyProvider>
      <main className="min-h-screen bg-black" data-header-theme="dark">
        <Header />
        <PricingPlans />
        <Footer />
      </main>
    </CurrencyProvider>
  );
}
