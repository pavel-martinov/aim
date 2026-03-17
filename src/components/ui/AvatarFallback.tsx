"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarFallbackProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
  borderClassName?: string;
}

const sizeConfig: Record<AvatarSize, { container: string; text: string; imageSizes: string }> = {
  xs: { container: "h-8 w-8", text: "text-xs", imageSizes: "32px" },
  sm: { container: "h-10 w-10", text: "text-sm", imageSizes: "40px" },
  md: { container: "h-12 w-12", text: "text-lg", imageSizes: "48px" },
  lg: { container: "h-16 w-16", text: "text-2xl", imageSizes: "64px" },
  xl: { container: "h-24 w-24", text: "text-3xl", imageSizes: "96px" },
};

/**
 * Avatar component with image or fallback initial.
 * Shows the first letter of the name when no image is available.
 */
export default function AvatarFallback({
  src,
  name,
  size = "md",
  className,
  borderClassName = "border border-white/10",
}: AvatarFallbackProps) {
  const config = sizeConfig[size];
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full",
        config.container,
        borderClassName,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes={config.imageSizes}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-white/10 font-medium text-white",
            config.text
          )}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
