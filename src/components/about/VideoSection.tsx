"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { DRAMATIC_EASE } from "@/lib/animations";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * Play button icon component.
 */
function PlayIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

/**
 * Video section with poster image and play button overlay.
 */
export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0a0a] py-24 lg:py-32"
      data-header-theme="dark"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 px-6">
        <SectionHeader eyebrow="Watch" headline="Experience AIM in action" />

        {/* Video container */}
        <motion.div
          className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black/50"
          style={{ scale, opacity }}
        >
          {!isPlaying ? (
            <>
              {/* Poster/placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#010400] via-[#0a0a0a] to-[#010400]">
                {/* Decorative grid overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--color-brand) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Center accent */}
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brand)]/10 blur-3xl" />
              </div>

              {/* Play button */}
              <motion.button
                onClick={handlePlay}
                className="group absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: DRAMATIC_EASE, delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Outer ring */}
                <div className="absolute h-32 w-32 rounded-full border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--color-brand)]/50" />

                {/* Inner circle */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-brand)] text-black transition-transform duration-300">
                  <PlayIcon />
                </div>
              </motion.button>

              {/* Corner text */}
              <span
                className="absolute bottom-6 left-6 text-xs uppercase tracking-wider text-white/40"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Click to play
              </span>
            </>
          ) : (
            /* Video player - replace src with actual video URL */
            <video
              className="h-full w-full object-cover"
              controls
              autoPlay
              playsInline
            >
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Border accent */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
        </motion.div>
      </div>
    </section>
  );
}
