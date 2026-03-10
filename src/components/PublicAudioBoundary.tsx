"use client";

import { usePathname } from "next/navigation";
import { AudioProvider } from "@/contexts/AudioContext";

const PUBLIC_AUDIO_ROUTES = new Set([
  "/",
  "/home",
  "/about",
  "/membership",
  "/contact",
  "/privacy",
  "/terms",
]);

type PublicAudioBoundaryProps = {
  children: React.ReactNode;
};

/** Wraps only marketing routes with the shared background music experience. */
export default function PublicAudioBoundary({
  children,
}: PublicAudioBoundaryProps) {
  const pathname = usePathname();

  if (!PUBLIC_AUDIO_ROUTES.has(pathname)) {
    return <>{children}</>;
  }

  return <AudioProvider>{children}</AudioProvider>;
}
