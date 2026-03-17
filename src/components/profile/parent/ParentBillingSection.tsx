"use client";

import BillingSettings from "@/components/profile/billing/BillingSettings";
import type { Invoice, PaymentMethod, SubscriptionTier, User } from "@/types/user";

interface ParentBillingSectionProps {
  user: User;
  invoices: Invoice[];
  paymentMethod: PaymentMethod | null;
  onChangePlan: (tier: SubscriptionTier) => Promise<void>;
  onCancelPlan: () => Promise<void>;
  onReactivate: () => Promise<void>;
  onUpdatePaymentMethod: () => void;
}

/**
 * Parent billing section that reuses the shared subscription and payment UI.
 */
export default function ParentBillingSection(props: ParentBillingSectionProps) {
  return <BillingSettings {...props} />;
}
