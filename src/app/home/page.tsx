"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MissionSection from "@/components/MissionSection";
import UnlockYourPotential from "@/components/UnlockYourPotential";
import StepsSection from "@/components/StepsSection";
import VisionSection from "@/components/VisionSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useAudio } from "@/contexts/AudioContext";
import { useEffect } from "react";

/** Home page: Hero with AVATR-style header and content sections. */
export default function HomePage() {
  const { startPlayback } = useAudio();

  // Start audio playback when home page mounts (after preloader transition)
  useEffect(() => {
    startPlayback();
  }, [startPlayback]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header visible />
      <div className="relative">
        <div className="lg:sticky lg:top-0 z-0 h-screen">
          <Hero />
        </div>
        <div className="relative z-10">
          <MissionSection />
          <UnlockYourPotential />
          <VisionSection />
          <StepsSection />
          <CTASection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
