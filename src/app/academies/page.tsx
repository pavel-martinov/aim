"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AcademiesHero from "@/components/academies/AcademiesHero";
import AcademiesAbout from "@/components/academies/AcademiesAbout";
import AcademiesStorytelling from "@/components/academies/AcademiesStorytelling";
import AcademiesDivider from "@/components/academies/AcademiesDivider";
import AcademiesAdvantages from "@/components/academies/AcademiesAdvantages";
import AcademiesPreCTA from "@/components/academies/AcademiesPreCTA";

/**
 * Academies landing page — light-mode design for coaches.
 * Showcases academy management, AI-powered analysis, and player progression tools.
 */
export default function AcademiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header visible />
      {/* Keep hero and about as consecutive top sections */}
      <div className="relative">
        <AcademiesHero />
        <AcademiesAbout />
      </div>
      <AcademiesStorytelling />
      <AcademiesDivider />
      <AcademiesAdvantages />
      <AcademiesPreCTA />
      <Footer />
    </main>
  );
}
