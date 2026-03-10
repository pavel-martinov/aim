"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import GhostButton from "@/components/ui/GhostButton";
import SectionHeader from "@/components/profile/SectionHeader";
import CurrentPlanCard from "./CurrentPlanCard";
import PlanSelector from "./PlanSelector";
import PaymentMethodCard from "./PaymentMethodCard";
import InvoiceList from "./InvoiceList";
import type { User, Invoice, PaymentMethod, SubscriptionTier } from "@/types/user";

interface BillingSettingsProps {
  user: User;
  invoices: Invoice[];
  paymentMethod: PaymentMethod | null;
  onChangePlan: (tier: SubscriptionTier) => Promise<void>;
  onCancelPlan: () => Promise<void>;
  onReactivate: () => Promise<void>;
  onUpdatePaymentMethod: () => void;
}

/**
 * Billing settings section combining plan, payment method, and invoices.
 */
export default function BillingSettings({
  user,
  invoices,
  paymentMethod,
  onChangePlan,
  onCancelPlan,
  onReactivate,
  onUpdatePaymentMethod,
}: BillingSettingsProps) {
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    try {
      await onCancelPlan();
      setShowCancelConfirm(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Billing"
        subtitle="Manage your subscription and payment details"
      />

      <CurrentPlanCard
        subscription={user.subscription}
        onChangePlan={() => setIsPlanSelectorOpen(true)}
        onCancelPlan={() => setShowCancelConfirm(true)}
        onReactivate={onReactivate}
      />

      <PaymentMethodCard paymentMethod={paymentMethod} onUpdate={onUpdatePaymentMethod} />

      <InvoiceList invoices={invoices} />

      <PlanSelector
        currentTier={user.subscription.tier}
        isOpen={isPlanSelectorOpen}
        onClose={() => setIsPlanSelectorOpen(false)}
        onSelectPlan={onChangePlan}
      />

      <Modal isOpen={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-400">
            <path
              d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-xl text-white font-sans">Cancel Subscription?</h2>
        <p className="mt-2 text-sm text-white/60 font-sans">
          Your subscription will remain active until the end of the current billing period. You can
          reactivate anytime before then.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <GhostButton onClick={() => setShowCancelConfirm(false)} disabled={isCancelling}>
            Keep Subscription
          </GhostButton>
          <button
            onClick={handleCancelConfirm}
            disabled={isCancelling}
            className="rounded-xl bg-red-500/10 px-6 py-3 text-sm text-red-400 font-sans transition-all duration-[var(--duration-standard)] hover:bg-red-500/20 disabled:opacity-50"
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
