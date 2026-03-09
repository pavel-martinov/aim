"use client";

import HeroStats from "@/components/HeroStats";
import DownloadButton from "@/components/ui/DownloadButton";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

const HERO_VIDEO_LOCAL = "/HeroVideoBG.mp4";
const HERO_VIDEO_FALLBACK =
  "https://assets.mixkit.co/videos/preview/mixkit-man-playing-soccer-502-large.mp4";

const HEADLINE_LINES = ["IT'S TIME. TO RISE.", "From Streets To Stadiums."];

/** Full-viewport hero with video background, animated stats, and gradient headline. */
export default function Hero() {
  return (
    <section
      className="relative h-screen overflow-hidden"
      data-header-theme="dark"
    >
      <BackgroundVideo
        src={HERO_VIDEO_LOCAL}
        fallbackSrc={HERO_VIDEO_FALLBACK}
        overlay
        overlayOpacity={0.52}
      />

      {/* Content Container */}
      <div className="relative flex h-full flex-col justify-between px-4 pb-6 pt-[84px] md:justify-end md:gap-10 md:px-6 md:pt-[100px] lg:px-6 lg:pb-[42px] lg:pt-[124px]">
        {/* Stats - Top on mobile (below header), top-right on tablet+ */}
        <HeroStats className="md:absolute md:right-6 md:top-[100px] lg:right-6 lg:top-[124px]" />

        {/* Bottom Content - Headline + CTA */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Headline + Subtext */}
          <div className="flex max-w-[696px] flex-col gap-6 uppercase">
            <h1
              className="flex flex-col text-[42px] leading-[1.1] lg:text-[62px]"
              style={{ fontFamily: "var(--font-anton), sans-serif" }}
            >
              {HEADLINE_LINES.map((line, i) => (
                <span
                  key={i}
                  className={`hero-animate hero-animate-delay-${i + 1} block bg-gradient-to-r from-white to-[#c4c4c4] bg-clip-text text-transparent`}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p className="hero-animate hero-animate-delay-3 text-base font-medium uppercase leading-[1.5] text-white md:normal-case">
              Where talent meets opportunity.
              <br />
              Train smarter, perform better, and rise to the next level.
            </p>
          </div>

          {/* CTA Button - Full width on mobile, fixed 240px on tablet+ */}
          <div className="hero-animate hero-animate-delay-4 w-full md:w-auto">
            <DownloadButton className="shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
