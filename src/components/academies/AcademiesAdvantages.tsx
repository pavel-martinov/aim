"use client";

import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

/** Feature items with letter indicators and descriptions */
const FEATURES = [
  {
    letter: "a",
    title: "Own the full picture of every player",
    description: [
      "See where each player stands across ball control, passing, shooting, and movement. Real scores pulled from real practice sessions give you hard numbers instead of guesswork and gut feelings from the sideline.",
      "Track who's putting in the hours and who needs a push. Week-over-week progress shows you exactly where to focus your next session and which players are ready to step up to the next challenge.",
    ],
  },
  {
    letter: "b",
    title: "AI that watches what you can't",
    description: [
      "Our AI breaks down every drill attempt, analyzing technique, timing, and execution frame by frame. Players receive instant feedback on their phone. You get the full picture without reviewing hours of video.",
      "Stop drowning in footage. Get straight to what matters: where technique is breaking down, what's actually working, and which players are ready to move up. All the insight, none of the admin.",
    ],
  },
  {
    letter: "c",
    title: "Catch bad habits before they stick",
    description: [
      "Technique problems compound fast. A dropped shoulder, lazy footwork, weak plant foot - small issues become permanent flaws within weeks. AIM flags them early, while they're still easy to correct.",
      "Get automatic alerts when a player's form starts slipping or their progress stalls out. You'll know exactly when to step in with the right drill or conversation, before small problems turn into big ones.",
    ],
  },
  {
    letter: "d",
    title: "Turn practice data into match-day results",
    description: [
      "Compare your squad against age and level benchmarks from academies around the world. See which players are tracking ahead of the curve and which ones need targeted work to close the gap.",
      "Build smarter training plans based on what the data actually shows, not hunches or assumptions. Better information leads to better coaching decisions, and better decisions build better players.",
    ],
  },
];

/**
 * Academy Advantages section — light mode feature list with letter indicators.
 * Each feature row has image (animating from bottom), title, and description.
 */
export default function AcademiesAdvantages() {
  return (
    <section
      className="w-full bg-white"
      data-header-theme="light"
    >
      {/* Intro text block */}
      <div className="px-6 py-[100px] lg:px-8 lg:py-[132px]">
        <p
          className="max-w-full text-[32px] font-medium capitalize leading-[1.25] text-black md:text-[40px] lg:text-[46px]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          We believe elite coaching should be available to anyone with a ball, a dream, and a desire to be better.
        </p>
      </div>

      {/* Features list */}
      <div className="px-6 pb-8 lg:px-8">
        <div className="flex flex-col">
          {FEATURES.map((feature, i) => (
            <FeatureRow
              key={feature.letter}
              {...feature}
              isLast={i === FEATURES.length - 1}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Individual feature row with letter indicator, image, title, and description */
function FeatureRow({
  letter,
  title,
  description,
  isLast,
  index,
}: {
  letter: string;
  title: string;
  description: string[];
  isLast: boolean;
  index: number;
}) {
  return (
    <div
      className={`relative grid gap-6 py-6 md:grid-cols-[auto_216px_1fr_1fr] md:gap-8 lg:gap-12 ${
        !isLast ? "border-b border-[#bababa]" : ""
      }`}
    >
      {/* Letter indicator */}
      <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[#0d1c28]">
        <span
          className="text-[12px] uppercase text-[#0d1c28]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {letter}
        </span>
      </div>

      {/* Image - animates from bottom */}
      <RevealOnScroll direction="up" delay={index * 0.1} dramatic>
        <div className="relative h-[200px] w-full overflow-hidden md:h-[270px] md:w-[216px]">
          <Image
            src="/academies/feature.jpg"
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </RevealOnScroll>

      {/* Title */}
      <div className="flex items-start">
        <h3
          className="text-[24px] font-medium leading-[1.25] text-[#0d1c28] md:text-[28px] lg:text-[32px]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {title}
        </h3>
      </div>

      {/* Description paragraphs */}
      <div className="flex flex-col gap-4">
        {description.map((para, j) => (
          <p
            key={j}
            className="text-[14px] font-medium uppercase leading-[1.5] text-[#0d1c28]/70 md:text-[16px]"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
