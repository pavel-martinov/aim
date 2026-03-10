"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import Modal from "@/components/ui/Modal";
import GhostButton from "@/components/ui/GhostButton";
import OpaqueButton from "@/components/ui/OpaqueButton";
import type { PaymentMethod } from "@/types/user";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod | null;
  onUpdate: () => void;
}

const BRAND_ICONS: Record<string, React.ReactNode> = {
  visa: (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="2" fill="#1A1F71" />
      <path d="M12.5 13.5l1.5-7h1.8l-1.5 7h-1.8zm7.2-6.8c-.4-.1-.9-.3-1.6-.3-1.8 0-3 .9-3 2.2 0 1 .9 1.5 1.6 1.8.7.3 1 .5 1 .8 0 .4-.6.6-1.1.6-.7 0-1.1-.1-1.7-.4l-.2-.1-.3 1.5c.4.2 1.2.4 2 .4 1.9 0 3.1-.9 3.1-2.3 0-.8-.5-1.4-1.5-1.8-.6-.3-1-.5-1-.8 0-.3.3-.6 1-.6.6 0 1 .1 1.3.2l.2.1.2-1.3zm4.5-.2h-1.4c-.4 0-.8.1-1 .6l-2.7 6.4h1.9l.4-1h2.3l.2 1h1.7l-1.4-7zm-2.2 4.5l1-2.5.5 2.5h-1.5zM11 6.5l-1.7 4.8-.2-.9c-.3-1.1-1.4-2.3-2.6-2.9l1.6 6h1.9l2.9-7h-1.9z" fill="white" />
    </svg>
  ),
  mastercard: (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="2" fill="#000" />
      <circle cx="12" cy="10" r="6" fill="#EB001B" />
      <circle cx="20" cy="10" r="6" fill="#F79E1B" />
      <path d="M16 5.3a6 6 0 000 9.4 6 6 0 000-9.4z" fill="#FF5F00" />
    </svg>
  ),
  amex: (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="2" fill="#006FCF" />
      <text x="16" y="12" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="bold">AMEX</text>
    </svg>
  ),
  discover: (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="2" fill="#FF6000" />
      <text x="16" y="12" textAnchor="middle" fill="white" fontSize="6" fontFamily="sans-serif" fontWeight="bold">DISCOVER</text>
    </svg>
  ),
  unknown: (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="2" fill="#333" />
      <rect x="4" y="6" width="8" height="2" rx="1" fill="#666" />
      <rect x="4" y="12" width="12" height="2" rx="1" fill="#666" />
    </svg>
  ),
};

/**
 * Displays saved payment method with option to update.
 */
export default function PaymentMethodCard({ paymentMethod, onUpdate }: PaymentMethodCardProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">
              Payment Method
            </h3>

            {paymentMethod ? (
              <div className="mt-3 flex items-center gap-3">
                {BRAND_ICONS[paymentMethod.brand] || BRAND_ICONS.unknown}
                <div>
                  <p className="text-white font-mono">•••• {paymentMethod.last4}</p>
                  <p className="text-xs text-white/40 font-sans">
                    Expires {paymentMethod.expiryMonth.toString().padStart(2, "0")}/{paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-white/60 font-sans">No payment method on file</p>
            )}
          </div>

          <GhostButton size="sm" onClick={() => setShowUpdateModal(true)}>
            {paymentMethod ? "Update" : "Add Card"}
          </GhostButton>
        </div>
      </motion.div>

      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <h2 className="text-xl text-white font-sans">Update Payment Method</h2>
        <p className="mt-2 text-sm text-white/50 font-sans">
          Stripe payment form will be integrated here
        </p>

        <div className="mt-6 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto text-white/20">
            <rect x="4" y="12" width="40" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20h40" stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="28" width="12" height="4" rx="1" fill="currentColor" />
          </svg>
          <p className="mt-4 text-sm text-white/40 font-sans">Stripe Elements integration coming soon</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <GhostButton onClick={() => setShowUpdateModal(false)}>Cancel</GhostButton>
          <OpaqueButton
            variant="brand"
            onClick={() => { onUpdate(); setShowUpdateModal(false); }}
            showIcon={false}
            className="h-auto w-full py-3 sm:w-auto sm:px-6"
          >
            Save Card
          </OpaqueButton>
        </div>
      </Modal>
    </>
  );
}
