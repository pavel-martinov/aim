"use client";

import Image from "next/image";
import DynamicImageReveal from "@/components/ui/DynamicImageReveal";

/** Feature items with letter indicators and descriptions */
const FEATURES = [
  {
    letter: "a",
    title: "Own the full picture\nof your academy",
    description: "Track player engagement and development across your entire organization. Hard numbers give you the insights needed to optimize your training programs and retain talent.",
    image: "/academies/Feature A.png",
  },
  {
    letter: "b",
    title: "Training that doesn't\nstop at practice.",
    description: "Keep players engaged 7 days a week. With AI analysis on their phones, players continue developing at home, maximizing the value of your academy's curriculum.",
    image: "/academies/Feature B.png",
  },
  {
    letter: "c",
    title: "Unlock every\nplayer's potential.",
    description: "No player gets left behind. AIM's automated analysis catches the subtle technique issues that coaches might miss in a crowded 20-player session.",
    image: "/academies/Feature C.png",
  },
];

/**
 * Academy Advantages section — light mode feature list with letter indicators.
 * Mobile: Stacked layout with letter, title, full-width image, then description.
 * Desktop: grid layout with large image and text.
 */
export default function AcademiesAdvantages() {
  return (
    <section
      className="w-full bg-white"
      data-header-theme="light"
    >
      {/* Intro text block */}
      <div className="px-4 py-[120px] md:px-6 lg:px-8 lg:py-[132px]">
        <p
          className="max-w-full text-[32px] font-medium capitalize leading-[1.25] text-[#0d1c28] md:text-[40px] lg:text-[46px]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          We believe elite coaching should be available to anyone with a ball, a dream, and a desire to be better.
        </p>
      </div>

      {/* Features list */}
      <div className="px-4 pb-8 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:gap-0">
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

/**
 * Individual feature row with letter indicator, image, title, and description.
 * Mobile: Vertical stack — letter, title, image (full-width 270px), description.
 * Desktop: Left-aligned large image and right-aligned text.
 */
function FeatureRow({
  letter,
  title,
  description,
  image,
  isLast,
  index,
}: {
  letter: string;
  title: string;
  description: string;
  image: string;
  isLast: boolean;
  index: number;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 pb-6 md:grid-cols-[auto_1fr_1fr] md:grid-rows-[1fr_auto] md:gap-x-10 md:gap-y-6 md:py-[60px] xl:grid-cols-[auto_580px_500px] xl:gap-x-[100px] ${
        !isLast ? "border-b border-[#bababa]" : ""
      }`}
    >
      {/* Letter indicator */}
      <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[#0d1c28] md:col-start-1 md:row-start-1">
        <span
          className="text-[12px] uppercase text-[#0d1c28]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {letter}
        </span>
      </div>

      {/* Title */}
      <h3
        className="whitespace-pre-wrap text-[24px] font-medium leading-[1.25] text-[#0d1c28] md:col-start-3 md:row-start-1 md:self-end md:text-[28px] lg:text-[32px]"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {title}
      </h3>

      {/* Image - full width on mobile, large left-aligned on desktop */}
      <DynamicImageReveal
        delay={index * 0.1}
        className="md:col-start-2 md:row-start-1 md:row-span-2"
      >
        <div className="relative h-[270px] w-full overflow-hidden md:h-[405px]">
          <Image
            src={image}
            alt={title.replace("\n", " ")}
            fill
            className="object-cover"
          />
        </div>
      </DynamicImageReveal>

      {/* Description */}
      <p
        className="text-[14px] font-normal uppercase leading-[1.5] text-[#0d1c28]/70 md:col-start-3 md:row-start-2 md:self-start md:text-[16px]"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {description}
      </p>
    </div>
  );
}
