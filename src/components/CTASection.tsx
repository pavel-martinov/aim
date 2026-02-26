"use client";

import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

const MARQUEE_TEXT = "Enquire Today. Redefine Tomorrow.";

/**
 * CTA section with infinite scrolling marquee text and download button.
 * Mobile: Dark button, reduced padding.
 * Desktop: Brand button, larger padding.
 */
export default function CTASection() {
  return (
    <section
      className="flex flex-col items-center justify-center gap-10 bg-black px-4 py-36 md:px-6 lg:py-60"
      data-header-theme="dark"
    >
      {/* Marquee container */}
      <RevealOnScroll className="w-full overflow-hidden" dramatic>
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 24s linear infinite",
          }}
        >
          {/* Render 4 copies for seamless loop */}
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-[42px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:mx-16 md:text-[82px] lg:text-[110px]"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </RevealOnScroll>

      {/* Download button - dark semi-transparent CTA per Figma */}
      <RevealOnScroll delay={0.2} className="w-full md:w-auto">
        <OpaqueButton variant="dark" onClick={openDownloadStore}>
          DOWNLOAD NOW
        </OpaqueButton>
      </RevealOnScroll>
    </section>
  );
}
