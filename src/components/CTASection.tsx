"use client";

import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

const MARQUEE_TEXT = "Enquire Today. Redefine Tomorrow.";

/**
 * CTA section with always-visible infinite scrolling marquee text
 * and centered green download button. Text scrolls left-to-right
 * at a dramatic, slow pace per animation-principles rule.
 * Marquee bleeds beyond viewport edges for cinematic effect.
 */
export default function CTASection() {
  return (
    <section
      className="flex flex-col items-center justify-center gap-10 bg-black py-36 md:py-36 lg:py-60"
      data-header-theme="dark"
    >
      {/* Marquee container - no overflow clipping, text bleeds beyond viewport */}
      <div className="w-full">
        <div
          className="cta-marquee flex whitespace-nowrap py-2"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {/* Render 4 copies for seamless loop */}
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="mx-4 text-[82px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:mx-8 lg:mx-16 lg:text-[110px]"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Green main CTA button - centered */}
      <RevealOnScroll delay={0.2} className="w-full px-4 md:w-auto md:px-0">
        <OpaqueButton onClick={openDownloadStore}>DOWNLOAD NOW</OpaqueButton>
      </RevealOnScroll>
    </section>
  );
}
