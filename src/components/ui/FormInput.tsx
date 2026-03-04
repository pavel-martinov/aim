"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { filterLettersOnly, filterNumbersOnly } from "@/lib/validation";

type InputType = "text" | "email" | "tel" | "url" | "password";

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  type?: InputType;
  /** Only allow letter characters (filters on input) */
  lettersOnly?: boolean;
  /** Show green checkmark when valid and has value */
  isValid?: boolean;
  autoComplete?: string;
}

/**
 * Shared form input with all interaction states:
 * default, hover, focus, filled, error, valid, disabled.
 */
export default function FormInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  disabled,
  required,
  type = "text",
  lettersOnly,
  isValid,
  autoComplete,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasValue = value.trim().length > 0;
  const showValid = isValid && hasValue && !error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (lettersOnly) v = filterLettersOnly(v);
    if (type === "tel") v = filterNumbersOnly(v);
    onChange(v);
  };

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
    ? "ring-2 ring-[var(--color-brand)]/20 ring-offset-0"
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
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={type === "tel" ? "tel" : type === "url" ? "url" : type === "email" ? "email" : "text"}
          className={cn(
            "w-full rounded-xl border bg-white/[0.03] px-4 py-4 text-base md:text-sm text-white outline-none",
            "placeholder:text-white/25",
            "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            "hover:bg-white/[0.05]",
            "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#0a0a0a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:caret-white",
            "[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_#0a0a0a_inset] [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_#0a0a0a_inset]",
            "[&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden",
            disabled && "cursor-not-allowed opacity-30",
            showValid && "pr-10",
            borderColor,
            ringClass
          )}
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        />

        {/* Valid checkmark icon */}
        {showValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[var(--color-brand)]"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M5 8l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {hint && !error && (
        <p
          className="text-xs text-white/30"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
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
