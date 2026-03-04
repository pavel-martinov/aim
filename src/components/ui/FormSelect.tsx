"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Shared form select with all interaction states:
 * default, hover, focus, filled, error, disabled.
 */
export default function FormSelect({
  label,
  placeholder = "Select an option",
  value,
  onChange,
  onBlur,
  options,
  error,
  hint,
  disabled,
  required,
}: FormSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasValue = !!value;

  const borderColor = error
    ? "border-red-500"
    : isFocused
      ? "border-white"
      : isHovered
        ? "border-white/70"
        : hasValue
          ? "border-white/60"
          : "border-white/30";

  const labelColor = error
    ? "text-red-400"
    : isFocused
      ? "text-white"
      : "text-white/50";

  const ringClass = isFocused && !error
    ? "ring-2 ring-[var(--color-brand)]/20"
    : "";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={cn(
          "text-xs uppercase tracking-widest transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          labelColor
        )}
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {label}
        {required && <span className="ml-1 text-[var(--color-brand)]">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-xl border bg-white/[0.03] px-4 py-4 text-sm outline-none",
            "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            "hover:bg-white/[0.05]",
            hasValue ? "text-white" : "text-white/25",
            disabled && "cursor-not-allowed opacity-30",
            borderColor,
            ringClass
          )}
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            colorScheme: "dark",
          }}
        >
          <option value="" disabled style={{ background: "#0a0a0a" }}>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#0a0a0a" }}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <div
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
            isFocused ? "text-white" : "text-white/40"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {hint && !error && (
        <p className="text-xs text-white/30" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
          {hint}
        </p>
      )}

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
