"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

interface StepperProgressProps {
  steps: Step[];
  currentStep: number;
  furthestStep?: number;
  /** 0-indexed; steps before currentStep are completed */
  onStepClick?: (index: number) => void;
}

/**
 * Horizontal stepper progress bar with clickable completed steps.
 * Desktop: step labels; Mobile: numbers only.
 */
export default function StepperProgress({
  steps,
  currentStep,
  furthestStep,
  onStepClick,
}: StepperProgressProps) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = furthestStep !== undefined 
          ? index <= furthestStep && !!onStepClick 
          : isCompleted && !!onStepClick;

        return (
          <div key={index} className={cn("flex items-center", index < steps.length - 1 ? "flex-1" : "flex-none")}>
            {/* Step node */}
            <button
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={cn(
                "relative flex items-center justify-center shrink-0",
                "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
              aria-label={`Step ${index + 1}: ${step.label}`}
            >
              {/* Circle */}
              <motion.div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
                  "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isCompleted
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)]"
                    : isCurrent
                      ? "border-white bg-white/10 text-white"
                      : "border-white/20 bg-transparent text-white/30"
                )}
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    width="12"
                    height="10"
                    viewBox="0 0 12 10"
                    fill="none"
                  >
                    <path
                      d="M1 5L4.5 8.5L11 1.5"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Label - desktop only */}
              <span
                className={cn(
                  "absolute -bottom-6 hidden whitespace-nowrap text-[10px] uppercase tracking-widest md:block",
                  "transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isCurrent
                    ? "text-white"
                    : isCompleted
                      ? "text-[var(--color-brand)]"
                      : "text-white/25"
                )}
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                {step.label}
              </span>
            </button>

            {/* Connector line - not after last step */}
            {index < steps.length - 1 && (
              <div className="relative mx-1.5 h-px flex-1 overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[var(--color-brand)]"
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
