"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlans from "@/components/membership/PricingPlans";
import CTASection from "@/components/CTASection";

/**
 * Membership page with pricing tiers, feature cards, and CTA.
 * Designed to convert users with a premium, exclusive feel.
 */
export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-black" data-header-theme="dark">
      <Header />
      <PricingPlans />
      <CTASection />
      <Footer />
    </main>
  );
}
