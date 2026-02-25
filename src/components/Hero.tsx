"use client";

import { useState } from "react";
import HeroStats from "@/components/HeroStats";
import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

const HERO_VIDEO_LOCAL = "/HeroVideoBG.mp4";
const HERO_VIDEO_FALLBACK =
  "https://assets.mixkit.co/videos/preview/mixkit-man-playing-soccer-502-large.mp4";

/** Full-viewport hero with video background, animated stats, and gradient headline. */
export default function Hero() {
  const [src, setSrc] = useState(HERO_VIDEO_LOCAL);

  return (
    <section
      className="relative h-screen overflow-hidden"
      data-header-theme="dark"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        onError={() => setSrc(HERO_VIDEO_FALLBACK)}
        aria-hidden
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/[0.52]" aria-hidden />

      {/* Content Container */}
      <div className="relative flex h-full flex-col justify-end gap-10 px-4 pb-6 pt-[100px] md:px-6 lg:px-6 lg:pb-[42px] lg:pt-[124px]">
        {/* Stats - Absolutely positioned at top right on tablet+ */}
        <HeroStats className="md:absolute md:right-6 md:top-[100px] lg:right-6 lg:top-[124px]" />

        {/* Bottom Content - Headline left, CTA right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Headline + Subtext */}
          <div className="flex max-w-[696px] flex-col gap-6 uppercase">
            <RevealOnScroll>
              <h1
                className="flex flex-col bg-gradient-to-r from-white to-[#c4c4c4] bg-clip-text text-[42px] leading-[1.1] text-transparent lg:text-[62px]"
                style={{ fontFamily: "var(--font-anton), sans-serif" }}
              >
                <span>IT&apos;S TIME. TO RISE.</span>
                <span>From Streets To Stadiums.</span>
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p className="max-w-[400px] text-base normal-case leading-[1.5] text-white">
                Where talent meets opportunity.
                <br />
                Train smarter, perform better, and rise to the next level.
              </p>
            </RevealOnScroll>
          </div>

          {/* CTA Button - Full width on mobile, fixed 240px on tablet+ */}
          <RevealOnScroll delay={0.2}>
            <OpaqueButton
              variant="card"
              onClick={openDownloadStore}
              className="w-full shrink-0 md:w-[240px]"
            >
              DOWNLOAD NOW
            </OpaqueButton>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
