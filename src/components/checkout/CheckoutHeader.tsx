"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CheckoutHeaderProps {
  onClose?: () => void;
  closeHref?: string;
  centerContent?: React.ReactNode;
}

/**
 * Shared checkout header with AIM logo, optional center content, and close button.
 * Used by both B2C and Academy checkout flows.
 */
export default function CheckoutHeader({
  onClose,
  closeHref = "/membership",
  centerContent,
}: CheckoutHeaderProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push(closeHref);
    }
  };

  return (
    <header className="shrink-0 z-30 border-b border-white/10 bg-black/80 px-4 py-4 md:px-5 md:pt-6 md:pb-8 backdrop-blur-md">
      <div className="relative mx-auto flex w-full items-center justify-between min-h-[40px]">
        {/* AIM logo */}
        <Link
          href="/home"
          className="shrink-0 transition-opacity hover:opacity-80 flex items-center z-10"
          aria-label="AIM home"
        >
          <Image src="/Logotype.svg" alt="AIM" width={23} height={26} className="h-7 w-auto" />
        </Link>

        {/* Optional center content (e.g., stepper) */}
        {centerContent && (
          <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none px-14 md:px-0 hidden md:block">
            <div className="pointer-events-auto">{centerContent}</div>
          </div>
        )}

        {/* Close button */}
        <div className="shrink-0 z-10 flex justify-end">
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-300 hover:border-white/50 hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
