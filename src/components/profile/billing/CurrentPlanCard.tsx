"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import { PLAN_PRICING } from "@/lib/mockUser";
import type { Subscription, SubscriptionTier } from "@/types/user";

interface CurrentPlanCardProps {
  subscription: Subscription;
  onChangePlan: () => void;
  onCancelPlan: () => void;
  onReactivate: () => void;
}

const TIER_COLORS: Record<SubscriptionTier, { accent: string; bg: string }> = {
  free: { accent: "text-white/60", bg: "bg-white/10" },
  pro: { accent: "text-[var(--color-brand)]", bg: "bg-[var(--color-brand)]/10" },
  premium: { accent: "text-amber-400", bg: "bg-amber-400/10" },
};

/**
 * Displays current subscription plan with pricing and renewal info.
 */
export default function CurrentPlanCard({
  subscription,
  onChangePlan,
  onCancelPlan,
  onReactivate,
}: CurrentPlanCardProps) {
  const planInfo = PLAN_PRICING[subscription.tier];
  const colors = TIER_COLORS[subscription.tier];
  const renewalDate = new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isActive = subscription.status === "active" && !subscription.cancelAtPeriodEnd;
  const isCancelling = subscription.cancelAtPeriodEnd;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Plan info */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3
                className="text-xl text-white"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                {planInfo.name} Plan
              </h3>
              <span className={cn("rounded-full px-2 py-0.5 text-xs", colors.bg, colors.accent)}>
                {isActive ? "Active" : isCancelling ? "Cancelling" : subscription.status}
              </span>
            </div>

            {/* Pricing */}
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className={cn("text-3xl", colors.accent)}
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                ${planInfo.price.toFixed(2)}
              </span>
              {planInfo.price > 0 && (
                <span
                  className="text-sm text-white/40"
                  style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                >
                  /month
                </span>
              )}
            </div>
          </div>

          {/* Renewal info */}
          {subscription.tier !== "free" && (
            <p
              className="text-sm text-white/50"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {isCancelling
                ? `Your subscription ends on ${renewalDate}`
                : `Next billing date: ${renewalDate}`}
            </p>
          )}

          {/* Features */}
          <ul className="flex flex-col gap-1.5">
            {planInfo.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={colors.accent}
                >
                  <path
                    d="M3 8l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:items-end">
          <button
            onClick={onChangePlan}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            {subscription.tier === "free" ? "Upgrade Plan" : "Change Plan"}
          </button>

          {subscription.tier !== "free" && (
            isCancelling ? (
              <button
                onClick={onReactivate}
                className="rounded-lg border border-[var(--color-brand)]/30 px-4 py-2 text-sm text-[var(--color-brand)] transition-all duration-300 hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/10"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                Reactivate Subscription
              </button>
            ) : (
              <button
                onClick={onCancelPlan}
                className="rounded-lg px-4 py-2 text-sm text-white/40 transition-colors hover:text-red-400"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                Cancel Subscription
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
