"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  size?: "sm" | "md";
}

/**
 * Reusable toggle switch component with loading state.
 * Used for enabling/disabling features like parental controls.
 */
export default function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  loading = false,
  ariaLabel,
  size = "md",
}: ToggleSwitchProps) {
  const isDisabled = disabled || loading;
  const dimensions = size === "sm" 
    ? { track: "h-6 w-10", knob: "h-4 w-4", enabledLeft: 22, disabledLeft: 4, top: "top-1" }
    : { track: "h-7 w-12", knob: "h-5 w-5", enabledLeft: 26, disabledLeft: 4, top: "top-1" };

  return (
    <button
      onClick={onChange}
      disabled={isDisabled}
      className={cn(
        "relative rounded-full transition-colors",
        dimensions.track,
        enabled ? "bg-[var(--color-brand)]" : "bg-white/20",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      aria-pressed={enabled}
      aria-label={ariaLabel}
    >
      <motion.div
        className={cn(
          "absolute rounded-full bg-white shadow-md",
          dimensions.knob,
          dimensions.top
        )}
        animate={{ left: enabled ? dimensions.enabledLeft : dimensions.disabledLeft }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      )}
    </button>
  );
}
