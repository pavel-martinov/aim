"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}

/**
 * Shared textarea with all interaction states:
 * default, hover, focus, filled, error, disabled.
 */
export default function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  disabled,
  required,
  rows = 4,
}: FormTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasValue = value.trim().length > 0;

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

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          "w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-4 text-sm text-white outline-none",
          "placeholder:text-white/25",
          "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:bg-white/[0.05]",
          "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#0a0a0a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]",
          disabled && "cursor-not-allowed opacity-30",
          borderColor,
          ringClass
        )}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      />

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
