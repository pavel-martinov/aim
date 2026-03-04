"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Shared checkbox with brand green accent when checked.
 * States: unchecked, checked, hover, focus, error, disabled.
 */
export default function FormCheckbox({
  label,
  checked,
  onChange,
  onBlur,
  error,
  disabled,
}: FormCheckboxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3",
          disabled && "cursor-not-allowed opacity-30"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hidden native checkbox for accessibility */}
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          disabled={disabled}
          className="sr-only"
        />

        {/* Custom checkbox visual */}
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
            "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            error
              ? "border-red-500 bg-red-500/10"
              : checked
                ? "border-[var(--color-brand)] bg-[var(--color-brand)]"
                : isFocused
                  ? "border-white ring-2 ring-[var(--color-brand)]/20"
                  : isHovered
                    ? "border-white/70 bg-white/5"
                    : "border-white/30 bg-white/[0.03]"
          )}
        >
          <AnimatePresence>
            {checked && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                width="11"
                height="9"
                viewBox="0 0 11 9"
                fill="none"
              >
                <path
                  d="M1 4L4 7.5L10 1"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>

        <span
          className="text-sm leading-[1.5] text-white/70"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {label}
        </span>
      </label>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="text-xs text-red-400"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
