"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

gsap.registerPlugin(ScrollTrigger);

/** Feature data for the scrolling cards section */
const FEATURES = [
  {
    id: "challenge",
    badge: "CHALLENGE",
    navLabel: "Challenge The World",
    title: "Challenge the World.\nCompete Like a Pro.",
    description:
      "This is your arena. Join global skill battles, climb leaderboards, and test yourself against the best.",
    image: "/images/steps/begin.jpg",
  },
  {
    id: "improve",
    badge: "IMPROVE",
    navLabel: "Level Up",
    title: "Level Up.\nEarn Real Rewards.",
    description:
      "Complete drills to unlock new ranks and prizes. The better you perform, the more you unlock — and the more the world sees your rise.",
    image: "/images/steps/record.jpg",
  },
  {
    id: "move",
    badge: "MOVE",
    navLabel: "Master Every Move",
    title: "Master Every Move\nwith AI Analysis.",
    description:
      "AIM watches your every move to spot what works and what needs work — helping you improve faster, one rep at a time.",
    image: "/images/steps/analyse.jpg",
  },
  {
    id: "train",
    badge: "TRAIN",
    navLabel: "Train With AI Coach",
    title: "Train with an AI Coach\nThat Never Sleeps.",
    description:
      "Your personal coach is always on. Get instant feedback after every drill, voice or chat — built around your game.",
    image: "/images/steps/learn.jpg",
  },
];

/** Reusable feature card with image, badge, title, and description */
function FeatureCard({
  badge,
  title,
  description,
  image,
  setRef,
}: {
  badge: string;
  title: string;
  description: string;
  image: string;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={setRef} className="flex flex-col gap-5 lg:gap-10">
      <div className="relative h-[343px] w-full overflow-hidden rounded-xl md:h-[422px] lg:h-[662px]">
        <Image
          src={image}
          alt={title.replace("\n", " ")}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 876px"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-white/[0.12] px-6 py-3 backdrop-blur-sm">
            <span
              className="text-base uppercase leading-[1.25] tracking-[0.02em] text-white"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {badge}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h3
          className="whitespace-pre-line text-[22px] font-semibold leading-[1.5] text-[#090808] lg:flex-1"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-sm uppercase leading-[1.5] text-[#474747] lg:flex-1 lg:text-base"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Features section with sticky sidebar navigation on desktop/tablet.
 * Cards animate in with smooth fade + translate on scroll.
 */
export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
              onEnter: () => setActiveIndex(index),
              onEnterBack: () => setActiveIndex(index),
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Features"
      className="bg-white"
      data-header-theme="light"
    >
      {/* Header section */}
      <div className="px-4 py-12 lg:px-6 lg:py-[60px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          {/* Headline */}
          <RevealOnScroll className="lg:flex-1 lg:pr-6" dramatic>
            <h2
              className="text-4xl font-medium leading-[1.25] text-black lg:text-[52px]"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              AIM is building the world's most intelligent training system merging human ambition with AI precision.
            </h2>
          </RevealOnScroll>

          {/* Subtitle */}
          <RevealOnScroll className="lg:flex-1 lg:pl-6" delay={0.1}>
            <p
              className="text-sm uppercase leading-[1.5] text-black lg:max-w-[504px] lg:text-base"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              AIM isn&apos;t just about improvement, it&apos;s about evolution.
              We believe elite coaching should be available to anyone with a
              ball, a dream, and a desire to be better.
            </p>
          </RevealOnScroll>
        </div>

        {/* CTA Button */}
        <RevealOnScroll className="mt-6 w-full md:w-auto lg:mt-10" delay={0.2}>
          <OpaqueButton onClick={openDownloadStore}>
            DOWNLOAD NOW
          </OpaqueButton>
        </RevealOnScroll>
      </div>

      {/* Spacer */}
      <div className="h-[60px] lg:h-[120px]" />

      {/* Features grid - justify-end pushes cards to right */}
      <div className="flex justify-end px-4 lg:px-6">
        {/* Sticky sidebar - takes flexible space on left, hidden on mobile */}
        <div className="sticky top-[120px] hidden h-fit flex-1 flex-col gap-[6px] self-start md:flex">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              className={`capitalize text-xl leading-[1.5] text-[#090808] transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                index === activeIndex
                  ? "opacity-100 pl-6"
                  : "opacity-50 pl-0"
              }`}
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {feature.navLabel}
            </div>
          ))}
        </div>

        {/* Feature cards - fixed width on desktop, right-aligned */}
        <div className="flex w-full flex-col gap-8 md:w-[60%] md:gap-20 lg:w-[876px]">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              {...feature}
              setRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-[60px] lg:h-[120px]" />
    </section>
  );
}
