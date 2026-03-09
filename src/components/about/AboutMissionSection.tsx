"use client";

import PinnedSlideSection from "@/components/ui/PinnedSlideSection";

/** Mission slide data - 3 steps: Problem > Solution > Promise */
const SLIDES = [
  {
    id: 1,
    text: "Every year, millions of talented players never get seen. Not because they lack skill — but because they lack access.",
    video: "/images/vision/Vision-1.mp4",
  },
  {
    id: 2,
    text: "AIM brings elite-level coaching to anyone with a smartphone. AI that watches, learns, and guides you like a personal coach.",
    video: "/images/vision/Vision-2.mp4",
  },
  {
    id: 3,
    text: "Your postcode doesn't define your potential. We do.",
    video: "/images/vision/Vision-3.mp4",
  },
];

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

/** Full-screen mission section with scroll-driven slide transitions. */
export default function AboutMissionSection() {
  const mobile = typeof window !== "undefined" ? isMobile() : false;

  return (
    <PinnedSlideSection
      slides={SLIDES}
      classPrefix="mission"
      ariaLabel="Our Mission"
      scrollEnd={mobile ? 3000 : 6000}
      scrub={mobile ? 0.3 : true}
      refreshOnSetup
    />
  );
}
