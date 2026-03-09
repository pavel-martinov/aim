"use client";

import { useState } from "react";

type BackgroundVideoProps = {
  src: string;
  fallbackSrc?: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
};

/** Full-cover background video with autoplay, loop, and optional overlay. */
export default function BackgroundVideo({
  src,
  fallbackSrc,
  className = "",
  overlay = false,
  overlayOpacity = 0.25,
}: BackgroundVideoProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <>
      <video
        src={currentSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        webkit-playsinline=""
        onError={() => fallbackSrc && setCurrentSrc(fallbackSrc)}
        onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        aria-hidden
      />
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
          aria-hidden
        />
      )}
    </>
  );
}
