"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutMissionSection from "@/components/about/AboutMissionSection";
import AboutGallery from "@/components/about/AboutGallery";
import CTASection from "@/components/CTASection";

/**
 * About page with hero, mission, gallery, CTA, and footer sections.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header visible />
      <AboutHero />
      <AboutMissionSection />
      <AboutGallery />
      <CTASection />
      <Footer />
    </main>
  );
}
