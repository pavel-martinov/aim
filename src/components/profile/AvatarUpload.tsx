"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isDataImage } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import AvatarPickerModal from "./AvatarPickerModal";

interface AvatarUploadProps {
  avatarUrl?: string;
  name: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

/** Detects uploaded or captured avatars that should bypass optimization. */
// isDataImage is imported from @/lib/utils

/**
 * Avatar display with Netflix-style picker modal.
 * Shows initials if no avatar URL is provided.
 */
export default function AvatarUpload({
  avatarUrl,
  name,
  onAvatarChange,
  size = "lg",
}: AvatarUploadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAvatarSelect = (newAvatarUrl: string) => {
    onAvatarChange(newAvatarUrl);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative overflow-hidden rounded-full transition-all duration-300",
            "ring-2 ring-white/20 hover:ring-[var(--color-brand)]/50",
            "focus:outline-none focus-visible:ring-[var(--color-brand)]",
            SIZE_CLASSES[size]
          )}
          aria-label="Change avatar"
        >
          {/* Avatar image or initials */}
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              unoptimized={isDataImage(avatarUrl)}
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-white/10 text-xl text-white"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {initials}
            </div>
          )}

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: SMOOTH_EASE }}
                className="absolute inset-0 flex items-center justify-center bg-black/60"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Avatar picker modal */}
      <AvatarPickerModal
        isOpen={isModalOpen}
        currentAvatar={avatarUrl}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAvatarSelect}
      />
    </>
  );
}
