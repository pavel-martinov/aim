"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlans from "@/components/membership/PricingPlans";
import WhyUpgrade from "@/components/membership/WhyUpgrade";
import MembershipFaq from "@/components/membership/MembershipFaq";

/**
 * Membership page with pricing tiers, feature cards, and FAQ.
 * Designed to convert users with a premium, exclusive feel.
 */
export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]" data-header-theme="dark">
      <Header />
      <PricingPlans />
      <WhyUpgrade />
      <MembershipFaq />
      <Footer />
    </main>
  );
}
