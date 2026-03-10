"use client";

import { useOptionalAudio } from "@/contexts/AudioContext";

type MusicToggleProps = {
  className?: string;
  isDark?: boolean;
};

/** Speaker icon for sound toggle */
function SpeakerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 15 15"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.5 0L3.75 3.75H0V11.25H3.75L7.5 15V0Z" />
      <path d="M11.25 7.5C11.25 5.775 10.2 4.3125 8.75 3.5625V11.4375C10.2 10.6875 11.25 9.225 11.25 7.5Z" />
      <path d="M8.75 0.5625V2.0625C11.1 2.9125 12.8125 5.0125 12.8125 7.5C12.8125 9.9875 11.1 12.0875 8.75 12.9375V14.4375C11.925 13.5375 14.375 10.8 14.375 7.5C14.375 4.2 11.925 1.4625 8.75 0.5625Z" />
    </svg>
  );
}

/**
 * Sound toggle with speaker icon: "[icon] ON/OFF"
 * Active state (ON or OFF) is highlighted in green.
 */
export default function MusicToggle({
  className = "",
  isDark = true,
}: MusicToggleProps) {
  const audio = useOptionalAudio();

  if (!audio) {
    return null;
  }

  const { isMuted, toggleMute } = audio;

  const baseColor = isDark ? "text-white/90" : "text-zinc-900";
  const activeColor = "text-[var(--color-brand)]";

  return (
    <button
      type="button"
      onClick={toggleMute}
      className={`flex items-center gap-1 transition-colors duration-500 ${className}`}
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      <SpeakerIcon className={`size-[15px] ${baseColor}`} />
      <span className={`text-sm uppercase leading-none ${baseColor}`}>
        <span className={`transition-colors duration-500 ${!isMuted ? activeColor : ""}`}>ON</span>
        <span>/</span>
        <span className={`transition-colors duration-500 ${isMuted ? activeColor : ""}`}>OFF</span>
      </span>
    </button>
  );
}
