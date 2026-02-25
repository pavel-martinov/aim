"use client";

import OpaqueButton from "@/components/ui/OpaqueButton";
import { openDownloadStore } from "@/lib/download";

const MARQUEE_TEXT = "Enquire Today. Redefine Tomorrow.";

/**
 * CTA section with infinite scrolling marquee text and download button.
 * Placed before the footer on the home page.
 */
export default function CTASection() {
  return (
    <section
      className="flex flex-col items-center justify-center gap-10 bg-black px-4 py-36 md:py-36 lg:py-60"
      data-header-theme="dark"
    >
      {/* Marquee container */}
      <div className="w-full overflow-hidden">
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
              className="mx-8 text-[82px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:mx-16 lg:text-[110px]"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Download button */}
      <OpaqueButton variant="card" onClick={openDownloadStore} className="w-full md:w-[240px]">
        DOWNLOAD NOW
      </OpaqueButton>
    </section>
  );
}
