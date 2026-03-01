"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import WhoWeAreSection from "@/components/about/WhoWeAreSection";
import GoalSection from "@/components/about/GoalSection";
import DiscoverTalentSection from "@/components/about/DiscoverTalentSection";

/**
 * About page with hero, who we are, goal, and discover talent sections.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header visible />
      <AboutHero />
      <WhoWeAreSection />
      <GoalSection />
      <DiscoverTalentSection />
      <Footer />
    </main>
  );
}
