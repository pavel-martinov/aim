"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION, DRAMATIC_EASE } from "@/lib/animations";
import { PLAN_PRICING } from "@/lib/mockUser";
import OpaqueButton from "@/components/ui/OpaqueButton";
import GhostButton from "@/components/ui/GhostButton";
import type { SubscriptionTier } from "@/types/user";

interface PlanSelectorProps {
  currentTier: SubscriptionTier;
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (tier: SubscriptionTier) => Promise<void>;
}

const TIER_ORDER: SubscriptionTier[] = ["free", "pro", "premium"];

const TIER_COLORS: Record<SubscriptionTier, { border: string; highlight: string }> = {
  free: { border: "border-white/20", highlight: "border-white/40" },
  pro: { border: "border-[var(--color-brand)]/30", highlight: "border-[var(--color-brand)]" },
  premium: { border: "border-amber-400/30", highlight: "border-amber-400" },
};

/**
 * Modal for selecting/changing subscription plan.
 */
export default function PlanSelector({
  currentTier,
  isOpen,
  onClose,
  onSelectPlan,
}: PlanSelectorProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(currentTier);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (selectedTier === currentTier) { onClose(); return; }
    setIsLoading(true);
    try {
      await onSelectPlan(selectedTier);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = () => {
    if (selectedTier === currentTier) return "Keep Current Plan";
    return TIER_ORDER.indexOf(selectedTier) > TIER_ORDER.indexOf(currentTier)
      ? "Upgrade Plan"
      : "Downgrade Plan";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-3xl -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[var(--background)] p-6 sm:inset-x-auto"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl uppercase text-white font-display">Choose Your Plan</h2>
                <p className="mt-1 text-sm text-white/50 font-sans">Select the plan that best fits your needs</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {TIER_ORDER.map((tier) => {
                const plan = PLAN_PRICING[tier];
                const colors = TIER_COLORS[tier];
                const isSelected = selectedTier === tier;
                const isCurrent = currentTier === tier;

                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                      "relative flex flex-col rounded-xl border-2 p-4 text-left transition-all duration-300",
                      isSelected ? colors.highlight : colors.border,
                      isSelected ? "bg-white/5" : "bg-transparent hover:bg-white/[0.02]"
                    )}
                  >
                    {isCurrent && (
                      <span className="absolute -top-2 right-3 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white font-mono">
                        Current
                      </span>
                    )}
                    <h3 className="text-lg text-white font-sans">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl text-white font-sans">${plan.price.toFixed(2)}</span>
                      {plan.price > 0 && <span className="text-sm text-white/40">/mo</span>}
                    </div>
                    <ul className="mt-4 flex flex-col gap-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs text-white/60">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0 text-[var(--color-brand)]">
                            <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="font-sans">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {isSelected && (
                      <motion.div
                        layoutId="plan-indicator"
                        className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[var(--color-brand)]"
                        transition={{ duration: DURATION.fast, ease: SMOOTH_EASE }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <GhostButton onClick={onClose} disabled={isLoading}>Cancel</GhostButton>
              <OpaqueButton
                variant="brand"
                onClick={handleConfirm}
                disabled={isLoading}
                showIcon={false}
                className="h-auto w-full py-3 sm:w-auto sm:px-6"
              >
                {isLoading ? "Processing..." : getActionLabel()}
              </OpaqueButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
