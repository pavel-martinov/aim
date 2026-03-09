"use client";

import PinnedSlideSection from "@/components/ui/PinnedSlideSection";

/** Vision slide data */
const SLIDES = [
  {
    id: 1,
    text: "Is to solve the worldwide issue of limited access to elite football coaching and propel the development of grassroots football.",
    video: "/images/vision/Vision-1.mp4",
  },
  {
    id: 2,
    text: "To democratise elite coaching through AI, making professional-level guidance accessible to every aspiring footballer.",
    video: "/images/vision/Vision-2.mp4",
  },
  {
    id: 3,
    text: "To transform raw talent into refined skill, one personalised insight at a time.",
    video: "/images/vision/Vision-3.mp4",
  },
];

/** Full-screen vision section with scroll-driven slide transitions. */
export default function VisionSection() {
  return (
    <PinnedSlideSection
      slides={SLIDES}
      classPrefix="vision"
      ariaLabel="Our Vision"
      scrollEnd={5000}
      scrub={0.8}
      disablePinOnTouch={false}
    />
  );
}
