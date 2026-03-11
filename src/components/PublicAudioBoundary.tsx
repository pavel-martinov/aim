"use client";

import { usePathname } from "next/navigation";
import { AudioProvider } from "@/contexts/AudioContext";

const PUBLIC_AUDIO_ROUTES = new Set([
  "/",
  "/home",
  "/about",
  "/academies",
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
  const isAcademiesRoute = pathname.startsWith("/academies");

  if (!PUBLIC_AUDIO_ROUTES.has(pathname) && !isAcademiesRoute) {
    return <>{children}</>;
  }

  return <AudioProvider>{children}</AudioProvider>;
}
