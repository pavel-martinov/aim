"use client";

import { CheckoutFormData } from "./types";

interface PaymentSummaryProps {
  data: CheckoutFormData;
  plan: {
    name: string;
    price: number;
    cycle: "monthly" | "annual";
    students: number;
  };
}

/**
 * Step 5 - Payment Summary mockup.
 * Shows order breakdown and a disabled payment button pending real integration.
 */
export default function PaymentSummary({ data, plan }: PaymentSummaryProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Order summary */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p
          className="mb-4 text-xs uppercase tracking-widest text-white/40"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Order Summary
        </p>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              AIM {plan.name}
            </p>
            <p
              className="mt-1 text-xs uppercase text-white/40"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {plan.cycle === "annual" ? "Annual billing" : "Monthly billing"} ·{" "}
              {plan.students <= 10
                ? "Up to 10 students"
                : `${plan.students} students`}
            </p>
          </div>

          <div className="text-right">
            <p
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-anton), sans-serif" }}
            >
              ${plan.price.toFixed(2)}
            </p>
            <p
              className="text-xs text-white/40"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              /mo
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase text-white/40"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Subtotal
            </span>
            <span
              className="text-sm text-white"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              ${plan.price.toFixed(2)}/mo
            </span>
          </div>
          {plan.cycle === "annual" && (
            <div className="flex items-center justify-between">
              <span
                className="text-xs uppercase text-[var(--color-brand)]"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Annual discount
              </span>
              <span
                className="text-sm text-[var(--color-brand)]"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                Included
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payer info */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p
          className="mb-4 text-xs uppercase tracking-widest text-white/40"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Billed To
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p
              className="text-xs uppercase text-white/30"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Name
            </p>
            <p
              className="mt-1 text-sm text-white"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {data.payer.fullName}
            </p>
          </div>
          <div>
            <p
              className="text-xs uppercase text-white/30"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Email
            </p>
            <p
              className="mt-1 text-sm text-white break-all"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {data.payer.email}
            </p>
          </div>
        </div>
      </div>

      {/* Payment method placeholder */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p
          className="mb-4 text-xs uppercase tracking-widest text-white/40"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Payment Method
        </p>

        <div className="flex items-center gap-4 rounded-xl border border-dashed border-white/20 px-4 py-5">
          {/* Card icon */}
          <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 18"
              fill="none"
              className="text-white/40"
            >
              <rect
                x="0.75"
                y="0.75"
                width="22.5"
                height="16.5"
                rx="2.25"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect x="0" y="4" width="24" height="4" fill="currentColor" opacity="0.3" />
              <rect x="3" y="11" width="6" height="2" rx="1" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <div>
            <p
              className="text-sm text-white/60"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              Payment integration coming soon
            </p>
            <p
              className="mt-0.5 text-xs text-white/30"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Our team will reach out to complete setup
            </p>
          </div>
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[var(--color-brand)]/20 bg-[var(--color-brand)]/5 px-4 py-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="mt-0.5 shrink-0 text-[var(--color-brand)]"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 5v3.5M8 11h.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p
          className="text-xs leading-relaxed text-white/60"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          After submitting, the AIM team will contact you at{" "}
          <span className="text-white">{data.organization.contactEmail || data.payer.email}</span>{" "}
          within 1–2 business days to finalize your Academy setup.
        </p>
      </div>
    </div>
  );
}
